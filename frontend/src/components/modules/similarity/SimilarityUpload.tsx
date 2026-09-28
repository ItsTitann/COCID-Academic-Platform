import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  FileCode, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  FileCheck2,
  Cpu
} from 'lucide-react';

interface SimilarityUploadProps {
  onFileSelected: (file: File) => void;
  onStartAnalysis: () => void;
  selectedFile: File | null;
  onClearFile: () => void;
  isUploading?: boolean;
  isProcessing?: boolean;
  error?: string | null;
}

export const SimilarityUpload: React.FC<SimilarityUploadProps> = ({
  onFileSelected,
  onStartAnalysis,
  selectedFile,
  onClearFile,
  isUploading = false,
  isProcessing = false,
  error = null,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'doc', 'txt'];

  const validateAndSelectFile = (file: File) => {
    setValidationError(null);
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setValidationError('Formato no compatible. Únicamente se admiten archivos PDF, DOCX y TXT.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setValidationError('El archivo excede el tamaño máximo permitido de 50 MB.');
      return;
    }

    onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSelectFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSelectFile(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      return <FileText className="w-8 h-8 text-rose-500" />;
    }
    if (ext === 'docx' || ext === 'doc') {
      return <FileText className="w-8 h-8 text-[#2563EB]" />;
    }
    return <FileCode className="w-8 h-8 text-[#14B8A6]" />;
  };

  return (
    <div className="space-y-6">
      {/* Alertas de error */}
      {(validationError || error) && (
        <div className="flex items-start space-x-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Atención al cargar el archivo</p>
            <p className="text-rose-700 text-xs mt-0.5">{validationError || error}</p>
          </div>
        </div>
      )}

      {/* Zona Drag & Drop o Archivo Seleccionado */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 group ${
            isDragOver
              ? 'border-[#2563EB] bg-blue-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-[#2563EB] bg-white hover:bg-slate-50/80 shadow-sm'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="w-20 h-20 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white transition-all shadow-inner">
            <UploadCloud className="w-10 h-10 transition-colors" />
          </div>

          <h3 className="text-lg font-bold text-[#0B1F3A] mb-1">
            Arrastra tu manuscrito o haz clic para examinar
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-4">
            Carga artículos científicos, tesis, ensayos o avances de investigación para contrastar originalidad y asistencia IA.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-semibold text-slate-600">
            <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 text-slate-700">
              PDF (.pdf)
            </span>
            <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 text-slate-700">
              Word (.docx, .doc)
            </span>
            <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 text-slate-700">
              Texto Plano (.txt)
            </span>
            <span className="px-2.5 py-1 bg-blue-50 text-[#2563EB] rounded-lg border border-blue-200 font-bold">
              Máx. 50 MB
            </span>
          </div>
        </div>
      ) : (
        /* Tarjeta de Archivo Seleccionado */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-4 min-w-0">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl shrink-0 shadow-sm">
                {getFileIcon(selectedFile.name)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Documento listo para procesar</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0B1F3A] truncate mt-1">
                  {selectedFile.name}
                </h3>
                <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                  <span>{formatFileSize(selectedFile.size)}</span>
                  <span>•</span>
                  <span>{selectedFile.type || 'Documento de texto'}</span>
                  <span>•</span>
                  <span>Listo para análisis NLP</span>
                </div>
              </div>
            </div>

            {!isUploading && !isProcessing && (
              <button
                type="button"
                onClick={onClearFile}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                title="Quitar archivo"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Botón de Acción Principal */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Inferencia de similitud multirreferencial y detección de IA</span>
            </div>

            <button
              type="button"
              onClick={onStartAnalysis}
              disabled={isUploading || isProcessing}
              className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center space-x-2.5 transition-all shadow-md ${
                isUploading || isProcessing
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-[#2563EB] hover:bg-blue-700 hover:shadow-lg hover:shadow-[#2563EB]/25 active:scale-[0.98]'
              }`}
            >
              <Cpu className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>
                {isProcessing
                  ? 'ANALIZANDO DOCUMENTO...'
                  : isUploading
                  ? 'CARGANDO ARCHIVO...'
                  : 'ANALIZAR DOCUMENTO'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Fila de Especificaciones y Buenas Prácticas Institucionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 text-[#2563EB] shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-[#0B1F3A]">Motor NLP Avanzado</h4>
            <p className="text-slate-500 mt-0.5">
              Segmentación semántica profunda contrastada contra corpus universitarios e internacionales.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-amber-50 text-[#D4AF37] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-[#0B1F3A]">Detección de Asistencia IA</h4>
            <p className="text-slate-500 mt-0.5">
              Evaluación probabilística de n-gramas y perplejidad sintética para integridad académica.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-teal-50 text-[#14B8A6] shrink-0">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-[#0B1F3A]">Confidencialidad COCID</h4>
            <p className="text-slate-500 mt-0.5">
              Los manuscritos procesados se mantienen bajo estricto resguardo y custodia institucional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
