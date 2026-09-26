import { apiClient } from './api/apiClient';
import type { ApiResponse } from '../types/api.types';
import type { LsmGesturePrediction, LsmGlossaryItem } from '../types/lsm.types';

export const lsmService = {
  predictFrame: async (imageBase64: string): Promise<LsmGesturePrediction> => {
    const res = await apiClient.post<unknown, ApiResponse<LsmGesturePrediction>>('/lsm/predict', {
      image: imageBase64,
    });
    return res.data;
  },

  getGlossary: async (): Promise<LsmGlossaryItem[]> => {
    const res = await apiClient.get<unknown, ApiResponse<LsmGlossaryItem[]>>('/lsm/glossary');
    return res.data;
  },
};
