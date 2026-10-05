import { Router } from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { authenticateJwt } from '../middleware/authMiddleware.js';

const router = Router();

// Todas las rutas de notificaciones requieren autenticación activa
router.use(authenticateJwt);

router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/:id/dismiss', notificationController.dismissFromBell);

export default router;
