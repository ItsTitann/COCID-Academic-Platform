import React from 'react';
import { 
  History, 
  LogIn, 
  UserCheck, 
  ShieldCheck, 
  FileText, 
  Sparkles 
} from 'lucide-react';

interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  date: string;
  icon: typeof LogIn;
  color: string;
  bg: string;
}

const placeholderActivities: ActivityItem[] = [
  {
    id: '1',
    action: 'Inicio de sesión exitoso',
    detail: 'Acceso autenticado mediante token JWT institucional seguro.',
    date: 'Hoy, ' + new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    icon: LogIn,
    color: 'text-[#14B8A6]',
    bg: 'bg-teal-50 border-teal-200',
  },
  {
    id: '2',
    action: 'Actualización de credenciales',
    detail: 'Verificación de perfil institucional en el sistema COCID.',
    date: '20 de Septiembre, 2026',
    icon: UserCheck,
    color: 'text-[#2563EB]',
    bg: 'bg-blue-50 border-blue-200',
  },
  {
    id: '3',
    action: 'Consulta en Módulos de IA',
    detail: 'Sesión activa en el Centro de Inteligencia Académica.',
    date: '15 de Septiembre, 2026',
    icon: Sparkles,
    color: 'text-[#D4AF37]',
    bg: 'bg-amber-50 border-amber-200',
  },
  {
    id: '4',
    action: 'Auditoría de seguridad',
    detail: 'Comprobación de permisos y niveles de acceso sin anomalías.',
    date: '01 de Septiembre, 2026',
    icon: ShieldCheck,
    color: 'text-slate-600',
    bg: 'bg-slate-100 border-slate-200',
  },
];

export const ActivityHistory: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 text-[#D4AF37] rounded-xl border border-amber-100">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0B1F3A]">Historial de Actividad</h2>
            <p className="text-xs text-slate-400">
              Registro de eventos y accesos recientes a tu cuenta institucional.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
          Últimos 30 días
        </span>
      </div>

      {/* Lista de Actividades */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {placeholderActivities.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="relative flex items-start space-x-3.5 group">
              {/* Punto/Icono en el timeline */}
              <div
                className={`absolute -left-6 p-1.5 rounded-full ${item.bg} ${item.color} border shadow-xs bg-white shrink-0 -translate-x-1/2`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Contenido */}
              <div className="flex-1 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100 group-hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-800 tracking-tight">
                    {item.action}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">
                    {item.date}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pie Informativo */}
      <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center space-x-1">
        <FileText className="w-3.5 h-3.5 text-slate-400" />
        <span>Registro auditado por el sistema de seguridad institucional COCID.</span>
      </div>
    </div>
  );
};
