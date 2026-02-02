import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { cursoService, inscripcionService } from '../services/api';
import LiveSessions from '../components/LiveSessions';

const CursoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [inscripcion, setInscripcion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurso();
  }, [id]);

  const loadCurso = async () => {
    try {
      const [cursoRes, inscripcionRes] = await Promise.all([
        cursoService.getById(id),
        inscripcionService.getDetalle(id)
      ]);

      setCurso(cursoRes.data.data);
      setInscripcion(inscripcionRes.data.data);
    } catch (error) {
      console.error('Error cargando curso:', error);
      if (error.response?.status === 404) {
        alert('No estás inscrito en este curso');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const esLeccionCompletada = (leccionId) => {
    return inscripcion?.curso?.etapas.some((etapa) =>
      etapa.lecciones.some((leccion) =>
        leccion.id === leccionId && leccion.progresos?.length > 0 && leccion.progresos[0].completado
      )
    );
  };

  if (loading) return <div className="loading"><div className="loader"></div></div>;
  if (!curso) return <div>Curso no encontrado</div>;

  return (
    <div>
      <nav className="navbar">
        <h2>{curso.titulo}</h2>
        <button onClick={() => navigate('/')} className="btn btn-secondary">Volver</button>
      </nav>

      <div className="container">
        {curso.imagen && <img src={curso.imagen} alt={curso.titulo} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '24px' }} />}
        
        <LiveSessions />

        <div className="card">
          <h1>{curso.titulo}</h1>
          <p style={{ marginTop: '16px', color: '#64748b' }}>{curso.descripcion}</p>
          
          {inscripcion && (
            <div style={{ marginTop: '24px' }}>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${inscripcion.progreso}%` }}></div>
              </div>
              <p style={{ marginTop: '8px' }}>Progreso total: {inscripcion.progreso.toFixed(1)}%</p>
              {inscripcion.completado && <span className="badge badge-success" style={{ marginTop: '12px' }}>Curso Completado</span>}
            </div>
          )}
        </div>

        {curso.etapas?.map((etapa, etapaIndex) => (
          <div key={etapa.id} className="card">
            <h2>{etapaIndex + 1}. {etapa.titulo}</h2>
            {etapa.descripcion && <p style={{ color: '#64748b', marginTop: '8px' }}>{etapa.descripcion}</p>}
            
            <div style={{ marginTop: '16px' }}>
              {etapa.lecciones?.map((leccion, leccionIndex) => (
                <div
                  key={leccion.id}
                  style={{
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    marginTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4>{etapaIndex + 1}.{leccionIndex + 1} {leccion.titulo}</h4>
                    {esLeccionCompletada(leccion.id) && (
                      <span className="badge badge-success" style={{ marginTop: '8px' }}>Completada</span>
                    )}
                  </div>
                  <Link to={`/leccion/${leccion.id}`} className="btn btn-primary">
                    {esLeccionCompletada(leccion.id) ? 'Revisar' : 'Iniciar'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CursoDetalle;
