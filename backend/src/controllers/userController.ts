import type { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

export const userController = {
  /**
   * GET /api/users
   * Obtiene la lista de usuarios registrados.
   */
  getUsers: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({
        success: true,
        message: 'Usuarios obtenidos exitosamente',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/users
   * Crea un nuevo usuario institucional.
   */
  createUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nombre, apellido, email, password, rol } = req.body;
      const user = await userService.createUser({
        nombre,
        apellido,
        email,
        password,
        rol,
      });

      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/users/:id
   * Actualiza los datos de un usuario.
   */
  updateUser: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const currentAdminId = req.user?.id || '';
      const { nombre, apellido, email, rol } = req.body;

      const updatedUser = await userService.updateUser(id, {
        nombre,
        apellido,
        email,
        rol,
      }, currentAdminId);

      res.status(200).json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/users/:id/status
   * Cambia el estado activo/inactivo de un usuario.
   */
  toggleStatus: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const currentAdminId = req.user?.id || '';
      const { activo } = req.body;

      if (typeof activo !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'El campo "activo" es obligatorio y debe ser un valor booleano',
        });
        return;
      }

      const updatedUser = await userService.toggleUserStatus(id, activo, currentAdminId);

      res.status(200).json({
        success: true,
        message: `Usuario ${activo ? 'activado' : 'desactivado'} exitosamente`,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/users/:id
   * Elimina un usuario de la base de datos.
   */
  deleteUser: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const currentAdminId = req.user?.id || '';

      const result = await userService.deleteUser(id, currentAdminId);

      res.status(200).json({
        success: true,
        message: 'Usuario eliminado exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
