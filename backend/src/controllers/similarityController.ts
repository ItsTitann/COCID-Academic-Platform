import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { similarityService } from '../services/similarityService.js';

export const similarityController = {
  /**
   * Carga de manuscrito (PDF, DOCX, TXT)
   * POST /api/similarity/upload
   */
  upload: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ success: false, message: 'No se ha adjuntado ningún archivo válido.' });
        return;
      }

      const report = await similarityService.uploadDocument(userId, {
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      res.status(201).json({
        success: true,
        message: 'Documento cargado correctamente',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Inicia el análisis NLP del documento
   * POST /api/similarity/analyze/:id
   */
  analyze: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const id = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
      if (!id) {
        res.status(400).json({ success: false, message: 'ID de reporte requerido.' });
        return;
      }

      const report = await similarityService.analyzeDocument(id, userId);

      res.json({
        success: true,
        message: 'Reporte generado',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtiene los resultados detallados del análisis
   * GET /api/similarity/result/:id
   */
  getResult: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const id = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
      if (!id) {
        res.status(400).json({ success: false, message: 'ID de reporte requerido.' });
        return;
      }

      const report = await similarityService.getReportResult(id, userId);

      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtiene el listado de reportes del usuario
   * GET /api/similarity/reports
   */
  getReports: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const reports = await similarityService.getUserReports(userId);

      res.json({
        success: true,
        data: reports,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Elimina un reporte
   * DELETE /api/similarity/reports/:id
   */
  deleteReport: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const id = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
      if (!id) {
        res.status(400).json({ success: false, message: 'ID de reporte requerido.' });
        return;
      }

      await similarityService.deleteReport(id, userId);

      res.json({
        success: true,
        message: 'Reporte eliminado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },
};
