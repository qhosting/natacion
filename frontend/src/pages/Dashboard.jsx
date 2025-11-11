import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cursoService, inscripcionService } from '../services/api';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cursosRes, inscripcionesRes] = await Promise.all([
        cursoService.getAll(),
        inscripcionService.getMisInscripciones()
      ]);

      setCursos(cursosRes.data.data);
      setInscripciones(inscripcionesRes.data.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInscribirse = async (cursoId) => {
    try {
      await inscripcionService.inscribirse(cursoId);
      alert('Te has inscrito exitosamente');
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al inscribirse');
    }
  };

  const estaInscrito = (cursoId) => {
    return inscripciones.some((insc) => insc.cursoId === cursoId);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <div>
          <h2 style={{ color: '#0284c7' }}>E-Learning Natación</h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Bienvenido, {user.nombre}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isAdmin && (
            <Link to="/admin" className="btn btn-secondary">
              Panel Admin
            </Link>
          )}
          <button onClick={logout} className="btn btn-danger">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div className="container">
        <h1 style={{ marginBottom: '24px' }}>Mis Cursos Inscritos</h1>
        {inscripciones.length === 0 ? (
          <p>No estás inscrito en ningún curso todavía.</p>
        ) : (
          <div className="grid grid-cols-3">
            {inscripciones.map((insc) => (
              <div key={insc.id} className="card">
                <h3>{insc.curso.titulo}</h3>
                <p style={{ color: '#64748b', marginTop: '8px' }}>{insc.curso.descripcion}</p>
                <div style={{ marginTop: '16px' }}>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${insc.progreso}%` }}></div>
                  </div>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>Progreso: {insc.progreso.toFixed(1)}%</p>
                </div>
                {insc.completado && <span className="badge badge-success" style={{ marginTop: '8px' }}>Completado</span>}
                <Link to={`/curso/${insc.curso.id}`} className="btn btn-primary" style={{ marginTop: '16px', width: '100%' }}>
                  Continuar
                </Link>
              </div>
            ))}
          </div>
        )}

        <h1 style={{ marginTop: '48px', marginBottom: '24px' }}>Catálogo de Cursos</h1>
        <div className="grid grid-cols-3">
          {cursos.map((curso) => (
            <div key={curso.id} className="card">
              {curso.imagen && <img src={curso.imagen} alt={curso.titulo} style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }} />}
              <h3>{curso.titulo}</h3>
              <p style={{ color: '#64748b', marginTop: '8px' }}>{curso.descripcion}</p>
              <p style={{ fontSize: '14px', marginTop: '12px', color: '#059669' }}>
                {curso.etapas?.length || 0} etapas - {curso.etapas?.reduce((sum, etapa) => sum + (etapa.lecciones?.length || 0), 0) || 0} lecciones
              </p>
              {estaInscrito(curso.id) ? (
                <Link to={`/curso/${curso.id}`} className="btn btn-primary" style={{ marginTop: '16px', width: '100%' }}>
                  Ver Curso
                </Link>
              ) : (
                <button onClick={() => handleInscribirse(curso.id)} className="btn btn-primary" style={{ marginTop: '16px', width: '100%' }}>
                  Inscribirse
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
