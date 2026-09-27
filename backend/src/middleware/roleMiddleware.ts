import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './authMiddleware.js';
import type { Role } from '../models/index.js';

/**
 * Middleware de autorización basado en roles para la plataforma COCID.
 * Requiere que la petición haya pasado previamente por `authenticateJwt`.
 * 
 * @param allowedRoles Lista de uno o más roles autorizados ('ADMIN' | 'TEACHER' | 'STUDENT')
 * 
 * Ejemplos de uso:
 * - authorizeRoles('ADMIN')
 * - authorizeRoles('ADMIN', 'TEACHER')
 */
export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // 1. Validar que exista usuario autenticado en la request
    if (!req.user || !req.user.id) {
      res.status(401).json({
        success: false,
        message: 'Acceso no autorizado: Se requiere iniciar sesión previamente',
      });
      return;
    }

    // 2. Validar si el rol del usuario está dentro de los roles autorizados
    if (!allowedRoles.includes(req.user.rol)) {
      res.status(403).json({
        success: false,
        message: `Acceso denegado: El rol '${req.user.rol}' no cuenta con los permisos necesarios para realizar esta acción. Roles requeridos: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    // 3. El usuario cuenta con la autorización requerida
    next();
  };
};
