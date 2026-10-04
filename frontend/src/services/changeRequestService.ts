import { apiClient } from './api/apiClient';
import type { ApiResponse } from '../types/api.types';
import type { 
  ChangeRequestRecord, 
  ChangeRequestStatus, 
  ChangeRequestType, 
  RequestProfileUpdatePayload, 
  RequestPasswordChangePayload,
  RejectChangeRequestPayload 
} from '../types/changeRequest.types';

export const changeRequestService = {
  /**
   * POST /api/change-requests/profile
   * Envía una solicitud de modificación de información personal (TEACHER / STUDENT).
   */
  requestProfileUpdate: async (payload: RequestProfileUpdatePayload): Promise<ApiResponse<ChangeRequestRecord>> => {
    return apiClient.post('/change-requests/profile', payload);
  },

  /**
   * POST /api/change-requests/password
   * Envía una solicitud de cambio de contraseña (TEACHER / STUDENT).
   */
  requestPasswordChange: async (payload: RequestPasswordChangePayload): Promise<ApiResponse<ChangeRequestRecord>> => {
    return apiClient.post('/change-requests/password', payload);
  },

  /**
   * GET /api/change-requests/my
   * Obtiene las solicitudes de cambio realizadas por el usuario en sesión.
   */
  getMyRequests: async (): Promise<ChangeRequestRecord[]> => {
    const res = await apiClient.get<unknown, ApiResponse<ChangeRequestRecord[]>>('/change-requests/my');
    return res.data;
  },

  /**
   * GET /api/change-requests
   * Obtiene todas las solicitudes del sistema (ADMIN ONLY).
   */
  getAllRequests: async (filters?: {
    status?: ChangeRequestStatus | 'ALL';
    type?: ChangeRequestType | 'ALL';
  }): Promise<ChangeRequestRecord[]> => {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'ALL') {
      params.append('status', filters.status);
    }
    if (filters?.type && filters.type !== 'ALL') {
      params.append('type', filters.type);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get<unknown, ApiResponse<ChangeRequestRecord[]>>(`/change-requests${query}`);
    return res.data;
  },

  /**
   * GET /api/change-requests/:id
   * Obtiene el detalle de una solicitud.
   */
  getRequestById: async (id: string): Promise<ChangeRequestRecord> => {
    const res = await apiClient.get<unknown, ApiResponse<ChangeRequestRecord>>(`/change-requests/${id}`);
    return res.data;
  },

  /**
   * PATCH /api/change-requests/:id/approve
   * Aprueba una solicitud de cambio y aplica los cambios en PostgreSQL (ADMIN ONLY).
   */
  approveRequest: async (id: string): Promise<ApiResponse<ChangeRequestRecord>> => {
    return apiClient.patch(`/change-requests/${id}/approve`);
  },

  /**
   * PATCH /api/change-requests/:id/reject
   * Rechaza una solicitud de cambio con motivo opcional (ADMIN ONLY).
   */
  rejectRequest: async (id: string, payload?: RejectChangeRequestPayload): Promise<ApiResponse<ChangeRequestRecord>> => {
    return apiClient.patch(`/change-requests/${id}/reject`, payload || {});
  },
};
