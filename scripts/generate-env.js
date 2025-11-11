
/**
 * Generador de archivo .env para E-Learning Natación
 * 
 * Este script genera un archivo .env con valores seguros y aleatorios
 * para todas las variables necesarias.
 * 
 * Adaptado de: EscalaFin MVP
 * 
 * Uso:
 *   node scripts/generate-env.js [opciones]
 * 
 * Opciones:
 *   --output <path>       Ruta del archivo de salida (default: backend/.env)
 *   --db-host <host>      Host de la base de datos (default: localhost)
 *   --db-port <port>      Puerto de la base de datos (default: 5432)
 *   --db-name <name>      Nombre de la base de datos (default: elearning_natacion)
 *   --db-user <user>      Usuario de la base de datos (default: postgres)
 *   --db-pass <pass>      Password de la base de datos (generado si no se proporciona)
 *   --backend-port <p>    Puerto del backend (default: 3000)
 *   --frontend-port <p>   Puerto del frontend (default: 5173)
 *   --app-url <url>       URL de la aplicación (default: http://localhost:3000)
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Configuración por defecto
const config = {
  dbHost: 'localhost',
  dbPort: '5432',
  dbName: 'elearning_natacion',
  dbUser: 'postgres',
  dbPass: null,
  appUrl: 'http://localhost:3000',
  backendPort: '3000',
  frontendPort: '5173',
  output: 'backend/.env',
};

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

// Funciones de logging
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ ${message}`, colors.cyan);
}

function logStep(step, total, message) {
  log(`\n[${step}/${total}] ${message}`, colors.bright + colors.blue);
  console.log('─'.repeat(60));
}

// Generar string aleatorio seguro
function generateSecureString(length = 32) {
  return crypto.randomBytes(length).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, length);
}

// Parsear argumentos
function parseArgs() {
  const args = process.argv.slice(2);
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    
    switch (arg) {
      case '--output':
        config.output = nextArg;
        i++;
        break;
      case '--db-host':
        config.dbHost = nextArg;
        i++;
        break;
      case '--db-port':
        config.dbPort = nextArg;
        i++;
        break;
      case '--db-name':
        config.dbName = nextArg;
        i++;
        break;
      case '--db-user':
        config.dbUser = nextArg;
        i++;
        break;
      case '--db-pass':
        config.dbPass = nextArg;
        i++;
        break;
      case '--app-url':
        config.appUrl = nextArg;
        i++;
        break;
      case '--backend-port':
        config.backendPort = nextArg;
        i++;
        break;
      case '--frontend-port':
        config.frontendPort = nextArg;
        i++;
        break;
      case '--help':
        printHelp();
        process.exit(0);
    }
  }
}

function printHelp() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  GENERADOR DE ARCHIVO .ENV - E-LEARNING NATACIÓN               ║
╚════════════════════════════════════════════════════════════════╝

Uso: node scripts/generate-env.js [opciones]

Opciones:
  --output <path>       Ruta del archivo de salida (default: backend/.env)
  --db-host <host>      Host de la base de datos (default: localhost)
  --db-port <port>      Puerto de la base de datos (default: 5432)
  --db-name <name>      Nombre de la base de datos (default: elearning_natacion)
  --db-user <user>      Usuario de la base de datos (default: postgres)
  --db-pass <pass>      Password de la base de datos (generado si no se proporciona)
  --backend-port <p>    Puerto del backend (default: 3000)
  --frontend-port <p>   Puerto del frontend (default: 5173)
  --app-url <url>       URL de la aplicación (default: http://localhost:3000)
  --help                Muestra esta ayuda

Ejemplo:
  node scripts/generate-env.js --db-host db.example.com --db-pass mypassword
  `);
}

// Generar el archivo .env
async function generateEnvFile() {
  logStep(1, 5, 'Generando valores seguros...');
  
  // Generar valores si no están configurados
  const dbPassword = config.dbPass || generateSecureString(32);
  const jwtSecret = generateSecureString(64);
  const secretKey = generateSecureString(64);
  
  logSuccess(`JWT_SECRET: ${jwtSecret.substring(0, 10)}...`);
  logSuccess(`SECRET_KEY: ${secretKey.substring(0, 10)}...`);
  logSuccess(`DB_PASSWORD: ${dbPassword.substring(0, 10)}...`);
  
  logStep(2, 5, 'Construyendo DATABASE_URL...');
  
  const databaseUrl = `postgresql://${config.dbUser}:${dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}?schema=public`;
  logSuccess(`DATABASE_URL configurada`);
  
  logStep(3, 5, 'Configurando variables de aplicación...');
  
  const envContent = `# ═══════════════════════════════════════════════════════════════
# CONFIGURACIÓN DE E-LEARNING NATACIÓN
# Generado automáticamente el: ${new Date().toISOString()}
# ═══════════════════════════════════════════════════════════════

# ──────────────────────────────────────────────────────────────
# DATABASE
# ──────────────────────────────────────────────────────────────
DATABASE_URL="${databaseUrl}"
DATABASE_HOST="${config.dbHost}"
DATABASE_PORT=${config.dbPort}
DATABASE_USER="${config.dbUser}"
DATABASE_PASSWORD="${dbPassword}"
DATABASE_NAME="${config.dbName}"

# ──────────────────────────────────────────────────────────────
# AUTHENTICATION & SECURITY
# ──────────────────────────────────────────────────────────────
JWT_SECRET="${jwtSecret}"
SECRET_KEY="${secretKey}"
JWT_EXPIRES_IN=7d

# ──────────────────────────────────────────────────────────────
# APPLICATION
# ──────────────────────────────────────────────────────────────
NODE_ENV=development
PORT=${config.backendPort}
FRONTEND_URL=http://localhost:${config.frontendPort}

# ──────────────────────────────────────────────────────────────
# UPLOADS & STORAGE
# ──────────────────────────────────────────────────────────────
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=524288000
ALLOWED_EXTENSIONS=mp4,mkv,avi,mov,wmv,flv,webm,mp3,wav,ogg,jpg,jpeg,png,gif,webp,pdf,doc,docx

# ──────────────────────────────────────────────────────────────
# VIDEO PROCESSING (HLS)
# ──────────────────────────────────────────────────────────────
HLS_ENABLED=true
HLS_SEGMENT_DURATION=10
HLS_OUTPUT_DIR=./uploads/hls

# ──────────────────────────────────────────────────────────────
# WATERMARKING
# ──────────────────────────────────────────────────────────────
WATERMARK_ENABLED=true
WATERMARK_OPACITY=0.3

# ──────────────────────────────────────────────────────────────
# N8N WEBHOOKS (Opcional)
# ──────────────────────────────────────────────────────────────
# N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/...
# N8N_WEBHOOK_ENABLED=false

# ──────────────────────────────────────────────────────────────
# EVOLUTION API - WHATSAPP (Opcional)
# ──────────────────────────────────────────────────────────────
# EVOLUTION_API_URL=https://your-evolution-api.com
# EVOLUTION_API_KEY=your_api_key
# EVOLUTION_API_ENABLED=false

# ──────────────────────────────────────────────────────────────
# CORS
# ──────────────────────────────────────────────────────────────
CORS_ORIGIN=http://localhost:${config.frontendPort}

# ═══════════════════════════════════════════════════════════════
# FIN DE CONFIGURACIÓN
# ═══════════════════════════════════════════════════════════════
`;

  logStep(4, 5, 'Escribiendo archivo .env...');
  
  const outputPath = path.resolve(config.output);
  
  // Verificar si el archivo existe
  if (fs.existsSync(outputPath)) {
    logWarning(`El archivo ${outputPath} ya existe`);
    const backup = `${outputPath}.backup-${Date.now()}`;
    fs.copyFileSync(outputPath, backup);
    logInfo(`Backup creado: ${backup}`);
  }
  
  // Crear directorio si no existe
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, envContent, 'utf8');
  logSuccess(`Archivo generado: ${outputPath}`);
  
  logStep(5, 5, 'Generando archivo de resumen...');
  
  const summaryContent = `
╔════════════════════════════════════════════════════════════════╗
║        RESUMEN DE VARIABLES GENERADAS - E-LEARNING NATACIÓN    ║
╚════════════════════════════════════════════════════════════════╝

Fecha: ${new Date().toLocaleString()}

CREDENCIALES GENERADAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JWT_SECRET:
${jwtSecret}

SECRET_KEY:
${secretKey}

DATABASE_URL:
${databaseUrl}

CONFIGURACIÓN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

App URL:        ${config.appUrl}
Backend Port:   ${config.backendPort}
Frontend Port:  ${config.frontendPort}
DB Host:        ${config.dbHost}
DB Port:        ${config.dbPort}
DB Name:        ${config.dbName}
DB User:        ${config.dbUser}
DB Password:    ${dbPassword}

IMPORTANTE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Guarda este archivo en un lugar seguro
⚠️  No lo subas a Git ni lo compartas públicamente
⚠️  Usa estas credenciales en tu plataforma de deployment

PRÓXIMOS PASOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Verifica que PostgreSQL esté corriendo
2. Ejecuta las migraciones: cd backend && npx prisma migrate dev
3. Seed la base de datos: cd backend && npx prisma db seed
4. Inicia el backend: cd backend && npm run dev
5. Inicia el frontend: cd frontend && npm run dev

═══════════════════════════════════════════════════════════════
`;
  
  const summaryPath = path.resolve(path.dirname(outputPath), '../ENV_SUMMARY.txt');
  fs.writeFileSync(summaryPath, summaryContent, 'utf8');
  logSuccess(`Resumen guardado: ${summaryPath}`);
  
  console.log(summaryContent);
}

// Main
async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  GENERADOR DE ARCHIVO .ENV - E-LEARNING NATACIÓN               ║
╚════════════════════════════════════════════════════════════════╝
`);
  
  parseArgs();
  
  try {
    await generateEnvFile();
    
    log('\n╔════════════════════════════════════════════════════════════════╗', colors.green);
    log('║                  ¡ARCHIVO .ENV GENERADO!                       ║', colors.green);
    log('╚════════════════════════════════════════════════════════════════╝\n', colors.green);
    
  } catch (error) {
    logError(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
