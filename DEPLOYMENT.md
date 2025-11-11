# Guía de Despliegue - E-Learning Natación

## Despliegue con Docker Compose (Recomendado)

### Requisitos Previos
- Docker y Docker Compose instalados
- Servidor Linux (Ubuntu 20.04+ recomendado)
- Dominio configurado (opcional pero recomendado)

### Pasos de Despliegue

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd elearning-natacion
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
nano .env
```

Configurar las siguientes variables:
```env
# Base de Datos
DATABASE_USER=postgres
DATABASE_PASSWORD=TuPasswordSegura123
DATABASE_NAME=elearning_natacion

# Seguridad (IMPORTANTE: Cambiar en producción)
SECRET_KEY=un-secret-key-muy-largo-y-aleatorio-de-al-menos-32-caracteres

# Integraciones
N8N_WEBHOOK_URL=https://tu-n8n.com/webhook/elearning
EVOLUTION_API_URL=https://tu-evolution.com
EVOLUTION_API_KEY=tu-api-key

# Puerto del backend
PORT=3000
```

3. **Iniciar servicios**
```bash
docker-compose up -d
```

4. **Ejecutar migraciones y seed**
```bash
# Entrar al contenedor del backend
docker exec -it elearning-backend sh

# Ejecutar migraciones
npx prisma migrate deploy

# Poblar base de datos con curso inicial
npx prisma db seed

# Salir del contenedor
exit
```

5. **Verificar que todo funciona**
```bash
# Ver logs
docker-compose logs -f

# La aplicación estará disponible en:
# Frontend: http://tu-servidor (puerto 80)
# Backend API: http://tu-servidor:3000
```

### Credenciales Iniciales

Después del seed, tendrás estas cuentas:
- **Admin**: admin@elearning.com / admin123
- **Alumno**: alumno@test.com / usuario123

**IMPORTANTE: Cambia estas contraseñas inmediatamente en producción.**

## Despliegue en Easypanel

### Requisitos
- Cuenta en Easypanel
- Servidor conectado a Easypanel

### Pasos

1. **Crear servicio de Base de Datos**
   - En Easypanel, crear nuevo servicio
   - Seleccionar "PostgreSQL"
   - Configurar nombre: `elearning-db`
   - Anotar credenciales generadas

2. **Crear servicio de Backend**
   - Crear nuevo servicio desde Docker
   - Usar el Dockerfile de `./backend`
   - Configurar variables de entorno:
     - `DATABASE_HOST`: nombre del servicio de PostgreSQL
     - `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`
     - `SECRET_KEY`, `N8N_WEBHOOK_URL`, etc.
   - Configurar puerto: 3000
   - Configurar volume para `/app/uploads`

3. **Crear servicio de Frontend**
   - Crear nuevo servicio desde Docker
   - Usar el Dockerfile de `./frontend`
   - Configurar dominio personalizado
   - Puerto: 80

4. **Ejecutar migraciones**
   - En el servicio de backend, abrir terminal
   - Ejecutar:
     ```bash
     npx prisma migrate deploy
     npx prisma db seed
     ```

## Configuración de n8n

### Webhook para eventos

1. En n8n, crear un nuevo workflow
2. Agregar nodo "Webhook"
3. Configurar método: POST
4. Copiar la URL del webhook
5. Configurar en variable de entorno `N8N_WEBHOOK_URL`

### Flujos recomendados

#### 1. Bienvenida a nuevo usuario
```
Webhook (usuario.creado) 
→ Function (preparar mensaje) 
→ Evolution API (enviar WhatsApp)
```

#### 2. Felicitación por inscripción
```
Webhook (curso.inscrito) 
→ Function (mensaje con detalles del curso) 
→ Evolution API
```

#### 3. Progreso en lección
```
Webhook (leccion.completada) 
→ IF (progreso > 50%) 
→ Evolution API (mensaje de ánimo)
```

#### 4. Curso completado
```
Webhook (curso.completado) 
→ Function (generar certificado o mensaje) 
→ Evolution API (felicitación)
```

## Configuración de Evolution API

### Variables necesarias
```env
EVOLUTION_API_URL=https://tu-instancia-evolution.com
EVOLUTION_API_KEY=tu-api-key-de-evolution
```

### Integración con n8n

En los nodos de Evolution API en n8n:
```javascript
// Estructura del mensaje desde el webhook
{
  "instanceName": "tuInstancia",
  "number": "{{datos del webhook}}",
  "message": "Mensaje personalizado"
}
```

## Mantenimiento

### Backups de Base de Datos

```bash
# Backup
docker exec elearning-db pg_dump -U postgres elearning_natacion > backup_$(date +%Y%m%d).sql

# Restaurar
cat backup_20231106.sql | docker exec -i elearning-db psql -U postgres elearning_natacion
```

### Actualizar la aplicación

```bash
# Detener servicios
docker-compose down

# Actualizar código
git pull

# Reconstruir y levantar
docker-compose up -d --build

# Ejecutar nuevas migraciones si hay
docker exec -it elearning-backend npx prisma migrate deploy
```

### Ver logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo base de datos
docker-compose logs -f db
```

## Solución de Problemas

### Backend no conecta a base de datos
- Verificar que `DATABASE_HOST` apunte al nombre del servicio (ej: `db`)
- Revisar credenciales en variables de entorno
- Verificar que la base de datos esté corriendo: `docker-compose ps`

### Videos no se reproducen
- Verificar que FFmpeg esté instalado en el contenedor
- Revisar permisos del directorio `uploads/`
- Comprobar logs del backend para errores de conversión HLS

### Webhooks no llegan a n8n
- Verificar que `N8N_WEBHOOK_URL` esté correctamente configurada
- Comprobar que n8n sea accesible desde el servidor del backend
- Revisar logs del backend para errores en el envío

### Frontend muestra error 404 en rutas
- Verificar configuración de nginx en `frontend/nginx.conf`
- Asegurar que el `try_files` esté correctamente configurado para SPA

## Seguridad

### Recomendaciones
- Cambiar `SECRET_KEY` a un valor aleatorio y largo (mínimo 32 caracteres)
- Cambiar contraseñas de usuarios seed inmediatamente
- Configurar HTTPS con certificado SSL (Let's Encrypt recomendado)
- Configurar firewall para exponer solo puertos necesarios (80, 443)
- Realizar backups regulares de la base de datos
- Actualizar dependencias regularmente

### HTTPS con Let's Encrypt

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com

# Renovación automática
sudo certbot renew --dry-run
```

## Monitoreo

### Métricas recomendadas
- Uso de CPU y memoria de los contenedores
- Espacio en disco (especialmente `/uploads`)
- Logs de errores del backend
- Tiempo de respuesta de la API
- Eventos de webhook (éxito/fallo)
