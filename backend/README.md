# Backend - API E-Learning Natación

API REST para la plataforma de e-learning de natación.

## Stack Tecnológico

- Node.js + Express.js
- Prisma ORM
- PostgreSQL
- JWT para autenticación
- Multer para subida de archivos
- FFmpeg para conversión HLS

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus configuraciones
nano .env

# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Iniciar en desarrollo
npm run dev

# Iniciar en producción
npm start
```

## Variables de Entorno

```env
# Base de Datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=changeme
DATABASE_NAME=elearning_natacion
DATABASE_URL=postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}

# Seguridad
SECRET_KEY=your-super-secret-jwt-key

# Integraciones
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/elearning
EVOLUTION_API_URL=https://your-evolution.com
EVOLUTION_API_KEY=your-api-key

# Servidor
PORT=3000
NODE_ENV=development
```

## Estructura del Proyecto

```
backend/
├── prisma/
│   └── schema.prisma         # Esquema de base de datos
├── src/
│   ├── config/
│   │   └── database.js       # Configuración Prisma
│   ├── controllers/          # Controladores de lógica
│   │   ├── auth.controller.js
│   │   ├── curso.controller.js
│   │   ├── etapa.controller.js
│   │   ├── leccion.controller.js
│   │   ├── media.controller.js
│   │   ├── inscripcion.controller.js
│   │   ├── progreso.controller.js
│   │   └── admin.controller.js
│   ├── middlewares/          # Middlewares
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   ├── routes/               # Rutas de la API
│   ├── services/             # Servicios
│   │   ├── webhook.service.js
│   │   └── hls.service.js
│   └── server.js             # Servidor principal
├── uploads/                  # Archivos subidos
├── .env                      # Variables de entorno
└── package.json
```

## Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere auth)

### Cursos
- `GET /api/cursos` - Listar todos los cursos
- `GET /api/cursos/:id` - Obtener curso específico
- `POST /api/cursos` - Crear curso (admin)
- `PUT /api/cursos/:id` - Actualizar curso (admin)
- `DELETE /api/cursos/:id` - Eliminar curso (admin)

### Etapas
- `POST /api/etapas` - Crear etapa (admin)
- `PUT /api/etapas/:id` - Actualizar etapa (admin)
- `DELETE /api/etapas/:id` - Eliminar etapa (admin)

### Lecciones
- `GET /api/lecciones/:id` - Obtener lección
- `POST /api/lecciones` - Crear lección (admin)
- `PUT /api/lecciones/:id` - Actualizar lección (admin)
- `DELETE /api/lecciones/:id` - Eliminar lección (admin)

### Media
- `POST /api/media` - Subir archivo (admin)
- `PUT /api/media/:id` - Actualizar media (admin)
- `DELETE /api/media/:id` - Eliminar media (admin)

### Inscripciones
- `POST /api/inscripciones` - Inscribirse a curso
- `GET /api/inscripciones` - Mis inscripciones
- `GET /api/inscripciones/:cursoId` - Detalle de inscripción

### Progreso
- `POST /api/progreso/completar` - Marcar lección completada
- `GET /api/progreso/curso/:cursoId` - Progreso del curso

### Administración
- `GET /api/admin/estadisticas` - Estadísticas generales
- `GET /api/admin/usuarios` - Lista de usuarios
- `GET /api/admin/inscripciones` - Todas las inscripciones
- `PUT /api/admin/usuarios/:id/role` - Cambiar rol de usuario

## Autenticación

Todas las rutas (excepto `/api/auth/register` y `/api/auth/login`) requieren autenticación mediante JWT.

Incluir el token en el header:
```
Authorization: Bearer <token>
```

## Roles

- **ALUMNO**: Acceso a cursos y progreso personal
- **ADMIN**: Acceso completo al panel de administración

## Webhooks

El sistema envía webhooks a n8n en los siguientes eventos:

### usuario.creado
```json
{
  "evento": "usuario.creado",
  "datos": {
    "userId": 1,
    "email": "usuario@example.com",
    "nombre": "Juan",
    "role": "ALUMNO",
    "timestamp": "2025-11-06T23:00:00.000Z"
  }
}
```

### curso.inscrito
```json
{
  "evento": "curso.inscrito",
  "datos": {
    "userId": 1,
    "userEmail": "usuario@example.com",
    "userName": "Juan Pérez",
    "cursoId": 1,
    "cursoTitulo": "Natación Crol para Adultos",
    "timestamp": "2025-11-06T23:00:00.000Z"
  }
}
```

### leccion.completada
```json
{
  "evento": "leccion.completada",
  "datos": {
    "userId": 1,
    "userEmail": "usuario@example.com",
    "userName": "Juan Pérez",
    "leccionId": 1,
    "leccionTitulo": "Soltar aire por la nariz",
    "cursoId": 1,
    "cursoTitulo": "Natación Crol para Adultos",
    "progreso": 20,
    "timestamp": "2025-11-06T23:00:00.000Z"
  }
}
```

### curso.completado
```json
{
  "evento": "curso.completado",
  "datos": {
    "userId": 1,
    "userEmail": "usuario@example.com",
    "userName": "Juan Pérez",
    "cursoId": 1,
    "cursoTitulo": "Natación Crol para Adultos",
    "timestamp": "2025-11-06T23:00:00.000Z"
  }
}
```

## Protección de Contenido

### Streaming HLS
Los videos se convierten automáticamente a formato HLS (HTTP Live Streaming):
- Segmentos de 10 segundos
- Playlist .m3u8
- Dificulta la descarga directa

### Watermarking
El frontend aplica watermarking dinámico con el email del usuario sobre los videos.

## Desarrollo

```bash
# Modo desarrollo con hot reload
npm run dev

# Ver base de datos con Prisma Studio
npm run prisma:studio

# Crear nueva migración
npm run prisma:migrate

# Generar cliente Prisma después de cambios en schema
npm run prisma:generate
```

## Producción

```bash
# Construir
npm install --production

# Ejecutar migraciones
npm run prisma:deploy

# Iniciar
npm start
```

## Docker

Ver sección principal del README para instrucciones de Docker.
