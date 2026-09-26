import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthenticatedUser } from '../models/index.js';

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateJwt = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Acceso no autorizado: Token de sesión ausente o con formato incorrecto',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'cocid_secret_fallback_key';

  try {
    const decoded = jwt.verify(token, secret) as AuthenticatedUser;
    
    if (!decoded || !decoded.id) {
      res.status(401).json({
        success: false,
        message: 'Token de sesión inválido',
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (err: unknown) {
    const isExpired = (err as { name?: string })?.name === 'TokenExpiredError';
    res.status(401).json({
      success: false,
      message: isExpired
        ? 'La sesión ha expirado. Por favor, inicie sesión nuevamente.'
        : 'Token inválido o corrupto',
    });
  }
};
