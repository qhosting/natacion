import prisma from '../config/database.js';
import { sendWebhook } from '../services/webhook.service.js';

export const inscribirseACurso = async (req, res) => {
  try {
    const { cursoId } = req.body;
    const userId = req.user.id;

    if (!cursoId) {
      return res.status(400).json({
        error: true,
        message: 'El ID del curso es requerido'
      });
    }

    // Verificar si el curso existe
    const curso = await prisma.curso.findUnique({
      where: { id: parseInt(cursoId) },
      include: {
        etapas: {
          include: {
            lecciones: true
          }
        }
      }
    });

    if (!curso) {
      return res.status(404).json({
        error: true,
        message: 'Curso no encontrado'
      });
    }

    // Verificar si ya está inscrito
    const inscripcionExistente = await prisma.inscripcion.findUnique({
      where: {
        userId_cursoId: {
          userId,
          cursoId: parseInt(cursoId)
        }
      }
    });

    if (inscripcionExistente) {
      return res.status(400).json({
        error: true,
        message: 'Ya estás inscrito en este curso'
      });
    }

    // Crear inscripción
    const inscripcion = await prisma.inscripcion.create({
      data: {
        userId,
        cursoId: parseInt(cursoId),
        progreso: 0,
        completado: false
      },
      include: {
        curso: true,
        user: {
          select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true
          }
        }
      }
    });

    // Enviar webhook
    await sendWebhook('curso.inscrito', {
      userId,
      userEmail: inscripcion.user.email,
      userName: `${inscripcion.user.nombre} ${inscripcion.user.apellido || ''}`.trim(),
      cursoId: parseInt(cursoId),
      cursoTitulo: curso.titulo,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Inscripción exitosa',
      data: inscripcion
    });
  } catch (error) {
    console.error('Error en inscripción:', error);
    res.status(500).json({
      error: true,
      message: 'Error al inscribirse al curso'
    });
  }
};

export const getMisInscripciones = async (req, res) => {
  try {
    const userId = req.user.id;

    const inscripciones = await prisma.inscripcion.findMany({
      where: { userId },
      include: {
        curso: {
          include: {
            etapas: {
              orderBy: { orden: 'asc' },
              include: {
                lecciones: {
                  orderBy: { orden: 'asc' }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: inscripciones
    });
  } catch (error) {
    console.error('Error obteniendo inscripciones:', error);
    res.status(500).json({
      error: true,
      message: 'Error al obtener inscripciones'
    });
  }
};

export const getDetalleInscripcion = async (req, res) => {
  try {
    const { cursoId } = req.params;
    const userId = req.user.id;

    const inscripcion = await prisma.inscripcion.findUnique({
      where: {
        userId_cursoId: {
          userId,
          cursoId: parseInt(cursoId)
        }
      },
      include: {
        curso: {
          include: {
            etapas: {
              orderBy: { orden: 'asc' },
              include: {
                lecciones: {
                  orderBy: { orden: 'asc' },
                  include: {
                    medios: {
                      orderBy: { orden: 'asc' }
                    },
                    progresos: {
                      where: { userId }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!inscripcion) {
      return res.status(404).json({
        error: true,
        message: 'No estás inscrito en este curso'
      });
    }

    res.json({
      success: true,
      data: inscripcion
    });
  } catch (error) {
    console.error('Error obteniendo detalle de inscripción:', error);
    res.status(500).json({
      error: true,
      message: 'Error al obtener detalle de inscripción'
    });
  }
};
