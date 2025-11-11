
#!/bin/bash

################################################################################
# Script de Health Check - E-Learning Natación
# 
# Propósito: Verificar que todos los componentes estén funcionando
################################################################################

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'
BOLD='\033[1m'

# Configuración
BACKEND_URL="${1:-http://localhost:3000}"
FRONTEND_URL="${2:-http://localhost:5173}"
TIMEOUT=5

# Contadores
CHECKS_PASSED=0
CHECKS_FAILED=0

print_header() {
  echo -e "\n${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BOLD}${BLUE} $1${NC}"
  echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
  ((CHECKS_PASSED++))
}

print_error() {
  echo -e "${RED}✗${NC} $1"
  ((CHECKS_FAILED++))
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

print_section() {
  echo -e "\n${BOLD}${BLUE}$1${NC}"
  echo "────────────────────────────────────────────────────────────"
}

# Verificar comando
check_command() {
  if command -v "$1" &> /dev/null; then
    print_success "$1 está instalado"
    return 0
  else
    print_error "$1 NO está instalado"
    return 1
  fi
}

# Verificar URL
check_url() {
  local url="$1"
  local name="$2"
  
  print_info "Verificando $name: $url"
  
  if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url" 2>/dev/null || echo "000")
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" --max-time $TIMEOUT "$url" 2>/dev/null || echo "0")
    
    if [ "$HTTP_CODE" = "200" ]; then
      print_success "$name responde correctamente (${RESPONSE_TIME}s)"
      return 0
    elif [ "$HTTP_CODE" = "000" ]; then
      print_error "$name no responde (timeout o no disponible)"
      return 1
    else
      print_warning "$name responde con código: $HTTP_CODE"
      return 1
    fi
  else
    print_warning "curl no está instalado, saltando verificación"
    return 0
  fi
}

# Verificar base de datos
check_database() {
  print_section "Base de Datos PostgreSQL"
  
  if [ -z "$DATABASE_URL" ]; then
    print_warning "DATABASE_URL no está configurada"
    print_info "Intentando cargar desde backend/.env..."
    
    if [ -f "backend/.env" ]; then
      source backend/.env
    fi
  fi
  
  if [ -z "$DATABASE_URL" ]; then
    print_error "No se pudo cargar DATABASE_URL"
    return 1
  fi
  
  # Extraer componentes
  if [[ $DATABASE_URL =~ postgres(ql)?://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
    DB_USER="${BASH_REMATCH[2]}"
    DB_PASSWORD="${BASH_REMATCH[3]}"
    DB_HOST="${BASH_REMATCH[4]}"
    DB_PORT="${BASH_REMATCH[5]}"
    DB_NAME=$(echo "${BASH_REMATCH[6]}" | cut -d'?' -f1)
    
    print_info "Conectando a: $DB_HOST:$DB_PORT/$DB_NAME"
    
    if command -v psql &> /dev/null; then
      if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c '\conninfo' >/dev/null 2>&1; then
        print_success "Conexión a PostgreSQL exitosa"
        
        # Contar tablas
        TABLES=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -A -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'" 2>/dev/null || echo "0")
        print_info "Tablas en la base de datos: $TABLES"
        
        return 0
      else
        print_error "No se pudo conectar a PostgreSQL"
        return 1
      fi
    else
      print_warning "psql no está instalado, saltando verificación detallada"
      return 0
    fi
  else
    print_error "Formato de DATABASE_URL inválido"
    return 1
  fi
}

# Verificar servicios Node
check_node_services() {
  print_section "Servicios Node.js"
  
  # Verificar Node.js
  if check_command node; then
    NODE_VERSION=$(node --version)
    print_info "Versión: $NODE_VERSION"
  fi
  
  # Verificar npm
  if check_command npm; then
    NPM_VERSION=$(npm --version)
    print_info "Versión: $NPM_VERSION"
  fi
  
  # Verificar dependencias del backend
  if [ -d "backend/node_modules" ]; then
    print_success "Dependencias del backend instaladas"
  else
    print_error "Dependencias del backend NO instaladas"
    print_info "Ejecuta: cd backend && npm install"
  fi
  
  # Verificar dependencias del frontend
  if [ -d "frontend/node_modules" ]; then
    print_success "Dependencias del frontend instaladas"
  else
    print_error "Dependencias del frontend NO instaladas"
    print_info "Ejecuta: cd frontend && npm install"
  fi
}

# Main
main() {
  echo ""
  echo "╔════════════════════════════════════════════════════════════════╗"
  echo "║        HEALTH CHECK - E-LEARNING NATACIÓN                      ║"
  echo "╚════════════════════════════════════════════════════════════════╝"
  echo ""
  echo "Fecha: $(date '+%Y-%m-%d %H:%M:%S')"
  echo ""
  
  # Verificar comandos esenciales
  print_section "Comandos Esenciales"
  check_command curl
  check_command git
  check_command node
  check_command npm
  
  # Verificar servicios Node
  check_node_services
  
  # Verificar base de datos
  check_database
  
  # Verificar URLs
  print_section "Servicios Web"
  check_url "$BACKEND_URL/api/health" "Backend API"
  check_url "$FRONTEND_URL" "Frontend"
  
  # Resumen
  print_header "RESUMEN DEL HEALTH CHECK"
  
  TOTAL_CHECKS=$((CHECKS_PASSED + CHECKS_FAILED))
  
  echo "Total de verificaciones: $TOTAL_CHECKS"
  echo -e "${GREEN}Exitosas: $CHECKS_PASSED${NC}"
  echo -e "${RED}Fallidas: $CHECKS_FAILED${NC}"
  echo ""
  
  if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}${BOLD}✓ SISTEMA OPERACIONAL${NC}"
    echo ""
    exit 0
  else
    echo -e "${YELLOW}${BOLD}⚠ SISTEMA CON ADVERTENCIAS${NC}"
    echo ""
    echo "Revisa los errores arriba y toma las acciones recomendadas."
    echo ""
    exit 1
  fi
}

# Ejecutar
main
