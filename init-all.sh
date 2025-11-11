#!/bin/bash

# Script Maestro de Inicialización - E-Learning Natación
# Este script configura completamente el proyecto

echo "================================================"
echo "  E-LEARNING NATACIÓN - INICIALIZACIÓN COMPLETA"
echo "================================================"
echo ""
echo "Este script instalará todas las dependencias y"
echo "configurará la base de datos."
echo ""
echo "REQUISITOS:"
echo "  - Node.js v18 o superior"
echo "  - PostgreSQL v14 o superior"
echo "  - npm v9 o superior"
echo ""
read -p "¿Deseas continuar? (s/n): " continuar

if [ "$continuar" != "s" ] && [ "$continuar" != "S" ]; then
    echo "Inicialización cancelada"
    exit 0
fi

echo ""
echo "================================================"
echo "  PASO 1: BACKEND"
echo "================================================"
echo ""

bash init-backend.sh
if [ $? -ne 0 ]; then
    echo "❌ Error en la inicialización del backend"
    exit 1
fi

echo ""
echo "================================================"
echo "  PASO 2: FRONTEND"
echo "================================================"
echo ""

bash init-frontend.sh
if [ $? -ne 0 ]; then
    echo "❌ Error en la inicialización del frontend"
    exit 1
fi

echo ""
echo "================================================"
echo "  ✓ INICIALIZACIÓN COMPLETADA EXITOSAMENTE"
echo "================================================"
echo ""
echo "PRÓXIMOS PASOS:"
echo ""
echo "1. Iniciar el backend:"
echo "   cd backend && npm run dev"
echo ""
echo "2. En otra terminal, iniciar el frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. O usar Docker Compose (recomendado):"
echo "   docker-compose up -d"
echo ""
echo "ACCESOS:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend:  http://localhost:3000"
echo ""
echo "CREDENCIALES DE PRUEBA:"
echo "  - Admin:  admin@elearning.com / admin123"
echo "  - Alumno: alumno@test.com / usuario123"
echo ""
echo "================================================"
