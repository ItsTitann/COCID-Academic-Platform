import { apiClient } from './api/apiClient';
import type { ApiResponse } from '../types/api.types';
import type { 
  AuditLogRecord, 
  AuditLogQueryParams, 
  PaginatedAuditLogs 
} from '../types/audit.types';

export const auditService = {
  /**
   * GET /api/audit-logs
   * Obtiene la bitácora de auditoría con paginación y filtros (ADMIN ONLY).
   */
  getAuditLogs: async (params?: AuditLogQueryParams): Promise<PaginatedAuditLogs> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.search) searchParams.append('search', params.search);
    if (params?.module && params.module !== 'ALL') searchParams.append('module', params.module);
    if (params?.action && params.action !== 'ALL') searchParams.append('action', params.action);
    if (params?.actorId) searchParams.append('actorId', params.actorId);
    if (params?.targetUserId) searchParams.append('targetUserId', params.targetUserId);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await apiClient.get<unknown, ApiResponse<AuditLogRecord[]> & { meta: PaginatedAuditLogs['meta'] }>(
      `/audit-logs${query}`
    );

    return {
      data: res.data,
      meta: res.meta,
    };
  },

  /**
   * GET /api/audit-logs/:id
   * Obtiene el detalle de un registro específico de auditoría.
   */
  getAuditLogById: async (id: string): Promise<AuditLogRecord> => {
    const res = await apiClient.get<unknown, ApiResponse<AuditLogRecord>>(`/audit-logs/${id}`);
    return res.data;
  },
};
