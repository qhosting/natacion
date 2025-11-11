import prisma from '../config/database.js';
import { convertToHLS } from '../services/hls.service.js';

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'No se ha subido ningún archivo'
      });
    }

    const { leccionId, titulo, orden } = req.body;

    if (!leccionId) {
      return res.status(400).json({
        error: true,
        message: 'leccionId es requerido'
      });
    }

    let tipo = 'IMAGE';
    if (req.file.mimetype.startsWith('video/')) {
      tipo = 'VIDEO';
    } else if (req.file.mimetype.startsWith('audio/')) {
      tipo = 'AUDIO';
    }

    const url = `/uploads/${req.file.filename.includes('/') ? req.file.filename.split('/').pop() : req.file.filename}`;

    let urlHls = null;

    // Si es video, convertir a HLS
    if (tipo === 'VIDEO') {
      try {
        urlHls = await convertToHLS(req.file.path, req.file.filename);
      } catch (hlsError) {
        console.error('Error convirtiendo a HLS:', hlsError);
        // Continuar sin HLS si falla la conversión
      }
    }

    const media = await prisma.media.create({
      data: {
        tipo,
        titulo: titulo || req.file.originalname,
        url,
        urlHls,
        tamano: req.file.size,
        leccionId: parseInt(leccionId),
        orden: orden ? parseInt(orden) : 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Archivo subido exitosamente',
      data: media
    });
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    res.status(500).json({
      error: true,
      message: 'Error al subir archivo'
    });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.media.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Media eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando media:', error);
    res.status(500).json({
      error: true,
      message: 'Error al eliminar media'
    });
  }
};

export const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, orden } = req.body;

    const media = await prisma.media.update({
      where: { id: parseInt(id) },
      data: {
        ...(titulo && { titulo }),
        ...(orden !== undefined && { orden: parseInt(orden) })
      }
    });

    res.json({
      success: true,
      message: 'Media actualizado exitosamente',
      data: media
    });
  } catch (error) {
    console.error('Error actualizando media:', error);
    res.status(500).json({
      error: true,
      message: 'Error al actualizar media'
    });
  }
};
