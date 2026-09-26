import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { scholarshipService } from '../services/scholarshipService.js';

export const scholarshipController = {
  getRecommendations: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || '';
      const recommendations = await scholarshipService.getRecommendations(userId);
      res.json({ success: true, data: recommendations });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const scholarships = await scholarshipService.getAll();
      res.json({ success: true, data: scholarships });
    } catch (error) {
      next(error);
    }
  },
};
