import { Router } from 'express';
import { changeRequestController } from '../controllers/changeRequestController.js';
import { authenticateJwt } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

// Todas las rutas requieren autenticación activa
router.use(authenticateJwt);

// Rutas para usuarios (TEACHER / STUDENT / ADMIN)
router.post('/profile', changeRequestController.requestProfileUpdate);
router.post('/password', changeRequestController.requestPasswordChange);
router.get('/my', changeRequestController.getMyRequests);
router.get('/:id', changeRequestController.getRequestById);

// Rutas de administración exclusivas para ADMIN
router.get('/', authorizeRoles('ADMIN'), changeRequestController.getAllRequests);
router.patch('/:id/approve', authorizeRoles('ADMIN'), changeRequestController.approveRequest);
router.patch('/:id/reject', authorizeRoles('ADMIN'), changeRequestController.rejectRequest);

export default router;
