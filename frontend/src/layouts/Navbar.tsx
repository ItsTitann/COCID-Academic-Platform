import React from 'react';
import { Bell, UserCircle, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

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

  const fullName = user?.nombre && user?.apellido 
    ? `${user.nombre} ${user.apellido}` 
    : user?.email || 'Usuario Institucional';

  const roleInfo = user?.rol 
    ? roleLabels[user.rol] || { label: user.rol, bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' } 
    : null;

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

      {/* Zona de Perfil y Notificaciones */}
      <div className="flex items-center space-x-4">
        {/* Notificaciones */}
        <button 
          aria-label="Notificaciones del sistema"
          className="p-2 text-slate-400 hover:text-white hover:bg-[#1F2937] rounded-xl transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#14B8A6] rounded-full ring-2 ring-[#0B1F3A] animate-pulse" />
        </button>

        <div className="h-6 w-px bg-slate-700/60" />

        {/* Tarjeta de Usuario y Rol */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#14B8A6] p-0.5 shadow-md shadow-[#2563EB]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B1F3A] rounded-[9px] flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-bold leading-none text-white tracking-tight">
                {fullName}
              </span>
              {roleInfo && (
                <span className={`text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-md ${roleInfo.bg} ${roleInfo.text} border ${roleInfo.border} inline-flex items-center w-fit`}>
                  {roleInfo.label}
                </span>
              )}
            </div>
          </div>

          {/* Botón de Cerrar Sesión */}
          <button
            onClick={logout}
            title="Cerrar Sesión"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
