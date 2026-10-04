import type { UserRole } from './auth.types';

export type ChangeRequestType = 'PROFILE_UPDATE' | 'PASSWORD_CHANGE';
export type ChangeRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ProfileChangeData {
  nombre?: string;
  apellido?: string;
  apellidoMaterno?: string;
  telefono?: string;
}

export interface ChangeRequestRecord {
  id: string;
  userId: string;
  user?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: UserRole;
    profile?: {
      apellidoMaterno?: string | null;
      telefono?: string | null;
      avatarUrl?: string | null;
    } | null;
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
  createdAt: string;
  reviewedAt?: string | null;
}

export interface RequestProfileUpdatePayload {
  nombre?: string;
  apellido?: string;
  apellidoMaterno?: string;
  telefono?: string;
}

export interface RequestPasswordChangePayload {
  currentPassword: string;
  newPassword: string;
}

export interface RejectChangeRequestPayload {
  rejectionReason?: string;
}
