import React, { useState, useEffect, useCallback } from 'react';
import { 
  ClipboardList, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  X, 
  ShieldCheck, 
  UserCheck, 
  UserPlus, 
  UserMinus, 
  Edit3, 
  KeyRound, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  RefreshCw, 
  Loader2, 
  ArrowRight
} from 'lucide-react';
import { auditService } from '../../services/auditService';
import type { AuditLogRecord, AuditLogQueryParams } from '../../types/audit.types';

function formatFullDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Hace un momento';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Ayer';
  if (diffInDays < 7) return `Hace ${diffInDays} días`;
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLog, setSelectedLog] = useState<AuditLogRecord | null>(null);

  // Paginación y metadatos
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Filtros
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Cargar bitácora desde el backend
  const fetchAuditLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: AuditLogQueryParams = {
        page,
        limit,
        search: searchTerm.trim() || undefined,
        module: selectedModule !== 'ALL' ? selectedModule : undefined,
        action: selectedAction !== 'ALL' ? selectedAction : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      const result = await auditService.getAuditLogs(params);
      setLogs(result.data);
      setTotalPages(result.meta.totalPages);
      setTotalRecords(result.meta.total);
    } catch (err) {
      console.error('Error al cargar la bitácora de auditoría:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchTerm, selectedModule, selectedAction, startDate, endDate]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedModule('ALL');
    setSelectedAction('ALL');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  // Icono y color por tipo de acción
  const getActionBadge = (action: string) => {
    switch (action) {
      case 'APROBAR_MODIFICACION_PERFIL':
      case 'APROBAR_CAMBIO_CONTRASENA':
        return {
          label: 'Aprobación de Solicitud',
          icon: CheckCircle2,
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
        };
      case 'RECHAZAR_MODIFICACION_PERFIL':
      case 'RECHAZAR_CAMBIO_CONTRASENA':
        return {
          label: 'Rechazo de Solicitud',
          icon: XCircle,
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
        };
      case 'CREAR_USUARIO':
        return {
          label: 'Creación de Usuario',
          icon: UserPlus,
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
        };
      case 'EDITAR_USUARIO':
      case 'ACTUALIZAR_PERFIL_PROPIO':
        return {
          label: 'Modificación de Datos',
          icon: Edit3,
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-200',
        };
      case 'ACTIVAR_USUARIO':
        return {
          label: 'Activación de Cuenta',
          icon: UserCheck,
          bg: 'bg-teal-50',
          text: 'text-teal-700',
          border: 'border-teal-200',
        };
      case 'DESACTIVAR_USUARIO':
        return {
          label: 'Desactivación de Cuenta',
          icon: UserMinus,
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
        };
      case 'ELIMINAR_USUARIO':
        return {
          label: 'Eliminación de Usuario',
          icon: XCircle,
          bg: 'bg-rose-100',
          text: 'text-rose-800',
          border: 'border-rose-300',
        };
      case 'CAMBIAR_CONTRASENA_PROPIA':
        return {
          label: 'Cambio de Contraseña',
          icon: KeyRound,
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
        };
      default:
        return {
          label: action.replace(/_/g, ' '),
          icon: ShieldCheck,
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200',
        };
    }
  };

  const getModuleLabel = (module: string) => {
    switch (module) {
      case 'SOLICITUDES_CAMBIO':
        return 'Solicitudes de Cambio';
      case 'GESTION_USUARIOS':
        return 'Gestión de Usuarios';
      case 'PERFIL_ADMIN':
        return 'Perfil Administrativo';
      default:
        return module;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn">
      {/* 1. Cabecera Institucional */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
        
        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B1F3A] to-[#2563EB] p-0.5 shadow-lg shadow-[#0B1F3A]/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#0B1F3A] rounded-[14px] flex items-center justify-center text-[#D4AF37]">
              <ClipboardList className="w-7 h-7" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">
                Bitácora de Auditoría
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 border border-rose-500/20 text-[10px] font-bold">
                ADMIN ONLY
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Registro histórico y permanente de actividades, resoluciones y cambios administrativos en la plataforma COCID.
            </p>
          </div>
        </div>

        {/* Botón de recarga rápida */}
        <div className="flex items-center space-x-3 relative z-10">
          <button
            type="button"
            onClick={() => fetchAuditLogs()}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* 2. Barra de Filtros y Búsqueda */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Buscador textual */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por usuario, admin o detalle..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all"
            />
          </div>

          {/* Filtro por Módulo */}
          <select
            value={selectedModule}
            onChange={(e) => {
              setSelectedModule(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            <option value="ALL">Todos los módulos</option>
            <option value="SOLICITUDES_CAMBIO">Solicitudes de Cambio</option>
            <option value="GESTION_USUARIOS">Gestión de Usuarios</option>
            <option value="PERFIL_ADMIN">Perfil Administrativo</option>
          </select>

          {/* Filtro por Acción */}
          <select
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            <option value="ALL">Todas las acciones</option>
            <option value="APROBAR_MODIFICACION_PERFIL">Aprobar Modificación de Perfil</option>
            <option value="RECHAZAR_MODIFICACION_PERFIL">Rechazar Modificación de Perfil</option>
            <option value="APROBAR_CAMBIO_CONTRASENA">Aprobar Cambio de Contraseña</option>
            <option value="RECHAZAR_CAMBIO_CONTRASENA">Rechazar Cambio de Contraseña</option>
            <option value="CREAR_USUARIO">Crear Usuario</option>
            <option value="EDITAR_USUARIO">Editar Usuario</option>
            <option value="ACTIVAR_USUARIO">Activar Usuario</option>
            <option value="DESACTIVAR_USUARIO">Desactivar Usuario</option>
            <option value="ELIMINAR_USUARIO">Eliminar Usuario</option>
            <option value="ACTUALIZAR_PERFIL_PROPIO">Actualizar Perfil Propio</option>
            <option value="CAMBIAR_CONTRASENA_PROPIA">Cambiar Contraseña Propia</option>
          </select>

          {/* Selector de límite por página */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Mostrar:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB] w-full"
            >
              <option value={10}>10 registros</option>
              <option value={20}>20 registros</option>
              <option value={50}>50 registros</option>
            </select>
          </div>
        </div>

        {/* Fila secundaria: Fechas y Limpiar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="flex items-center space-x-1 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Desde:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
              />
            </div>
            <div className="flex items-center space-x-1 text-slate-500">
              <span>Hasta:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
              />
            </div>
          </div>

          {(searchTerm || selectedModule !== 'ALL' || selectedAction !== 'ALL' || startDate || endDate) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer self-end sm:self-center"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* 3. Listado Resumido de Registros de Auditoría */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
          <p className="text-xs font-semibold">Consultando bitácora de auditoría...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">No se encontraron registros de auditoría</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No existen eventos que coincidan con los criterios de búsqueda o el rango de fechas seleccionado.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const badge = getActionBadge(log.action);
            const Icon = badge.icon;

            return (
              <div
                key={log.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
              >
                {/* Lado Izquierdo: Acción e Icono */}
                <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-xl ${badge.bg} border ${badge.border} flex items-center justify-center ${badge.text} shrink-0 mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {badge.label}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {getModuleLabel(log.module)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {log.description}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-0.5 font-mono">
                      <span>
                        Por: <span className="text-[#0B1F3A] font-bold">{log.actorName || 'Administrador'}</span>
                      </span>
                      {log.targetUserName && (
                        <>
                          <span>•</span>
                          <span>
                            Usuario: <span className="text-slate-600 font-semibold">{log.targetUserName}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lado Derecho: Fecha y Botón Ver Detalles */}
                <div className="flex items-center space-x-4 self-end sm:self-center shrink-0">
                  <div className="text-right font-mono text-[11px] text-slate-400 hidden sm:block">
                    <p className="text-slate-600 font-semibold">{formatFullDateTime(log.createdAt)}</p>
                    <p className="text-slate-400">{formatRelativeTime(log.createdAt)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedLog(log)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#2563EB] bg-[#2563EB]/10 hover:bg-[#2563EB]/20 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver detalles</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Paginación */}
      {!isLoading && logs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Mostrando página <span className="font-bold text-[#0B1F3A]">{page}</span> de{' '}
            <span className="font-bold text-[#0B1F3A]">{totalPages}</span> ({totalRecords} registros en total)
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 bg-slate-100 rounded-lg font-mono font-bold text-slate-700">
              {page} / {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Página siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL DE DETALLE COMPLETO DEL EVENTO DE AUDITORÍA */}
      {/* ======================================================== */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F3A]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-scaleIn max-h-[90vh] overflow-y-auto">
            {/* Encabezado del Modal */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-[#0B1F3A] text-[#D4AF37] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1F3A]">Detalle del Evento de Auditoría</h3>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {selectedLog.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ficha de Información Principal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Acción Institucional</span>
                <p className="font-bold text-[#0B1F3A]">{getActionBadge(selectedLog.action).label}</p>
                <p className="text-[10px] text-slate-500 font-mono">({selectedLog.action})</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Módulo del Sistema</span>
                <p className="font-bold text-[#2563EB]">{getModuleLabel(selectedLog.module)}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Realizado por</span>
                <p className="font-bold text-[#0B1F3A]">{selectedLog.actorName || 'Administrador'}</p>
                <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 inline-block mt-0.5">
                  Rol: {selectedLog.actorRole || 'ADMIN'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Usuario Afectado</span>
                <p className="font-bold text-slate-800">{selectedLog.targetUserName || 'N/A'}</p>
                {selectedLog.targetUserRole ? (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border inline-block mt-0.5 ${
                    selectedLog.targetUserRole === 'STUDENT'
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : selectedLog.targetUserRole === 'TEACHER'
                      ? 'text-blue-700 bg-blue-50 border-blue-200'
                      : 'text-rose-700 bg-rose-50 border-rose-200'
                  }`}>
                    Rol: {
                      selectedLog.targetUserRole === 'STUDENT'
                        ? 'ESTUDIANTE'
                        : selectedLog.targetUserRole === 'TEACHER'
                        ? 'DOCENTE'
                        : selectedLog.targetUserRole === 'ADMIN'
                        ? 'ADMIN'
                        : selectedLog.targetUserRole
                    }
                  </span>
                ) : selectedLog.targetUserId ? (
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 inline-block mt-0.5">
                    Rol: No disponible
                  </span>
                ) : null}
                {selectedLog.targetUserId && (
                  <p className="text-[10px] text-slate-400 font-mono">ID: {selectedLog.targetUserId}</p>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fecha y Hora Exacta</span>
                <p className="font-bold text-[#0B1F3A] font-mono">{formatFullDateTime(selectedLog.createdAt)}</p>
                <p className="text-[10px] text-slate-400">{formatRelativeTime(selectedLog.createdAt)}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Entidad de Referencia</span>
                <p className="font-bold text-slate-800">{selectedLog.entityType || 'Sistema'}</p>
                {selectedLog.entityId && (
                  <p className="text-[10px] text-slate-400 font-mono">Ref ID: {selectedLog.entityId}</p>
                )}
              </div>
            </div>

            {/* Descripción Completa */}
            <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100 text-xs space-y-1">
              <span className="text-[10px] font-bold text-blue-900 uppercase">Descripción Formal del Registro</span>
              <p className="text-slate-700 leading-relaxed font-medium">{selectedLog.description}</p>
            </div>

            {/* Metadata Segura y Resumen de Cambios */}
            {selectedLog.metadata && typeof selectedLog.metadata === 'object' && Object.keys(selectedLog.metadata).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Detalles del Cambio Registrado
                </h4>

                {/* Si hay objeto de cambios (before / after) */}
                {selectedLog.metadata.changes && typeof selectedLog.metadata.changes === 'object' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.entries(selectedLog.metadata.changes as Record<string, { before?: string | null; after?: string | null }>).map(([field, diff]) => (
                      <div key={field} className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1 shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{field}</span>
                        <div className="space-y-0.5">
                          <div className="text-slate-400 line-through truncate">
                            {diff?.before !== undefined && diff?.before !== null ? String(diff.before) : '—'}
                          </div>
                          <div className="text-emerald-700 font-bold flex items-center space-x-1">
                            <ArrowRight className="w-3 h-3 shrink-0" />
                            <span className="truncate">{diff?.after !== undefined && diff?.after !== null ? String(diff.after) : '—'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Si hay motivo de rechazo */}
                {selectedLog.metadata.rejectionReason && (
                  <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 space-y-0.5">
                    <span className="font-bold">Motivo de Rechazo Registrado:</span>
                    <p className="leading-relaxed">{String(selectedLog.metadata.rejectionReason)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Sello de Seguridad */}
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#14B8A6]" />
                <span>Registro inmutable firmado institucionalmente en PostgreSQL.</span>
              </span>
              <span className="font-mono font-bold text-[#2563EB]">COCID Audit Core</span>
            </div>

            {/* Botón de Cierre */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0B1F3A] hover:bg-[#14294d] transition-all cursor-pointer"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
