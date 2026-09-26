import React from 'react';
import { GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';

export const ScholarshipsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Módulo: Recomendación de Becas y Posgrados</h1>
            <p className="text-slate-600 text-sm">Matching inteligente de oportunidades académicas basadas en perfil estudiantil.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Motor de Recomendaciones Académicas</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
            Módulo estructurado para conectar perfiles académicos con el recomendador de convocatorias (<code>scholarshipsService.ts</code>).
          </p>
        </div>
        <div className="inline-flex items-center space-x-2 text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full">
          <CheckCircle2 className="w-4 h-4" />
          <span>Estructura de tipos y servicio de matching configurada</span>
        </div>
      </div>
    </div>
  );
};
