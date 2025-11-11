import { Router } from 'express';
import { 
  inscribirseACurso, 
  getMisInscripciones, 
  getDetalleInscripcion 
} from '../controllers/inscripcion.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, inscribirseACurso);
router.get('/', authMiddleware, getMisInscripciones);
router.get('/:cursoId', authMiddleware, getDetalleInscripcion);

export default router;
