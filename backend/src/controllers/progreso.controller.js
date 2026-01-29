import prisma from '../config/database.js';
import { sendWebhook } from '../services/webhook.service.js';

export const marcarLeccionCompletada = async (req, res) => {
  try {
    const { leccionId } = req.body;
    const userId = req.user.id;

    if (!leccionId) {
      return res.status(400).json({
        error: true,
        message: 'El ID de la lección es requerido'
      });
    }

    // Verificar que la lección existe y obtener datos del curso
    const leccion = await prisma.leccion.findUnique({
      where: { id: parseInt(leccionId) },
      include: {
        etapa: {
          include: {
            curso: {
              include: {
                etapas: {
                  include: {
                    lecciones: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!leccion) {
      return res.status(404).json({
        error: true,
        message: 'Lección no encontrada'
      });
    }

    const cursoId = leccion.etapa.cursoId;

    // Verificar que el usuario está inscrito en el curso
    const inscripcion = await prisma.inscripcion.findUnique({
      where: {
        userId_cursoId: {
          userId,
          cursoId
        }
      }
    });

    if (!inscripcion) {
      return res.status(403).json({
        error: true,
        message: 'Debes estar inscrito en el curso para marcar lecciones como completadas'
      });
    }

    // Verificar si ya estaba completada para no dar puntos dobles
    const progresoExistente = await prisma.progreso.findUnique({
      where: {
        userId_leccionId: {
          userId,
          leccionId: parseInt(leccionId)
        }
      }
    });

    const esPrimeraVez = !progresoExistente || !progresoExistente.completado;

    // Crear o actualizar el progreso
    const progreso = await prisma.progreso.upsert({
      where: {
        userId_leccionId: {
          userId,
          leccionId: parseInt(leccionId)
        }
      },
      update: {
        completado: true
      },
      create: {
        userId,
        leccionId: parseInt(leccionId),
        completado: true
      }
    });

    // Gamificación: Otorgar puntos si es la primera vez
    if (esPrimeraVez) {
      await prisma.user.update({
        where: { id: userId },
        data: { puntos: { increment: 10 } }
      });
    }

    // Calcular el progreso total del curso
    const totalLecciones = leccion.etapa.curso.etapas.reduce((sum, etapa) => {
      return sum + etapa.lecciones.length;
    }, 0);

    const leccionesCompletadas = await prisma.progreso.count({
      where: {
        userId,
        completado: true,
        leccion: {
          etapa: {
            cursoId
          }
        }
      }
    });

    const porcentajeProgreso = totalLecciones > 0 
      ? (leccionesCompletadas / totalLecciones) * 100 
      : 0;

    const cursoCompletado = porcentajeProgreso === 100;

    // Actualizar inscripción con el nuevo progreso
    const inscripcionActualizada = await prisma.inscripcion.update({
      where: {
        userId_cursoId: {
          userId,
          cursoId
        }
      },
      data: {
        progreso: porcentajeProgreso,
        completado: cursoCompletado
      },
      include: {
        user: {
          select: {
            email: true,
            nombre: true,
            apellido: true
          }
        },
        curso: true
      }
    });

    // Enviar webhook de lección completada
    await sendWebhook('leccion.completada', {
      userId,
      userEmail: inscripcionActualizada.user.email,
      userName: `${inscripcionActualizada.user.nombre} ${inscripcionActualizada.user.apellido || ''}`.trim(),
      leccionId: parseInt(leccionId),
      leccionTitulo: leccion.titulo,
      cursoId,
      cursoTitulo: leccion.etapa.curso.titulo,
      progreso: porcentajeProgreso,
      timestamp: new Date().toISOString()
    });

    // Si el curso se completó, enviar webhook adicional y generar certificado
    if (cursoCompletado && !inscripcion.completado) {
      // Generar registro de certificado
      await prisma.certificado.create({
        data: {
          userId,
          cursoId
        }
      });

      // Bonus de puntos por completar curso
      await prisma.user.update({
        where: { id: userId },
        data: { puntos: { increment: 100 } }
      });

      await sendWebhook('curso.completado', {
        userId,
        userEmail: inscripcionActualizada.user.email,
        userName: `${inscripcionActualizada.user.nombre} ${inscripcionActualizada.user.apellido || ''}`.trim(),
        cursoId,
        cursoTitulo: leccion.etapa.curso.titulo,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      message: cursoCompletado ? 'Curso completado' : 'Lección marcada como completada',
      data: {
        progreso,
        progresoTotal: porcentajeProgreso,
        cursoCompletado
      }
    });
  } catch (error) {
    console.error('Error marcando lección:', error);
    res.status(500).json({
      error: true,
      message: 'Error al marcar lección como completada'
    });
  }
};

export const getProgresoDelCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;
    const userId = req.user.id;

    const progresos = await prisma.progreso.findMany({
      where: {
        userId,
        leccion: {
          etapa: {
            cursoId: parseInt(cursoId)
          }
        }
      },
      include: {
        leccion: {
          include: {
            etapa: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: progresos
    });
  } catch (error) {
    console.error('Error obteniendo progreso:', error);
    res.status(500).json({
      error: true,
      message: 'Error al obtener progreso'
    });
  }
};
