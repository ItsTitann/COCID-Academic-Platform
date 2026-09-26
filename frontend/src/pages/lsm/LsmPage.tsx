import React from 'react';
import { HandMetal, Camera, CheckCircle2 } from 'lucide-react';

export const LsmPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
            <HandMetal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Módulo: Lengua de Señas Mexicana (LSM)</h1>
            <p className="text-slate-600 text-sm">Reconocimiento de señas y práctica interactiva con visión artificial.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <Camera className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Entorno de Visión y Captura de Señas</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
            Módulo preparado para integración de cámara web e inferencia de landmarks mediante el microservicio de IA (<code>lsmService.ts</code>).
          </p>
        </div>
        <div className="inline-flex items-center space-x-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
          <CheckCircle2 className="w-4 h-4" />
          <span>Estructura de tipos y contratos LSM configurada</span>
        </div>
      </div>
    </div>
  );
};
