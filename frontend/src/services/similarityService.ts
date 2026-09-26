import { apiClient } from './api/apiClient';
import type { ApiResponse } from '../types/api.types';
import type { SimilarityAnalysisReport } from '../types/similarity.types';

export const similarityService = {
  analyzeDocument: async (file: File): Promise<SimilarityAnalysisReport> => {
    const formData = new FormData();
    formData.append('document', file);
    const res = await apiClient.post<unknown, ApiResponse<SimilarityAnalysisReport>>('/similarity/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getReport: async (reportId: string): Promise<SimilarityAnalysisReport> => {
    const res = await apiClient.get<unknown, ApiResponse<SimilarityAnalysisReport>>(`/similarity/reports/${reportId}`);
    return res.data;
  },

  listReports: async (): Promise<SimilarityAnalysisReport[]> => {
    const res = await apiClient.get<unknown, ApiResponse<SimilarityAnalysisReport[]>>('/similarity/reports');
    return res.data;
  },
};
