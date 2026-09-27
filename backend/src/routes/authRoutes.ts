import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authenticateJwt } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

// Rutas públicas de autenticación
router.post('/login', authController.login);

// Rutas protegidas para cualquier usuario autenticado
router.get('/profile', authenticateJwt, authController.getProfile);

// Ruta de creación/registro de usuarios restringida exclusivamente a ADMIN
router.post('/register', authenticateJwt, authorizeRoles('ADMIN'), authController.register);

export default router;
