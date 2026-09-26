import React from 'react';
import { Bell, UserCircle, LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const roleLabels: Record<string, { label: string; bg: string; text: string }> = {
  ADMIN: { label: 'Administrador', bg: 'bg-rose-500/10', text: 'text-rose-600' },
  TEACHER: { label: 'Docente / Investigador', bg: 'bg-blue-500/10', text: 'text-blue-600' },
  STUDENT: { label: 'Estudiante', bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
};

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const fullName = user?.nombre && user?.apellido 
    ? `${user.nombre} ${user.apellido}` 
    : user?.email || 'Usuario Institucional';

  const roleInfo = user?.rol ? roleLabels[user.rol] || { label: user.rol, bg: 'bg-slate-100', text: 'text-slate-600' } : null;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/20">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-800 leading-tight">COCID</h1>
          <p className="text-xs text-slate-500">Plataforma Inteligente de Apoyo Académico</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          aria-label="Notificaciones"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-slate-700">
            <UserCircle className="w-6 h-6 text-slate-400" />
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium leading-none text-slate-800">{fullName}</span>
              {roleInfo && (
                <span className={`text-[10px] font-semibold mt-0.5 px-1.5 py-0.2 rounded ${roleInfo.bg} ${roleInfo.text} inline-flex items-center w-fit`}>
                  {roleInfo.label}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            title="Cerrar Sesión"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
