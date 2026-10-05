import { prisma } from '../prisma/client.js';
import type { Prisma } from '@prisma/client';
import type { NotificationType, NotificationResponse, ChangeRequestStatus } from '../models/index.js';

export const notificationService = {
  /**
   * Crea una notificación para un usuario específico con soporte de fecha de expiración.
   */
  createNotification: async (
    userId: string,
    title: string,
    message: string,
    type: NotificationType = 'SYSTEM_ALERT',
    relatedId?: string | null,
    expiresAt?: Date | null,
    txClient?: Prisma.TransactionClient
  ): Promise<NotificationResponse> => {
    const client = txClient || prisma;
    const notification = await client.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        relatedId: relatedId || null,
        expiresAt: expiresAt || null,
        isRead: false,
      },
    });

    return notification as unknown as NotificationResponse;
  },

  /**
   * Envía una notificación a todos los administradores activos del sistema (sin expiración fija mientras sea PENDING).
   */
  notifyAllAdmins: async (
    title: string,
    message: string,
    type: NotificationType = 'NEW_CHANGE_REQUEST',
    relatedId?: string | null,
    txClient?: Prisma.TransactionClient
  ): Promise<number> => {
    const client = txClient || prisma;
    const activeAdmins = await client.user.findMany({
      where: {
        rol: 'ADMIN',
        activo: true,
      },
      select: { id: true },
    });

    if (activeAdmins.length === 0) {
      return 0;
    }

    const notificationsData = activeAdmins.map((admin) => ({
      userId: admin.id,
      title,
      message,
      type,
      relatedId: relatedId || null,
      expiresAt: null, // Pendiente de revisión no expira hasta ser resuelta
      isRead: false,
    }));

    const result = await client.notification.createMany({
      data: notificationsData,
    });

    return result.count;
  },

  /**
   * Obtiene las notificaciones vigentes (no expiradas) del usuario autenticado.
   * Enriquecidas con el estado en tiempo real de ChangeRequest si corresponde.
   */
  getUserNotifications: async (
    userId: string,
    userRole?: string,
    isRead?: boolean,
    limit?: number,
    dismissedFromBell?: boolean
  ): Promise<NotificationResponse[]> => {
    const now = new Date();

    // Filtro para excluir notificaciones expiradas
    const whereClause: Prisma.NotificationWhereInput = {
      userId,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } },
      ],
    };

    if (isRead !== undefined) {
      whereClause.isRead = isRead;
    }

    if (dismissedFromBell !== undefined) {
      whereClause.dismissedFromBell = dismissedFromBell;
    }

    // Ejecutar limpieza ligera asíncrona de fondo
    notificationService.cleanupExpiredNotifications().catch(() => {});

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit ? Math.min(limit, 100) : 50,
    });

    // Enriquecer con el estado real de ChangeRequest si tiene relatedId
    const relatedIds = notifications
      .map((n) => n.relatedId)
      .filter((id): id is string => Boolean(id));

    let changeRequestMap = new Map<string, ChangeRequestStatus>();
    if (relatedIds.length > 0) {
      const changeRequests = await prisma.changeRequest.findMany({
        where: { id: { in: relatedIds } },
        select: { id: true, status: true },
      });
      changeRequestMap = new Map(changeRequests.map((cr) => [cr.id, cr.status]));
    }

    return notifications.map((n) => ({
      ...n,
      changeRequestStatus: n.relatedId ? (changeRequestMap.get(n.relatedId) || null) : null,
    })) as unknown as NotificationResponse[];
  },

  /**
   * Conteo de notificaciones que requieren atención para la campana:
   * - Para STUDENT y TEACHER: Notificaciones no leídas, no descartadas de la campana y no expiradas.
   * - Para ADMIN: Notificaciones normales no leídas + Solicitudes ChangeRequest que continúen PENDING (sin descartar).
   */
  getUnreadCount: async (userId: string, userRole?: string): Promise<number> => {
    const now = new Date();

    if (userRole === 'ADMIN') {
      // 1. Notificaciones normales no leídas del admin (no descartadas de la campana)
      const normalUnreadCount = await prisma.notification.count({
        where: {
          userId,
          isRead: false,
          dismissedFromBell: false,
          type: { not: 'NEW_CHANGE_REQUEST' },
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: now } },
          ],
        },
      });

      // 2. Notificaciones NEW_CHANGE_REQUEST del admin no descartadas de la campana cuya solicitud siga PENDING
      const adminPendingNotifs = await prisma.notification.findMany({
        where: {
          userId,
          dismissedFromBell: false,
          type: 'NEW_CHANGE_REQUEST',
          relatedId: { not: null },
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: now } },
          ],
        },
        select: { relatedId: true },
      });

      const relatedIds = adminPendingNotifs
        .map((n) => n.relatedId)
        .filter((id): id is string => Boolean(id));

      let pendingChangeRequestsCount = 0;
      if (relatedIds.length > 0) {
        pendingChangeRequestsCount = await prisma.changeRequest.count({
          where: {
            id: { in: relatedIds },
            status: 'PENDING',
          },
        });
      }

      return normalUnreadCount + pendingChangeRequestsCount;
    }

    // Para STUDENT y TEACHER: conteo de notificaciones no leídas y no descartadas de la campana
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
        dismissedFromBell: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } },
        ],
      },
    });
  },

  /**
   * Oculta una notificación del dropdown de la campana para el usuario autenticado.
   * Valida estrictamente la pertenencia al usuario para evitar manipulaciones.
   * NO elimina el registro de PostgreSQL ni altera ChangeRequest ni AuditLog.
   */
  dismissFromBell: async (notificationId: string, userId: string): Promise<NotificationResponse> => {
    const existing = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!existing) {
      throw new Error('Notificación no encontrada o no pertenece al usuario.');
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { dismissedFromBell: true },
    });

    return updated as unknown as NotificationResponse;
  },

  /**
   * Marca una notificación específica como leída.
   */
  markAsRead: async (notificationId: string, userId: string): Promise<NotificationResponse> => {
    const existing = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!existing) {
      throw new Error('Notificación no encontrada o no pertenece al usuario.');
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return updated as unknown as NotificationResponse;
  },

  /**
   * Marca todas las notificaciones vigentes del usuario como leídas.
   */
  markAllAsRead: async (userId: string): Promise<{ count: number }> => {
    const now = new Date();

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } },
        ],
      },
      data: { isRead: true },
    });

    return { count: result.count };
  },

  /**
   * Limpieza física de todas las notificaciones que ya expiraron en PostgreSQL.
   */
  cleanupExpiredNotifications: async (): Promise<{ count: number }> => {
    const now = new Date();

    const result = await prisma.notification.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    return { count: result.count };
  },
};
