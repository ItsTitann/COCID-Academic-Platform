import { apiClient } from './api/apiClient';
import type { ApiResponse } from '../types/api.types';
import type { NotificationRecord, UnreadCountData } from '../types/notification.types';

export const notificationService = {
  /**
   * GET /api/notifications
   * Obtiene la lista de notificaciones del usuario autenticado.
   */
  getNotifications: async (filters?: {
    isRead?: boolean;
    dismissedFromBell?: boolean;
    limit?: number;
  }): Promise<NotificationRecord[]> => {
    const params = new URLSearchParams();
    if (filters?.isRead !== undefined) {
      params.append('isRead', String(filters.isRead));
    }
    if (filters?.dismissedFromBell !== undefined) {
      params.append('dismissedFromBell', String(filters.dismissedFromBell));
    }
    if (filters?.limit) {
      params.append('limit', String(filters.limit));
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get<unknown, ApiResponse<NotificationRecord[]>>(`/notifications${query}`);
    return res.data;
  },

  /**
   * GET /api/notifications/unread-count
   * Obtiene el conteo de notificaciones no leídas para la campana.
   */
  getUnreadCount: async (): Promise<number> => {
    const res = await apiClient.get<unknown, ApiResponse<UnreadCountData>>('/notifications/unread-count');
    return res.data.count;
  },

  /**
   * PATCH /api/notifications/:id/read
   * Marca una notificación como leída.
   */
  markAsRead: async (id: string): Promise<NotificationRecord> => {
    const res = await apiClient.patch<unknown, ApiResponse<NotificationRecord>>(`/notifications/${id}/read`);
    return res.data;
  },

  /**
   * PATCH /api/notifications/read-all
   * Marca todas las notificaciones como leídas.
   */
  markAllAsRead: async (): Promise<{ count: number }> => {
    const res = await apiClient.patch<unknown, ApiResponse<{ count: number }>>('/notifications/read-all');
    return res.data;
  },

  /**
   * PATCH /api/notifications/:id/dismiss
   * Oculta una notificación del dropdown de la campana.
   */
  dismissFromBell: async (id: string): Promise<NotificationRecord> => {
    const res = await apiClient.patch<unknown, ApiResponse<NotificationRecord>>(`/notifications/${id}/dismiss`);
    return res.data;
  },
};
