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

// ==========================================
// SOLICITUDES DE CAMBIO Y NOTIFICACIONES
// ==========================================
export type ChangeRequestType = 'PROFILE_UPDATE' | 'PASSWORD_CHANGE';
export type ChangeRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type NotificationType = 
  | 'REQUEST_SUBMITTED' 
  | 'REQUEST_APPROVED' 
  | 'REQUEST_REJECTED' 
  | 'NEW_CHANGE_REQUEST' 
  | 'SYSTEM_ALERT';

export interface ProfileChangeData {
  nombre?: string;
  apellido?: string;
  apellidoMaterno?: string;
  telefono?: string;
}

export interface ChangeRequestResponse {
  id: string;
  userId: string;
  user?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: Role;
    profile?: UserProfileData | null;
  };
  type: ChangeRequestType;
  status: ChangeRequestStatus;
  requestedData?: ProfileChangeData | null;
  reviewedById?: string | null;
  reviewer?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  } | null;
  rejectionReason?: string | null;
  createdAt: Date;
  reviewedAt?: Date | null;
}

export interface NotificationResponse {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedId?: string | null;
  expiresAt?: Date | null;
  createdAt: Date;
  changeRequestStatus?: ChangeRequestStatus | null;
}

export interface RequestProfileUpdateDTO {
  nombre?: string;
  apellido?: string;
  apellidoMaterno?: string;
  telefono?: string;
}

export interface RequestPasswordChangeDTO {
  currentPassword: string;
  newPassword: string;
}

export interface RejectChangeRequestDTO {
  rejectionReason?: string;
}

// ==========================================
// BITÁCORA DE AUDITORÍA PERMANENTE
// ==========================================
export interface AuditLogResponse {
  id: string;
  actorId?: string | null;
  actorName?: string | null;
  actorRole?: string | null;
  action: string;
  module: string;
  targetUserId?: string | null;
  targetUserName?: string | null;
  targetUserRole?: Role | null;
  entityType?: string | null;
  entityId?: string | null;
  description: string;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}

export interface CreateAuditLogDTO {
  actorId?: string | null;
  actorName?: string | null;
  actorRole?: string | null;
  action: string;
  module: string;
  targetUserId?: string | null;
  targetUserName?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  description: string;
  metadata?: Record<string, unknown> | null;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  module?: string;
  action?: string;
  actorId?: string;
  targetUserId?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

