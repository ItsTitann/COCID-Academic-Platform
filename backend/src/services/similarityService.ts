import axios from 'axios';
import { prisma } from '../prisma/client.js';

const AI_URL = process.env.AI_SERVICES_URL || 'http://localhost:8000/api/v1';

export const similarityService = {
  processDocument: async (userId: string, title: string, content: string) => {
    // 1. Call AI service for inference
    const aiResponse = await axios.post(`${AI_URL}/similarity/analyze`, {
      title,
      text_content: content,
    });

    const { overall_score, total_words, matches } = aiResponse.data;

    // 2. Persist analysis report in PostgreSQL via Prisma
    const report = await prisma.similarityReport.create({
      data: {
        userId,
        documentTitle: title,
        overallScore: overall_score,
        totalWords: total_words,
        status: 'COMPLETED',
        matchesData: matches,
      },
    });

    return report;
  },

  getUserReports: async (userId: string) => {
    return prisma.similarityReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },
};
