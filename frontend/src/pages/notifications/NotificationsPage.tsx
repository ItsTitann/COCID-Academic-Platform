import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  AlertTriangle, 
  CheckCheck, 
  Search, 
  ShieldCheck, 
  User as UserIcon, 
  KeyRound, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  X,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from '../../services/notificationService';
import { changeRequestService } from '../../services/changeRequestService';
import type { NotificationRecord, NotificationType } from '../../types/notification.types';
import type { 
  ChangeRequestRecord, 
  ChangeRequestStatus, 
  ChangeRequestType 
} from '../../types/changeRequest.types';
import type { UserRole } from '../../types/auth.types';
import { ROUTES } from '../../routes/routes.config';

const roleBadges: Record<UserRole, { label: string; bg: string; text: string; border: string }> = {
  ADMIN: { label: 'Administrador', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  TEACHER: { label: 'Docente / Investigador', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  STUDENT: { label: 'Estudiante', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

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

function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab: 'notifications' | 'requests'
  const initialTab = searchParams.get('tab') === 'requests' && isAdmin ? 'requests' : 'notifications';
  const [activeTab, setActiveTab] = useState<'notifications' | 'requests'>(initialTab);
  const targetRequestId = searchParams.get('id') || searchParams.get('requestId') || null;

  // Notificaciones State
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [isLoadingNotifs, setIsLoadingNotifs] = useState(true);
  const [notifFilter, setNotifFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [notifSearch, setNotifSearch] = useState('');

  // Solicitudes State (Admin only)
  const [requests, setRequests] = useState<ChangeRequestRecord[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [reqStatusFilter, setReqStatusFilter] = useState<ChangeRequestStatus | 'ALL'>('ALL');
  const [reqTypeFilter, setReqTypeFilter] = useState<ChangeRequestType | 'ALL'>('ALL');
  const [reqSearch, setReqSearch] = useState('');

  // Feedback State
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modales de Aprobación y Rechazo
  const [approvingRequest, setApprovingRequest] = useState<ChangeRequestRecord | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const [rejectingRequest, setRejectingRequest] = useState<ChangeRequestRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // Sincronizar tab desde query param
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'requests' && isAdmin) {
      setActiveTab('requests');
    } else if (tabParam === 'notifications') {
      setActiveTab('notifications');
    }
  }, [searchParams, isAdmin]);

  const handleTabChange = (tab: 'notifications' | 'requests') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Cargar Notificaciones
  const fetchNotifications = useCallback(async () => {
    setIsLoadingNotifs(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err: unknown) {
      console.error('Error al cargar notificaciones:', err);
    } finally {
      setIsLoadingNotifs(false);
    }
  }, []);

  // Cargar Solicitudes (ADMIN)
  const fetchRequests = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoadingRequests(true);
    try {
      const data = await changeRequestService.getAllRequests();
      setRequests(data);
    } catch (err: unknown) {
      console.error('Error al cargar solicitudes de cambio:', err);
    } finally {
      setIsLoadingRequests(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchNotifications();
    if (isAdmin) {
      fetchRequests();
    }
  }, [fetchNotifications, fetchRequests, isAdmin]);

  // Auto-dismiss feedback
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Acciones de Notificaciones
  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err: unknown) {
      console.error('Error al marcar notificación como leída:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setFeedback({ type: 'success', message: 'Todas las notificaciones han sido marcadas como leídas.' });
    } catch (err: unknown) {
      setFeedback({ type: 'error', message: 'No se pudieron marcar todas las notificaciones como leídas.' });
    }
  };

  // Acciones de Solicitudes (Admin)
  const handleConfirmApprove = async () => {
    if (!approvingRequest) return;
    setIsApproving(true);
    try {
      await changeRequestService.approveRequest(approvingRequest.id);
      setFeedback({
        type: 'success',
        message: `Solicitud de ${approvingRequest.user?.nombre || 'usuario'} aprobada con éxito. Los cambios se han aplicado en la base de datos.`
      });
      setApprovingRequest(null);
      await fetchRequests();
      await fetchNotifications();
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al aprobar la solicitud.';
      setFeedback({ type: 'error', message: errorMsg });
    } finally {
      setIsApproving(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingRequest) return;
    setIsRejecting(true);
    try {
      await changeRequestService.rejectRequest(rejectingRequest.id, {
        rejectionReason: rejectionReason.trim() || undefined,
      });
      setFeedback({
        type: 'success',
        message: `Solicitud rechazada. Se ha notificado al usuario con el motivo correspondiente.`
      });
      setRejectingRequest(null);
      setRejectionReason('');
      await fetchRequests();
      await fetchNotifications();
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al rechazar la solicitud.';
      setFeedback({ type: 'error', message: errorMsg });
    } finally {
      setIsRejecting(false);
    }
  };

  // Notificaciones filtradas
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (notifFilter === 'UNREAD' && n.isRead) return false;
      if (notifFilter === 'READ' && !n.isRead) return false;
      if (notifSearch) {
        const query = notifSearch.toLowerCase();
        return n.title.toLowerCase().includes(query) || n.message.toLowerCase().includes(query);
      }
      return true;
    });
  }, [notifications, notifFilter, notifSearch]);

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  // Solicitudes filtradas (Admin)
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (reqStatusFilter !== 'ALL' && r.status !== reqStatusFilter) return false;
      if (reqTypeFilter !== 'ALL' && r.type !== reqTypeFilter) return false;
      if (reqSearch) {
        const query = reqSearch.toLowerCase();
        const userName = `${r.user?.nombre || ''} ${r.user?.apellido || ''}`.toLowerCase();
        const userEmail = (r.user?.email || '').toLowerCase();
        return userName.includes(query) || userEmail.includes(query);
      }
      return true;
    });
  }, [requests, reqStatusFilter, reqTypeFilter, reqSearch]);

  const pendingRequestsCount = requests.filter((r) => r.status === 'PENDING').length;

  // Icono para tipo de notificación
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'REQUEST_APPROVED':
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      case 'REQUEST_REJECTED':
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
        );
      case 'NEW_CHANGE_REQUEST':
        return (
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#B38D1C] shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        );
      case 'REQUEST_SUBMITTED':
        return (
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        );
      case 'SYSTEM_ALERT':
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center text-[#14B8A6] shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
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
              <Bell className="w-7 h-7" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">
                Centro de Notificaciones
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 text-[10px] font-bold">
                COCID
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Gestión de avisos institucionales, cambios de cuenta y solicitudes de autorización.
            </p>
          </div>
        </div>

        {/* Botón de recarga rápida */}
        <div className="flex items-center space-x-3 relative z-10">
          <button
            type="button"
            onClick={() => {
              fetchNotifications();
              if (isAdmin) fetchRequests();
            }}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Banner de Feedback */}
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 animate-fadeIn ${
          feedback.type === 'success'
            ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
            : 'bg-rose-50/90 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center space-x-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-semibold">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Pestañas de Navegación (Tabs) */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => handleTabChange('notifications')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-[#0B1F3A] text-white shadow-md shadow-[#0B1F3A]/20'
              : 'text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Mis Notificaciones</span>
          {unreadNotifsCount > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'notifications' ? 'bg-[#14B8A6] text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {unreadNotifsCount}
            </span>
          )}
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={() => handleTabChange('requests')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-[#0B1F3A] text-white shadow-md shadow-[#0B1F3A]/20'
                : 'text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Solicitudes de Cambio</span>
            {pendingRequestsCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'requests' ? 'bg-[#D4AF37] text-[#0B1F3A]' : 'bg-[#D4AF37]/20 text-[#B38D1C]'
              }`}>
                {pendingRequestsCount} pendientes
              </span>
            )}
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* PESTAÑA 1: MIS NOTIFICACIONES */}
      {/* ======================================================== */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Barra de Filtros y Acciones de Notificaciones */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              {/* Buscador */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar en notificaciones..."
                  value={notifSearch}
                  onChange={(e) => setNotifSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all"
                />
              </div>

              {/* Filtro por estado */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setNotifFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    notifFilter === 'ALL' ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Todas ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setNotifFilter('UNREAD')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    notifFilter === 'UNREAD' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  No leídas ({unreadNotifsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setNotifFilter('READ')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    notifFilter === 'READ' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Leídas
                </button>
              </div>
            </div>

            {/* Acción Global: Marcar todas como leídas */}
            {unreadNotifsCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-[#2563EB] bg-[#2563EB]/10 hover:bg-[#2563EB]/20 border border-[#2563EB]/20 transition-all cursor-pointer w-full sm:w-auto justify-center"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Marcar todas como leídas</span>
              </button>
            )}
          </div>

          {/* Lista de Notificaciones */}
          {isLoadingNotifs ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
              <p className="text-xs font-semibold">Cargando tus notificaciones...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">No hay notificaciones para mostrar</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {notifSearch || notifFilter !== 'ALL'
                  ? 'No se encontraron notificaciones que coincidan con los filtros aplicados.'
                  : 'Aquí recibirás confirmaciones sobre cambios en tu cuenta, respuestas a solicitudes y avisos institucionales.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    n.isRead
                      ? 'border-slate-200/70 hover:border-slate-300'
                      : 'border-[#2563EB]/30 bg-blue-50/20 shadow-xs ring-1 ring-[#2563EB]/10'
                  }`}
                >
                  <div className="flex items-start space-x-4 min-w-0 flex-1">
                    {getNotificationIcon(n.type)}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h4 className={`text-sm font-bold truncate ${n.isRead ? 'text-slate-800' : 'text-[#0B1F3A]'}`}>
                          {n.title}
                        </h4>
                        {!n.isRead && (
                          <span className="px-2 py-0.5 rounded-full bg-[#14B8A6]/15 text-[#14B8A6] font-bold text-[9px] border border-[#14B8A6]/30">
                            Nueva
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed break-words">
                        {n.message}
                      </p>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1 font-mono">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatRelativeTime(n.createdAt)}</span>
                        </span>
                        <span>•</span>
                        <span>{formatFullDate(n.createdAt)}</span>
                        {n.expiresAt && (
                          <>
                            <span>•</span>
                            <span className="text-[#14B8A6] font-semibold">Expira en 5 días</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción individual */}
                  <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                    {!n.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(n.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#2563EB] bg-[#2563EB]/10 hover:bg-[#2563EB]/20 transition-colors flex items-center space-x-1 cursor-pointer"
                        title="Marcar como leída"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Leída</span>
                      </button>
                    )}

                    {/* Si la notificación refiere a una solicitud y el usuario es ADMIN */}
                    {isAdmin && n.relatedId && n.type === 'NEW_CHANGE_REQUEST' && (
                      <button
                        type="button"
                        onClick={() => {
                          handleMarkAsRead(n.id);
                          setSearchParams({ tab: 'requests', id: n.relatedId! });
                          setActiveTab('requests');
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Solicitud</span>
                      </button>
                    )}

                    {/* Si es de perfil, enlace a perfil */}
                    {(n.type === 'REQUEST_APPROVED' || n.type === 'REQUEST_REJECTED') && (
                      <Link
                        to={ROUTES.PROFILE}
                        onClick={() => handleMarkAsRead(n.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center space-x-1"
                      >
                        <span>Mi Perfil</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* PESTAÑA 2: SOLICITUDES DE CAMBIO (ADMIN ONLY) */}
      {/* ======================================================== */}
      {isAdmin && activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Tarjetas de Resumen Rápido (Stats) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm shrink-0">
                {requests.length}
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Solicitudes</p>
                <p className="text-sm font-black text-[#0B1F3A]">Registradas</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-amber-200/80 bg-amber-50/20 p-4 shadow-sm flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#B38D1C] font-bold text-sm shrink-0">
                {pendingRequestsCount}
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#B38D1C] uppercase tracking-wider">Pendientes</p>
                <p className="text-sm font-black text-[#0B1F3A]">Por autorizar</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-200/80 bg-emerald-50/20 p-4 shadow-sm flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                {requests.filter((r) => r.status === 'APPROVED').length}
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Aprobadas</p>
                <p className="text-sm font-black text-[#0B1F3A]">Aplicadas</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-rose-200/80 bg-rose-50/20 p-4 shadow-sm flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-sm shrink-0">
                {requests.filter((r) => r.status === 'REJECTED').length}
              </div>
              <div>
                <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Rechazadas</p>
                <p className="text-sm font-black text-[#0B1F3A]">Descartadas</p>
              </div>
            </div>
          </div>

          {/* Filtros de Solicitudes */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
              {/* Buscador */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar usuario o correo..."
                  value={reqSearch}
                  onChange={(e) => setReqSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all"
                />
              </div>

              {/* Filtro por estado */}
              <select
                value={reqStatusFilter}
                onChange={(e) => setReqStatusFilter(e.target.value as ChangeRequestStatus | 'ALL')}
                className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="ALL">Todos los estados</option>
                <option value="PENDING">Pendientes</option>
                <option value="APPROVED">Aprobadas</option>
                <option value="REJECTED">Rechazadas</option>
              </select>

              {/* Filtro por tipo */}
              <select
                value={reqTypeFilter}
                onChange={(e) => setReqTypeFilter(e.target.value as ChangeRequestType | 'ALL')}
                className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="ALL">Todos los tipos</option>
                <option value="PROFILE_UPDATE">Información Personal</option>
                <option value="PASSWORD_CHANGE">Cambio de Contraseña</option>
              </select>
            </div>
          </div>

          {/* Lista de Solicitudes */}
          {isLoadingRequests ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
              <p className="text-xs font-semibold">Cargando solicitudes institucionales...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">No hay solicitudes para mostrar</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No se encontraron solicitudes con los criterios de búsqueda seleccionados.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => {
                const isTarget = targetRequestId === req.id;
                const userRoleInfo = req.user?.rol ? roleBadges[req.user.rol] : null;

                return (
                  <div
                    key={req.id}
                    id={`req-${req.id}`}
                    className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 space-y-4 ${
                      isTarget
                        ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-lg'
                        : 'border-slate-200/80 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    {/* Encabezado de la Solicitud */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      {/* Usuario Solicitante */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B1F3A] to-[#2563EB] p-0.5 flex items-center justify-center shrink-0">
                          <div className="w-full h-full bg-[#0B1F3A] rounded-[9px] flex items-center justify-center font-mono font-bold text-xs text-[#D4AF37]">
                            {req.user?.nombre?.[0] || 'U'}{req.user?.apellido?.[0] || 'S'}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="text-sm font-bold text-[#0B1F3A]">
                              {req.user?.nombre} {req.user?.apellido}
                            </span>
                            {userRoleInfo && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${userRoleInfo.bg} ${userRoleInfo.text} ${userRoleInfo.border}`}>
                                {userRoleInfo.label}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-mono">{req.user?.email}</p>
                        </div>
                      </div>

                      {/* Tipo y Estado de la Solicitud */}
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        {/* Tipo */}
                        {req.type === 'PROFILE_UPDATE' ? (
                          <span className="px-2.5 py-1 rounded-lg bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 text-xs font-bold flex items-center space-x-1">
                            <UserIcon className="w-3.5 h-3.5" />
                            <span>Información Personal</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center space-x-1">
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Cambio de Contraseña</span>
                          </span>
                        )}

                        {/* Estado */}
                        {req.status === 'PENDING' && (
                          <span className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 text-[#B38D1C] border border-[#D4AF37]/30 text-xs font-bold flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pendiente</span>
                          </span>
                        )}
                        {req.status === 'APPROVED' && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Aprobada</span>
                          </span>
                        )}
                        {req.status === 'REJECTED' && (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center space-x-1">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Rechazada</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cuerpo: Comparativa de Valores o Notificación de Contraseña */}
                    <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60">
                      {req.type === 'PROFILE_UPDATE' ? (
                        <div className="space-y-3">
                          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Comparativa de Modificaciones Solicitadas
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {/* Nombre */}
                            <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Nombre</span>
                              <div className="text-xs space-y-1">
                                <div className="text-slate-400 line-through truncate font-medium">
                                  {req.user?.nombre || '—'}
                                </div>
                                <div className="text-[#0B1F3A] font-bold flex items-center space-x-1">
                                  <ArrowRight className="w-3 h-3 text-[#2563EB] shrink-0" />
                                  <span className="truncate">{req.requestedData?.nombre || req.user?.nombre || '—'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Apellido Paterno */}
                            <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Apellido Paterno</span>
                              <div className="text-xs space-y-1">
                                <div className="text-slate-400 line-through truncate font-medium">
                                  {req.user?.apellido || '—'}
                                </div>
                                <div className="text-[#0B1F3A] font-bold flex items-center space-x-1">
                                  <ArrowRight className="w-3 h-3 text-[#2563EB] shrink-0" />
                                  <span className="truncate">{req.requestedData?.apellido || req.user?.apellido || '—'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Apellido Materno */}
                            <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Apellido Materno</span>
                              <div className="text-xs space-y-1">
                                <div className="text-slate-400 line-through truncate font-medium">
                                  {req.user?.profile?.apellidoMaterno || '—'}
                                </div>
                                <div className="text-[#0B1F3A] font-bold flex items-center space-x-1">
                                  <ArrowRight className="w-3 h-3 text-[#2563EB] shrink-0" />
                                  <span className="truncate">{req.requestedData?.apellidoMaterno || '—'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Teléfono */}
                            <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Teléfono</span>
                              <div className="text-xs space-y-1">
                                <div className="text-slate-400 line-through truncate font-medium font-mono">
                                  {req.user?.profile?.telefono || '—'}
                                </div>
                                <div className="text-[#0B1F3A] font-bold flex items-center space-x-1">
                                  <ArrowRight className="w-3 h-3 text-[#2563EB] shrink-0" />
                                  <span className="truncate font-mono">{req.requestedData?.telefono || '—'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-[#14B8A6]/15 flex items-center justify-center text-[#14B8A6] shrink-0">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-[#0B1F3A]">
                              Solicitud de Nueva Contraseña Cifrada
                            </h5>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                              El usuario ha validado exitosamente su contraseña actual en el sistema. El nuevo hash seguro (bcrypt) se encuentra almacenado y listo para ser aplicado atómicamente a su cuenta.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Motivo de rechazo si ya fue rechazada */}
                      {req.status === 'REJECTED' && req.rejectionReason && (
                        <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Motivo de rechazo institucional: </span>
                            <span>{req.rejectionReason}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pie de Solicitud: Tiempos y Botones de Acción */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                      {/* Fechas e Información de Revisión */}
                      <div className="text-slate-400 space-y-0.5 font-mono text-[11px]">
                        <div>
                          <span>Solicitada: </span>
                          <span className="text-slate-600 font-semibold">{formatFullDate(req.createdAt)}</span>
                          <span className="text-slate-400"> ({formatRelativeTime(req.createdAt)})</span>
                        </div>
                        {req.reviewedAt && req.reviewer && (
                          <div>
                            <span>Revisada por: </span>
                            <span className="text-[#0B1F3A] font-bold">{req.reviewer.nombre} {req.reviewer.apellido}</span>
                            <span> el {formatFullDate(req.reviewedAt)}</span>
                          </div>
                        )}
                      </div>

                      {/* Botones para solicitudes PENDING */}
                      {req.status === 'PENDING' && (
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setRejectingRequest(req)}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Rechazar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setApprovingRequest(req)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#14B8A6] hover:opacity-95 shadow-md shadow-[#2563EB]/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Aprobar Solicitud</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL DE CONFIRMACIÓN DE APROBACIÓN */}
      {/* ======================================================== */}
      {approvingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F3A]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleIn">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B1F3A]">¿Aprobar solicitud institucional?</h3>
                <p className="text-xs text-slate-500">Esta acción aplicará los cambios de inmediato en la base de datos.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <p className="font-semibold text-slate-700">
                Usuario: <span className="text-[#0B1F3A] font-bold">{approvingRequest.user?.nombre} {approvingRequest.user?.apellido}</span> ({approvingRequest.user?.email})
              </p>
              <p className="text-slate-600">
                Tipo: <span className="font-bold">{approvingRequest.type === 'PROFILE_UPDATE' ? 'Información Personal' : 'Cambio de Contraseña'}</span>
              </p>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Al confirmar, el sistema actualizará el registro correspondiente en PostgreSQL y enviará una notificación automática al usuario informándole de la aprobación.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                disabled={isApproving}
                onClick={() => setApprovingRequest(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isApproving}
                onClick={handleConfirmApprove}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#14B8A6] hover:opacity-95 shadow-lg shadow-[#2563EB]/25 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Aprobando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Aprobación</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL DE RECHAZO DE SOLICITUD */}
      {/* ======================================================== */}
      {rejectingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F3A]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleIn">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B1F3A]">Rechazar solicitud institucional</h3>
                <p className="text-xs text-slate-500">Indica el motivo para notificar al solicitante.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Motivo del rechazo (opcional pero recomendado):
              </label>
              <textarea
                rows={3}
                placeholder="Ejemplo: La información no coincide con el expediente institucional o el número telefónico no es válido."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white resize-none transition-all"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                disabled={isRejecting}
                onClick={() => {
                  setRejectingRequest(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isRejecting}
                onClick={handleConfirmReject}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/25 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rechazando...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Confirmar Rechazo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
