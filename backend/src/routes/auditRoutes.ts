import { Router } from 'express';
import { auditController } from '../controllers/auditController.js';
import { authenticateJwt } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

// Todas las rutas de auditoría requieren autenticación JWT y rol exclusivo ADMIN
router.use(authenticateJwt);
router.use(authorizeRoles('ADMIN'));

/**
 * GET /api/audit-logs
 * Listado paginado y con filtros de la bitácora institucional.
 */
router.get('/', auditController.getAuditLogs);

/**
 * GET /api/audit-logs/:id
 * Detalle completo de un registro de auditoría.
 */
router.get('/:id', auditController.getAuditLogById);

export default router;
