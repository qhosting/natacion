import { Router } from 'express';
import { createEtapa, updateEtapa, deleteEtapa } from '../controllers/etapa.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, adminMiddleware, createEtapa);
router.put('/:id', authMiddleware, adminMiddleware, updateEtapa);
router.delete('/:id', authMiddleware, adminMiddleware, deleteEtapa);

export default router;
