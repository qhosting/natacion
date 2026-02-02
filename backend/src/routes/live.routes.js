import { Router } from 'express';
import { getLiveSessions, createLiveSession, deleteLiveSession } from '../controllers/live.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticate, getLiveSessions);
router.post('/', authenticate, authorize(['ADMIN']), createLiveSession);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteLiveSession);

export default router;
