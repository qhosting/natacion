
#!/bin/bash

################################################################################
# Script para instalar git hooks preventivos - E-Learning Natación
# Adaptado de: EscalaFin MVP
################################################################################

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GIT_HOOKS_DIR="$PROJECT_ROOT/.git/hooks"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   INSTALACIÓN DE GIT HOOKS - E-LEARNING NATACIÓN               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar que estamos en un repositorio git
if [ ! -d "$PROJECT_ROOT/.git" ]; then
    echo "❌ ERROR: No es un repositorio git"
    echo "   Ejecuta: git init"
    exit 1
fi

echo "✓ Repositorio Git encontrado"
echo ""

# Crear pre-commit hook
echo "📝 Creando pre-commit hook..."
PRE_COMMIT_HOOK="$GIT_HOOKS_DIR/pre-commit"

cat > "$PRE_COMMIT_HOOK" << 'EOF'
#!/bin/bash

# Git pre-commit hook - Verificaciones antes de commit

echo "🔍 Ejecutando verificaciones pre-commit..."

# Verificar que no se suban archivos .env
if git diff --cached --name-only | grep -E "\.env$|\.env\.local$" > /dev/null; then
    echo "❌ ERROR: Intentando commitear archivos .env"
    echo "   Los archivos .env no deben subirse a Git"
    echo "   Asegúrate de que estén en .gitignore"
    exit 1
fi

# Verificar que no se suban credenciales o secretos
if git diff --cached -G"(password|secret|api_key|token)" --name-only | grep -v ".gitignore" > /dev/null; then
    echo "⚠️  ADVERTENCIA: Posibles credenciales detectadas en los cambios"
    echo "   Revisa que no estés commiteando secretos"
    read -p "¿Continuar de todos modos? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        exit 1
    fi
fi

echo "✅ Verificaciones completadas"
exit 0
EOF

chmod +x "$PRE_COMMIT_HOOK"
echo "✅ Pre-commit hook instalado"
echo ""

# Crear pre-push hook
echo "📝 Creando pre-push hook..."
PRE_PUSH_HOOK="$GIT_HOOKS_DIR/pre-push"

cat > "$PRE_PUSH_HOOK" << 'EOF'
#!/bin/bash

# Git pre-push hook - Verificaciones antes de push

echo "🔍 Ejecutando verificaciones pre-push..."

# Verificar que no hay archivos .env en el repositorio
if git ls-files | grep -E "\.env$|\.env\.local$" > /dev/null; then
    echo "❌ ERROR: Archivos .env detectados en el repositorio"
    echo "   Elimínalos con: git rm --cached .env"
    exit 1
fi

# Verificar que el directorio node_modules no esté trackeado
if git ls-files | grep "node_modules/" > /dev/null; then
    echo "❌ ERROR: Directorio node_modules detectado en el repositorio"
    echo "   Elimínalo con: git rm -r --cached node_modules/"
    exit 1
fi

echo "✅ Verificaciones completadas"
exit 0
EOF

chmod +x "$PRE_PUSH_HOOK"
echo "✅ Pre-push hook instalado"
echo ""

# Resumen
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    INSTALACIÓN COMPLETADA                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Git hooks instalados:"
echo "   ✓ pre-commit: Verifica archivos sensibles antes de commit"
echo "   ✓ pre-push:   Verifica repositorio antes de push"
echo ""
echo "🎯 Estos hooks se ejecutarán automáticamente en cada commit/push"
echo ""
echo "Para deshabilitarlos temporalmente:"
echo "   git commit --no-verify"
echo "   git push --no-verify"
echo ""

exit 0
