#!/bin/bash

# Script de inicialización del Backend
# Ejecutar desde la raíz del proyecto: bash init-backend.sh

echo "================================================"
echo "   INICIALIZACIÓN DEL BACKEND - E-LEARNING"
echo "================================================"
echo ""

# Navegar al directorio del backend
cd backend

echo "✓ Directorio: $(pwd)"
echo ""

# Instalar dependencias
echo "[1/5] Instalando dependencias de Node.js..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi
echo "✓ Dependencias instaladas correctamente"
echo ""

# Generar Prisma Client
echo "[2/5] Generando Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Error al generar Prisma Client"
    exit 1
fi
echo "✓ Prisma Client generado correctamente"
echo ""

# Ejecutar migraciones
echo "[3/5] Ejecutando migraciones de base de datos..."
npx prisma migrate dev --name init
if [ $? -ne 0 ]; then
    echo "⚠️ Las migraciones requieren PostgreSQL corriendo"
    echo "   Asegúrate de tener PostgreSQL activo en localhost:5432"
    echo "   O ajusta DATABASE_URL en el archivo .env"
    echo ""
fi
echo ""

# Ejecutar seed
echo "[4/5] Poblando base de datos con datos iniciales..."
npx prisma db seed
if [ $? -ne 0 ]; then
    echo "⚠️ El seed requiere que las migraciones se hayan ejecutado correctamente"
fi
echo ""

# Mensaje final
echo "[5/5] Inicialización completada"
echo ""
echo "================================================"
echo "   BACKEND LISTO PARA USAR"
echo "================================================"
echo ""
echo "Para iniciar el servidor de desarrollo:"
echo "  cd backend && npm run dev"
echo ""
echo "Credenciales de prueba creadas:"
echo "  Admin:  admin@elearning.com / admin123"
echo "  Alumno: alumno@test.com / usuario123"
echo ""
echo "El servidor estará disponible en: http://localhost:3000"
echo "================================================"
