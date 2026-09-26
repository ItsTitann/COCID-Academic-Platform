import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { lsmService } from '../services/lsmService.js';

export const lsmController = {
  predict: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { image } = req.body;
      const prediction = await lsmService.predictSign(image);
      res.json({ success: true, data: prediction });
    } catch (error) {
      next(error);
    }
  },

  saveSession: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || '';
      const { totalSigns, accuracy, logs } = req.body;
      const session = await lsmService.logSession(userId, totalSigns, accuracy, logs);
      res.status(201).json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  },
};
