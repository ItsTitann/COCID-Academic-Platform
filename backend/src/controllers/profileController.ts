import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware.js';
import { profileService } from '../services/profileService.js';
import { changeRequestService } from '../services/changeRequestService.js';
import { auditService } from '../services/auditService.js';
import type { UpdateProfileDTO, ChangePasswordDTO } from '../models/index.js';

export const profileController = {
  /**
   * GET /api/profile
   * Obtiene la información completa del perfil del usuario autenticado.
   */
  getProfile: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const profile = await profileService.getProfile(userId);

      res.status(200).json({
        success: true,
        message: 'Perfil obtenido exitosamente',
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/profile
   * Actualiza los datos personales del usuario autenticado.
   * - ADMIN: Actualización inmediata en PostgreSQL.
   * - TEACHER / STUDENT: Genera una solicitud de cambio pendiente para aprobación de ADMIN.
   */
  updateProfile: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.rol;
      if (!userId || !userRole) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const data: UpdateProfileDTO = req.body;

      if (userRole === 'ADMIN') {
        const updatedProfile = await profileService.updateProfile(userId, data);

        // Registrar en AuditLog
        await auditService.createAuditLog({
          actorId: userId,
          actorName: `${updatedProfile.nombre} ${updatedProfile.apellido}`,
          actorRole: 'ADMIN',
          action: 'ACTUALIZAR_PERFIL_PROPIO',
          module: 'PERFIL_ADMIN',
          targetUserId: userId,
          targetUserName: `${updatedProfile.nombre} ${updatedProfile.apellido}`,
          entityType: 'User',
          entityId: userId,
          description: 'El administrador actualizó su información personal de perfil.',
          metadata: {
            changes: {
              nombre: data.nombre,
              apellido: data.apellido,
              apellidoMaterno: data.apellidoMaterno,
              telefono: data.telefono,
            },
          },
        });

        res.status(200).json({
          success: true,
          message: 'Información personal actualizada exitosamente',
          data: updatedProfile,
        });
        return;
      }

      // TEACHER o STUDENT -> Solicitud de cambio
      const changeRequest = await changeRequestService.createProfileChangeRequest(userId, data);
      res.status(200).json({
        success: true,
        isRequest: true,
        message: 'Se ha enviado correctamente tu solicitud de cambio de información personal. Espera a que un administrador acepte tu petición.',
        data: changeRequest,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/profile/password
   * Cambia la contraseña del usuario autenticado.
   * - ADMIN: Actualización inmediata verificando contraseña actual.
   * - TEACHER / STUDENT: Verifica contraseña actual y genera solicitud pendiente.
   */
  changePassword: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.rol;
      if (!userId || !userRole) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const data: ChangePasswordDTO = req.body;

      if (userRole === 'ADMIN') {
        const result = await profileService.changePassword(userId, data);
        const adminUser = req.user;

        // Registrar en AuditLog (NUNCA contraseñas ni hashes)
        await auditService.createAuditLog({
          actorId: userId,
          actorName: adminUser ? `${adminUser.nombre} ${adminUser.apellido}` : 'Administrador',
          actorRole: 'ADMIN',
          action: 'CAMBIAR_CONTRASENA_PROPIA',
          module: 'PERFIL_ADMIN',
          targetUserId: userId,
          targetUserName: adminUser ? `${adminUser.nombre} ${adminUser.apellido}` : 'Administrador',
          entityType: 'User',
          entityId: userId,
          description: 'El administrador actualizó su contraseña.',
          metadata: null, // CERO información de contraseñas
        });

        res.status(200).json({
          success: true,
          message: result.message,
        });
        return;
      }

      // TEACHER o STUDENT -> Solicitud de cambio de contraseña
      const changeRequest = await changeRequestService.createPasswordChangeRequest(userId, data);
      res.status(200).json({
        success: true,
        isRequest: true,
        message: 'Se ha enviado correctamente tu solicitud de cambio de contraseña. Espera a que un administrador acepte tu petición.',
        data: changeRequest,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/profile/avatar
   * Sube y almacena la fotografía de perfil del usuario.
   */
  uploadAvatar: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'Debe seleccionar un archivo de imagen (JPG, PNG o WEBP)',
        });
        return;
      }

      // URL accesible públicamente para el frontend
      const avatarUrl = `/uploads/profile/${req.file.filename}`;
      const updatedProfile = await profileService.updateAvatar(userId, avatarUrl);

      res.status(200).json({
        success: true,
        message: 'Fotografía de perfil actualizada exitosamente',
        data: updatedProfile,
      });
    } catch (err) {
      next(err);
    }
  },
};
