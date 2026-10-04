import { Router } from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import userRoutes from './userRoutes.js';
import similarityRoutes from './similarityRoutes.js';
import lsmRoutes from './lsmRoutes.js';
import scholarshipRoutes from './scholarshipRoutes.js';
import changeRequestRoutes from './changeRequestRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import auditRoutes from './auditRoutes.js';

const router = Router();

// Module Routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/users', userRoutes);
router.use('/similarity', similarityRoutes);
router.use('/lsm', lsmRoutes);
router.use('/scholarships', scholarshipRoutes);
router.use('/change-requests', changeRequestRoutes);
router.use('/notifications', notificationRoutes);
router.use('/audit-logs', auditRoutes);

// Health Check
router.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'COCID Backend Core',
    timestamp: new Date().toISOString(),
  });
});

export default router;
