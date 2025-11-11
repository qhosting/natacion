import prisma from '../config/database.js';

export const createEtapa = async (req, res) => {
  try {
    const { titulo, descripcion, orden, cursoId } = req.body;

    if (!titulo || !cursoId) {
      return res.status(400).json({
        error: true,
        message: 'Título y cursoId son requeridos'
      });
    }

    const etapa = await prisma.etapa.create({
      data: {
        titulo,
        descripcion,
        orden: orden || 0,
        cursoId: parseInt(cursoId)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Etapa creada exitosamente',
      data: etapa
    });
  } catch (error) {
    console.error('Error creando etapa:', error);
    res.status(500).json({
      error: true,
      message: 'Error al crear etapa'
    });
  }
};

export const updateEtapa = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, orden } = req.body;

    const etapa = await prisma.etapa.update({
      where: { id: parseInt(id) },
      data: {
        ...(titulo && { titulo }),
        ...(descripcion !== undefined && { descripcion }),
        ...(orden !== undefined && { orden })
      }
    });

    res.json({
      success: true,
      message: 'Etapa actualizada exitosamente',
      data: etapa
    });
  } catch (error) {
    console.error('Error actualizando etapa:', error);
    res.status(500).json({
      error: true,
      message: 'Error al actualizar etapa'
    });
  }
};

export const deleteEtapa = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.etapa.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Etapa eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando etapa:', error);
    res.status(500).json({
      error: true,
      message: 'Error al eliminar etapa'
    });
  }
};
