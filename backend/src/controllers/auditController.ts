import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware.js';
import { auditService } from '../services/auditService.js';
import type { AuditLogQueryParams } from '../models/index.js';

export const auditController = {
  /**
   * GET /api/audit-logs
   * Obtiene la bitácora de auditoría con paginación y filtros (ADMIN ONLY).
   */
  getAuditLogs: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        page,
        limit,
        search,
        module,
        action,
        actorId,
        targetUserId,
        startDate,
        endDate,
      } = req.query as Record<string, string | undefined>;

      const queryParams: AuditLogQueryParams = {
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
        search: search?.trim() || undefined,
        module: module?.trim() || undefined,
        action: action?.trim() || undefined,
        actorId: actorId?.trim() || undefined,
        targetUserId: targetUserId?.trim() || undefined,
        startDate: startDate?.trim() || undefined,
        endDate: endDate?.trim() || undefined,
      };

      const result = await auditService.getAuditLogs(queryParams);

      res.status(200).json({
        success: true,
        message: 'Bitácora de auditoría obtenida exitosamente',
        data: result.data,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/audit-logs/:id
   * Obtiene el detalle de un registro específico de auditoría (ADMIN ONLY).
   */
  getAuditLogById: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID de registro de auditoría inválido',
        });
        return;
      }

      const log = await auditService.getAuditLogById(id);

      res.status(200).json({
        success: true,
        message: 'Registro de auditoría obtenido exitosamente',
        data: log,
      });
    } catch (err) {
      next(err);
    }
  },
};
