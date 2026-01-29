import { Router } from 'express';
import { getQuizByLeccion, submitQuiz, createQuiz } from '../controllers/quiz.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/leccion/:leccionId', authenticate, getQuizByLeccion);
router.post('/submit', authenticate, submitQuiz);
router.post('/', authenticate, authorize(['ADMIN']), createQuiz);

export default router;
