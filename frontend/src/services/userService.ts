import { apiClient } from './api/apiClient';
import type { ApiResponse } from '../types/api.types';

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface UserRecord {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: UserRole;
  activo: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserPayload {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: UserRole;
}

export interface UpdateUserPayload {
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: UserRole;
}

export interface ToggleStatusPayload {
  activo: boolean;
}

export const userService = {
  /**
   * GET /api/users
   * Obtiene la lista de todos los usuarios del sistema.
   */
  getUsers: async (): Promise<UserRecord[]> => {
    const res = await apiClient.get<unknown, ApiResponse<UserRecord[]>>('/users');
    return res.data;
  },

  /**
   * POST /api/users
   * Crea un nuevo usuario institucional.
   */
  createUser: async (data: CreateUserPayload): Promise<UserRecord> => {
    const res = await apiClient.post<unknown, ApiResponse<UserRecord>>('/users', data);
    return res.data;
  },

  /**
   * PUT /api/users/:id
   * Actualiza los datos básicos de un usuario.
   */
  updateUser: async (id: string, data: UpdateUserPayload): Promise<UserRecord> => {
    const res = await apiClient.put<unknown, ApiResponse<UserRecord>>(`/users/${id}`, data);
    return res.data;
  },

  /**
   * PATCH /api/users/:id/status
   * Activa o desactiva la cuenta de un usuario.
   */
  toggleStatus: async (id: string, activo: boolean): Promise<UserRecord> => {
    const res = await apiClient.patch<unknown, ApiResponse<UserRecord>>(`/users/${id}/status`, { activo });
    return res.data;
  },

  /**
   * DELETE /api/users/:id
   * Elimina un usuario del sistema.
   */
  deleteUser: async (id: string): Promise<{ id: string; email: string }> => {
    const res = await apiClient.delete<unknown, ApiResponse<{ id: string; email: string }>>(`/users/${id}`);
    return res.data;
  },
};
