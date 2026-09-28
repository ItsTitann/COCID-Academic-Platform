import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ModuleCards } from '../../components/dashboard/ModuleCards';
import { AdminAnalytics } from '../../components/dashboard/AdminAnalytics';
import { AcademicWelcome, AcademicBottomBanner } from '../../components/dashboard/AcademicWelcome';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const role = user?.rol || 'STUDENT';
  const isAdmin = role === 'ADMIN';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* VISTA 1: DASHBOARD PARA ADMINISTRADOR */}
      {isAdmin ? (
        <>
          {/* Encabezado Institucional de Administración */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-xs font-semibold mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Centro de Inteligencia COCID</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
                Panel de Control Institucional
              </h1>
              <p className="text-slate-500 text-sm mt-1 max-w-2xl leading-relaxed">
                Gestión y acceso centralizado a los módulos de inteligencia artificial para la investigación, inclusión y orientación académica.
              </p>
            </div>

            {/* Indicador de Estado Operativo */}
            <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm shrink-0 self-start sm:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] animate-pulse" />
              <span className="text-xs font-semibold text-slate-700">Sistema en Línea</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">v1.0</span>
            </div>
          </div>

          {/* Tarjetas de Módulos */}
          <ModuleCards role="ADMIN" />

          {/* Analítica y Métricas del Sistema (Exclusivo Administrador) */}
          <AdminAnalytics />
        </>
      ) : (
        /* VISTA 2: DASHBOARD PARA DOCENTE (TEACHER) O ESTUDIANTE (STUDENT) */
        <>
          {/* Encabezado Académico Personalizado */}
          <AcademicWelcome role={role} />

          {/* Tarjetas de Módulos con Descripciones Académicas por Rol */}
          <ModuleCards role={role} />

          {/* Bloque Institucional de Acompañamiento Académico */}
          <AcademicBottomBanner role={role} />
        </>
      )}
    </div>
  );
};
