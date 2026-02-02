import React, { useState, useEffect } from 'react';
import { comentarioService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Comentarios = ({ leccionId }) => {
  const { user } = useAuth();
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComentarios = async () => {
    try {
      const response = await comentarioService.getByLeccion(leccionId);
      if (response.data.success) {
        setComentarios(response.data.data);
      }
    } catch (error) {
      console.error('Error cargando comentarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComentarios();
  }, [leccionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    try {
      const response = await comentarioService.create({
        contenido: nuevoComentario,
        leccionId
      });
      if (response.data.success) {
        setNuevoComentario('');
        fetchComentarios(); // Recargar lista
      }
    } catch (error) {
      console.error('Error enviando comentario:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este comentario?')) return;
    try {
      await comentarioService.delete(id);
      setComentarios(comentarios.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error eliminando comentario:', error);
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-4">Comentarios / Dudas</h3>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Escribe tu duda o comentario aquí..."
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
        />
        <div className="mt-2 text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={!nuevoComentario.trim()}
          >
            Publicar
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">Cargando comentarios...</p>
        ) : comentarios.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay comentarios aún. ¡Sé el primero!</p>
        ) : (
          comentarios.map((c) => (
            <div key={c.id} className="border-b pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <div className="font-semibold text-gray-800">
                  {c.user.nombre} {c.user.apellido}
                  <span className="ml-2 text-xs text-gray-500 font-normal">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {(user.id === c.user.id || user.role === 'ADMIN') && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Eliminar
                  </button>
                )}
              </div>
              <p className="mt-1 text-gray-700 whitespace-pre-wrap">{c.contenido}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comentarios;
