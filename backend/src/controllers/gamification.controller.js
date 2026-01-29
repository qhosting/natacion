import prisma from '../config/database.js';

export const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { puntos: true }
    });

    const cursosCompletados = await prisma.inscripcion.count({
        where: { userId, completado: true }
    });

    const leccionesCompletadas = await prisma.progreso.count({
        where: { userId, completado: true }
    });

    const insignias = await prisma.userInsignia.findMany({
        where: { userId },
        include: { insignia: true }
    });

    const certificados = await prisma.certificado.findMany({
        where: { userId },
        include: { curso: { select: { id: true, titulo: true } } }
    });

    res.json({
        success: true,
        data: {
            puntos: user.puntos || 0,
            cursosCompletados,
            leccionesCompletadas,
            insignias,
            certificados
        }
    });

  } catch (error) {
    console.error('Error obteniendo stats:', error);
    res.status(500).json({ error: true, message: 'Error al obtener estadísticas' });
  }
};
