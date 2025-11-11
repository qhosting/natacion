import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leccionService, progresoService } from '../services/api';
import { VideoPlayer } from '../components/VideoPlayer';

const LeccionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leccion, setLeccion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completando, setCompletando] = useState(false);

  useEffect(() => {
    loadLeccion();
  }, [id]);

  const loadLeccion = async () => {
    try {
      const response = await leccionService.getById(id);
      setLeccion(response.data.data);
    } catch (error) {
      console.error('Error cargando lección:', error);
      alert('Error al cargar la lección');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarCompletada = async () => {
    if (completando) return;

    if (!confirm('¿Marcar esta lección como completada?')) return;

    setCompletando(true);
    try {
      await progresoService.marcarCompletada(parseInt(id));
      alert('Lección completada exitosamente');
      navigate(-1);
    } catch (error) {
      alert(error.response?.data?.message || 'Error al marcar lección');
    } finally {
      setCompletando(false);
    }
  };

  if (loading) return <div className="loading"><div className="loader"></div></div>;
  if (!leccion) return <div>Lección no encontrada</div>;

  return (
    <div>
      <nav className="navbar">
        <h2>{leccion.titulo}</h2>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">Volver</button>
      </nav>

      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="card">
          <h1>{leccion.titulo}</h1>
          
          {leccion.contenido && (
            <div
              style={{ marginTop: '24px', lineHeight: '1.6' }}
              dangerouslySetInnerHTML={{ __html: leccion.contenido }}
            />
          )}

          {leccion.medios && leccion.medios.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <h2 style={{ marginBottom: '16px' }}>Recursos</h2>
              {leccion.medios.map((media) => (
                <div key={media.id} style={{ marginBottom: '24px' }}>
                  {media.titulo && <h3 style={{ marginBottom: '12px' }}>{media.titulo}</h3>}
                  
                  {media.tipo === 'VIDEO' && (
                    <VideoPlayer
                      src={media.url}
                      hlsSrc={media.urlHls}
                      poster={media.thumbnail}
                    />
                  )}

                  {media.tipo === 'AUDIO' && (
                    <audio controls style={{ width: '100%' }}>
                      <source src={media.url} type="audio/mpeg" />
                      Tu navegador no soporta audio.
                    </audio>
                  )}

                  {media.tipo === 'IMAGE' && (
                    <img
                      src={media.url}
                      alt={media.titulo}
                      className="protected"
                      style={{ width: '100%', borderRadius: '8px' }}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleMarcarCompletada}
            disabled={completando}
            className="btn btn-primary"
            style={{ marginTop: '32px', width: '100%', padding: '16px' }}
          >
            {completando ? 'Marcando...' : 'Marcar como Completada'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeccionView;
