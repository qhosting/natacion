import { Router } from 'express';
import { 
  createLeccion, 
  updateLeccion, 
  deleteLeccion, 
  getLeccionById 
} from '../controllers/leccion.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/:id', authMiddleware, getLeccionById);
router.post('/', authMiddleware, adminMiddleware, createLeccion);
router.put('/:id', authMiddleware, adminMiddleware, updateLeccion);
router.delete('/:id', authMiddleware, adminMiddleware, deleteLeccion);

export default router;
