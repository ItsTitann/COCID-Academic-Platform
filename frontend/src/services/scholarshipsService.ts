import { apiClient } from './api/apiClient';
import type { ApiResponse } from '../types/api.types';
import type { ScholarshipOpportunity, StudentAcademicProfile } from '../types/scholarships.types';

export const scholarshipsService = {
  getRecommendations: async (profile: StudentAcademicProfile): Promise<ScholarshipOpportunity[]> => {
    const res = await apiClient.post<unknown, ApiResponse<ScholarshipOpportunity[]>>('/scholarships/recommend', profile);
    return res.data;
  },

  getAllOpportunities: async (): Promise<ScholarshipOpportunity[]> => {
    const res = await apiClient.get<unknown, ApiResponse<ScholarshipOpportunity[]>>('/scholarships');
    return res.data;
  },
};
