import { apiClient } from './api/apiClient';
import type { ApiResponse } from '../types/api.types';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await apiClient.post<unknown, ApiResponse<AuthResponse>>('/auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('cocid_auth_token', res.data.token);
    }
    return res.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const res = await apiClient.post<unknown, ApiResponse<AuthResponse>>('/auth/register', data);
    if (res.data?.token) {
      localStorage.setItem('cocid_auth_token', res.data.token);
    }
    return res.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await apiClient.get<unknown, ApiResponse<User>>('/auth/profile');
    return res.data;
  },

  logout: (): void => {
    localStorage.removeItem('cocid_auth_token');
  },
};
