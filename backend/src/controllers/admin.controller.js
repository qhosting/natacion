import prisma from '../config/database.js';

export const getEstadisticas = async (req, res) => {
  try {
    const [
      totalUsuarios,
      totalCursos,
      totalInscripciones,
      totalLecciones,
      cursosActivos
    ] = await Promise.all([
      prisma.user.count(),
      prisma.curso.count(),
      prisma.inscripcion.count(),
      prisma.leccion.count(),
      prisma.curso.count({ where: { activo: true } })
    ]);

    const estadisticas = {
      totalUsuarios,
      totalCursos,
      cursosActivos,
      totalInscripciones,
      totalLecciones
    };

    res.json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: true,
      message: 'Error al obtener estadísticas'
    });
  }
};

export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        role: true,
        createdAt: true,
        _count: {
          select: { inscripciones: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: usuarios
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      error: true,
      message: 'Error al obtener usuarios'
    });
  }
};

export const getAllInscripciones = async (req, res) => {
  try {
    const inscripciones = await prisma.inscripcion.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true
          }
        },
        curso: true
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

export const updateUsuarioRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['ALUMNO', 'ADMIN'].includes(role)) {
      return res.status(400).json({
        error: true,
        message: 'Role inválido. Debe ser ALUMNO o ADMIN'
      });
    }

    const usuario = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        role: true
      }
    });

    res.json({
      success: true,
      message: 'Rol actualizado exitosamente',
      data: usuario
    });
  } catch (error) {
    console.error('Error actualizando rol:', error);
    res.status(500).json({
      error: true,
      message: 'Error al actualizar rol'
    });
  }
};
