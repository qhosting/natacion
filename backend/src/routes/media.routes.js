import { Router } from 'express';
import { uploadMedia, deleteMedia, updateMedia } from '../controllers/media.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.post('/', authMiddleware, adminMiddleware, upload.single('file'), uploadMedia);
router.put('/:id', authMiddleware, adminMiddleware, updateMedia);
router.delete('/:id', authMiddleware, adminMiddleware, deleteMedia);

export default router;
