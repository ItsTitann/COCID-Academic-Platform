export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface AuthenticatedUser {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: Role;
  activo: boolean;
}

export interface UserResponse {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: Role;
  activo: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AuthSuccessPayload {
  token: string;
  user: UserResponse;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}
