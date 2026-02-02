import { Router } from 'express';
import { getStats } from '../controllers/gamification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/stats', authenticate, getStats);

export default router;
