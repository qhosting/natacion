# Utilizar imagen Node.js LTS
FROM node:20-alpine

# Instalar FFmpeg para conversión de video
RUN apk add --no-cache ffmpeg

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Crear directorio para uploads
RUN mkdir -p uploads/videos uploads/audios uploads/imagenes uploads/hls

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicio
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
