import prisma from '../config/database.js';

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Usuarios Totales
    const totalUsers = await prisma.user.count({ where: { role: 'ALUMNO' } });

    // 2. Inscripciones Totales
    const totalInscripciones = await prisma.inscripcion.count();

    // 3. Tasa de Finalización Global (Cursos completados / Inscripciones totales)
    const completados = await prisma.inscripcion.count({ where: { completado: true } });
    const completionRate = totalInscripciones > 0 ? (completados / totalInscripciones) * 100 : 0;

    // 4. Cursos más populares (Top 5)
    const topCursos = await prisma.inscripcion.groupBy({
      by: ['cursoId'],
      _count: {
        cursoId: true
      },
      orderBy: {
        _count: {
          cursoId: 'desc'
        }
      },
      take: 5
    });

    // Enriquecer datos de cursos
    const cursosPopulares = await Promise.all(topCursos.map(async (item) => {
      const curso = await prisma.curso.findUnique({ where: { id: item.cursoId }, select: { titulo: true } });
      return {
        name: curso?.titulo || 'Desconocido',
        count: item._count.cursoId
      };
    }));

    // 5. Nuevos usuarios por mes (últimos 6 meses)
    // Nota: Esto es una simplificación. En producción usaríamos raw query con date_trunc
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const usersByDate = await prisma.user.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        role: 'ALUMNO'
      },
      select: { createdAt: true }
    });

    const growthData = {};
    usersByDate.forEach(u => {
      const key = u.createdAt.toISOString().slice(0, 7); // YYYY-MM
      growthData[key] = (growthData[key] || 0) + 1;
    });

    const userGrowth = Object.entries(growthData)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({
      success: true,
      data: {
        totalUsers,
        totalInscripciones,
        completionRate: Math.round(completionRate * 100) / 100,
        cursosPopulares,
        userGrowth
      }
    });

  } catch (error) {
    console.error('Error obteniendo analytics:', error);
    res.status(500).json({ error: true, message: 'Error al obtener analíticas' });
  }
};
