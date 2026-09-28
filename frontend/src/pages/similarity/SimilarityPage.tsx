import React, { useState, useEffect } from 'react';
import { 
  FileSearch, 
  History, 
  PlusCircle, 
  Download, 
  ArrowLeft, 
  RefreshCw, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { similarityService } from '../../services/similarityService';
import type { SimilarityReport } from '../../types/similarity.types';
import { SimilarityUpload } from '../../components/modules/similarity/SimilarityUpload';
import { SimilarityStatus } from '../../components/modules/similarity/SimilarityStatus';
import { SimilarityMetrics } from '../../components/modules/similarity/SimilarityMetrics';
import { SimilarityViewer } from '../../components/modules/similarity/SimilarityViewer';
import { SimilaritySources } from '../../components/modules/similarity/SimilaritySources';

export const SimilarityPage: React.FC = () => {
  // Estados principales de flujo
  const [currentView, setCurrentView] = useState<'UPLOAD' | 'RESULTS' | 'HISTORY'>('UPLOAD');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentReport, setCurrentReport] = useState<SimilarityReport | null>(null);
  const [reportsHistory, setReportsHistory] = useState<SimilarityReport[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedFragmentId, setSelectedFragmentId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cargar historial de reportes al montar
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const res = await similarityService.getUserReports();
      if (res.data) {
        setReportsHistory(res.data);
      }
    } catch (err: any) {
      console.error('Error al cargar historial de reportes:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Manejar selección de archivo
  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setErrorMessage(null);
  };

  // Limpiar archivo seleccionado
  const handleClearFile = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    setIsProcessing(false);
    setIsUploading(false);
    setProcessingProgress(0);
  };

  // Iniciar flujo de carga y análisis
  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    try {
      setErrorMessage(null);
      setIsUploading(true);
      setProcessingProgress(15);

      // 1. Subir archivo
      const uploadRes = await similarityService.uploadDocument(selectedFile);
      if (!uploadRes.success || !uploadRes.data?.id) {
        throw new Error(uploadRes.message || 'Error al cargar el documento.');
      }

      const reportId = uploadRes.data.id;
      setIsUploading(false);
      setIsProcessing(true);
      setProcessingProgress(35);

      // 2. Simular progresión visual de escaneo NLP
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + 12;
        });
      }, 400);

      // 3. Ejecutar análisis NLP en backend
      const analyzeRes = await similarityService.analyzeDocument(reportId);
      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (!analyzeRes.success || !analyzeRes.data) {
        throw new Error(analyzeRes.message || 'Error al procesar el análisis.');
      }

      // 4. Establecer reporte activo y cambiar a vista de resultados
      setCurrentReport(analyzeRes.data);
      setIsProcessing(false);
      setCurrentView('RESULTS');
      fetchHistory(); // Actualizar historial en segundo plano
    } catch (err: any) {
      setIsUploading(false);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Ocurrió un error durante el procesamiento.');
    }
  };

  // Cargar un reporte previo del historial
  const handleLoadPastReport = async (reportId: string) => {
    try {
      setIsLoadingHistory(true);
      const res = await similarityService.getReportResult(reportId);
      if (res.data) {
        setCurrentReport(res.data);
        setCurrentView('RESULTS');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al abrir el reporte seleccionado.');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Eliminar un reporte
  const handleDeleteReport = async (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('¿Está seguro de eliminar este reporte de similitud?')) return;

    try {
      await similarityService.deleteReport(reportId);
      setReportsHistory((prev) => prev.filter((r) => r.id !== reportId));
      if (currentReport?.id === reportId) {
        setCurrentReport(null);
        setCurrentView('UPLOAD');
      }
    } catch (err: any) {
      alert('Error al eliminar el reporte: ' + err.message);
    }
  };

  const handlePrintOrExport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Encabezado Institucional del Módulo */}
      <div className="bg-[#0B1F3A] rounded-2xl p-6 text-white shadow-sm border border-[#1F2937]/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-600/30 rounded-2xl text-blue-300 border border-blue-500/30 shadow-inner">
            <FileSearch className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                Similitud Académica e Integridad Científica
              </h1>
              <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/40">
                <Sparkles className="w-3 h-3" />
                <span>Motor NLP</span>
              </span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Evaluación multirreferencial de manuscritos, detección de citas académicas, contrastación con repositorios universitarios y cálculo de probabilidad de asistencia IA.
            </p>
          </div>
        </div>

        {/* Botones de Navegación de Vistas */}
        <div className="flex items-center space-x-2 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={() => {
              handleClearFile();
              setCurrentView('UPLOAD');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              currentView === 'UPLOAD'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'bg-[#1F2937] text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo Análisis</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('HISTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              currentView === 'HISTORY'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'bg-[#1F2937] text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <History className="w-4 h-4 text-[#D4AF37]" />
            <span>Historial ({reportsHistory.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: CARGA DE MANUSCRITOS Y PROCESAMIENTO NLP */}
      {/* ========================================================================= */}
      {currentView === 'UPLOAD' && (
        <div className="space-y-6">
          {/* Componente de Estado y Progreso */}
          {(selectedFile || isProcessing || isUploading) && (
            <SimilarityStatus
              status={
                isProcessing
                  ? 'PROCESSING'
                  : isUploading
                  ? 'PROCESSING'
                  : selectedFile
                  ? 'UPLOADED'
                  : 'PENDING'
              }
              processingMessage={
                isProcessing
                  ? 'Analizando documento mediante NLP'
                  : isUploading
                  ? 'Cargando y extrayendo metadatos...'
                  : 'Documento cargado correctamente'
              }
              progressPercentage={processingProgress}
            />
          )}

          {/* Componente de Carga Drag & Drop */}
          <SimilarityUpload
            onFileSelected={handleFileSelected}
            onStartAnalysis={handleStartAnalysis}
            selectedFile={selectedFile}
            onClearFile={handleClearFile}
            isUploading={isUploading}
            isProcessing={isProcessing}
            error={errorMessage}
          />

          {/* Acceso Rápido al Historial Reciente si existe */}
          {reportsHistory.length > 0 && !selectedFile && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="text-sm font-bold text-[#0B1F3A]">Análisis Académicos Recientes</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentView('HISTORY')}
                  className="text-xs font-bold text-[#2563EB] hover:underline"
                >
                  Ver todos ({reportsHistory.length})
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {reportsHistory.slice(0, 3).map((report) => (
                  <div
                    key={report.id}
                    onClick={() => handleLoadPastReport(report.id)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/30 transition-all cursor-pointer space-y-2 group shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-[#2563EB]" />
                        <span className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#2563EB] transition-colors truncate max-w-[170px]">
                          {report.documentTitle}
                        </span>
                      </div>
                      <span className="text-xs font-black font-mono text-[#0B1F3A] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        {report.overallScore.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      <span className="text-emerald-700 font-semibold">{report.processingMessage || 'Completado'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: RESULTADOS DETALLADOS (SPLIT-SCREEN INTERACTIVO) */}
      {/* ========================================================================= */}
      {currentView === 'RESULTS' && currentReport && (
        <div className="space-y-6">
          {/* Barra de Acciones del Reporte */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setCurrentView('UPLOAD')}
                className="p-2 rounded-xl text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 transition-colors"
                title="Volver a cargar manuscrito"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Reporte Generado
                  </span>
                  <span className="text-xs font-mono text-slate-400">ID: {currentReport.id.slice(0, 8)}</span>
                </div>
                <h2 className="text-base font-bold text-[#0B1F3A] truncate mt-0.5">
                  {currentReport.documentTitle}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handlePrintOrExport}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exportar / Imprimir</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleClearFile();
                  setCurrentView('UPLOAD');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-blue-700 text-white flex items-center space-x-2 transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Analizar Otro</span>
              </button>
            </div>
          </div>

          {/* Tarjetas KPI de Métricas Institucionales */}
          <SimilarityMetrics
            overallScore={currentReport.overallScore}
            aiProbability={currentReport.aiProbability}
            sourcesCount={currentReport.sourcesCount}
            totalWords={currentReport.totalWords}
            totalPages={currentReport.totalPages}
          />

          {/* Estructura Dividida (Split Screen): Visor de Documento a la izquierda y Fuentes a la derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
            {/* Panel Izquierdo: Visor de Manuscrito con Resaltado Inteligente */}
            <div className="lg:col-span-7 xl:col-span-7 min-h-[580px]">
              <SimilarityViewer
                documentTitle={currentReport.documentTitle}
                pages={currentReport.matchesData?.pages || []}
                fragments={currentReport.matchesData?.fragments || []}
                fileUrl={currentReport.fileUrl || undefined}
                totalPages={currentReport.totalPages}
                selectedFragmentId={selectedFragmentId}
                onSelectFragment={(id) => setSelectedFragmentId(id)}
              />
            </div>

            {/* Panel Derecho: Lista de Fuentes Coincidentes y Fragmentos */}
            <div className="lg:col-span-5 xl:col-span-5 min-h-[580px]">
              <SimilaritySources
                sources={currentReport.matchesData?.sources || []}
                fragments={currentReport.matchesData?.fragments || []}
                selectedFragmentId={selectedFragmentId}
                onSelectFragment={(id) => setSelectedFragmentId(id)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 3: HISTORIAL DE REPORTES PREVIOS */}
      {/* ========================================================================= */}
      {currentView === 'HISTORY' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setCurrentView('UPLOAD')}
                className="p-2 rounded-xl text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 transition-colors"
                title="Volver"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-[#0B1F3A]">Historial de Manuscritos Procesados</h2>
                <p className="text-xs text-slate-500">
                  Consulte y descargue reportes generados anteriormente por el motor NLP.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchHistory}
              disabled={isLoadingHistory}
              className="p-2 text-slate-600 hover:text-[#2563EB] hover:bg-blue-50 rounded-xl transition-colors"
              title="Recargar historial"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingHistory ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {reportsHistory.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B1F3A] text-white uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Documento</th>
                      <th className="py-3.5 px-4">Fecha de Análisis</th>
                      <th className="py-3.5 px-4">Similitud</th>
                      <th className="py-3.5 px-4">Asistencia IA</th>
                      <th className="py-3.5 px-4">Fuentes</th>
                      <th className="py-3.5 px-4">Estado</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportsHistory.map((report) => (
                      <tr
                        key={report.id}
                        onClick={() => handleLoadPastReport(report.id)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2.5">
                            <FileText className="w-4 h-4 text-[#2563EB] shrink-0" />
                            <div>
                              <p className="font-bold text-[#0B1F3A] text-xs truncate max-w-xs">
                                {report.documentTitle}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                {report.filename || 'manuscrito.pdf'} • {report.totalPages} pág.
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 font-mono">
                          {new Date(report.createdAt).toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold font-mono text-[11px] ${
                            report.overallScore <= 15
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : report.overallScore <= 30
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {report.overallScore.toFixed(1)}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">
                          {report.aiProbability.toFixed(1)}%
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          {report.sourcesCount} {report.sourcesCount === 1 ? 'fuente' : 'fuentes'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{report.processingMessage || 'Reporte generado'}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => handleLoadPastReport(report.id)}
                              className="px-2.5 py-1 rounded-lg bg-[#2563EB] text-white font-bold hover:bg-blue-700 transition-colors text-[11px]"
                            >
                              Ver Reporte
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteReport(report.id, e)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Eliminar del historial"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <History className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No hay análisis registrados</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Los reportes de similitud que procese quedarán guardados en este historial para su consulta institucional.
              </p>
              <button
                type="button"
                onClick={() => setCurrentView('UPLOAD')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2563EB] text-white hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Analizar Primer Documento</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
