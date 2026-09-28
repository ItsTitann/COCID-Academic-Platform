import React from 'react';
import { 
  Percent, 
  Bot, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  Info
} from 'lucide-react';

interface SimilarityMetricsProps {
  overallScore: number;
  aiProbability: number;
  sourcesCount: number;
  totalWords: number;
  totalPages: number;
}

export const SimilarityMetrics: React.FC<SimilarityMetricsProps> = ({
  overallScore,
  aiProbability,
  sourcesCount,
  totalWords,
  totalPages,
}) => {
  // Clasificación de nivel de riesgo de similitud
  const getRiskLevel = (score: number) => {
    if (score <= 15) {
      return {
        label: 'BAJO',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'bg-emerald-500',
        badge: 'bg-emerald-100 text-emerald-800',
        description: 'Dentro del margen aceptable de citas y referencias',
      };
    }
    if (score <= 30) {
      return {
        label: 'MODERADO',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        barColor: 'bg-[#D4AF37]',
        badge: 'bg-amber-100 text-amber-800',
        description: 'Requiere revisión puntual de atribución y citas',
      };
    }
    return {
      label: 'ALTO',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      barColor: 'bg-rose-500',
      badge: 'bg-rose-100 text-rose-800',
      description: 'Alta coincidencia textual no atribuida detectada',
    };
  };

  const risk = getRiskLevel(overallScore);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tarjeta: Índice de Similitud Total */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 relative overflow-hidden group hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Similitud Total
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-[#0B1F3A] font-mono">
            {overallScore.toFixed(1)}%
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${risk.color}`}>
            Nivel {risk.label}
          </span>
        </div>

        {/* Barra de Progreso */}
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${risk.barColor} rounded-full transition-all duration-700`}
              style={{ width: `${Math.min(100, overallScore)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 truncate">{risk.description}</p>
        </div>
      </div>

      {/* 2. Tarjeta: Probabilidad de Contenido IA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 relative overflow-hidden group hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Asistencia IA
          </span>
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#14B8A6] flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-[#0B1F3A] font-mono">
            {aiProbability.toFixed(1)}%
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            {aiProbability < 10 ? 'Mínima' : aiProbability < 25 ? 'Moderada' : 'Elevada'}
          </span>
        </div>

        {/* Barra de Progreso IA */}
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#14B8A6] rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, aiProbability)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">Probabilidad de síntesis generativa</p>
        </div>
      </div>

      {/* 3. Tarjeta: Fuentes Coincidentes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 relative overflow-hidden group hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Fuentes Detectadas
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#D4AF37] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-[#0B1F3A] font-mono">
            {sourcesCount}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {sourcesCount === 1 ? 'fuente' : 'fuentes'}
          </span>
        </div>

        <div className="pt-1.5 flex items-center space-x-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
          <span className="truncate">UNAM, SciELO, IEEE, Redalyc</span>
        </div>
      </div>

      {/* 4. Tarjeta: Extensión del Manuscrito */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 relative overflow-hidden group hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Extensión Analizada
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-[#0B1F3A] font-mono">
            {totalWords.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 font-medium">palabras</span>
        </div>

        <div className="pt-1.5 flex items-center space-x-1.5 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{totalPages} {totalPages === 1 ? 'página procesada' : 'páginas procesadas'}</span>
        </div>
      </div>
    </div>
  );
};
