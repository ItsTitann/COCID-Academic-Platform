import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware.js';
import { changeRequestService } from '../services/changeRequestService.js';
import type { ChangeRequestStatus, ChangeRequestType } from '../models/index.js';

export const changeRequestController = {
  /**
   * POST /api/change-requests/profile
   * Envía una solicitud de modificación de información personal (TEACHER / STUDENT).
   */
  requestProfileUpdate: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const { nombre, apellido, apellidoMaterno, telefono } = req.body;
      const request = await changeRequestService.createProfileChangeRequest(userId, {
        nombre,
        apellido,
        apellidoMaterno,
        telefono,
      });

      res.status(201).json({
        success: true,
        message: 'Solicitud enviada exitosamente. Un administrador la revisará a la brevedad.',
        data: request,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/change-requests/password
   * Envía una solicitud de cambio de contraseña (TEACHER / STUDENT).
   */
  requestPasswordChange: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const { currentPassword, newPassword } = req.body;
      const request = await changeRequestService.createPasswordChangeRequest(userId, {
        currentPassword,
        newPassword,
      });

      res.status(201).json({
        success: true,
        message: 'Solicitud de cambio de contraseña enviada exitosamente.',
        data: request,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/change-requests/my
   * Obtiene las solicitudes realizadas por el usuario en sesión.
   */
  getMyRequests: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const requests = await changeRequestService.getMyChangeRequests(userId);

      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/change-requests
   * Obtiene todas las solicitudes del sistema (ADMIN ONLY).
   */
  getAllRequests: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const status = req.query.status as ChangeRequestStatus | undefined;
      const type = req.query.type as ChangeRequestType | undefined;

      const requests = await changeRequestService.getAllChangeRequests({ status, type });

      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/change-requests/:id
   * Obtiene el detalle de una solicitud específica.
   */
  getRequestById: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.rol;
      if (!userId || !userRole) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const id = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
      if (!id) {
        res.status(400).json({ success: false, message: 'ID de solicitud requerido' });
        return;
      }

      const request = await changeRequestService.getChangeRequestById(id, userId, userRole);

      res.status(200).json({
        success: true,
        data: request,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/change-requests/:id/approve
   * Aprueba una solicitud de cambio y aplica los datos en la BD (ADMIN ONLY).
   */
  approveRequest: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = req.user?.id;
      if (!adminId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const id = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
      if (!id) {
        res.status(400).json({ success: false, message: 'ID de solicitud requerido' });
        return;
      }

      const request = await changeRequestService.approveChangeRequest(id, adminId);

      res.status(200).json({
        success: true,
        message: 'Solicitud aprobada y datos aplicados exitosamente',
        data: request,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/change-requests/:id/reject
   * Rechaza una solicitud de cambio (ADMIN ONLY).
   */
  rejectRequest: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = req.user?.id;
      if (!adminId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const id = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
      if (!id) {
        res.status(400).json({ success: false, message: 'ID de solicitud requerido' });
        return;
      }

      const { rejectionReason } = req.body;
      const request = await changeRequestService.rejectChangeRequest(id, adminId, rejectionReason);

      res.status(200).json({
        success: true,
        message: 'Solicitud rechazada',
        data: request,
      });
    } catch (error) {
      next(error);
    }
  },
};
