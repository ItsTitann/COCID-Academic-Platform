import React from 'react';
import { Link } from 'react-router-dom';
import { FileSearch, HandMetal, GraduationCap, ArrowRight, Cpu } from 'lucide-react';
import { ROUTES } from '../../routes/routes.config';

const moduleCards = [
  {
    id: 'similarity',
    title: 'Similitud Académica',
    description: 'Análisis inteligente de documentos y detección de coincidencias en textos académicos.',
    path: ROUTES.SIMILARITY.ROOT,
    icon: FileSearch,
    color: 'from-blue-600 to-indigo-600',
    tag: 'NLP / Similitud',
  },
  {
    id: 'lsm',
    title: 'Lengua de Señas Mexicana (LSM)',
    description: 'Reconocimiento y práctica interactiva de señas mediante visión computacional.',
    path: ROUTES.LSM.ROOT,
    icon: HandMetal,
    color: 'from-emerald-600 to-teal-600',
    tag: 'Visión Computacional',
  },
  {
    id: 'scholarships',
    title: 'Recomendación de Becas y Posgrados',
    description: 'Sistema de emparejamiento inteligente de convocatorias según tu perfil académico.',
    path: ROUTES.SCHOLARSHIPS.ROOT,
    icon: GraduationCap,
    color: 'from-amber-500 to-orange-600',
    tag: 'Sistema de Recomendación',
  },
];

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Bienvenido al Centro de Inteligencia COCID
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Accede a las herramientas de inteligencia artificial para el fortalecimiento académico e inclusión.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {moduleCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                    {card.tag}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {card.title}
                </h2>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  to={card.path}
                  className="inline-flex items-center space-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <span>Ingresar al módulo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-6 flex items-start space-x-4">
        <div className="p-2 bg-indigo-600 text-white rounded-lg shrink-0 mt-0.5">
          <Cpu className="w-5 h-5" />
        </div>
        <div className="text-sm text-indigo-950">
          <h3 className="font-semibold mb-1">Arquitectura Modular de IA Activa</h3>
          <p className="text-indigo-800 leading-relaxed">
            Los servicios de inferencia en Python (FastAPI) y la capa de gestión en Node.js (Express + Prisma) están listos para la integración de modelos de lenguaje, visión artificial y filtrado colaborativo.
          </p>
        </div>
      </div>
    </div>
  );
};
