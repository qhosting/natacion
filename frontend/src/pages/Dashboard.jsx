import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cursoService, inscripcionService, gamificationService, certificadoService } from '../services/api';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cursosRes, inscripcionesRes, statsRes] = await Promise.all([
        cursoService.getAll(),
        inscripcionService.getMisInscripciones(),
        gamificationService.getStats()
      ]);

      setCursos(cursosRes.data.data);
      setInscripciones(inscripcionesRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (cursoId) => {
    try {
      const response = await certificadoService.download(cursoId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificado-curso-${cursoId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Error descargando el certificado. Asegúrate de haber completado el curso.');
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
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Bienvenido, {user.nombre} | ⭐ Puntos: {stats?.puntos || 0}
          </p>
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
        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-3" style={{ marginBottom: '32px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="card" style={{ textAlign: 'center', backgroundColor: '#f0f9ff' }}>
              <h3>⭐ Puntos</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0284c7' }}>{stats.puntos}</p>
            </div>
            <div className="card" style={{ textAlign: 'center', backgroundColor: '#f0fdf4' }}>
              <h3>🏆 Cursos Completados</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{stats.cursosCompletados}</p>
            </div>
            <div className="card" style={{ textAlign: 'center', backgroundColor: '#fff7ed' }}>
              <h3>✅ Lecciones</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ea580c' }}>{stats.leccionesCompletadas}</p>
            </div>
          </div>
        )}

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
                {insc.completado && (
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="badge badge-success">Completado</span>
                    <button
                      onClick={() => handleDownloadCertificate(insc.curso.id)}
                      style={{ fontSize: '12px', color: '#0284c7', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      Descargar Certificado
                    </button>
                  </div>
                )}
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
