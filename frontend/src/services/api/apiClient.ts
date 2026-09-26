import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../../types/api.types';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT Token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('cocid_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalized error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: (error.response?.data as { message?: string })?.message || error.message || 'Error de conexión con el servidor',
      statusCode: error.response?.status,
      details: error.response?.data as Record<string, unknown>,
    };
    return Promise.reject(apiError);
  }
);
