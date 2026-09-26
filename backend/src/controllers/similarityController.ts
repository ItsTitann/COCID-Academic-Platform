import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { similarityService } from '../services/similarityService.js';

export const similarityController = {
  analyze: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || 'anonymous';
      const { title, text_content } = req.body;
      const report = await similarityService.processDocument(userId, title, text_content);
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  },

  getReports: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || '';
      const reports = await similarityService.getUserReports(userId);
      res.json({ success: true, data: reports });
    } catch (error) {
      next(error);
    }
  },
};
