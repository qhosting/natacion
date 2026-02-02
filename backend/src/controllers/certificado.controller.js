import PDFDocument from 'pdfkit';
import prisma from '../config/database.js';

export const getCertificado = async (req, res) => {
  try {
    const { cursoId } = req.params;
    const userId = req.user.id;

    // Verificar certificado
    const certificado = await prisma.certificado.findUnique({
      where: {
        userId_cursoId: {
          userId,
          cursoId: parseInt(cursoId)
        }
      },
      include: {
        user: true,
        curso: true
      }
    });

    if (!certificado) {
      return res.status(404).json({ error: true, message: 'Certificado no encontrado. Asegúrate de haber completado el curso al 100%.' });
    }

    // Generar PDF
    const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margin: 50
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificado-${certificado.id}.pdf`);

    doc.pipe(res);

    // Diseño del Certificado
    // Borde
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();
    doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).lineWidth(3).stroke();

    // Encabezado
    doc.moveDown(2);
    doc.font('Helvetica-Bold').fontSize(40).text('CERTIFICADO', { align: 'center', spacing: 5 });
    doc.fontSize(20).text('DE FINALIZACIÓN', { align: 'center', spacing: 2 });

    doc.moveDown(2);
    doc.font('Helvetica').fontSize(16).text('Este documento certifica que', { align: 'center' });

    // Nombre del Alumno
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(28).text(`${certificado.user.nombre} ${certificado.user.apellido || ''}`, { align: 'center' });
    doc.rect(doc.page.width / 2 - 200, doc.y + 5, 400, 1).stroke(); // Línea bajo nombre

    doc.moveDown(1.5);
    doc.font('Helvetica').fontSize(16).text('Ha completado satisfactoriamente el curso:', { align: 'center' });

    // Nombre del Curso
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(24).text(certificado.curso.titulo, { align: 'center' });

    // Detalles
    doc.moveDown(3);
    doc.fontSize(12).text(`Fecha de Emisión: ${certificado.fechaEmision.toLocaleDateString()}`, { align: 'center' });
    doc.text(`ID del Certificado: ${certificado.id}`, { align: 'center' });

    // Footer / Firma (Simulada)
    doc.moveDown(2);
    doc.text('E-Learning Natación', { align: 'center', oblique: true });

    doc.end();

  } catch (error) {
    console.error('Error generando certificado:', error);
    if (!res.headersSent) {
        res.status(500).json({ error: true, message: 'Error al generar certificado' });
    }
  }
};
