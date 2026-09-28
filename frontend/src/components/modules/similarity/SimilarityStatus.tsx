import React, { useEffect, useState } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  BookOpen, 
  FileSearch,
  Bot
} from 'lucide-react';
import type { AnalysisStatus } from '../../../types/similarity.types';

interface SimilarityStatusProps {
  status: AnalysisStatus;
  processingMessage?: string;
  progressPercentage?: number;
}

export const SimilarityStatus: React.FC<SimilarityStatusProps> = ({
  status,
  processingMessage,
  progressPercentage = 45,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { label: 'Extrayendo capas de texto y metadatos...', icon: FileSearch },
    { label: 'Segmentando fragmentos y calculando embeddings...', icon: Layers },
    { label: 'Consultando bases académicas (UNAM, SciELO, IEEE)...', icon: BookOpen },
    { label: 'Evaluando patrones de generación por IA...', icon: Bot },
    { label: 'Generando reporte de integridad académica...', icon: Sparkles },
  ];

  useEffect(() => {
    if (status === 'PROCESSING') {
      const interval = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % steps.length);
      }, 2200);
      return () => clearInterval(interval);
    }
  }, [status, steps.length]);

  const getStatusBadge = () => {
    switch (status) {
      case 'PENDING':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          title: 'Esperando documento',
        };
      case 'UPLOADED':
        return {
          bg: 'bg-blue-50 text-[#2563EB] border-blue-200',
          dot: 'bg-[#2563EB]',
          title: 'Documento cargado correctamente',
        };
      case 'PROCESSING':
        return {
          bg: 'bg-blue-50 text-[#2563EB] border-blue-200',
          dot: 'bg-[#2563EB] animate-ping',
          title: 'Analizando documento mediante NLP',
        };
      case 'COMPLETED':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          title: 'Reporte generado',
        };
      case 'FAILED':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          title: 'Error durante el procesamiento',
        };
    }
  };

  const currentBadge = getStatusBadge();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      {/* Encabezado del Estado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] text-white flex items-center justify-center shadow-sm">
            <Cpu className={`w-5 h-5 ${status === 'PROCESSING' ? 'animate-spin text-[#14B8A6]' : 'text-blue-300'}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0B1F3A]">
              Motor de Similitud e Integridad Académica COCID
            </h3>
            <p className="text-xs text-slate-500">
              {processingMessage || currentBadge.title}
            </p>
          </div>
        </div>

        <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold border ${currentBadge.bg}`}>
          <span className={`w-2 h-2 rounded-full ${currentBadge.dot}`} />
          <span>{currentBadge.title}</span>
        </div>
      </div>

      {/* Barra de progreso cuando está en PROCESSING */}
      {status === 'PROCESSING' && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
            <div className="flex items-center space-x-2 text-[#2563EB]">
              {React.createElement(steps[currentStepIndex].icon, { className: 'w-4 h-4 animate-bounce' })}
              <span>{steps[currentStepIndex].label}</span>
            </div>
            <span className="text-slate-400 font-mono">{progressPercentage}%</span>
          </div>

          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-[#2563EB] via-[#14B8A6] to-[#D4AF37] rounded-full transition-all duration-500 shadow-sm relative overflow-hidden"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-[shimmer_1.5s_infinite] -skew-x-12" />
            </div>
          </div>
        </div>
      )}

      {/* Estado Completado */}
      {status === 'COMPLETED' && (
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>El análisis semántico y la contrastación multirreferencial finalizaron con éxito.</span>
        </div>
      )}

      {/* Estado Error */}
      {status === 'FAILED' && (
        <div className="flex items-center space-x-2 text-xs font-semibold text-rose-700 bg-rose-50 px-3.5 py-2 rounded-xl border border-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Ocurrió una interrupción al procesar el archivo. Verifique el formato e intente nuevamente.</span>
        </div>
      )}
    </div>
  );
};
