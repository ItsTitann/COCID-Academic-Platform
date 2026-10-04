import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileSearch, 
  HandMetal, 
  GraduationCap, 
  Settings, 
  Users, 
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Layers,
  Bell,
  ClipboardList
} from 'lucide-react';
import { ROUTES } from '../routes/routes.config';
import { useAuth } from '../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'ADMIN';
  const [isAiModulesOpen, setIsAiModulesOpen] = useState(true);

  const aiModuleItems = [
    {
      label: 'Similitud Académica',
      path: ROUTES.SIMILARITY.ROOT,
      icon: FileSearch,
      tag: 'NLP',
      accentColor: 'text-blue-400',
    },
    {
      label: 'Lengua de Señas (LSM)',
      path: ROUTES.LSM.ROOT,
      icon: HandMetal,
      tag: 'Visión',
      accentColor: 'text-[#14B8A6]',
    },
    {
      label: 'Becas y Posgrados',
      path: ROUTES.SCHOLARSHIPS.ROOT,
      icon: GraduationCap,
      tag: 'Matching',
      accentColor: 'text-[#D4AF37]',
    },
  ];

  return (
    <aside className="w-64 bg-[#0B1F3A] text-slate-300 flex flex-col h-full border-r border-[#1F2937]/80 select-none shrink-0 z-20">
      {/* Encabezado con Logo Blanco Lineal Oficial */}
      <div className="p-5 border-b border-[#1F2937]/80 flex flex-col items-center justify-center space-y-2 bg-[#08172C]">
        <img
          src="/assets/images/blanco lineal.png"
          alt="Logotipo Institucional COCID"
          className="h-10 w-auto object-contain max-w-full drop-shadow-sm"
        />
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
            Plataforma Inteligente
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 p-3.5 space-y-2 overflow-y-auto custom-scrollbar">
        {/* Enlace Directo: Dashboard */}
        <NavLink
          to={ROUTES.DASHBOARD}
          className={({ isActive }) =>
            `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isActive
                ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25 border-l-4 border-[#D4AF37]'
                : 'text-slate-300 hover:text-white hover:bg-[#1F2937]/70'
            }`
          }
        >
          <div className="flex items-center space-x-3">
            <LayoutDashboard className="w-4 h-4 shrink-0 text-blue-300" />
            <span>Dashboard</span>
          </div>
        </NavLink>

        {/* Sección Desplegable: Módulos de IA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsAiModulesOpen(!isAiModulesOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 hover:bg-[#1F2937]/50 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>Módulos de IA</span>
            </div>
            {isAiModulesOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {isAiModulesOpen && (
            <div className="mt-1 pl-2 space-y-1 border-l-2 border-slate-800 ml-3">
              {aiModuleItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#2563EB]/90 text-white shadow-sm border-l-2 border-[#D4AF37]'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-[#1F2937]/60'
                    }`
                  }
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <item.icon className={`w-4 h-4 shrink-0 ${item.accentColor}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#07162C] text-slate-300 border border-slate-700/60 shrink-0">
                    {item.tag}
                  </span>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Sección Administrativa Exclusiva para ADMIN */}
        {isAdmin && (
          <div className="pt-4 mt-3 border-t border-[#1F2937]/80">
            <div className="px-3.5 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>Administración</span>
            </div>

            <div className="space-y-1">
              <NavLink
                to={ROUTES.USERS}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25 border-l-4 border-[#D4AF37]'
                      : 'text-slate-300 hover:text-white hover:bg-[#1F2937]/70'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>Gestión de Usuarios</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  Admin
                </span>
              </NavLink>

              <NavLink
                to={ROUTES.NOTIFICATIONS}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25 border-l-4 border-[#D4AF37]'
                      : 'text-slate-300 hover:text-white hover:bg-[#1F2937]/70'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                  <span>Notificaciones</span>
                </div>
              </NavLink>

              <NavLink
                to={ROUTES.AUDIT}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25 border-l-4 border-[#D4AF37]'
                      : 'text-slate-300 hover:text-white hover:bg-[#1F2937]/70'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <ClipboardList className="w-4 h-4 shrink-0 text-[#14B8A6]" />
                  <span>Bitácora de Auditoría</span>
                </div>
              </NavLink>
            </div>
          </div>
        )}
      </nav>

      {/* Pie del Sidebar */}
      <div className="p-3.5 border-t border-[#1F2937]/80 bg-[#08172C] flex items-center justify-between">
        <NavLink
          to="/configuracion"
          className={({ isActive }) =>
            `flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isActive ? 'bg-[#1F2937] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1F2937]/50'
            }`
          }
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Configuración</span>
        </NavLink>

        <div className="flex items-center space-x-1 text-[10px] text-[#D4AF37] font-semibold">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>v1.0</span>
        </div>
      </div>
    </aside>
  );
};
