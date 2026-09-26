import axios from 'axios';
import { prisma } from '../prisma/client.js';

const AI_URL = process.env.AI_SERVICES_URL || 'http://localhost:8000/api/v1';

export const scholarshipService = {
  getRecommendations: async (userId: string) => {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new Error('Perfil académico no configurado');
    }

    const aiResponse = await axios.post(`${AI_URL}/recommendations/match`, {
      gpa: profile.gpa,
      academic_level: profile.academicLevel,
      study_field: profile.studyField,
      interests: profile.researchInterests,
    });

    return aiResponse.data;
  },

  getAll: async () => {
    return prisma.scholarship.findMany({
      where: { isActive: true },
      orderBy: { deadline: 'asc' },
    });
  },
};
