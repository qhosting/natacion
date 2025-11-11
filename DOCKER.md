# 🐳 Guía de Docker - E-Learning Natación

Esta guía explica las diferentes opciones de Docker disponibles en el proyecto y cómo usarlas.

## 📋 Tabla de Contenidos

1. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
2. [Opciones de Dockerfiles](#opciones-de-dockerfiles)
3. [Despliegue con Docker Compose](#despliegue-con-docker-compose-recomendado)
4. [Despliegue Individual de Servicios](#despliegue-individual-de-servicios)
5. [Despliegue en Plataformas Cloud](#despliegue-en-plataformas-cloud)
6. [Variables de Entorno](#variables-de-entorno)
7. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitectura del Proyecto

Este proyecto utiliza una **arquitectura de microservicios** con tres componentes principales:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   PostgreSQL    │────▶│  Backend API    │◀────│   Frontend      │
│   (Database)    │     │  (Node.js)      │     │   (React)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     Puerto 5432             Puerto 3000             Puerto 80
```

---

## 📦 Opciones de Dockerfiles

El proyecto incluye **múltiples Dockerfiles** para diferentes casos de uso:

| Archivo | Ubicación | Propósito | Uso Recomendado |
|---------|-----------|-----------|-----------------|
| `Dockerfile` | Raíz del proyecto | **Backend** (por defecto) | Plataformas cloud que esperan Dockerfile en raíz |
| `Dockerfile.frontend` | Raíz del proyecto | **Frontend** | Despliegue separado del frontend |
| `backend/Dockerfile` | Subdirectorio | Backend | Docker Compose, builds locales |
| `frontend/Dockerfile` | Subdirectorio | Frontend | Docker Compose, builds locales |
| `docker-compose.yml` | Raíz del proyecto | **Todos los servicios** | ⭐ **Recomendado para desarrollo** |

### ¿Cuándo usar cada uno?

- **🏠 Desarrollo Local**: Usa `docker-compose up` (usa todos los Dockerfiles automáticamente)
- **☁️ Easypanel/Railway/Coolify**: Usa `Dockerfile` (backend) o `Dockerfile.frontend`
- **🚀 CI/CD**: Usa `Dockerfile` o `Dockerfile.frontend` según el servicio
- **📦 Builds manuales**: Usa `backend/Dockerfile` o `frontend/Dockerfile`

---

## 🚀 Despliegue con Docker Compose (RECOMENDADO)

Esta es la forma **más fácil** de ejecutar todo el stack completo.

### Paso 1: Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus valores
nano .env
```

Variables críticas:
```env
DATABASE_PASSWORD=un_password_seguro_aqui
SECRET_KEY=un_secret_key_muy_largo_minimo_32_caracteres
```

### Paso 2: Iniciar servicios

```bash
# Iniciar todos los servicios en background
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver solo logs del backend
docker-compose logs -f backend
```

### Paso 3: Ejecutar migraciones y seed

```bash
# Entrar al contenedor del backend
docker exec -it elearning-backend sh

# Ejecutar migraciones
npx prisma migrate deploy

# Poblar base de datos (usuarios y curso de prueba)
npx prisma db seed

# Salir del contenedor
exit
```

### Paso 4: Verificar servicios

```bash
# Verificar que los contenedores están corriendo
docker-compose ps

# Health check
./scripts/health-check.sh
```

**Acceder a la aplicación:**
- Frontend: http://localhost
- Backend API: http://localhost:3000
- Base de datos: localhost:5432

### Comandos útiles

```bash
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ borra la base de datos)
docker-compose down -v

# Reconstruir servicios después de cambios en código
docker-compose up -d --build

# Ver uso de recursos
docker stats
```

---

## 🎯 Despliegue Individual de Servicios

### Opción A: Backend (Dockerfile raíz)

```bash
# Build
docker build -t elearning-backend .

# Run
docker run -d \
  --name elearning-backend \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/elearning_natacion" \
  -e SECRET_KEY="tu-secret-key-seguro" \
  -e PORT=3000 \
  -v $(pwd)/uploads:/app/uploads \
  elearning-backend

# Ver logs
docker logs -f elearning-backend
```

### Opción B: Frontend (Dockerfile.frontend)

```bash
# Build
docker build -f Dockerfile.frontend -t elearning-frontend .

# Run
docker run -d \
  --name elearning-frontend \
  -p 80:80 \
  elearning-frontend

# Ver logs
docker logs -f elearning-frontend
```

### Opción C: Backend desde subdirectorio

```bash
# Build desde el directorio backend/
cd backend
docker build -t elearning-backend-alt .

# O build desde raíz con contexto específico
docker build -t elearning-backend-alt -f backend/Dockerfile backend/
```

---

## ☁️ Despliegue en Plataformas Cloud

### Easypanel

Easypanel espera un Dockerfile en la raíz del repositorio.

#### Backend en Easypanel:

1. **Crear nuevo servicio** → "From GitHub Repository"
2. **Seleccionar** el repositorio `natacion`
3. **Configuración:**
   - Dockerfile path: `Dockerfile` (o dejarlo vacío, usa el de raíz por defecto)
   - Build context: `.` (raíz)
   - Puerto: `3000`
4. **Variables de entorno:**
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db
   SECRET_KEY=tu-secret-key-muy-largo
   PORT=3000
   ```
5. **Volúmenes:**
   - Mount path: `/app/uploads`
   - Storage: Create new volume (ej: 10 GB)
6. **Deploy** 🚀

#### Frontend en Easypanel:

1. **Crear nuevo servicio** → "From GitHub Repository"
2. **Seleccionar** el repositorio `natacion`
3. **Configuración:**
   - Dockerfile path: `Dockerfile.frontend`
   - Build context: `.` (raíz)
   - Puerto: `80`
4. **Dominio:** Configurar dominio personalizado
5. **Deploy** 🚀

### Railway

```bash
# Instalar Railway CLI
npm install -g railway

# Login
railway login

# Crear proyecto
railway init

# Configurar backend
railway up --service backend --dockerfile Dockerfile

# Configurar frontend
railway up --service frontend --dockerfile Dockerfile.frontend
```

### Coolify

Coolify permite especificar el Dockerfile en la configuración del servicio:

1. **Backend:**
   - Dockerfile Location: `/Dockerfile`
   - Port: `3000`

2. **Frontend:**
   - Dockerfile Location: `/Dockerfile.frontend`
   - Port: `80`

### Render / Heroku

Estas plataformas detectan automáticamente el `Dockerfile` en la raíz.

**Para backend:** El `Dockerfile` en la raíz ya está configurado ✅

**Para frontend:** Necesitas crear un servicio separado y especificar `Dockerfile.frontend`

---

## 🔐 Variables de Entorno

### Variables REQUERIDAS (Backend)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de PostgreSQL | `postgresql://user:pass@db:5432/elearning` |
| `SECRET_KEY` | Secreto para JWT | `un-string-aleatorio-muy-largo-32-chars` |

### Variables OPCIONALES (Backend)

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `production` |
| `N8N_WEBHOOK_URL` | URL de webhook de n8n | - |
| `EVOLUTION_API_URL` | URL de Evolution API | - |
| `EVOLUTION_API_KEY` | API Key de Evolution | - |
| `HLS_ENABLED` | Habilitar conversión HLS | `true` |
| `WATERMARK_ENABLED` | Marca de agua en videos | `false` |

### Generar variables automáticamente

Usa el script de generación de `.env`:

```bash
node scripts/generate-env.js --db-host localhost --db-pass mypassword
```

---

## 🛠️ Troubleshooting

### ❌ Error: "failed to read dockerfile: open Dockerfile: no such file or directory"

**Causa:** El sistema está buscando un Dockerfile en la raíz del proyecto.

**Solución:**
- ✅ **Ahora está solucionado**: El proyecto ya tiene `Dockerfile` y `Dockerfile.frontend` en la raíz
- Para backend: usa `Dockerfile` (ya existe)
- Para frontend: usa `Dockerfile.frontend`
- Para desarrollo: usa `docker-compose up`

### ❌ Backend no conecta a la base de datos

**Síntomas:**
```
Error: P1001: Can't reach database server at `db:5432`
```

**Soluciones:**
1. Verifica que PostgreSQL esté corriendo:
   ```bash
   docker-compose ps
   ```
2. Verifica la variable `DATABASE_URL`:
   ```bash
   docker exec -it elearning-backend env | grep DATABASE_URL
   ```
3. Si usas Docker Compose, el host debe ser `db` (nombre del servicio)
4. Si usas contenedores individuales, usa la IP o hostname correcto

### ❌ Frontend no puede comunicarse con el backend

**Síntomas:** Errores de CORS o "Network Error" en el frontend

**Soluciones:**
1. Verifica que el backend esté accesible:
   ```bash
   curl http://localhost:3000/health
   ```
2. Verifica la configuración de CORS en `backend/src/server.js`
3. Si usas diferentes dominios, ajusta `CORS_ORIGIN` en variables de entorno

### ❌ Videos no se reproducen

**Síntomas:** El video se sube pero no se reproduce en el frontend

**Soluciones:**
1. Verifica que FFmpeg esté instalado en el contenedor:
   ```bash
   docker exec -it elearning-backend ffmpeg -version
   ```
2. Verifica permisos del directorio `/app/uploads`:
   ```bash
   docker exec -it elearning-backend ls -la uploads/
   ```
3. Revisa logs de conversión HLS:
   ```bash
   docker logs elearning-backend | grep -i "hls\|ffmpeg"
   ```

### ❌ Error: "ENOSPC: System limit for number of file watchers reached"

**Causa:** Límite de watchers del sistema en Linux (común en desarrollo)

**Solución:**
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### ❌ Build falla con "npm ERR! code EINTEGRITY"

**Causa:** Cache de npm corrupto

**Solución:**
```bash
# Limpiar cache
docker-compose down
docker builder prune -a

# Rebuild sin cache
docker-compose build --no-cache
```

### 🔍 Comandos de Diagnóstico

```bash
# Ver logs detallados del backend
docker-compose logs -f --tail=100 backend

# Inspeccionar contenedor
docker inspect elearning-backend

# Entrar al contenedor para debug
docker exec -it elearning-backend sh

# Ver variables de entorno del contenedor
docker exec -it elearning-backend env

# Ver uso de recursos
docker stats

# Ver redes de Docker
docker network ls
docker network inspect elearning-network
```

### 📊 Health Checks

El proyecto incluye health checks automáticos:

```bash
# Usando el script de health check
./scripts/health-check.sh

# Ver estado de health check de Docker
docker inspect --format='{{.State.Health.Status}}' elearning-backend

# Ver historial de health checks
docker inspect --format='{{range .State.Health.Log}}{{.End}}: {{.ExitCode}}{{end}}' elearning-backend
```

---

## 📚 Recursos Adicionales

- **Docker Compose Documentation**: https://docs.docker.com/compose/
- **Docker Best Practices**: https://docs.docker.com/develop/dev-best-practices/
- **Prisma with Docker**: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker
- **Nginx Configuration**: https://nginx.org/en/docs/

---

## 🆘 Soporte

Si encuentras problemas:

1. **Revisa esta documentación** y la sección de Troubleshooting
2. **Ejecuta el health check**: `./scripts/health-check.sh`
3. **Revisa los logs**: `docker-compose logs -f`
4. **Diagnostica la BD**: `./scripts/diagnose-db.sh`
5. **Crea un issue** en el repositorio con:
   - Descripción del problema
   - Logs relevantes
   - Comando que ejecutaste
   - Sistema operativo y versión de Docker

---

**✅ Con estos Dockerfiles, el proyecto está listo para ser desplegado en cualquier plataforma!**
