import { Router } from 'express';
import { getCertificado } from '../controllers/certificado.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/:cursoId', authenticate, getCertificado);

export default router;
