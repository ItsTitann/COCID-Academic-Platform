export interface AuditLogRecord {
  id: string;
  actorId?: string | null;
  actorName?: string | null;
  actorRole?: string | null;
  action: string;
  module: string;
  targetUserId?: string | null;
  targetUserName?: string | null;
  targetUserRole?: 'ADMIN' | 'TEACHER' | 'STUDENT' | string | null;
  entityType?: string | null;
  entityId?: string | null;
  description: string;
  metadata?: Record<string, any> | null;
  createdAt: string;
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

export interface PaginatedAuditLogs {
  data: AuditLogRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
