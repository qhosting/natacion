
# Scripts de Utilidad - E-Learning Natación

Scripts automatizados para facilitar el desarrollo y deployment de la plataforma E-Learning de Natación.

## 📋 Scripts Disponibles

### 1. `diagnose-db.sh`
**Diagnóstico de Base de Datos PostgreSQL**

Verifica la conectividad y estado de la base de datos.

```bash
# Uso
export DATABASE_URL="your_database_url"
./scripts/diagnose-db.sh
```

**Características:**
- ✅ Verifica conectividad de red
- ✅ Valida credenciales de acceso
- ✅ Lista tablas existentes
- ✅ Verifica migraciones de Prisma
- ✅ Muestra estadísticas de la base de datos

---

### 2. `generate-env.js`
**Generador de Archivo .env**

Genera un archivo `.env` completo con valores seguros aleatorios.

```bash
# Uso básico
node scripts/generate-env.js

# Con opciones personalizadas
node scripts/generate-env.js \
  --db-host db.example.com \
  --db-name elearning_natacion \
  --app-url https://natacion.com

# Ver todas las opciones
node scripts/generate-env.js --help
```

**Características:**
- ✅ Genera secretos criptográficamente seguros
- ✅ Configura DATABASE_URL automáticamente
- ✅ Crea backup si el archivo ya existe
- ✅ Genera archivo de resumen con credenciales

**Opciones disponibles:**
- `--output <path>` - Ruta del archivo de salida (default: .env)
- `--db-host <host>` - Host de la base de datos
- `--db-port <port>` - Puerto de la base de datos
- `--db-name <name>` - Nombre de la base de datos
- `--db-user <user>` - Usuario de la base de datos
- `--db-pass <pass>` - Password de la base de datos
- `--app-url <url>` - URL de la aplicación
- `--backend-port <port>` - Puerto del backend (default: 3000)
- `--frontend-port <port>` - Puerto del frontend (default: 5173)

---

### 3. `pg_backup.sh`
**Backup de PostgreSQL**

Crea backups automáticos comprimidos de la base de datos.

```bash
# Uso básico
export DATABASE_URL="your_database_url"
./scripts/pg_backup.sh

# Con configuración personalizada
export BACKUP_DIR="./my-backups"
export RETENTION_DAYS="30"
./scripts/pg_backup.sh
```

**Características:**
- ✅ Crea dumps SQL comprimidos (gzip)
- ✅ Limpia backups antiguos automáticamente
- ✅ Nomenclatura con timestamp
- ✅ Validación de credenciales

**Variables de entorno:**
- `BACKUP_DIR` - Directorio de backups (default: ./backups)
- `RETENTION_DAYS` - Días para retener backups (default: 7)

---

### 4. `test-hash.js`
**Test de Hashing de Passwords**

Verifica el funcionamiento del hashing bcrypt y genera hashes de prueba.

```bash
# Desde el directorio backend
cd backend && node ../scripts/test-hash.js
```

**Características:**
- ✅ Prueba generación de hash
- ✅ Verifica comparación de passwords
- ✅ Genera hashes para usuarios de prueba
- ✅ Validación de seguridad

---

### 5. `setup-git-hooks.sh`
**Instalación de Git Hooks**

Instala git hooks preventivos para el control de calidad del código.

```bash
./scripts/setup-git-hooks.sh
```

**Características:**
- ✅ Instala pre-commit hooks
- ✅ Instala pre-push hooks
- ✅ Verifica código antes de commits
- ✅ Previene errores comunes

---

### 6. `health-check.sh`
**Verificación de Salud del Sistema**

Verifica que todos los componentes del sistema estén funcionando correctamente.

```bash
# Uso básico
./scripts/health-check.sh

# Con URL personalizada
./scripts/health-check.sh http://localhost:3000
```

**Características:**
- ✅ Verifica conectividad de backend
- ✅ Verifica conectividad de frontend
- ✅ Verifica base de datos
- ✅ Reporta tiempo de respuesta
- ✅ Muestra estado de los servicios

---

## 🚀 Setup Inicial

### 1. Instalar dependencias
```bash
cd /home/ubuntu/Uploads/elearning-natacion
chmod +x scripts/*.sh
```

### 2. Configurar variables de entorno
```bash
# Generar archivo .env
node scripts/generate-env.js --output backend/.env

# O copiar desde el ejemplo
cp backend/.env.example backend/.env
# Editar con tus valores
```

### 3. Verificar base de datos
```bash
export DATABASE_URL="postgresql://user:pass@localhost:5432/elearning_natacion"
./scripts/diagnose-db.sh
```

---

## 📝 Uso en Docker

### Setup Automatizado con Docker

1. **Generar variables de entorno:**
```bash
node scripts/generate-env.js --db-host your-db-host --db-pass your-db-pass
```

2. **Levantar servicios:**
```bash
docker-compose up -d
```

3. **Verificar deployment:**
```bash
export DATABASE_URL="..."
./scripts/diagnose-db.sh
```

---

## 🔧 Troubleshooting

### Error: "DATABASE_URL no está configurada"
```bash
# Exportar variable temporalmente
export DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# O agregar al .env
echo 'DATABASE_URL="..."' >> backend/.env
source backend/.env
```

### Error: "psql no está instalado"
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y postgresql-client

# macOS
brew install postgresql
```

### Error de permisos en scripts .sh
```bash
chmod +x scripts/*.sh
```

---

## 📦 Dependencias Requeridas

- **Node.js** >= 18.x
- **PostgreSQL Client** (psql)
- **Paquetes npm:**
  - bcryptjs
  - crypto (built-in)

```bash
cd backend
npm install bcryptjs
```

---

## 🔐 Seguridad

### ⚠️ Importante

- **NUNCA** subas archivos `.env` a Git
- Guarda `ENV_SUMMARY.txt` en lugar seguro
- Rota secretos periódicamente en producción
- Usa diferentes secretos para cada entorno

### Recomendaciones

```bash
# Agregar a .gitignore
echo ".env" >> .gitignore
echo "ENV_SUMMARY.txt" >> .gitignore
echo "backups/" >> .gitignore
```

---

## 📚 Referencias

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Backup & Restore](https://www.postgresql.org/docs/current/backup.html)
- [bcrypt.js](https://github.com/dcodeIO/bcrypt.js)

---

## 🤝 Soporte

Para más información, consulta la documentación principal del proyecto en `/README.md`

---

**Adaptado desde:** [EscalaFin MVP Scripts](https://github.com/qhosting/escalafin)  
**Proyecto:** E-Learning Natación  
**Fecha de Adaptación:** 2025-11-11

