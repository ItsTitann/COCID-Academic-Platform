import { prisma } from '../prisma/client.js';
import type { Prisma } from '@prisma/client';
import type { 
  AuditLogResponse, 
  CreateAuditLogDTO, 
  AuditLogQueryParams, 
  PaginatedResponse 
} from '../models/index.js';

/**
 * Lista de claves sensibles que NUNCA deben almacenarse en la metadata de auditoría.
 */
const SENSITIVE_KEYS_REGEX = /^(password|password_hash|passwordhash|currentpassword|newpassword|confirmpassword|token|jwt|authorization|secret)$/i;

/**
 * Función recursiva para sanitizar cualquier objeto de metadata antes de persistir en PostgreSQL.
 */
export function sanitizeMetadata(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeMetadata(item));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_KEYS_REGEX.test(key)) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeMetadata(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export const auditService = {
  /**
   * Crea un registro de auditoría permanente.
   * Soporta ejecución dentro de una transacción `prisma.$transaction` pasando `txClient`.
   */
  createAuditLog: async (
    data: CreateAuditLogDTO,
    txClient?: Prisma.TransactionClient
  ): Promise<AuditLogResponse> => {
    const client = txClient || prisma;
    const cleanMetadata = data.metadata ? (sanitizeMetadata(data.metadata) as object) : undefined;

    const auditLog = await client.auditLog.create({
      data: {
        actorId: data.actorId || null,
        actorName: data.actorName || null,
        actorRole: data.actorRole || null,
        action: data.action,
        module: data.module,
        targetUserId: data.targetUserId || null,
        targetUserName: data.targetUserName || null,
        entityType: data.entityType || null,
        entityId: data.entityId || null,
        description: data.description,
        metadata: cleanMetadata,
      },
    });

    return auditLog as unknown as AuditLogResponse;
  },

  /**
   * Obtiene la bitácora de auditoría con filtros y paginación desde PostgreSQL (ADMIN ONLY).
   */
  getAuditLogs: async (
    params: AuditLogQueryParams
  ): Promise<PaginatedResponse<AuditLogResponse>> => {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
    const skip = (page - 1) * limit;

    const whereClause: Prisma.AuditLogWhereInput = {};

    // Filtro por módulo
    if (params.module && params.module.trim() !== 'ALL') {
      whereClause.module = params.module.trim();
    }

    // Filtro por acción
    if (params.action && params.action.trim() !== 'ALL') {
      whereClause.action = params.action.trim();
    }

    // Filtro por administrador actuante
    if (params.actorId && params.actorId.trim()) {
      whereClause.actorId = params.actorId.trim();
    }

    // Filtro por usuario afectado
    if (params.targetUserId && params.targetUserId.trim()) {
      whereClause.targetUserId = params.targetUserId.trim();
    }

    // Filtro por rango de fechas
    if (params.startDate || params.endDate) {
      whereClause.createdAt = {};
      if (params.startDate) {
        whereClause.createdAt.gte = new Date(params.startDate);
      }
      if (params.endDate) {
        // Incluir todo el día final hasta las 23:59:59.999
        const end = new Date(params.endDate);
        end.setHours(23, 59, 59, 999);
        whereClause.createdAt.lte = end;
      }
    }

    // Filtro de búsqueda textual (descripción, actorName, targetUserName, action)
    if (params.search && params.search.trim()) {
      const query = params.search.trim();
      whereClause.OR = [
        { description: { contains: query, mode: 'insensitive' } },
        { actorName: { contains: query, mode: 'insensitive' } },
        { targetUserName: { contains: query, mode: 'insensitive' } },
        { action: { contains: query, mode: 'insensitive' } },
        { module: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Ejecutar consulta y conteo total en paralelo
    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where: whereClause }),
      prisma.auditLog.findMany({
        where: whereClause,
        include: {
          targetUser: {
            select: {
              rol: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const formattedLogs: AuditLogResponse[] = logs.map((log) => ({
      id: log.id,
      actorId: log.actorId,
      actorName: log.actorName,
      actorRole: log.actorRole,
      action: log.action,
      module: log.module,
      targetUserId: log.targetUserId,
      targetUserName: log.targetUserName,
      targetUserRole: log.targetUser?.rol || null,
      entityType: log.entityType,
      entityId: log.entityId,
      description: log.description,
      metadata: log.metadata as Record<string, unknown> | null,
      createdAt: log.createdAt,
    }));

    return {
      data: formattedLogs,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  },

  /**
   * Obtiene el detalle de un registro específico de auditoría con el rol del usuario afectado.
   */
  getAuditLogById: async (id: string): Promise<AuditLogResponse> => {
    const log = await prisma.auditLog.findUnique({
      where: { id },
      include: {
        targetUser: {
          select: {
            rol: true,
          },
        },
      },
    });

    if (!log) {
      throw new Error('Registro de auditoría no encontrado.');
    }

    const formattedLog: AuditLogResponse = {
      id: log.id,
      actorId: log.actorId,
      actorName: log.actorName,
      actorRole: log.actorRole,
      action: log.action,
      module: log.module,
      targetUserId: log.targetUserId,
      targetUserName: log.targetUserName,
      targetUserRole: log.targetUser?.rol || null,
      entityType: log.entityType,
      entityId: log.entityId,
      description: log.description,
      metadata: log.metadata as Record<string, unknown> | null,
      createdAt: log.createdAt,
    };

    return formattedLog;
  },
};
