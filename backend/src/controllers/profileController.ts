import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware.js';
import { profileService } from '../services/profileService.js';
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
   */
  updateProfile: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const data: UpdateProfileDTO = req.body;
      const updatedProfile = await profileService.updateProfile(userId, data);

      res.status(200).json({
        success: true,
        message: 'Información personal actualizada exitosamente',
        data: updatedProfile,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/profile/password
   * Cambia la contraseña del usuario autenticado.
   */
  changePassword: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const data: ChangePasswordDTO = req.body;
      const result = await profileService.changePassword(userId, data);

      res.status(200).json({
        success: true,
        message: result.message,
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
