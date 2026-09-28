import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { profileController } from '../controllers/profileController.js';
import { authenticateJwt } from '../middleware/authMiddleware.js';

const router = Router();

// Garantizar que la carpeta de almacenamiento existe
const uploadDir = path.join(process.cwd(), 'uploads', 'profile');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento Multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

// Filtro de tipos de imagen permitidos
const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagen inválido. Solo se permiten JPG, PNG y WEBP'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB máximo
  },
});

// Todas las rutas de perfil requieren autenticación activa (ADMIN, TEACHER, STUDENT)
router.use(authenticateJwt);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.put('/password', profileController.changePassword);
router.post('/avatar', upload.single('avatar'), profileController.uploadAvatar);

export default router;
