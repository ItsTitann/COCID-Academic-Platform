import type { ChangeRequestStatus } from './changeRequest.types';

export type NotificationType = 
  | 'REQUEST_SUBMITTED' 
  | 'REQUEST_APPROVED' 
  | 'REQUEST_REJECTED' 
  | 'NEW_CHANGE_REQUEST' 
  | 'SYSTEM_ALERT';

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedId?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  changeRequestStatus?: ChangeRequestStatus | null;
}

export interface UnreadCountData {
  count: number;
}
