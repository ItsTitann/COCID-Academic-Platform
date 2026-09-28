import React from 'react';
import { Link } from 'react-router-dom';
import { FileSearch, HandMetal, GraduationCap, ArrowRight } from 'lucide-react';
import { ROUTES } from '../../routes/routes.config';
import type { UserRole } from '../../types/auth.types';

interface ModuleCardsProps {
  role: UserRole;
}

interface ModuleInfo {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: typeof FileSearch;
  tag: string;
  iconBg: string;
  tagStyle: string;
  actionColor: string;
  topBorder: string;
}

export const ModuleCards: React.FC<ModuleCardsProps> = ({ role }) => {
  const getModules = (): ModuleInfo[] => {
    if (role === 'TEACHER') {
      return [
        {
          id: 'similarity',
          title: 'Similitud Académica',
          description: 'Analiza documentos académicos, investigaciones y materiales educativos mediante modelos de procesamiento de lenguaje natural.',
          path: ROUTES.SIMILARITY.ROOT,
          icon: FileSearch,
          tag: 'NLP ACADÉMICO',
          iconBg: 'bg-blue-50 text-[#2563EB] border border-blue-100',
          tagStyle: 'bg-blue-50 text-[#2563EB] border-blue-200',
          actionColor: 'text-[#2563EB] hover:text-blue-700',
          topBorder: 'border-t-4 border-t-[#2563EB]',
        },
        {
          id: 'lsm',
          title: 'Lengua de Señas Mexicana (LSM)',
          description: 'Herramienta de apoyo para inclusión educativa mediante visión computacional y reconocimiento de señas.',
          path: ROUTES.LSM.ROOT,
          icon: HandMetal,
          tag: 'VISIÓN ARTIFICIAL',
          iconBg: 'bg-teal-50 text-[#14B8A6] border border-teal-100',
          tagStyle: 'bg-teal-50 text-[#14B8A6] border-teal-200',
          actionColor: 'text-[#14B8A6] hover:text-teal-700',
          topBorder: 'border-t-4 border-t-[#14B8A6]',
        },
        {
          id: 'scholarships',
          title: 'Becas y Posgrados',
          description: 'Consulta oportunidades académicas y programas institucionales relacionados con formación profesional.',
          path: ROUTES.SCHOLARSHIPS.ROOT,
          icon: GraduationCap,
          tag: 'RECOMENDACIÓN IA',
          iconBg: 'bg-amber-50 text-[#D4AF37] border border-amber-100',
          tagStyle: 'bg-amber-50 text-[#B89428] border-amber-200',
          actionColor: 'text-[#B89428] hover:text-amber-800',
          topBorder: 'border-t-4 border-t-[#D4AF37]',
        },
      ];
    }

    if (role === 'STUDENT') {
      return [
        {
          id: 'similarity',
          title: 'Similitud Académica',
          description: 'Verifica la originalidad de tus documentos académicos y mejora la calidad de tus trabajos.',
          path: ROUTES.SIMILARITY.ROOT,
          icon: FileSearch,
          tag: 'ORIGINALIDAD',
          iconBg: 'bg-blue-50 text-[#2563EB] border border-blue-100',
          tagStyle: 'bg-blue-50 text-[#2563EB] border-blue-200',
          actionColor: 'text-[#2563EB] hover:text-blue-700',
          topBorder: 'border-t-4 border-t-[#2563EB]',
        },
        {
          id: 'lsm',
          title: 'Lengua de Señas Mexicana',
          description: 'Aprende y practica herramientas de inclusión mediante inteligencia artificial.',
          path: ROUTES.LSM.ROOT,
          icon: HandMetal,
          tag: 'INCLUSIÓN',
          iconBg: 'bg-teal-50 text-[#14B8A6] border border-teal-100',
          tagStyle: 'bg-teal-50 text-[#14B8A6] border-teal-200',
          actionColor: 'text-[#14B8A6] hover:text-teal-700',
          topBorder: 'border-t-4 border-t-[#14B8A6]',
        },
        {
          id: 'scholarships',
          title: 'Becas y Posgrados',
          description: 'Encuentra oportunidades académicas y programas disponibles para estudiantes.',
          path: ROUTES.SCHOLARSHIPS.ROOT,
          icon: GraduationCap,
          tag: 'OPORTUNIDADES',
          iconBg: 'bg-amber-50 text-[#D4AF37] border border-amber-100',
          tagStyle: 'bg-amber-50 text-[#B89428] border-amber-200',
          actionColor: 'text-[#B89428] hover:text-amber-800',
          topBorder: 'border-t-4 border-t-[#D4AF37]',
        },
      ];
    }

    // Default ADMIN
    return [
      {
        id: 'similarity',
        title: 'Similitud Académica',
        description: 'Análisis inteligente de documentos y detección de coincidencias en textos académicos y tesis.',
        path: ROUTES.SIMILARITY.ROOT,
        icon: FileSearch,
        tag: 'NLP / SIMILITUD',
        iconBg: 'bg-blue-50 text-[#2563EB] border border-blue-100',
        tagStyle: 'bg-blue-50 text-[#2563EB] border-blue-200',
        actionColor: 'text-[#2563EB] hover:text-blue-700',
        topBorder: 'border-t-4 border-t-[#2563EB]',
      },
      {
        id: 'lsm',
        title: 'Lengua de Señas Mexicana (LSM)',
        description: 'Reconocimiento y práctica interactiva de señas mediante visión computacional y modelos de landmarks.',
        path: ROUTES.LSM.ROOT,
        icon: HandMetal,
        tag: 'VISIÓN COMPUTACIONAL',
        iconBg: 'bg-teal-50 text-[#14B8A6] border border-teal-100',
        tagStyle: 'bg-teal-50 text-[#14B8A6] border-teal-200',
        actionColor: 'text-[#14B8A6] hover:text-teal-700',
        topBorder: 'border-t-4 border-t-[#14B8A6]',
      },
      {
        id: 'scholarships',
        title: 'Recomendación de Becas y Posgrados',
        description: 'Sistema de emparejamiento inteligente de convocatorias y financiamiento según el perfil del alumno.',
        path: ROUTES.SCHOLARSHIPS.ROOT,
        icon: GraduationCap,
        tag: 'SISTEMA DE RECOMENDACIÓN',
        iconBg: 'bg-amber-50 text-[#D4AF37] border border-amber-100',
        tagStyle: 'bg-amber-50 text-[#B89428] border-amber-200',
        actionColor: 'text-[#B89428] hover:text-amber-800',
        topBorder: 'border-t-4 border-t-[#D4AF37]',
      },
    ];
  };

  const modules = getModules();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {modules.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`bg-white rounded-2xl border border-slate-200/90 ${card.topBorder} p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group`}
          >
            <div>
              {/* Cabecera de la Tarjeta */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${card.tagStyle}`}>
                  {card.tag}
                </span>
              </div>

              {/* Título y Descripción */}
              <h2 className="text-lg font-bold text-[#0B1F3A] group-hover:text-[#2563EB] transition-colors leading-snug">
                {card.title}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* Botón de Entrada */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={card.path}
                className={`inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold ${card.actionColor} transition-colors`}
              >
                <span>Ingresar al módulo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};
