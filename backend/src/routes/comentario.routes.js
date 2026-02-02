import { Router } from 'express';
import { createComentario, getComentariosByLeccion, deleteComentario } from '../controllers/comentario.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticate, createComentario);
router.get('/leccion/:leccionId', authenticate, getComentariosByLeccion);
router.delete('/:id', authenticate, deleteComentario);

export default router;
