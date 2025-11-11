import { Router } from 'express';
import { 
  getEstadisticas, 
  getAllUsuarios, 
  getAllInscripciones,
  updateUsuarioRole
} from '../controllers/admin.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación y rol de admin
router.use(authMiddleware, adminMiddleware);

router.get('/estadisticas', getEstadisticas);
router.get('/usuarios', getAllUsuarios);
router.get('/inscripciones', getAllInscripciones);
router.put('/usuarios/:id/role', updateUsuarioRole);

export default router;
