import { apiClient } from './api/apiClient';
import type { ApiResponse } from '../types/api.types';
import type { SimilarityReport } from '../types/similarity.types';

export const similarityService = {
  /**
   * Carga un archivo de manuscrito (PDF, DOCX, TXT)
   * POST /api/similarity/upload
   */
  uploadDocument: async (file: File): Promise<ApiResponse<SimilarityReport>> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/similarity/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Inicia el análisis NLP del documento
   * POST /api/similarity/analyze/:id
   */
  analyzeDocument: async (reportId: string): Promise<ApiResponse<SimilarityReport>> => {
    return apiClient.post(`/similarity/analyze/${reportId}`);
  },

  /**
   * Obtiene los resultados de un análisis específico
   * GET /api/similarity/result/:id
   */
  getReportResult: async (reportId: string): Promise<ApiResponse<SimilarityReport>> => {
    return apiClient.get(`/similarity/result/${reportId}`);
  },

  /**
   * Obtiene el listado de reportes previos del usuario
   * GET /api/similarity/reports
   */
  getUserReports: async (): Promise<ApiResponse<SimilarityReport[]>> => {
    return apiClient.get('/similarity/reports');
  },

  /**
   * Elimina un reporte del historial
   * DELETE /api/similarity/reports/:id
   */
  deleteReport: async (reportId: string): Promise<ApiResponse<null>> => {
    return apiClient.delete(`/similarity/reports/${reportId}`);
  },
};
