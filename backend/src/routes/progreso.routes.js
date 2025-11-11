import { Router } from 'express';
import { marcarLeccionCompletada, getProgresoDelCurso } from '../controllers/progreso.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/completar', authMiddleware, marcarLeccionCompletada);
router.get('/curso/:cursoId', authMiddleware, getProgresoDelCurso);

export default router;
