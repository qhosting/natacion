import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: true,
        message: 'Token de autenticación requerido'
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: true,
      message: 'Token inválido o expirado'
    });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: true,
      message: 'Acceso denegado. Se requiere rol de administrador'
    });
  }
  next();
};

export const alumnoMiddleware = (req, res, next) => {
  if (req.user.role !== 'ALUMNO' && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: true,
      message: 'Acceso denegado'
    });
  }
  next();
};
