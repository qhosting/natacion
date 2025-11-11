import prisma from '../config/database.js';

export const getAllCursos = async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany({
      where: { activo: true },
      include: {
        etapas: {
          orderBy: { orden: 'asc' },
          include: {
            lecciones: {
              orderBy: { orden: 'asc' }
            }
          }
        },
        _count: {
          select: { inscripciones: true }
        }
      },
      orderBy: { orden: 'asc' }
    });

    res.json({
      success: true,
      data: cursos
    });
  } catch (error) {
    console.error('Error obteniendo cursos:', error);
    res.status(500).json({
      error: true,
      message: 'Error al obtener cursos'
    });
  }
};

export const getCursoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const curso = await prisma.curso.findUnique({
      where: { id: parseInt(id) },
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
        },
        inscripciones: {
          where: { userId }
        }
      }
    });

    if (!curso) {
      return res.status(404).json({
        error: true,
        message: 'Curso no encontrado'
      });
    }

    res.json({
      success: true,
      data: curso
    });
  } catch (error) {
    console.error('Error obteniendo curso:', error);
    res.status(500).json({
      error: true,
      message: 'Error al obtener curso'
    });
  }
};

export const createCurso = async (req, res) => {
  try {
    const { titulo, descripcion, imagen, activo, orden } = req.body;

    if (!titulo) {
      return res.status(400).json({
        error: true,
        message: 'El título es requerido'
      });
    }

    const curso = await prisma.curso.create({
      data: {
        titulo,
        descripcion,
        imagen,
        activo: activo !== undefined ? activo : true,
        orden: orden || 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Curso creado exitosamente',
      data: curso
    });
  } catch (error) {
    console.error('Error creando curso:', error);
    res.status(500).json({
      error: true,
      message: 'Error al crear curso'
    });
  }
};

export const updateCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, imagen, activo, orden } = req.body;

    const curso = await prisma.curso.update({
      where: { id: parseInt(id) },
      data: {
        ...(titulo && { titulo }),
        ...(descripcion !== undefined && { descripcion }),
        ...(imagen !== undefined && { imagen }),
        ...(activo !== undefined && { activo }),
        ...(orden !== undefined && { orden })
      }
    });

    res.json({
      success: true,
      message: 'Curso actualizado exitosamente',
      data: curso
    });
  } catch (error) {
    console.error('Error actualizando curso:', error);
    res.status(500).json({
      error: true,
      message: 'Error al actualizar curso'
    });
  }
};

export const deleteCurso = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.curso.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Curso eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando curso:', error);
    res.status(500).json({
      error: true,
      message: 'Error al eliminar curso'
    });
  }
};
