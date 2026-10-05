import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  LogOut, 
  Sparkles, 
  ChevronDown, 
  User as UserIcon, 
  KeyRound,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  AlertTriangle,
  CheckCheck,
  ArrowRight,
  Loader2,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../routes/routes.config';
import { notificationService } from '../services/notificationService';
import type { NotificationRecord, NotificationType } from '../types/notification.types';

const roleLabels: Record<string, { label: string; bg: string; text: string; border: string }> = {
  ADMIN: { 
    label: 'Administrador', 
    bg: 'bg-rose-500/15', 
    text: 'text-rose-300', 
    border: 'border-rose-500/30' 
  },
  TEACHER: { 
    label: 'Docente / Investigador', 
    bg: 'bg-[#2563EB]/15', 
    text: 'text-blue-300', 
    border: 'border-[#2563EB]/30' 
  },
  STUDENT: { 
    label: 'Estudiante', 
    bg: 'bg-emerald-500/15', 
    text: 'text-emerald-300', 
    border: 'border-emerald-500/30' 
  },
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

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.rol === 'ADMIN';

  // Estados de menús desplegables
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Estados de notificaciones
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [recentNotifs, setRecentNotifs] = useState<NotificationRecord[]>([]);
  const [isLoadingNotifs, setIsLoadingNotifs] = useState<boolean>(false);

  const fullName = user?.nombre && user?.apellido 
    ? `${user.nombre} ${user.apellido}` 
    : user?.email || 'Usuario Institucional';

  const roleInfo = user?.rol 
    ? roleLabels[user.rol] || { label: user.rol, bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' } 
    : null;

  const getInitials = () => {
    if (user?.nombre && user?.apellido) {
      return `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase();
    }
    return 'CO';
  };

  const getFullAvatarUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
    return `${base}${url}`;
  };

  const avatarSrc = getFullAvatarUrl(user?.profile?.avatarUrl);

  // Cargar conteo de no leídas
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      // Manejo silencioso en background
    }
  }, []);

  // Cargar notificaciones recientes para la campana (excluyendo las descartadas)
  const fetchRecentNotifs = useCallback(async () => {
    setIsLoadingNotifs(true);
    try {
      const list = await notificationService.getNotifications({ limit: 5, dismissedFromBell: false });
      setRecentNotifs(list);
    } catch {
      // Manejo silencioso
    } finally {
      setIsLoadingNotifs(false);
    }
  }, []);

  // Quitar notificación individual del dropdown de la campana
  const handleDismissFromBell = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      // 1. Quitar visualmente de forma inmediata para reactividad instantánea
      setRecentNotifs((prev) => prev.filter((n) => n.id !== id));
      // 2. Persistir en el backend
      await notificationService.dismissFromBell(id);
      // 3. Recalcular el contador de la campana
      await fetchUnreadCount();
    } catch (err) {
      console.error('Error al quitar notificación de la campana:', err);
      fetchRecentNotifs();
      fetchUnreadCount();
    }
  };

  // Polling de notificaciones no leídas cada 45 segundos
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 45000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Al abrir el dropdown de notificaciones, cargar las recientes y actualizar contador
  const toggleNotifDropdown = () => {
    const nextState = !isNotifOpen;
    setIsNotifOpen(nextState);
    if (nextState) {
      setIsDropdownOpen(false);
      fetchRecentNotifs();
      fetchUnreadCount();
    }
  };

  // Marcar todas como leídas desde el dropdown
  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markAllAsRead();
      await fetchUnreadCount();
      setRecentNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
    }
  };

  // Clic en una notificación individual
  const handleNotificationClick = async (notif: NotificationRecord) => {
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif.id);
        await fetchUnreadCount();
        setRecentNotifs((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      } catch (err) {
        console.error('Error al marcar notificación:', err);
      }
    }

    setIsNotifOpen(false);

    if (isAdmin && notif.type === 'NEW_CHANGE_REQUEST' && notif.relatedId) {
      navigate(`${ROUTES.NOTIFICATIONS}?tab=requests&id=${notif.relatedId}`);
    } else {
      navigate(ROUTES.NOTIFICATIONS);
    }
  };

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case 'REQUEST_APPROVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'REQUEST_REJECTED':
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'NEW_CHANGE_REQUEST':
        return <Clock className="w-4 h-4 text-[#D4AF37]" />;
      case 'REQUEST_SUBMITTED':
        return <FileText className="w-4 h-4 text-[#2563EB]" />;
      case 'SYSTEM_ALERT':
      default:
        return <AlertTriangle className="w-4 h-4 text-[#14B8A6]" />;
    }
  };

  return (
    <header className="h-16 bg-[#0B1F3A] border-b border-[#1F2937]/80 px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-sm">
      {/* Título de Cabecera / Identidad */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm font-bold text-white tracking-wide">
            Centro de Inteligencia Académica
          </span>
        </div>
        <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/30 font-semibold">
          COCID
        </span>
      </div>

      {/* Zona de Notificaciones y Menú de Perfil Desplegable */}
      <div className="flex items-center space-x-4">
        {/* ======================================================== */}
        {/* Menú Desplegable de Notificaciones */}
        {/* ======================================================== */}
        <div className="relative" ref={notifDropdownRef}>
          <button 
            type="button"
            onClick={toggleNotifDropdown}
            aria-label="Notificaciones del sistema"
            className="p-2 text-slate-400 hover:text-white hover:bg-[#1F2937] rounded-xl transition-colors relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#2563EB] text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-[#0B1F3A] animate-pulse shadow-sm">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#14B8A6]/40 rounded-full ring-2 ring-[#0B1F3A]" />
            )}
          </button>

          {/* Dropdown Flotante de Notificaciones */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0B1F3A] border border-[#1F2937] rounded-2xl shadow-2xl overflow-hidden animate-scaleIn z-50 text-slate-200">
              {/* Cabecera */}
              <div className="p-3.5 bg-[#08172C] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-white tracking-wide">Notificaciones</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-[#2563EB]/20 text-[#2563EB] border border-[#2563EB]/30 text-[10px] font-bold">
                      {unreadCount} {isAdmin ? 'pendientes' : 'nuevas'}
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-[#14B8A6] hover:text-white transition-colors flex items-center space-x-1 font-semibold cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Marcar leídas</span>
                  </button>
                )}
              </div>

              {/* Lista de Notificaciones Recientes */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {isLoadingNotifs ? (
                  <div className="p-6 flex items-center justify-center space-x-2 text-slate-400 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
                    <span>Cargando avisos...</span>
                  </div>
                ) : recentNotifs.length === 0 ? (
                  <div className="p-6 text-center space-y-1">
                    <p className="text-xs font-semibold text-slate-400">Sin notificaciones pendientes</p>
                    <p className="text-[11px] text-slate-500">Te avisaremos cuando haya actualizaciones en tu cuenta.</p>
                  </div>
                ) : (
                  recentNotifs.map((n) => {
                    const isPendingRequest = isAdmin && n.type === 'NEW_CHANGE_REQUEST' && (n.changeRequestStatus === 'PENDING' || n.changeRequestStatus === undefined);

                    return (
                      <div
                        key={n.id}
                        className="group relative"
                      >
                        <button
                          type="button"
                          onClick={() => handleNotificationClick(n)}
                          className={`w-full text-left p-3.5 pr-9 flex items-start space-x-3 hover:bg-[#1F2937]/70 transition-colors cursor-pointer ${
                            !n.isRead || isPendingRequest ? 'bg-blue-950/25' : ''
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {getNotifIcon(n.type)}
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-xs font-bold truncate ${!n.isRead || isPendingRequest ? 'text-white' : 'text-slate-300'}`}>
                                {n.title}
                              </p>
                              {isPendingRequest ? (
                                <span className="px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-[9px] font-bold shrink-0">
                                  Pendiente
                                </span>
                              ) : !n.isRead ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] shrink-0" />
                              ) : null}
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                              {n.message}
                            </p>
                            <span className="text-[10px] text-slate-500 font-mono block pt-0.5">
                              {formatRelativeTime(n.createdAt)}
                            </span>
                          </div>
                        </button>

                        {/* Botón X discreto para quitar de la campana */}
                        <button
                          type="button"
                          title="Quitar de la campana"
                          aria-label="Quitar de la campana"
                          onClick={(e) => handleDismissFromBell(e, n.id)}
                          className="absolute top-3 right-2.5 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pie del Dropdown */}
              <div className="p-2.5 bg-[#08172C] border-t border-slate-800 text-center">
                <Link
                  to={ROUTES.NOTIFICATIONS}
                  onClick={() => setIsNotifOpen(false)}
                  className="w-full py-1.5 flex items-center justify-center space-x-1.5 text-xs font-bold text-[#2563EB] hover:text-white transition-colors"
                >
                  <span>Ver todas las notificaciones</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-700/60" />

        {/* ======================================================== */}
        {/* Menú Desplegable de Usuario */}
        {/* ======================================================== */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-[#1F2937]/70 transition-colors focus:outline-none cursor-pointer"
            aria-expanded={isDropdownOpen}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#14B8A6] p-0.5 shadow-md shadow-[#2563EB]/20 flex items-center justify-center overflow-hidden">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={fullName}
                  className="w-full h-full object-cover rounded-[9px]"
                />
              ) : (
                <div className="w-full h-full bg-[#0B1F3A] rounded-[9px] flex items-center justify-center font-mono font-bold text-xs text-[#D4AF37]">
                  {getInitials()}
                </div>
              )}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold leading-none text-white tracking-tight">
                {fullName}
              </span>
              {roleInfo && (
                <span className={`text-[9px] font-semibold mt-1 px-1.5 py-0.2 rounded ${roleInfo.bg} ${roleInfo.text} border ${roleInfo.border} inline-flex items-center w-fit`}>
                  {roleInfo.label}
                </span>
              )}
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          {/* Menú Desplegable Flotante */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0B1F3A] border border-[#1F2937] rounded-2xl shadow-2xl overflow-hidden animate-scaleIn z-50 text-slate-200">
              {/* Cabecera del Dropdown */}
              <div className="p-4 bg-[#08172C] border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#14B8A6] p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={fullName}
                        className="w-full h-full object-cover rounded-[10px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#0B1F3A] rounded-[10px] flex items-center justify-center text-sm font-bold text-[#D4AF37] font-mono">
                        {getInitials()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{fullName}</p>
                    <p className="text-[11px] text-slate-400 truncate font-mono">{user?.email}</p>
                  </div>
                </div>

                {roleInfo && (
                  <div className="mt-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${roleInfo.bg} ${roleInfo.text} ${roleInfo.border} inline-flex items-center`}>
                      {roleInfo.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Opciones del Menú */}
              <div className="p-2 space-y-1 text-xs font-medium">
                <Link
                  to={ROUTES.PROFILE}
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-[#1F2937] text-slate-300 hover:text-white transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-[#2563EB]" />
                  <span>Mi Perfil</span>
                </Link>

                <Link
                  to={`${ROUTES.PROFILE}#seguridad`}
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-[#1F2937] text-slate-300 hover:text-white transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-[#14B8A6]" />
                  <span>Seguridad</span>
                </Link>

                <Link
                  to={ROUTES.NOTIFICATIONS}
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-[#1F2937] text-slate-300 hover:text-white transition-colors"
                >
                  <Bell className="w-4 h-4 text-[#D4AF37]" />
                  <span>Notificaciones</span>
                </Link>

                <div className="h-px bg-slate-800 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
