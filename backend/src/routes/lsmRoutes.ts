import { Router } from 'express';
import { lsmController } from '../controllers/lsmController.js';
import { authenticateJwt } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateJwt);
router.post('/predict', lsmController.predict);
router.post('/sessions', lsmController.saveSession);

export default router;
