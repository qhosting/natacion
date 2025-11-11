# ==========================================
# DOCKERFILE - E-LEARNING NATACIÓN (BACKEND)
# ==========================================
# Este es el Dockerfile raíz para el backend API
# Para el frontend, usa: docker build -f Dockerfile.frontend .
# Para despliegue completo, usa: docker-compose up
# ==========================================

# Utilizar imagen Node.js LTS basada en Alpine para menor tamaño
FROM node:20-alpine AS base

# Instalar FFmpeg para conversión de video (necesario para HLS)
RUN apk add --no-cache \
    ffmpeg \
    bash \
    curl \
    && rm -rf /var/cache/apk/*

# Crear directorio de trabajo
WORKDIR /app

# ==========================================
# STAGE 1: Dependencies
# ==========================================
FROM base AS deps

WORKDIR /app/backend

# Copiar archivos de dependencias
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Instalar dependencias (solo producción)
RUN npm ci --only=production && \
    npm cache clean --force

# ==========================================
# STAGE 2: Builder (Prisma Client Generation)
# ==========================================
FROM base AS builder

WORKDIR /app/backend

# Copiar node_modules del stage anterior
COPY --from=deps /app/backend/node_modules ./node_modules

# Copiar archivos de aplicación
COPY backend/package*.json ./
COPY backend/prisma ./prisma/
COPY backend/src ./src/

# Generar cliente Prisma
RUN npx prisma generate

# ==========================================
# STAGE 3: Runner (Production)
# ==========================================
FROM base AS runner

WORKDIR /app

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --home /home/nodejs nodejs

# Copiar node_modules y Prisma Client generado
COPY --from=builder --chown=nodejs:nodejs /app/backend/node_modules ./node_modules

# Copiar código fuente
COPY --chown=nodejs:nodejs backend/src ./src
COPY --chown=nodejs:nodejs backend/prisma ./prisma
COPY --chown=nodejs:nodejs backend/package*.json ./

# Crear directorios para uploads con permisos correctos
RUN mkdir -p \
    uploads/videos \
    uploads/audios \
    uploads/imagenes \
    uploads/hls \
    uploads/temp && \
    chown -R nodejs:nodejs uploads

# Script de inicio que ejecuta migraciones antes de iniciar el servidor
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "🚀 Iniciando E-Learning Natación Backend..."' >> /app/start.sh && \
    echo 'echo ""' >> /app/start.sh && \
    echo 'echo "📊 Ejecutando migraciones de Prisma..."' >> /app/start.sh && \
    echo 'npx prisma migrate deploy' >> /app/start.sh && \
    echo 'if [ $? -eq 0 ]; then' >> /app/start.sh && \
    echo '  echo "✅ Migraciones completadas exitosamente"' >> /app/start.sh && \
    echo 'else' >> /app/start.sh && \
    echo '  echo "❌ Error en migraciones. Continuando de todos modos..."' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo 'echo ""' >> /app/start.sh && \
    echo 'echo "🌐 Iniciando servidor en puerto ${PORT}..."' >> /app/start.sh && \
    echo 'exec node src/server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Health check script
RUN echo '#!/bin/sh' > /app/healthcheck.sh && \
    echo 'wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1' >> /app/healthcheck.sh && \
    chmod +x /app/healthcheck.sh

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD /app/healthcheck.sh

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["/app/start.sh"]

# ==========================================
# BUILD INSTRUCTIONS
# ==========================================
# Para construir esta imagen:
#   docker build -t elearning-natacion-backend .
#
# Para ejecutar:
#   docker run -p 3000:3000 \
#     -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
#     -e SECRET_KEY="your-secret-key" \
#     elearning-natacion-backend
#
# Para ver logs:
#   docker logs -f <container-id>
# ==========================================
