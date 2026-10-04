import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client.js';
import { notificationService } from './notificationService.js';
import { auditService } from './auditService.js';
import type { 
  ChangeRequestStatus, 
  ChangeRequestType, 
  ProfileChangeData, 
  ChangeRequestResponse, 
  RequestPasswordChangeDTO 
} from '../models/index.js';

export const changeRequestService = {
  /**
   * Crea una solicitud de modificación de información personal (TEACHER / STUDENT).
   */
  createProfileChangeRequest: async (
    userId: string,
    data: ProfileChangeData
  ): Promise<ChangeRequestResponse> => {
    // 1. Obtener datos actuales del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.activo) {
      throw new Error('Usuario no encontrado o cuenta inactiva.');
    }

    // 2. Validar que no exista ya una solicitud PENDING de este tipo
    const pendingExisting = await prisma.changeRequest.findFirst({
      where: {
        userId,
        type: 'PROFILE_UPDATE',
        status: 'PENDING',
      },
    });

    if (pendingExisting) {
      throw new Error('Ya tienes una solicitud de modificación de perfil pendiente de revisión.');
    }

    // 3. Sanitizar datos solicitados
    const requestedData: ProfileChangeData = {
      nombre: data.nombre?.trim() || undefined,
      apellido: data.apellido?.trim() || undefined,
      apellidoMaterno: data.apellidoMaterno?.trim() || undefined,
      telefono: data.telefono?.trim() || undefined,
    };

    // 4. Crear solicitud en la base de datos
    const changeRequest = await prisma.changeRequest.create({
      data: {
        userId,
        type: 'PROFILE_UPDATE',
        status: 'PENDING',
        requestedData: requestedData as object,
      },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            rol: true,
            profile: {
              select: {
                apellidoMaterno: true,
                telefono: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    // 5. Notificación inicial al usuario solicitante (sin expiración fija mientras sea procesada)
    await notificationService.createNotification(
      userId,
      'Solicitud de modificación de información enviada',
      'Se ha enviado correctamente tu solicitud de cambio de información personal. Espera a que un administrador acepte tu petición.',
      'REQUEST_SUBMITTED',
      changeRequest.id,
      null
    );

    // 6. Notificación a todos los administradores activos
    const fullName = `${user.nombre} ${user.apellido}`;
    await notificationService.notifyAllAdmins(
      'Nueva solicitud de cambio de información',
      `${fullName} ha solicitado modificar su información personal.`,
      'NEW_CHANGE_REQUEST',
      changeRequest.id
    );

    return changeRequest as unknown as ChangeRequestResponse;
  },

  /**
   * Crea una solicitud de cambio de contraseña (TEACHER / STUDENT).
   */
  createPasswordChangeRequest: async (
    userId: string,
    data: RequestPasswordChangeDTO
  ): Promise<ChangeRequestResponse> => {
    const { currentPassword, newPassword } = data;

    if (!currentPassword) {
      throw new Error('Debe ingresar su contraseña actual.');
    }

    if (!newPassword || newPassword.length < 8) {
      throw new Error('La nueva contraseña debe tener al menos 8 caracteres.');
    }

    // 1. Obtener usuario y validar contraseña actual con bcrypt
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.activo) {
      throw new Error('Usuario no encontrado o cuenta inactiva.');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      throw new Error('La contraseña actual es incorrecta.');
    }

    // 2. Validar que no tenga otra solicitud de cambio de contraseña PENDING
    const pendingExisting = await prisma.changeRequest.findFirst({
      where: {
        userId,
        type: 'PASSWORD_CHANGE',
        status: 'PENDING',
      },
    });

    if (pendingExisting) {
      throw new Error('Ya tienes una solicitud de cambio de contraseña pendiente de revisión.');
    }

    // 3. Generar hash bcrypt de la nueva contraseña (NUNCA texto plano)
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // 4. Crear la solicitud guardando ÚNICAMENTE el hash seguro
    const changeRequest = await prisma.changeRequest.create({
      data: {
        userId,
        type: 'PASSWORD_CHANGE',
        status: 'PENDING',
        passwordHash: newPasswordHash,
      },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            rol: true,
          },
        },
      },
    });

    // 5. Notificación inicial al usuario solicitante
    await notificationService.createNotification(
      userId,
      'Solicitud de cambio de contraseña enviada',
      'Se ha enviado correctamente tu solicitud de cambio de contraseña. Espera a que un administrador acepte tu petición.',
      'REQUEST_SUBMITTED',
      changeRequest.id,
      null
    );

    // 6. Notificación a todos los administradores activos
    const fullName = `${user.nombre} ${user.apellido}`;
    await notificationService.notifyAllAdmins(
      'Nueva solicitud de cambio de contraseña',
      `${fullName} ha solicitado cambiar su contraseña.`,
      'NEW_CHANGE_REQUEST',
      changeRequest.id
    );

    // Retornar sin exponer el passwordHash
    const sanitizedResponse: ChangeRequestResponse = {
      id: changeRequest.id,
      userId: changeRequest.userId,
      user: changeRequest.user as any,
      type: changeRequest.type,
      status: changeRequest.status,
      createdAt: changeRequest.createdAt,
      reviewedAt: changeRequest.reviewedAt,
    };

    return sanitizedResponse;
  },

  /**
   * Obtiene las solicitudes de cambio realizadas por el usuario autenticado.
   */
  getMyChangeRequests: async (userId: string): Promise<ChangeRequestResponse[]> => {
    const requests = await prisma.changeRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        type: true,
        status: true,
        requestedData: true,
        reviewedById: true,
        rejectionReason: true,
        createdAt: true,
        reviewedAt: true,
        reviewer: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
    });

    return requests as unknown as ChangeRequestResponse[];
  },

  /**
   * Obtiene todas las solicitudes del sistema (ADMIN ONLY).
   */
  getAllChangeRequests: async (filter?: {
    status?: ChangeRequestStatus;
    type?: ChangeRequestType;
  }): Promise<ChangeRequestResponse[]> => {
    const whereClause: { status?: ChangeRequestStatus; type?: ChangeRequestType } = {};
    if (filter?.status) whereClause.status = filter.status;
    if (filter?.type) whereClause.type = filter.type;

    const requests = await prisma.changeRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        type: true,
        status: true,
        requestedData: true,
        reviewedById: true,
        rejectionReason: true,
        createdAt: true,
        reviewedAt: true,
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            rol: true,
            profile: {
              select: {
                apellidoMaterno: true,
                telefono: true,
                avatarUrl: true,
              },
            },
          },
        },
        reviewer: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
    });

    return requests as unknown as ChangeRequestResponse[];
  },

  /**
   * Obtiene el detalle de una solicitud específica.
   */
  getChangeRequestById: async (
    id: string,
    requesterId: string,
    requesterRole: string
  ): Promise<ChangeRequestResponse> => {
    const request = await prisma.changeRequest.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        type: true,
        status: true,
        requestedData: true,
        reviewedById: true,
        rejectionReason: true,
        createdAt: true,
        reviewedAt: true,
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            rol: true,
            profile: {
              select: {
                apellidoMaterno: true,
                telefono: true,
                avatarUrl: true,
              },
            },
          },
        },
        reviewer: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
    });

    if (!request) {
      throw new Error('Solicitud no encontrada.');
    }

    // Validar autorización: ADMIN o el dueño de la solicitud
    if (requesterRole !== 'ADMIN' && request.userId !== requesterId) {
      throw new Error('Acceso no autorizado a esta solicitud.');
    }

    return request as unknown as ChangeRequestResponse;
  },

  /**
   * Aprueba una solicitud de cambio (ADMIN ONLY).
   * Ejecuta la actualización atómica en PostgreSQL dentro de una transacción:
   * - Aplica los cambios de datos.
   * - Registra el evento permanente en AuditLog.
   * - Elimina notificaciones administrativas PENDING asociadas.
   * - Elimina la notificación inicial REQUEST_SUBMITTED del usuario.
   * - Crea la notificación final de aprobación con expiración de 5 días.
   */
  approveChangeRequest: async (
    id: string,
    adminId: string
  ): Promise<ChangeRequestResponse> => {
    return prisma.$transaction(async (tx) => {
      // 1. Verificar existencia y estado PENDING dentro de la transacción
      const request = await tx.changeRequest.findUnique({
        where: { id },
        include: {
          user: {
            include: { profile: true },
          },
        },
      });

      if (!request) {
        throw new Error('Solicitud no encontrada.');
      }

      if (request.status !== 'PENDING') {
        throw new Error('Esta solicitud ya fue procesada por otro administrador.');
      }

      const targetUserId = request.userId;

      // Obtener datos del administrador para la bitácora de auditoría
      const admin = await tx.user.findUnique({
        where: { id: adminId },
        select: { id: true, nombre: true, apellido: true, rol: true },
      });

      const changesSummary: Record<string, { before: string | null; after: string | null }> = {};

      // 2. Aplicar los cambios según el tipo de solicitud
      if (request.type === 'PROFILE_UPDATE') {
        const data = (request.requestedData || {}) as ProfileChangeData;

        // Comparar cambios para registrar en auditoría
        if (data.nombre && data.nombre.trim() !== request.user.nombre) {
          changesSummary.nombre = { before: request.user.nombre, after: data.nombre.trim() };
        }
        if (data.apellido && data.apellido.trim() !== request.user.apellido) {
          changesSummary.apellido = { before: request.user.apellido, after: data.apellido.trim() };
        }
        if (data.apellidoMaterno !== undefined && data.apellidoMaterno.trim() !== (request.user.profile?.apellidoMaterno || '')) {
          changesSummary.apellidoMaterno = {
            before: request.user.profile?.apellidoMaterno || null,
            after: data.apellidoMaterno.trim() || null,
          };
        }
        if (data.telefono !== undefined && data.telefono.trim() !== (request.user.profile?.telefono || '')) {
          changesSummary.telefono = {
            before: request.user.profile?.telefono || null,
            after: data.telefono.trim() || null,
          };
        }

        // Actualizar tabla `users` (nombre, apellido)
        if (data.nombre || data.apellido) {
          await tx.user.update({
            where: { id: targetUserId },
            data: {
              nombre: data.nombre ? data.nombre.trim() : undefined,
              apellido: data.apellido ? data.apellido.trim() : undefined,
            },
          });
        }

        // Actualizar tabla `user_profiles` (apellidoMaterno, telefono)
        if (data.apellidoMaterno !== undefined || data.telefono !== undefined) {
          await tx.userProfile.upsert({
            where: { userId: targetUserId },
            create: {
              userId: targetUserId,
              apellidoMaterno: data.apellidoMaterno?.trim() || null,
              telefono: data.telefono?.trim() || null,
            },
            update: {
              apellidoMaterno: data.apellidoMaterno !== undefined ? (data.apellidoMaterno.trim() || null) : undefined,
              telefono: data.telefono !== undefined ? (data.telefono.trim() || null) : undefined,
            },
          });
        }
      } else if (request.type === 'PASSWORD_CHANGE') {
        if (!request.passwordHash) {
          throw new Error('No se encontró el hash de contraseña seguro en la solicitud.');
        }

        await tx.user.update({
          where: { id: targetUserId },
          data: {
            password_hash: request.passwordHash,
          },
        });

        changesSummary.password = { before: '[PREVIOUS_PASSWORD_ENCRYPTED]', after: '[NEW_PASSWORD_UPDATED]' };
      }

      // 3. Marcar la solicitud como APPROVED y limpiar el hash temporal
      const updatedRequest = await tx.changeRequest.update({
        where: { id },
        data: {
          status: 'APPROVED',
          reviewedById: adminId,
          reviewedAt: new Date(),
          passwordHash: null, // Limpiar hash para máxima seguridad
        },
        select: {
          id: true,
          userId: true,
          type: true,
          status: true,
          requestedData: true,
          reviewedById: true,
          rejectionReason: true,
          createdAt: true,
          reviewedAt: true,
          user: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
              rol: true,
              profile: {
                select: {
                  apellidoMaterno: true,
                  telefono: true,
                  avatarUrl: true,
                },
              },
            },
          },
          reviewer: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
            },
          },
        },
      });

      // 4. Crear registro en Bitácora de Auditoría Permanente
      await auditService.createAuditLog(
        {
          actorId: adminId,
          actorName: admin ? `${admin.nombre} ${admin.apellido}` : 'Administrador',
          actorRole: admin?.rol || 'ADMIN',
          action: request.type === 'PROFILE_UPDATE' ? 'APROBAR_MODIFICACION_PERFIL' : 'APROBAR_CAMBIO_CONTRASENA',
          module: 'SOLICITUDES_CAMBIO',
          targetUserId: targetUserId,
          targetUserName: `${request.user.nombre} ${request.user.apellido}`,
          entityType: 'ChangeRequest',
          entityId: id,
          description: request.type === 'PROFILE_UPDATE'
            ? 'El administrador aprobó una solicitud de modificación de información personal.'
            : 'El administrador aprobó una solicitud de cambio de contraseña.',
          metadata: {
            requestId: id,
            requestType: request.type,
            changes: changesSummary,
          },
        },
        tx
      );

      // 5. Eliminar notificaciones administrativas pendientes asociadas a este ChangeRequest
      await tx.notification.deleteMany({
        where: {
          relatedId: id,
          type: 'NEW_CHANGE_REQUEST',
        },
      });

      // 6. Eliminar la notificación inicial de "Solicitud enviada" del usuario solicitante
      await tx.notification.deleteMany({
        where: {
          userId: targetUserId,
          relatedId: id,
          type: 'REQUEST_SUBMITTED',
        },
      });

      // 7. Crear notificación final para el usuario destinatario (con expiración de 5 días)
      const approvalMessage =
        request.type === 'PROFILE_UPDATE'
          ? 'Tu solicitud de cambio de información personal ha sido aprobada.'
          : 'Tu solicitud de cambio de contraseña ha sido aprobada. Ya puedes iniciar sesión con tu nueva contraseña.';

      const fiveDaysFromNow = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

      await tx.notification.create({
        data: {
          userId: targetUserId,
          title: 'Solicitud aprobada',
          message: approvalMessage,
          type: 'REQUEST_APPROVED',
          relatedId: id,
          expiresAt: fiveDaysFromNow,
          isRead: false,
        },
      });

      return updatedRequest as unknown as ChangeRequestResponse;
    });
  },

  /**
   * Rechaza una solicitud de cambio (ADMIN ONLY).
   * - Actualiza el estado a REJECTED con motivo opcional.
   * - Registra el evento permanente en AuditLog.
   * - Elimina notificaciones administrativas PENDING asociadas.
   * - Elimina la notificación inicial REQUEST_SUBMITTED del usuario.
   * - Crea la notificación final de rechazo con expiración de 5 días.
   */
  rejectChangeRequest: async (
    id: string,
    adminId: string,
    rejectionReason?: string
  ): Promise<ChangeRequestResponse> => {
    return prisma.$transaction(async (tx) => {
      // 1. Verificar existencia y estado PENDING
      const request = await tx.changeRequest.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

      if (!request) {
        throw new Error('Solicitud no encontrada.');
      }

      if (request.status !== 'PENDING') {
        throw new Error('Esta solicitud ya fue procesada por otro administrador.');
      }

      const targetUserId = request.userId;
      const cleanReason = rejectionReason?.trim() || null;

      // Obtener datos del administrador
      const admin = await tx.user.findUnique({
        where: { id: adminId },
        select: { id: true, nombre: true, apellido: true, rol: true },
      });

      // 2. Marcar como REJECTED y limpiar hash
      const updatedRequest = await tx.changeRequest.update({
        where: { id },
        data: {
          status: 'REJECTED',
          reviewedById: adminId,
          reviewedAt: new Date(),
          rejectionReason: cleanReason,
          passwordHash: null,
        },
        select: {
          id: true,
          userId: true,
          type: true,
          status: true,
          requestedData: true,
          reviewedById: true,
          rejectionReason: true,
          createdAt: true,
          reviewedAt: true,
          user: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
              rol: true,
            },
          },
          reviewer: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
            },
          },
        },
      });

      // 3. Crear registro en Bitácora de Auditoría Permanente
      await auditService.createAuditLog(
        {
          actorId: adminId,
          actorName: admin ? `${admin.nombre} ${admin.apellido}` : 'Administrador',
          actorRole: admin?.rol || 'ADMIN',
          action: request.type === 'PROFILE_UPDATE' ? 'RECHAZAR_MODIFICACION_PERFIL' : 'RECHAZAR_CAMBIO_CONTRASENA',
          module: 'SOLICITUDES_CAMBIO',
          targetUserId: targetUserId,
          targetUserName: `${request.user.nombre} ${request.user.apellido}`,
          entityType: 'ChangeRequest',
          entityId: id,
          description: request.type === 'PROFILE_UPDATE'
            ? 'El administrador rechazó una solicitud de modificación de información personal.'
            : 'El administrador rechazó una solicitud de cambio de contraseña.',
          metadata: {
            requestId: id,
            requestType: request.type,
            rejectionReason: cleanReason,
          },
        },
        tx
      );

      // 4. Eliminar notificaciones administrativas pendientes asociadas a este ChangeRequest
      await tx.notification.deleteMany({
        where: {
          relatedId: id,
          type: 'NEW_CHANGE_REQUEST',
        },
      });

      // 5. Eliminar la notificación inicial de "Solicitud enviada" del usuario solicitante
      await tx.notification.deleteMany({
        where: {
          userId: targetUserId,
          relatedId: id,
          type: 'REQUEST_SUBMITTED',
        },
      });

      // 6. Crear notificación para el usuario con el motivo y expiración de 5 días
      const typeLabel =
        request.type === 'PROFILE_UPDATE'
          ? 'cambio de información personal'
          : 'cambio de contraseña';

      const rejectMessage = cleanReason
        ? `Tu solicitud de ${typeLabel} ha sido rechazada. Motivo: ${cleanReason}`
        : `Tu solicitud de ${typeLabel} ha sido rechazada.`;

      const fiveDaysFromNow = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

      await tx.notification.create({
        data: {
          userId: targetUserId,
          title: 'Solicitud rechazada',
          message: rejectMessage,
          type: 'REQUEST_REJECTED',
          relatedId: id,
          expiresAt: fiveDaysFromNow,
          isRead: false,
        },
      });

      return updatedRequest as unknown as ChangeRequestResponse;
    });
  },
};
