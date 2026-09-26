import React from 'react';
import { FileSearch, UploadCloud, CheckCircle2 } from 'lucide-react';

export const SimilarityPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Módulo: Detección de Similitud Académica</h1>
            <p className="text-slate-600 text-sm">Procesamiento de documentos y análisis de originalidad académica con IA.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Carga y Análisis de Documentos</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
            La arquitectura de este módulo está conectada a la capa de servicios (<code>similarityService.ts</code>) lista para recibir archivos y comunicarse con FastAPI.
          </p>
        </div>
        <div className="inline-flex items-center space-x-2 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full">
          <CheckCircle2 className="w-4 h-4" />
          <span>Estructura de tipos y servicios configurada</span>
        </div>
      </div>
    </div>
  );
};
