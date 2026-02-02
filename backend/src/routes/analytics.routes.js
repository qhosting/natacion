import { Router } from 'express';
import { getDashboardStats } from '../controllers/analytics.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/dashboard', authenticate, authorize(['ADMIN']), getDashboardStats);

export default router;
