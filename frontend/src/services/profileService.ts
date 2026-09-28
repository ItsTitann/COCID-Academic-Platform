import { apiClient } from './api/apiClient';
import type { ApiResponse } from '../types/api.types';
import type { User } from '../types/auth.types';

export interface UpdateProfilePayload {
  nombre?: string;
  apellido?: string;
  apellidoMaterno?: string;
  telefono?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const profileService = {
  /**
   * GET /api/profile
   * Obtiene la información completa del perfil del usuario autenticado.
   */
  getProfile: async (): Promise<User> => {
    const res = await apiClient.get<unknown, ApiResponse<User>>('/profile');
    return res.data;
  },

  /**
   * PUT /api/profile
   * Actualiza los datos personales del usuario autenticado en PostgreSQL.
   */
  updateProfile: async (data: UpdateProfilePayload): Promise<User> => {
    const res = await apiClient.put<unknown, ApiResponse<User>>('/profile', data);
    return res.data;
  },

  /**
   * PUT /api/profile/password
   * Cambia la contraseña del usuario verificando la actual mediante bcrypt.
   */
  changePassword: async (data: ChangePasswordPayload): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.put<unknown, ApiResponse<{ success: boolean; message: string }>>('/profile/password', data);
    return {
      success: res.success,
      message: res.message || 'Contraseña actualizada exitosamente',
    };
  },

  /**
   * POST /api/profile/avatar
   * Sube un archivo de imagen (JPG, PNG, WEBP) y actualiza el avatarUrl del usuario.
   */
  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await apiClient.post<unknown, ApiResponse<User>>('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
