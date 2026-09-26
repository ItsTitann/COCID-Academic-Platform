import { Router } from 'express';
import { scholarshipController } from '../controllers/scholarshipController.js';
import { authenticateJwt } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateJwt);
router.get('/', scholarshipController.getAll);
router.get('/recommend', scholarshipController.getRecommendations);

export default router;
