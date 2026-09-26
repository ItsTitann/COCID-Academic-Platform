import axios from 'axios';
import { prisma } from '../prisma/client.js';

const AI_URL = process.env.AI_SERVICES_URL || 'http://localhost:8000/api/v1';

export const lsmService = {
  predictSign: async (imageBase64: string) => {
    const aiResponse = await axios.post(`${AI_URL}/lsm/predict`, {
      image_base64: imageBase64,
    });
    return aiResponse.data;
  },

  logSession: async (userId: string, totalSigns: number, accuracy: number, logs: unknown) => {
    return prisma.lsmSession.create({
      data: {
        userId,
        totalSigns,
        accuracy,
        logsData: logs as object,
      },
    });
  },
};
