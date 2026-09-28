export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface AuthenticatedUser {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: Role;
  activo: boolean;
}

export interface UserProfileData {
  apellidoMaterno?: string | null;
  telefono?: string | null;
  avatarUrl?: string | null;
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
  profile?: UserProfileData | null;
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

// DTOs para gestión de perfil de usuario
export interface UpdateProfileDTO {
  nombre?: string;
  apellido?: string;
  apellidoMaterno?: string;
  telefono?: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

// DTOs para gestión administrativa de usuarios
export interface CreateUserDTO {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: Role;
}

export interface UpdateUserDTO {
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: Role;
}

export interface UpdateUserStatusDTO {
  activo: boolean;
}
