import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  ShieldCheck
} from 'lucide-react';
import type { MatchSource, MatchedFragment } from '../../../types/similarity.types';

interface SimilaritySourcesProps {
  sources: MatchSource[];
  fragments?: MatchedFragment[];
  selectedFragmentId?: string | null;
  onSelectFragment?: (fragmentId: string) => void;
}

export const SimilaritySources: React.FC<SimilaritySourcesProps> = ({
  sources = [],
  fragments = [],
  selectedFragmentId = null,
  onSelectFragment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(sources[0]?.id || null);

  // Filtrar fuentes
  const filteredSources = sources.filter((src) => {
    return src.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      src.type.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getSourceBadgeColor = (type: string) => {
    if (type.includes('UNAM') || type.includes('Repositorio')) {
      return 'bg-blue-50 text-[#2563EB] border-blue-200';
    }
    if (type.includes('SciELO') || type.includes('Revista')) {
      return 'bg-amber-50 text-[#D4AF37] border-amber-200';
    }
    if (type.includes('IEEE') || type.includes('Artículo')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
    return 'bg-teal-50 text-[#14B8A6] border-teal-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Encabezado */}
      <div className="p-4 border-b border-slate-200 bg-[#0B1F3A] text-white space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/40 text-blue-300 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Fuentes Coincidentes Identificadas</h3>
              <p className="text-[11px] text-slate-400">
                {sources.length} {sources.length === 1 ? 'fuente indexada' : 'fuentes indexadas en repositorios'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/30">
            Cotejo NLP
          </span>
        </div>

        {/* Buscador de Fuentes */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre de revista, autor o repositorio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#2563EB]"
          />
        </div>
      </div>

      {/* Lista de Fuentes */}
      <div className="flex-1 p-3.5 space-y-3 overflow-y-auto custom-scrollbar">
        {filteredSources.length > 0 ? (
          filteredSources.map((source) => {
            const isExpanded = expandedSourceId === source.id;
            const sourceFragments = fragments.filter((f) => f.sourceId === source.id);

            return (
              <div
                key={source.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'border-[#2563EB] bg-blue-50/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                {/* Cabecera de la Fuente */}
                <div
                  onClick={() => setExpandedSourceId(isExpanded ? null : source.id)}
                  className="p-3.5 cursor-pointer space-y-2 select-none"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getSourceBadgeColor(source.type)}`}>
                          {source.type}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {source.matchedPassagesCount} {source.matchedPassagesCount === 1 ? 'coincidencia' : 'coincidencias'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#0B1F3A] mt-1.5 line-clamp-2 hover:text-[#2563EB] transition-colors">
                        {source.name}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-[#0B1F3A] font-mono">
                        {source.similarity.toFixed(1)}%
                      </span>
                      <div className="mt-1">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Barra de impacto */}
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2563EB] rounded-full transition-all"
                      style={{ width: `${Math.min(100, source.similarity * 5)}%` }}
                    />
                  </div>
                </div>

                {/* Acordeón Desplegable con Fragmentos Textuales Comparativos */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 space-y-3 bg-white rounded-b-xl animate-fadeIn">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                      <span>Pasajes contrastados ({sourceFragments.length})</span>
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-[#2563EB] hover:underline"
                        >
                          <span>Ver enlace de fuente</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {sourceFragments.length > 0 ? (
                      sourceFragments.map((frag) => {
                        const isSelected = selectedFragmentId === frag.id;

                        return (
                          <div
                            key={frag.id}
                            onClick={() => onSelectFragment?.(frag.id)}
                            className={`p-3 rounded-lg border text-xs space-y-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#2563EB] bg-blue-50/70 ring-1 ring-[#2563EB]'
                                : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-bold">
                              <span className="text-slate-500">Página {frag.pageNumber}</span>
                              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                                {frag.similarityScore.toFixed(1)}% coincidencia
                              </span>
                            </div>

                            {/* Comparación de textos */}
                            <div className="space-y-1.5">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  En tu documento:
                                </span>
                                <p className="text-slate-800 font-serif italic bg-white p-2 rounded border border-slate-200 text-[11px] leading-relaxed">
                                  "{frag.originalText}"
                                </p>
                              </div>

                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  En la fuente referenciada:
                                </span>
                                <p className="text-slate-600 bg-white p-2 rounded border border-slate-200 text-[11px] leading-relaxed">
                                  "{frag.matchedText}"
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 italic py-2">
                        Coincidencia estructural detectada en la sección general.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-slate-400 space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No se encontraron fuentes con el criterio especificado.</p>
          </div>
        )}
      </div>

      {/* Pie de Fuentes */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Bases académicas verificadas</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">COCID NLP ENGINE</span>
      </div>
    </div>
  );
};
