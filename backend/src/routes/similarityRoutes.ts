import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { similarityController } from '../controllers/similarityController.js';
import { authenticateJwt } from '../middleware/authMiddleware.js';

const router = Router();

// Asegurar directorio de almacenamiento para documentos
const uploadDir = path.join(process.cwd(), 'uploads', 'documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento Multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  },
});

// Validación de formatos institucionales (PDF, DOCX, TXT) y tamaño (máx 50MB)
const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'application/octet-stream', // fallback común de navegadores para docx/txt
  ];

  if (allowedExtensions.includes(ext) || allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato no permitido. Solo se admiten archivos PDF, DOCX y TXT.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB límite
  },
});

// Todas las rutas requieren autenticación institucional JWT
router.use(authenticateJwt);

// Endpoints del módulo de similitud académica
router.post('/upload', upload.single('file'), similarityController.upload);
router.post('/analyze/:id', similarityController.analyze);
router.get('/result/:id', similarityController.getResult);
router.get('/reports', similarityController.getReports);
router.get('/reports/:id', similarityController.getResult);
router.delete('/reports/:id', similarityController.deleteReport);

export default router;
