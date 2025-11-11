import prisma from '../config/database.js';

export const createLeccion = async (req, res) => {
  try {
    const { titulo, contenido, orden, etapaId } = req.body;

    if (!titulo || !etapaId) {
      return res.status(400).json({
        error: true,
        message: 'Título y etapaId son requeridos'
      });
    }

    const leccion = await prisma.leccion.create({
      data: {
        titulo,
        contenido,
        orden: orden || 0,
        etapaId: parseInt(etapaId)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Lección creada exitosamente',
      data: leccion
    });
  } catch (error) {
    console.error('Error creando lección:', error);
    res.status(500).json({
      error: true,
      message: 'Error al crear lección'
    });
  }
};

export const updateLeccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido, orden } = req.body;

    const leccion = await prisma.leccion.update({
      where: { id: parseInt(id) },
      data: {
        ...(titulo && { titulo }),
        ...(contenido !== undefined && { contenido }),
        ...(orden !== undefined && { orden })
      }
    });

    res.json({
      success: true,
      message: 'Lección actualizada exitosamente',
      data: leccion
    });
  } catch (error) {
    console.error('Error actualizando lección:', error);
    res.status(500).json({
      error: true,
      message: 'Error al actualizar lección'
    });
  }
};

export const deleteLeccion = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.leccion.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Lección eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando lección:', error);
    res.status(500).json({
      error: true,
      message: 'Error al eliminar lección'
    });
  }
};

export const getLeccionById = async (req, res) => {
  try {
    const { id } = req.params;

    const leccion = await prisma.leccion.findUnique({
      where: { id: parseInt(id) },
      include: {
        etapa: {
          include: {
            curso: true
          }
        },
        medios: {
          orderBy: { orden: 'asc' }
        }
      }
    });

    if (!leccion) {
      return res.status(404).json({
        error: true,
        message: 'Lección no encontrada'
      });
    }

    res.json({
      success: true,
      data: leccion
    });
  } catch (error) {
    console.error('Error obteniendo lección:', error);
    res.status(500).json({
      error: true,
      message: 'Error al obtener lección'
    });
  }
};
