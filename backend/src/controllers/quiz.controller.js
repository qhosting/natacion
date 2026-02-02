import prisma from '../config/database.js';

export const getQuizByLeccion = async (req, res) => {
  try {
    const { leccionId } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { leccionId: parseInt(leccionId) },
      include: {
        preguntas: {
          include: {
            opciones: {
              select: { id: true, texto: true } // No enviar esCorrecta al frontend
            }
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz no encontrado para esta lección' });
    }

    res.json({ success: true, data: quiz });
  } catch (error) {
    console.error('Error obteniendo quiz:', error);
    res.status(500).json({ error: true, message: 'Error al obtener quiz' });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { quizId, respuestas } = req.body; // respuestas: { preguntaId: opcionId }
    const userId = req.user.id;

    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(quizId) },
      include: {
        preguntas: {
          include: {
            opciones: true
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: true, message: 'Quiz no encontrado' });
    }

    let correctas = 0;
    const total = quiz.preguntas.length;

    quiz.preguntas.forEach(pregunta => {
      const opcionSeleccionadaId = respuestas[pregunta.id];
      const opcionCorrecta = pregunta.opciones.find(op => op.esCorrecta);

      if (opcionCorrecta && opcionCorrecta.id === opcionSeleccionadaId) {
        correctas++;
      }
    });

    const puntaje = Math.round((correctas / total) * 100);
    const aprobado = puntaje >= 70; // 70% para aprobar

    // Guardar intento
    const intento = await prisma.intentoQuiz.create({
      data: {
        userId,
        quizId: parseInt(quizId),
        puntaje,
        aprobado
      }
    });

    // Si aprobó y es primera vez, dar puntos (opcional)
    if (aprobado) {
       // Lógica de puntos si se desea
    }

    res.json({
      success: true,
      data: {
        puntaje,
        aprobado,
        correctas,
        total
      }
    });

  } catch (error) {
    console.error('Error enviando quiz:', error);
    res.status(500).json({ error: true, message: 'Error al procesar el quiz' });
  }
};

export const createQuiz = async (req, res) => {
    try {
        const { titulo, leccionId, preguntas } = req.body;
        // preguntas: [{ texto: "...", opciones: [{ texto: "...", esCorrecta: boolean }] }]

        const quiz = await prisma.quiz.create({
            data: {
                titulo,
                leccionId: parseInt(leccionId),
                preguntas: {
                    create: preguntas.map(p => ({
                        texto: p.texto,
                        opciones: {
                            create: p.opciones
                        }
                    }))
                }
            },
            include: {
                preguntas: {
                    include: { opciones: true }
                }
            }
        });

        res.status(201).json({ success: true, data: quiz });
    } catch (error) {
        console.error('Error creando quiz:', error);
        res.status(500).json({ error: true, message: 'Error al crear quiz' });
    }
};
