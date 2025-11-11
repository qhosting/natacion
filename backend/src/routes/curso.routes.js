import { Router } from 'express';
import { 
  getAllCursos, 
  getCursoById, 
  createCurso, 
  updateCurso, 
  deleteCurso 
} from '../controllers/curso.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas públicas (requieren autenticación)
router.get('/', authMiddleware, getAllCursos);
router.get('/:id', authMiddleware, getCursoById);

// Rutas de administración
router.post('/', authMiddleware, adminMiddleware, createCurso);
router.put('/:id', authMiddleware, adminMiddleware, updateCurso);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCurso);

export default router;
