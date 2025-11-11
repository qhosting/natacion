import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminPanel = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav className="navbar">
        <div>
          <h2 style={{ color: '#0284c7' }}>Panel de Administración</h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>{user.email}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/" className="btn btn-secondary">Dashboard</Link>
          <button onClick={logout} className="btn btn-danger">Cerrar Sesión</button>
        </div>
      </nav>

      <div className="container">
        <h1 style={{ marginBottom: '24px' }}>Gestión de Plataforma</h1>

        <div className="grid grid-cols-3">
          <Link to="/admin/cursos" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2 style={{ color: '#0284c7' }}>Cursos</h2>
            <p style={{ marginTop: '12px', color: '#64748b' }}>Gestionar catálogo de cursos</p>
          </Link>

          <Link to="/admin/usuarios" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2 style={{ color: '#0284c7' }}>Usuarios</h2>
            <p style={{ marginTop: '12px', color: '#64748b' }}>Administrar usuarios y roles</p>
          </Link>

          <div className="card">
            <h2 style={{ color: '#0284c7' }}>Estadísticas</h2>
            <p style={{ marginTop: '12px', color: '#64748b' }}>Ver métricas de la plataforma</p>
          </div>
        </div>

        <div className="card" style={{ marginTop: '32px' }}>
          <h2>Instrucciones</h2>
          <ul style={{ marginTop: '16px', marginLeft: '20px', lineHeight: '1.8' }}>
            <li>Gestiona cursos, etapas y lecciones desde la sección de Cursos</li>
            <li>Sube videos, audios e imágenes asociados a cada lección</li>
            <li>Los videos se convertirán automáticamente a formato HLS</li>
            <li>Administra roles de usuarios desde la sección de Usuarios</li>
            <li>Los webhooks se envían automáticamente a n8n en eventos clave</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
