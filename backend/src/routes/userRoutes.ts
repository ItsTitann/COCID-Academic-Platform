import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authenticateJwt } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

// Todas las rutas de administración de usuarios requieren autenticación y rol ADMIN
router.use(authenticateJwt, authorizeRoles('ADMIN'));

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.patch('/:id/status', userController.toggleStatus);
router.delete('/:id', userController.deleteUser);

export default router;
