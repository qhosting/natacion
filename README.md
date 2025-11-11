# Plataforma E-Learning de Natación

Plataforma profesional de e-learning para tutorías de natación con gestión de cursos, sistema de roles y protección avanzada de contenido.

## Arquitectura

- **Backend**: Node.js + Express.js + Prisma + PostgreSQL
- **Frontend**: React + Vite (PWA)
- **Base de Datos**: PostgreSQL (contenedor separado)
- **Despliegue**: Docker + Easypanel

## Estructura del Proyecto

```
elearning-natacion/
├── backend/           # API REST con Node.js + Express
├── frontend/          # React + Vite PWA
├── docker-compose.yml # Orquestación local (desarrollo)
└── README.md
```

## Funcionalidades

### Sistema de Roles
- **ALUMNO**: Acceso a catálogo, inscripción y progreso
- **ADMIN**: Panel de administración completo

### Gestión de Contenido
- CRUD de Cursos, Etapas y Lecciones
- Gestión de medios (video, audio, imagen)
- Progreso de usuarios por lección

### Protección de Contenido
- Streaming HLS/DASH (no servir .mp4 directo)
- Watermarking dinámico con email del usuario
- Deshabilitar clic derecho en multimedia

### Integraciones
- Webhooks a n8n en eventos clave
- Preparado para Evolution API (WhatsApp)

## Variables de Entorno

```env
# Base de Datos
DATABASE_HOST=
DATABASE_PORT=5432
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

# Seguridad
SECRET_KEY=

# Integraciones
N8N_WEBHOOK_URL=
EVOLUTION_API_URL=
EVOLUTION_API_KEY=

# Servidor
PORT=3000
```

## Inicio Rápido

### Desarrollo Local

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd elearning-natacion
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. **Iniciar con Docker Compose**
```bash
docker-compose up -d
```

4. **Ejecutar migraciones y seed**
```bash
docker exec -it elearning-backend sh
npx prisma migrate deploy
npx prisma db seed
exit
```

5. **Acceder a la aplicación**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - Credenciales: admin@elearning.com / admin123

### Instalación Manual

Ver documentación específica en cada carpeta:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Guía de Despliegue](./DEPLOYMENT.md)

## Curso Inicial: "Natación Crol para Adultos"

El sistema incluye el siguiente curso pre-configurado:

### Etapas
1. **RESPIRACIÓN**: Soltar aire por la nariz, posturas, hundirse, objetos del fondo
2. **POSTURAS**: Flechita hidrodinámica, posición de pie, salidas, distancia
3. **PATADA**: Ejercicios fuera del agua, ejercicios dentro del agua, identificar tipo de patada
4. **BRAZADA**: Brazada sin respiración, corregir postura de manos, respiración lateral
5. **TÉCNICA**: Salida desde la pared, voltereta de campana, flecha subacuática, clavados


## Tecnologías Utilizadas

### Backend
- Node.js 20+ con Express.js
- Prisma ORM
- PostgreSQL 15
- JWT para autenticación
- Multer para subida de archivos
- FFmpeg para conversión HLS
- Axios para webhooks

### Frontend
- React 18
- Vite 5
- React Router DOM v6
- Axios para peticiones HTTP
- HLS.js para reproducción de video
- PWA con Vite Plugin PWA

### DevOps
- Docker y Docker Compose
- Nginx para servir frontend
- Volúmenes persistentes para datos y uploads

## Estructura Completa del Proyecto

```
elearning-natacion/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Esquema de base de datos
│   │   └── seed.js              # Datos iniciales
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # Configuración Prisma
│   │   ├── controllers/         # Lógica de negocio
│   │   │   ├── auth.controller.js
│   │   │   ├── curso.controller.js
│   │   │   ├── etapa.controller.js
│   │   │   ├── leccion.controller.js
│   │   │   ├── media.controller.js
│   │   │   ├── inscripcion.controller.js
│   │   │   ├── progreso.controller.js
│   │   │   └── admin.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── upload.middleware.js
│   │   ├── routes/              # Rutas de la API
│   │   │   ├── auth.routes.js
│   │   │   ├── curso.routes.js
│   │   │   ├── etapa.routes.js
│   │   │   ├── leccion.routes.js
│   │   │   ├── media.routes.js
│   │   │   ├── inscripcion.routes.js
│   │   │   ├── progreso.routes.js
│   │   │   └── admin.routes.js
│   │   ├── services/
│   │   │   ├── webhook.service.js
│   │   │   └── hls.service.js
│   │   └── server.js            # Servidor principal
│   ├── uploads/                 # Archivos subidos
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   └── VideoPlayer.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CursoDetalle.jsx
│   │   │   ├── LeccionView.jsx
│   │   │   └── admin/
│   │   │       ├── AdminPanel.jsx
│   │   │       ├── AdminCursos.jsx
│   │   │       ├── AdminEtapas.jsx
│   │   │       ├── AdminLecciones.jsx
│   │   │       ├── AdminMedias.jsx
│   │   │       └── AdminUsuarios.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
├── docker-compose.yml
├── .env.example
├── .gitignore
├── DEPLOYMENT.md
└── README.md
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (autenticado)

### Cursos
- `GET /api/cursos` - Listar todos los cursos
- `GET /api/cursos/:id` - Obtener curso específico
- `POST /api/cursos` - Crear curso (admin)
- `PUT /api/cursos/:id` - Actualizar curso (admin)
- `DELETE /api/cursos/:id` - Eliminar curso (admin)

### Inscripciones
- `POST /api/inscripciones` - Inscribirse a curso
- `GET /api/inscripciones` - Mis inscripciones
- `GET /api/inscripciones/:cursoId` - Detalle de inscripción

### Progreso
- `POST /api/progreso/completar` - Marcar lección completada
- `GET /api/progreso/curso/:cursoId` - Progreso del curso

### Panel Admin
- `GET /api/admin/estadisticas` - Estadísticas generales
- `GET /api/admin/usuarios` - Lista de usuarios
- `PUT /api/admin/usuarios/:id/role` - Cambiar rol de usuario

Ver [Backend README](./backend/README.md) para documentación completa de la API.

## Webhooks y Eventos

El sistema envía webhooks automáticos a n8n en estos eventos:

1. **usuario.creado**: Cuando un nuevo usuario se registra
2. **curso.inscrito**: Cuando un usuario se inscribe a un curso
3. **leccion.completada**: Cuando un usuario completa una lección
4. **curso.completado**: Cuando un usuario completa todas las lecciones de un curso

Ver [Guía de Despliegue](./DEPLOYMENT.md) para configuración de n8n y Evolution API.

## Seguridad

La plataforma incluye múltiples capas de seguridad:

- Autenticación JWT con tokens de 7 días
- Contraseñas hasheadas con bcrypt
- Middleware de autorización por roles
- Protección CORS configurada
- Helmet.js para headers de seguridad
- Validación de tipos de archivo en uploads
- Límites de tamaño en archivos (500MB)

## Protección de Contenido

### Streaming HLS
Los videos no se sirven directamente como archivos .mp4. Se convierten a formato HLS:
- Segmentos de 10 segundos (.ts)
- Playlist .m3u8
- Dificulta la descarga completa del video

### Watermarking Dinámico
El email del usuario se superpone en los videos como marca de agua semi-transparente, disuadiendo la distribución no autorizada.

### Deshabilitar Controles
- Clic derecho deshabilitado en videos e imágenes
- CSS pointer-events y user-select deshabilitados
- Contexto de menú bloqueado via JavaScript

## Mantenimiento

### Backups
```bash
# Backup de base de datos
docker exec elearning-db pg_dump -U postgres elearning_natacion > backup.sql

# Backup de uploads
tar -czf uploads_backup.tar.gz backend/uploads/
```

### Actualizar
```bash
git pull
docker-compose down
docker-compose up -d --build
docker exec -it elearning-backend npx prisma migrate deploy
```

### Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

MIT License

## Soporte

Para soporte y consultas, abrir un issue en el repositorio.

## Próximas Mejoras

- [ ] Panel de administración completo con CRUD visual
- [ ] Certificados de finalización de curso
- [ ] Gamificación con puntos y logros
- [ ] Foros de discusión por curso
- [ ] Notificaciones push en PWA
- [ ] Dashboard de analytics para administradores
- [ ] Integración con sistemas de pago (Stripe/MercadoPago)
- [ ] App móvil nativa (React Native)
- [ ] Sistema de evaluaciones y quizzes
- [ ] Live streaming de clases

---

Desarrollado con dedicación para transformar la educación en natación.
