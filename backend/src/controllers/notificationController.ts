import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware.js';
import { notificationService } from '../services/notificationService.js';

export const notificationController = {
  /**
   * GET /api/notifications
   * Obtiene la lista de notificaciones del usuario autenticado.
   */
  getNotifications: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const isReadQuery = req.query.isRead;
      let isRead: boolean | undefined = undefined;
      if (isReadQuery === 'true') isRead = true;
      if (isReadQuery === 'false') isRead = false;

      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : undefined;
      const userRole = req.user?.rol;

      const notifications = await notificationService.getUserNotifications(userId, userRole, isRead, limit);

      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/notifications/unread-count
   * Obtiene el conteo de notificaciones no leídas y solicitudes pendientes.
   */
  getUnreadCount: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.rol;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const count = await notificationService.getUnreadCount(userId, userRole);

      res.status(200).json({
        success: true,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/notifications/:id/read
   * Marca una notificación como leída.
   */
  markAsRead: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const id = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
      if (!id) {
        res.status(400).json({ success: false, message: 'ID de notificación requerido' });
        return;
      }

      const notification = await notificationService.markAsRead(id, userId);

      res.status(200).json({
        success: true,
        message: 'Notificación marcada como leída',
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/notifications/read-all
   * Marca todas las notificaciones del usuario como leídas.
   */
  markAllAsRead: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const result = await notificationService.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        message: 'Todas las notificaciones fueron marcadas como leídas',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
