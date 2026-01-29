import React, { useState, useEffect } from 'react';
import { liveService } from '../services/api';

const LiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await liveService.getAll();
      if (response.data.success) {
        setSessions(response.data.data);
      }
    } catch (error) {
      console.error('Error loading live sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (sessions.length === 0) return null;

  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        🔴 Clases en Vivo Próximas
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map(session => (
          <div key={session.id} className="bg-white text-gray-800 p-4 rounded shadow">
            <h3 className="font-bold text-lg">{session.titulo}</h3>
            <p className="text-sm text-gray-500 mb-2">{session.curso.titulo}</p>
            <p className="text-sm mb-3">{new Date(session.fechaInicio).toLocaleString()}</p>
            <p className="mb-4 text-gray-700 text-sm">{session.descripcion}</p>
            <a
              href={session.urlLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              Unirse a la Clase
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSessions;
