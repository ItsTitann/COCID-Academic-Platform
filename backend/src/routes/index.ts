import { Router } from 'express';
import authRoutes from './authRoutes.js';
import similarityRoutes from './similarityRoutes.js';
import lsmRoutes from './lsmRoutes.js';
import scholarshipRoutes from './scholarshipRoutes.js';

const router = Router();

// Module Routes
router.use('/auth', authRoutes);
router.use('/similarity', similarityRoutes);
router.use('/lsm', lsmRoutes);
router.use('/scholarships', scholarshipRoutes);

// Health Check
router.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'COCID Backend Core',
    timestamp: new Date().toISOString(),
  });
});

export default router;
