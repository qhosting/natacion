import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Crear usuario administrador
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@elearning.com' },
    update: {},
    create: {
      email: 'admin@elearning.com',
      password: adminPassword,
      nombre: 'Administrador',
      apellido: 'Sistema',
      role: 'ADMIN'
    }
  });

  console.log('✓ Usuario administrador creado:', admin.email);

  // Crear usuario de prueba
  const userPassword = await bcrypt.hash('usuario123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'alumno@test.com' },
    update: {},
    create: {
      email: 'alumno@test.com',
      password: userPassword,
      nombre: 'Alumno',
      apellido: 'Prueba',
      role: 'ALUMNO'
    }
  });

  console.log('✓ Usuario de prueba creado:', user.email);

  // Crear curso "Natación Crol para Adultos"
  const curso = await prisma.curso.upsert({
    where: { id: 1 },
    update: {},
    create: {
      titulo: 'Natación Crol para Adultos',
      descripcion: 'Curso completo de natación estilo crol diseñado para adultos. Aprende desde las técnicas básicas de respiración hasta los aspectos más avanzados de la técnica.',
      activo: true,
      orden: 1
    }
  });

  console.log('✓ Curso creado:', curso.titulo);

  // Etapa 1: RESPIRACIÓN
  const etapaRespiracion = await prisma.etapa.create({
    data: {
      titulo: 'RESPIRACIÓN',
      descripcion: 'Aprende las técnicas fundamentales de respiración en el agua',
      orden: 1,
      cursoId: curso.id,
      lecciones: {
        create: [
          {
            titulo: 'Soltar aire por la nariz',
            contenido: 'Aprende a exhalar correctamente bajo el agua a través de la nariz. Esta técnica es fundamental para evitar que el agua entre por las fosas nasales.',
            orden: 1
          },
          {
            titulo: 'Posturas de respiración',
            contenido: 'Practica diferentes posturas corporales para optimizar la respiración mientras nadas.',
            orden: 2
          },
          {
            titulo: 'Hundirse controladamente',
            contenido: 'Aprende a hundirte y sumergirte de forma controlada, manteniendo la calma bajo el agua.',
            orden: 3
          },
          {
            titulo: 'Recoger objetos del fondo',
            contenido: 'Ejercicio práctico: bucea para recoger objetos del fondo de la piscina, mejorando tu control bajo el agua.',
            orden: 4
          }
        ]
      }
    }
  });

  console.log('✓ Etapa RESPIRACIÓN creada');

  // Etapa 2: POSTURAS
  const etapaPosturas = await prisma.etapa.create({
    data: {
      titulo: 'POSTURAS',
      descripcion: 'Domina las posturas correctas para un nado eficiente',
      orden: 2,
      cursoId: curso.id,
      lecciones: {
        create: [
          {
            titulo: 'Flechita hidrodinámica',
            contenido: 'La posición de flecha es la base del nado eficiente. Aprende a mantener tu cuerpo alineado y estirado.',
            orden: 1
          },
          {
            titulo: 'Posición de pie',
            contenido: 'Practica la transición entre posición horizontal y vertical en el agua.',
            orden: 2
          },
          {
            titulo: 'Salidas desde el borde',
            contenido: 'Técnicas para iniciar el nado desde el borde de la piscina de forma eficiente.',
            orden: 3
          },
          {
            titulo: 'Llegar lo más lejos posible en posición de flecha',
            contenido: 'Ejercicio de deslizamiento: impulso y mantenimiento de la posición aerodinámica.',
            orden: 4
          }
        ]
      }
    }
  });

  console.log('✓ Etapa POSTURAS creada');

  // Etapa 3: PATADA
  const etapaPatada = await prisma.etapa.create({
    data: {
      titulo: 'PATADA',
      descripcion: 'Perfecciona la técnica de patada para mayor propulsión',
      orden: 3,
      cursoId: curso.id,
      lecciones: {
        create: [
          {
            titulo: 'Ejercicios fuera del agua',
            contenido: 'Practica el movimiento de patada sentado en el borde de la piscina para interiorizar la técnica.',
            orden: 1
          },
          {
            titulo: 'Ejercicios dentro del agua',
            contenido: 'Aplica la técnica de patada en el agua, con apoyo de tabla o pared.',
            orden: 2
          },
          {
            titulo: 'Identificar el tipo de patada',
            contenido: 'Aprende a identificar y corregir tu tipo de patada: bicicleta, tijera o correcta.',
            orden: 3
          }
        ]
      }
    }
  });

  console.log('✓ Etapa PATADA creada');

  // Etapa 4: BRAZADA
  const etapaBrazada = await prisma.etapa.create({
    data: {
      titulo: 'BRAZADA',
      descripcion: 'Domina el movimiento de brazos y la coordinación con la respiración',
      orden: 4,
      cursoId: curso.id,
      lecciones: {
        create: [
          {
            titulo: 'Brazada sin respiración',
            contenido: 'Practica el movimiento de brazos sin preocuparte por la respiración. Enfócate en la técnica.',
            orden: 1
          },
          {
            titulo: 'Corregir postura de manos',
            contenido: 'Aprende la posición correcta de las manos durante la brazada: cucharita vs. relajada.',
            orden: 2
          },
          {
            titulo: 'Respiración lateral',
            contenido: 'Integra la respiración lateral con el movimiento de brazos. Coordinación fundamental del crol.',
            orden: 3
          },
          {
            titulo: 'Coordinación brazada-respiración en ambos lados',
            contenido: 'Practica la respiración bilateral para un nado equilibrado.',
            orden: 4
          }
        ]
      }
    }
  });

  console.log('✓ Etapa BRAZADA creada');

  // Etapa 5: TÉCNICA AVANZADA
  const etapaTecnica = await prisma.etapa.create({
    data: {
      titulo: 'TÉCNICA AVANZADA',
      descripcion: 'Perfecciona tu técnica con elementos avanzados',
      orden: 5,
      cursoId: curso.id,
      lecciones: {
        create: [
          {
            titulo: 'Salida desde la pared al tocar el piso',
            contenido: 'Impulso eficiente desde la pared para iniciar o continuar el nado.',
            orden: 1
          },
          {
            titulo: 'Voltereta de campana',
            contenido: 'Técnica de volteo en la pared para cambiar de dirección sin detenerte.',
            orden: 2
          },
          {
            titulo: 'Flecha por debajo del agua',
            contenido: 'Deslizamiento subacuático después del impulso. Técnica de competición.',
            orden: 3
          },
          {
            titulo: 'Clavados básicos',
            contenido: 'Introducción a los clavados: entrada al agua de cabeza desde el borde.',
            orden: 4
          }
        ]
      }
    }
  });

  console.log('✓ Etapa TÉCNICA AVANZADA creada');

  console.log('\n✅ Seed completado exitosamente');
  console.log('\n📝 Credenciales de acceso:');
  console.log('   Admin: admin@elearning.com / admin123');
  console.log('   Alumno: alumno@test.com / usuario123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
