import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authenticateJwt } from '../middleware/authMiddleware.js';

const router = Router();

// Public auth endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected auth endpoints
router.get('/profile', authenticateJwt, authController.getProfile);

export default router;
