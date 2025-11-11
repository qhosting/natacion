#!/bin/bash

# Script de inicialización del Frontend
# Ejecutar desde la raíz del proyecto: bash init-frontend.sh

echo "================================================"
echo "  INICIALIZACIÓN DEL FRONTEND - E-LEARNING"
echo "================================================"
echo ""

# Navegar al directorio del frontend
cd frontend

echo "✓ Directorio: $(pwd)"
echo ""

# Instalar dependencias
echo "[1/2] Instalando dependencias de Node.js..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi
echo "✓ Dependencias instaladas correctamente"
echo ""

# Mensaje final
echo "[2/2] Inicialización completada"
echo ""
echo "================================================"
echo "   FRONTEND LISTO PARA USAR"
echo "================================================"
echo ""
echo "Para iniciar el servidor de desarrollo:"
echo "  cd frontend && npm run dev"
echo ""
echo "El frontend estará disponible en: http://localhost:5173"
echo "================================================"
