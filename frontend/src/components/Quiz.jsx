import React, { useState, useEffect } from 'react';
import { quizService } from '../services/api';

const Quiz = ({ leccionId, onCompleted }) => {
  const [quiz, setQuiz] = useState(null);
  const [respuestas, setRespuestas] = useState({}); // { preguntaId: opcionId }
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, [leccionId]);

  const loadQuiz = async () => {
    try {
      const response = await quizService.getByLeccion(leccionId);
      if (response.data.success) {
        setQuiz(response.data.data);
      }
    } catch (error) {
      console.log('No quiz for this lesson or error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (preguntaId, opcionId) => {
    setRespuestas({
      ...respuestas,
      [preguntaId]: opcionId
    });
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Verificar que todas contestadas
    if (Object.keys(respuestas).length < quiz.preguntas.length) {
      alert('Por favor responde todas las preguntas');
      return;
    }

    try {
      const response = await quizService.submit({
        quizId: quiz.id,
        respuestas
      });

      if (response.data.success) {
        setResultado(response.data.data);
        if (response.data.data.aprobado && onCompleted) {
          onCompleted();
        }
      }
    } catch (error) {
      console.error('Error enviando quiz:', error);
      alert('Error enviando respuestas');
    }
  };

  if (loading) return null;
  if (!quiz) return null;

  if (resultado) {
    return (
      <div className="mt-8 p-6 bg-white rounded-lg shadow text-center">
        <h3 className="text-2xl font-bold mb-4">
          {resultado.aprobado ? '🎉 ¡Felicidades! Aprobaste' : '❌ Inténtalo de nuevo'}
        </h3>
        <p className="text-lg mb-2">Tu puntaje: <span className="font-bold">{resultado.puntaje}%</span></p>
        <p className="text-gray-600 mb-6">Respondiste correctamente {resultado.correctas} de {resultado.total} preguntas.</p>

        {!resultado.aprobado && (
          <button
            onClick={() => { setResultado(null); setRespuestas({}); }}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Reintentar Quiz
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold mb-6 text-gray-800">📝 Evaluación: {quiz.titulo}</h3>

      <div className="space-y-8">
        {quiz.preguntas.map((p, index) => (
          <div key={p.id}>
            <p className="font-semibold text-lg mb-3">{index + 1}. {p.texto}</p>
            <div className="space-y-2">
              {p.opciones.map((op) => (
                <label
                  key={op.id}
                  className={`flex items-center p-3 rounded cursor-pointer border hover:bg-gray-50 transition ${respuestas[p.id] === op.id ? 'bg-blue-50 border-blue-500' : 'border-gray-200'}`}
                >
                  <input
                    type="radio"
                    name={`pregunta-${p.id}`}
                    value={op.id}
                    checked={respuestas[p.id] === op.id}
                    onChange={() => handleSelect(p.id, op.id)}
                    className="mr-3 h-4 w-4 text-blue-600"
                  />
                  <span>{op.texto}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 font-bold transition shadow-lg"
        >
          Enviar Respuestas
        </button>
      </div>
    </div>
  );
};

export default Quiz;
