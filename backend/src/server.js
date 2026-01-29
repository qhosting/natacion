import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import cursoRoutes from './routes/curso.routes.js';
import etapaRoutes from './routes/etapa.routes.js';
import leccionRoutes from './routes/leccion.routes.js';
import mediaRoutes from './routes/media.routes.js';
import inscripcionRoutes from './routes/inscripcion.routes.js';
import progresoRoutes from './routes/progreso.routes.js';
import adminRoutes from './routes/admin.routes.js';
import comentarioRoutes from './routes/comentario.routes.js';
import certificadoRoutes from './routes/certificado.routes.js';
import gamificationRoutes from './routes/gamification.routes.js';

// Configuración
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(join(__dirname, '../uploads')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/etapas', etapaRoutes);
app.use('/api/lecciones', leccionRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/inscripciones', inscripcionRoutes);
app.use('/api/progreso', progresoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/certificados', certificadoRoutes);
app.use('/api/gamification', gamificationRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API E-Learning Natación funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Manejador 404
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: 'Ruta no encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📚 API E-Learning Natación`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n✅ Endpoints disponibles:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/cursos`);
  console.log(`   - ...y más\n`);
});

export default app;
