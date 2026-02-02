import prisma from '../config/database.js';

export const createComentario = async (req, res) => {
  try {
    const { contenido, leccionId } = req.body;
    const userId = req.user.id;

    if (!contenido || !leccionId) {
      return res.status(400).json({ error: true, message: 'Contenido y leccionId son requeridos' });
    }

    const comentario = await prisma.comentario.create({
      data: {
        contenido,
        leccionId: parseInt(leccionId),
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            role: true
          }
        }
      }
    });

    res.status(201).json({ success: true, data: comentario });
  } catch (error) {
    console.error('Error creando comentario:', error);
    res.status(500).json({ error: true, message: 'Error al crear comentario' });
  }
};

export const getComentariosByLeccion = async (req, res) => {
  try {
    const { leccionId } = req.params;

    const comentarios = await prisma.comentario.findMany({
      where: { leccionId: parseInt(leccionId) },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: comentarios });
  } catch (error) {
    console.error('Error obteniendo comentarios:', error);
    res.status(500).json({ error: true, message: 'Error al obtener comentarios' });
  }
};

export const deleteComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const comentario = await prisma.comentario.findUnique({
      where: { id: parseInt(id) }
    });

    if (!comentario) {
      return res.status(404).json({ error: true, message: 'Comentario no encontrado' });
    }

    if (comentario.userId !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({ error: true, message: 'No autorizado' });
    }

    await prisma.comentario.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: 'Comentario eliminado' });
  } catch (error) {
    console.error('Error eliminando comentario:', error);
    res.status(500).json({ error: true, message: 'Error al eliminar comentario' });
  }
};
