import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  LogOut, 
  Sparkles, 
  ChevronDown, 
  User as UserIcon, 
  KeyRound 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../routes/routes.config';

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

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        {/* Notificaciones */}
        <button 
          aria-label="Notificaciones del sistema"
          className="p-2 text-slate-400 hover:text-white hover:bg-[#1F2937] rounded-xl transition-colors relative cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#14B8A6] rounded-full ring-2 ring-[#0B1F3A] animate-pulse" />
        </button>

        <div className="h-6 w-px bg-slate-700/60" />

        {/* Menú Desplegable de Usuario */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
