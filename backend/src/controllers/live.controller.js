import prisma from '../config/database.js';

export const getLiveSessions = async (req, res) => {
  try {
    const sessions = await prisma.liveSession.findMany({
      where: {
        fechaInicio: {
          gte: new Date() // Solo futuras o actuales
        }
      },
      include: {
        curso: { select: { titulo: true } }
      },
      orderBy: { fechaInicio: 'asc' }
    });

    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error obteniendo live sessions:', error);
    res.status(500).json({ error: true, message: 'Error al obtener sesiones en vivo' });
  }
};

export const createLiveSession = async (req, res) => {
  try {
    const { titulo, descripcion, fechaInicio, urlLink, cursoId } = req.body;

    const session = await prisma.liveSession.create({
      data: {
        titulo,
        descripcion,
        fechaInicio: new Date(fechaInicio),
        urlLink,
        cursoId: parseInt(cursoId)
      }
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    console.error('Error creando live session:', error);
    res.status(500).json({ error: true, message: 'Error al crear sesión en vivo' });
  }
};

export const deleteLiveSession = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.liveSession.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: 'Sesión eliminada' });
  } catch (error) {
    console.error('Error eliminando live session:', error);
    res.status(500).json({ error: true, message: 'Error al eliminar sesión' });
  }
};
