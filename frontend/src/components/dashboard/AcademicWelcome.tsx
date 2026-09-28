import React from 'react';
import { Sparkles, BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';
import type { UserRole } from '../../types/auth.types';

interface AcademicWelcomeProps {
  role: UserRole;
}

export const AcademicWelcome: React.FC<AcademicWelcomeProps> = ({ role }) => {
  const isTeacher = role === 'TEACHER';

  return (
    <div className="space-y-8">
      {/* Encabezado Personalizado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-xs font-semibold mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isTeacher ? 'Perfil Docente / Investigador' : 'Perfil Estudiante'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
            {isTeacher
              ? 'Bienvenido al Centro de Inteligencia COCID'
              : 'Bienvenido al Ecosistema Inteligente COCID'}
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl leading-relaxed">
            {isTeacher
              ? 'Accede a herramientas inteligentes para investigación, análisis académico e inclusión educativa.'
              : 'Explora herramientas digitales diseñadas para apoyar tu formación académica.'}
          </p>
        </div>

        {/* Indicador de Estado del Ecosistema */}
        <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm shrink-0 self-start sm:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] animate-pulse" />
          <span className="text-xs font-semibold text-slate-700">Módulos Disponibles</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">COCID</span>
        </div>
      </div>
    </div>
  );
};

export const AcademicBottomBanner: React.FC<AcademicWelcomeProps> = ({ role }) => {
  const isTeacher = role === 'TEACHER';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex items-start space-x-4 border-l-4 border-l-[#14B8A6]">
      <div className="p-3 bg-teal-50 text-[#14B8A6] rounded-xl shrink-0 mt-0.5">
        {isTeacher ? <BookOpen className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
      </div>
      <div className="text-sm">
        <div className="flex items-center space-x-2 mb-1.5">
          <h3 className="font-bold text-[#0B1F3A] text-base">
            {isTeacher ? 'Recursos Académicos Inteligentes' : 'Tu aprendizaje impulsado por IA'}
          </h3>
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-[#14B8A6] border border-teal-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Asistencia Activa</span>
          </span>
        </div>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-4xl">
          {isTeacher
            ? 'Utiliza herramientas basadas en inteligencia artificial para fortalecer procesos de investigación, aprendizaje e inclusión.'
            : 'La plataforma COCID integra inteligencia artificial para acompañarte durante tu trayectoria académica.'}
        </p>
      </div>
    </div>
  );
};
