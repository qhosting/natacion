# 🚀 GUÍA RÁPIDA DE INICIO - E-Learning Natación

## Requisitos Previos

- **Node.js**: v18 o superior
- **PostgreSQL**: v14 o superior  
- **npm**: v9 o superior
- **Docker** (opcional): Para despliegue con contenedores

## Opción 1: Instalación Local (Desarrollo)

### Paso 1: Dar permisos de ejecución a los scripts

```bash
chmod +x init-all.sh init-backend.sh init-frontend.sh
```

### Paso 2: Ejecutar script de inicialización

```bash
./init-all.sh
```

Este script hará automáticamente:
- ✓ Instalar dependencias del backend
- ✓ Instalar dependencias del frontend
- ✓ Generar Prisma Client
- ✓ Ejecutar migraciones de base de datos
- ✓ Poblar la base de datos con el curso "Natación Crol para Adultos"
- ✓ Crear usuarios de prueba (admin y alumno)

### Paso 3: Iniciar los servicios

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## Opción 2: Despliegue con Docker (Producción)

### Paso 1: Construir e iniciar contenedores

```bash
docker-compose up -d
```

Esto iniciará:
- PostgreSQL en puerto 5432
- Backend en puerto 3000
- Frontend en puerto 80

### Paso 2: Ejecutar migraciones en el contenedor

```bash
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

### Acceder a la aplicación

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000

## Credenciales de Prueba

### Administrador
- **Email**: admin@elearning.com
- **Contraseña**: admin123
- **Acceso**: Panel de administración completo

### Alumno
- **Email**: alumno@test.com
- **Contraseña**: usuario123
- **Acceso**: Dashboard de cursos

## Funcionalidades Disponibles

### Panel de Administración (/admin)

- ✅ **Gestión de Cursos**: Crear, editar, eliminar cursos
- ✅ **Gestión de Etapas**: Organizar contenido en etapas
- ✅ **Gestión de Lecciones**: Administrar lecciones con contenido multimedia
- ✅ **Gestión de Medios**: Subir y gestionar videos, PDFs, imágenes
- ✅ **Gestión de Usuarios**: Administrar alumnos y sus inscripciones
- ✅ **Estadísticas**: Dashboard con métricas del sistema

### Dashboard de Alumno

- ✅ **Catálogo de Cursos**: Ver todos los cursos disponibles
- ✅ **Inscripción**: Inscribirse a cursos
- ✅ **Visualización de Contenido**: Acceder a lecciones con streaming HLS
- ✅ **Seguimiento de Progreso**: Ver progreso por curso y lección
- ✅ **Watermarking**: Protección de contenido con marca de agua dinámica

## Contenido Pre-cargado

El sistema incluye el curso **"Natación Crol para Adultos"** con 5 etapas:

1. **RESPIRACIÓN** (4 lecciones)
   - Soltar aire bajo el agua
   - Posturas de respiración
   - Hundirse y aguantar aire
   - Recoger objetos del fondo

2. **POSTURAS** (4 lecciones)
   - Flechita hidrodinámica
   - Posición corporal correcta
   - Salidas desde el borde
   - Flotación y distancia

3. **PATADA** (3 lecciones)
   - Ejercicios fuera del agua
   - Ejercicios en el agua
   - Identificar tipo de patada

4. **BRAZADA** (4 lecciones)
   - Brazada sin respiración
   - Postura correcta de mano
   - Respiración lateral
   - Coordinación brazada-respiración

5. **TÉCNICA AVANZADA** (4 lecciones)
   - Salida desde la pared
   - Voltereta subacuática
   - Flecha subacuática
   - Clavados básicos

## Solución de Problemas

### Error de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

# O iniciar PostgreSQL
sudo systemctl start postgresql
```

### Error de migraciones

```bash
# Resetear la base de datos (CUIDADO: borra todos los datos)
cd backend
npx prisma migrate reset
npx prisma db seed
```

### Puerto ocupado

```bash
# Verificar qué proceso usa el puerto 3000
lsof -i :3000

# O cambiar el puerto en backend/.env
PORT=3001
```

## Comandos Útiles

### Backend

```bash
# Desarrollo con hot-reload
npm run dev

# Producción
npm start

# Ver estructura de BD
npx prisma studio

# Generar migración
npx prisma migrate dev --name nombre_migracion
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

### Docker

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reconstruir contenedores
docker-compose up -d --build
```

## Estructura del Proyecto

```
elearning-natacion/
├── backend/                    # API Node.js + Express + Prisma
│   ├── prisma/                # Esquema y migraciones
│   │   ├── schema.prisma
│   │   └── seed.js           # Datos iniciales
│   ├── src/
│   │   ├── controllers/      # Lógica de negocio (8 controladores)
│   │   ├── routes/           # Definición de rutas (8 archivos)
│   │   ├── middlewares/      # Auth y upload
│   │   ├── services/         # HLS y webhooks
│   │   └── server.js         # Punto de entrada
│   ├── uploads/              # Archivos subidos
│   ├── .env                  # Variables de entorno
│   └── package.json
│
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── context/          # AuthContext
│   │   ├── pages/            # Páginas de la app
│   │   │   ├── admin/        # 6 páginas de administración
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CursoDetalle.jsx
│   │   │   └── LeccionView.jsx
│   │   ├── services/         # API client (axios)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── manifest.json     # PWA manifest
│   └── package.json
│
├── docker-compose.yml         # Orquestación de servicios
├── init-all.sh               # Script de inicialización completo
├── init-backend.sh           # Script solo backend
├── init-frontend.sh          # Script solo frontend
├── README.md
├── DEPLOYMENT.md             # Guía de despliegue en Easypanel
└── RESUMEN.md                # Resumen ejecutivo del proyecto
```

## Soporte y Documentación

- **README.md**: Documentación general del proyecto
- **backend/README.md**: Documentación completa de la API (todos los endpoints)
- **frontend/README.md**: Documentación del frontend
- **DEPLOYMENT.md**: Guía completa de despliegue en Easypanel
- **RESUMEN.md**: Resumen ejecutivo con todos los detalles técnicos

## Próximos Pasos

1. ✅ Ejecutar `./init-all.sh` para configurar el proyecto
2. ✅ Iniciar backend y frontend
3. ✅ Acceder con las credenciales de prueba
4. ✅ Explorar el panel de administración
5. ✅ Probar el flujo de alumno (inscripción, visualización, progreso)
6. ✅ Subir contenido multimedia real
7. ✅ Configurar webhooks de n8n
8. ✅ Desplegar en producción con Docker

---

**¿Listo para empezar?** Ejecuta `./init-all.sh` y comienza a usar la plataforma. 🏊‍♂️
