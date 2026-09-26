import { Router } from 'express';
import { similarityController } from '../controllers/similarityController.js';
import { authenticateJwt } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateJwt);
router.post('/analyze', similarityController.analyze);
router.get('/reports', similarityController.getReports);

export default router;
