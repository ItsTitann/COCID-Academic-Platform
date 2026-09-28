import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  FileText
} from 'lucide-react';
import type { DocumentPage, MatchedFragment } from '../../../types/similarity.types';

interface SimilarityViewerProps {
  documentTitle: string;
  pages?: DocumentPage[];
  fragments?: MatchedFragment[];
  fileUrl?: string;
  totalPages?: number;
  onSelectFragment?: (fragmentId: string) => void;
  selectedFragmentId?: string | null;
}

export const SimilarityViewer: React.FC<SimilarityViewerProps> = ({
  documentTitle,
  pages = [],
  fragments = [],
  fileUrl,
  totalPages = 1,
  onSelectFragment,
  selectedFragmentId = null,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeLayer, setActiveLayer] = useState<'ALL' | 'DIRECT' | 'PARAPHRASE' | 'AI'>('ALL');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const total = Math.max(1, pages.length > 0 ? pages.length : totalPages);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(150, prev + 10));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(70, prev - 10));
  const handleZoomReset = () => setZoomLevel(100);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(total, prev + 1));

  // Obtener página activa
  const currentPageData = pages.find((p) => p.pageNumber === currentPage) || pages[0];

  // Determinar si un tipo de resaltado está activo según la capa seleccionada
  const isHighlightVisible = (type?: string) => {
    if (!type) return false;
    if (activeLayer === 'ALL') return true;
    if (activeLayer === 'DIRECT' && type === 'DIRECT_MATCH') return true;
    if (activeLayer === 'PARAPHRASE' && type === 'PARAPHRASE') return true;
    if (activeLayer === 'AI' && type === 'AI_GENERATED') return true;
    return false;
  };

  const getHighlightStyle = (type: string, isSelected: boolean) => {
    switch (type) {
      case 'DIRECT_MATCH':
        return `bg-blue-100/90 text-blue-950 border-l-4 border-[#2563EB] ${
          isSelected ? 'ring-2 ring-[#2563EB] shadow-md' : 'hover:bg-blue-200/90'
        }`;
      case 'PARAPHRASE':
        return `bg-amber-100/90 text-amber-950 border-l-4 border-[#D4AF37] ${
          isSelected ? 'ring-2 ring-[#D4AF37] shadow-md' : 'hover:bg-amber-200/90'
        }`;
      case 'AI_GENERATED':
        return `bg-teal-100/90 text-teal-950 border-l-4 border-[#14B8A6] ${
          isSelected ? 'ring-2 ring-[#14B8A6] shadow-md' : 'hover:bg-teal-200/90'
        }`;
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-slate-900/5 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Barra de Herramientas Superior del Visor */}
      <div className="p-3 bg-[#0B1F3A] text-white flex flex-wrap items-center justify-between gap-3 border-b border-[#1F2937] shrink-0">
        {/* Título y archivo */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-blue-600/30 text-blue-300">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-100 truncate block max-w-[180px] sm:max-w-xs">
              {documentTitle}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">
              {fragments.length} pasajes identificados {fileUrl ? '• Documento original disponible' : ''}
            </span>
          </div>
        </div>

        {/* Capas de Resaltado */}
        <div className="flex items-center space-x-1 text-xs">
          <span className="text-[10px] text-slate-400 mr-1 hidden sm:inline">Capas:</span>
          <button
            type="button"
            onClick={() => setActiveLayer('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
              activeLayer === 'ALL'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('DIRECT')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-colors ${
              activeLayer === 'DIRECT'
                ? 'bg-[#2563EB] text-white'
                : 'text-blue-300 hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Similitud</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('PARAPHRASE')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-colors ${
              activeLayer === 'PARAPHRASE'
                ? 'bg-[#D4AF37] text-[#0B1F3A]'
                : 'text-amber-300 hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span>Paráfrasis</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('AI')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-colors ${
              activeLayer === 'AI'
                ? 'bg-[#14B8A6] text-[#0B1F3A]'
                : 'text-teal-300 hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
            <span>IA</span>
          </button>
        </div>

        {/* Navegación de Páginas y Zoom */}
        <div className="flex items-center space-x-2">
          {/* Zoom */}
          <div className="flex items-center space-x-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 70}
              className="text-slate-300 hover:text-white disabled:text-slate-600 transition-colors p-0.5"
              title="Reducir zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-slate-200 px-1">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 150}
              className="text-slate-300 hover:text-white disabled:text-slate-600 transition-colors p-0.5"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomReset}
              className="text-slate-400 hover:text-white transition-colors p-0.5 ml-1"
              title="Restablecer 100%"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Paginador */}
          <div className="flex items-center space-x-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="text-slate-300 hover:text-white disabled:text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-200 px-1.5">
              {currentPage} / {total}
            </span>
            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage >= total}
              className="text-slate-300 hover:text-white disabled:text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Área del Documento */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-100 flex justify-center items-start custom-scrollbar">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-200 w-full max-w-2xl"
        >
          {/* Hoja de Documento Académico */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200/90 p-8 sm:p-12 min-h-[680px] space-y-6 text-slate-800 relative">
            {/* Encabezado Institucional de la Hoja */}
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-500 uppercase tracking-wider">
                Plataforma Inteligente COCID — Manuscrito Arbitrado
              </span>
              <span className="font-mono">Pág. {currentPage} de {total}</span>
            </div>

            {/* Título de Sección */}
            {currentPageData?.title && (
              <h4 className="text-base font-bold text-[#0B1F3A] border-l-2 border-[#2563EB] pl-3 py-0.5">
                {currentPageData.title}
              </h4>
            )}

            {/* Párrafos del Manuscrito */}
            <div className="space-y-4 text-sm leading-relaxed text-slate-700 font-serif">
              {currentPageData?.paragraphs && currentPageData.paragraphs.length > 0 ? (
                currentPageData.paragraphs.map((p) => {
                  const hasHighlight = p.highlight && isHighlightVisible(p.highlight.type);
                  const isSelected = p.highlight?.fragmentId === selectedFragmentId;

                  return (
                    <div key={p.id} className="relative group/paragraph">
                      {hasHighlight ? (
                        <div
                          onClick={() => {
                            if (p.highlight?.fragmentId) {
                              onSelectFragment?.(p.highlight.fragmentId);
                              setActiveTooltip(activeTooltip === p.id ? null : p.id);
                            }
                          }}
                          className={`p-3 rounded-lg transition-all cursor-pointer ${getHighlightStyle(
                            p.highlight!.type,
                            isSelected
                          )}`}
                        >
                          <p>{p.text}</p>

                          {/* Badge y Detalle de la Coincidencia */}
                          <div className="mt-2 flex items-center justify-between text-[11px] font-sans font-semibold pt-1 border-t border-black/10">
                            <span className="truncate pr-2">{p.highlight!.sourceName}</span>
                            <span className="px-1.5 py-0.5 rounded bg-black/10 font-mono shrink-0">
                              {p.highlight!.score.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-justify text-slate-800">{p.text}</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400 space-y-3 font-sans">
                  <FileText className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="text-sm">Contenido digital del documento cargado correctamente.</p>
                </div>
              )}
            </div>

            {/* Pie de Página de la Hoja */}
            <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-sans">
              <span>Informe de Similitud Semántica y Originalidad</span>
              <span>COCID v1.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda de Colores de Capas */}
      <div className="p-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2 shrink-0">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-500 border border-blue-600" />
            <span className="font-medium text-slate-700">Coincidencia Directa</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#D4AF37] border border-amber-600" />
            <span className="font-medium text-slate-700">Paráfrasis Relevante</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#14B8A6] border border-teal-600" />
            <span className="font-medium text-slate-700">Contenido Asistido por IA</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-400">
          Haz clic en cualquier segmento resaltado para ver el fragmento comparativo.
        </span>
      </div>
    </div>
  );
};
