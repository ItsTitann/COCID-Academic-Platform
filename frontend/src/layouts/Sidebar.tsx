import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileSearch, 
  HandMetal, 
  GraduationCap, 
  Settings,
  Sparkles
} from 'lucide-react';
import { ROUTES } from '../routes/routes.config';

const navigationItems = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: 'Similitud Académica',
    path: ROUTES.SIMILARITY.ROOT,
    icon: FileSearch,
    badge: 'IA',
  },
  {
    label: 'Lengua de Señas (LSM)',
    path: ROUTES.LSM.ROOT,
    icon: HandMetal,
    badge: 'Visión IA',
  },
  {
    label: 'Becas y Posgrados',
    path: ROUTES.SCHOLARSHIPS.ROOT,
    icon: GraduationCap,
    badge: 'Matching IA',
  },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 select-none">
      <div className="p-5 border-b border-slate-800 flex items-center space-x-2.5">
        <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
          <Sparkles className="w-5 h-5" />
        </div>
        <span className="font-bold text-white tracking-wide text-sm">Módulos de IA</span>
      </div>

      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`
            }
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-500/30">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <NavLink
          to="/configuracion"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`
          }
        >
          <Settings className="w-4 h-4" />
          <span>Configuración</span>
        </NavLink>
      </div>
    </aside>
  );
};
