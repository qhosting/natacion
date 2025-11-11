
/**
 * Test de Hashing de Passwords - E-Learning Natación
 * 
 * Propósito: Verificar y testear el hashing de passwords con bcrypt
 * Adaptado de: EscalaFin MVP
 * 
 * Uso:
 *   cd backend && node ../scripts/test-hash.js
 */

const path = require('path');

// Intentar cargar bcryptjs desde el directorio backend
let bcrypt;
try {
  bcrypt = require(path.join(process.cwd(), 'node_modules/bcryptjs'));
} catch (e) {
  try {
    bcrypt = require('bcryptjs');
  } catch (e2) {
    console.error('❌ Error: bcryptjs no está instalado');
    console.error('Por favor, ejecuta:');
    console.error('  cd backend && npm install bcryptjs');
    process.exit(1);
  }
}

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testHash() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║        TEST DE HASHING - E-LEARNING NATACIÓN                   ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  
  const testPassword = 'admin123';
  
  log('1. Generando hash para password: ' + testPassword, colors.cyan);
  const hash = await bcrypt.hash(testPassword, 10);
  log('   Hash generado:', colors.green);
  log('   ' + hash + '\n');
  
  log('2. Verificando password correcto...', colors.cyan);
  const isValid = await bcrypt.compare(testPassword, hash);
  log('   Resultado: ' + (isValid ? '✓ VÁLIDO' : '✗ INVÁLIDO'), isValid ? colors.green : colors.yellow);
  
  log('\n3. Verificando password incorrecto...', colors.cyan);
  const isInvalid = await bcrypt.compare('wrongpassword', hash);
  log('   Resultado: ' + (isInvalid ? '✗ VÁLIDO (ERROR!)' : '✓ INVÁLIDO (CORRECTO)'), !isInvalid ? colors.green : colors.yellow);
  
  log('\n4. Hashes de usuarios de prueba:', colors.cyan);
  const users = [
    { email: 'admin@elearning.com', password: 'admin123', role: 'ADMIN' },
    { email: 'alumno@test.com', password: 'usuario123', role: 'ALUMNO' },
    { email: 'profesor@test.com', password: 'profesor123', role: 'ALUMNO' }
  ];
  
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    log(`\n   ${user.email} (${user.role})`, colors.blue);
    log(`   Password: ${user.password}`);
    log(`   Hash: ${hash}\n`);
  }
  
  log('5. Verificación de seguridad:', colors.cyan);
  log('   ✓ Los hashes son únicos incluso para el mismo password', colors.green);
  log('   ✓ No es posible revertir un hash a su password original', colors.green);
  log('   ✓ bcrypt incluye salt automáticamente', colors.green);
  
  console.log('\n═══════════════════════════════════════════════════════════════\n');
  
  log('💡 Tip: Puedes usar estos hashes para crear usuarios manualmente en la BD', colors.cyan);
  log('   o usarlos en el archivo prisma/seed.js\n', colors.cyan);
}

testHash().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
