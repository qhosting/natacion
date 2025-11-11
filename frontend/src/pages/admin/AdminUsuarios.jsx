import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const response = await adminService.getUsuarios();
      setUsuarios(response.data.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      alert('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    if (!confirm(`¿Cambiar rol del usuario a ${newRole}?`)) return;

    try {
      await adminService.updateRole(userId, newRole);
      alert('Rol actualizado exitosamente');
      loadUsuarios();
    } catch (error) {
      console.error('Error actualizando rol:', error);
      alert('Error al actualizar rol');
    }
  };

  if (loading) return <div className="loading"><div className="loader"></div></div>;

  return (
    <div>
      <nav className="navbar">
        <h2>Gestión de Usuarios</h2>
        <Link to="/admin" className="btn btn-secondary">Volver</Link>
      </nav>

      <div className="container">
        <div className="grid grid-cols-1">
          {usuarios.length === 0 ? (
            <div className="card">
              <p>No hay usuarios registrados.</p>
            </div>
          ) : (
            usuarios.map((usuario) => (
              <div key={usuario.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3>{usuario.nombre} {usuario.apellido}</h3>
                    <p style={{ color: '#64748b', marginTop: '4px' }}>{usuario.email}</p>
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span className={`badge ${usuario.role === 'ADMIN' ? 'badge-success' : 'badge-primary'}`}>
                        {usuario.role}
                      </span>
                      <span className="badge badge-primary">
                        {usuario._count?.inscripciones || 0} inscripciones
                      </span>
                      <span className="badge badge-primary">
                        Registro: {new Date(usuario.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    {usuario.role === 'ALUMNO' ? (
                      <button
                        onClick={() => handleChangeRole(usuario.id, 'ADMIN')}
                        className="btn btn-secondary"
                      >
                        Hacer Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleChangeRole(usuario.id, 'ALUMNO')}
                        className="btn btn-secondary"
                      >
                        Hacer Alumno
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card" style={{ marginTop: '32px', background: '#fffbeb' }}>
          <h3 style={{ color: '#92400e' }}>Información</h3>
          <p style={{ marginTop: '8px', color: '#78350f' }}>
            Los administradores tienen acceso completo a la plataforma, incluyendo:
          </p>
          <ul style={{ marginLeft: '20px', marginTop: '8px', color: '#78350f' }}>
            <li>Gestión de cursos, etapas y lecciones</li>
            <li>Subida y gestión de archivos multimedia</li>
            <li>Visualización de estadísticas</li>
            <li>Cambio de roles de usuarios</li>
          </ul>
          <p style={{ marginTop: '12px', color: '#78350f', fontWeight: 'bold' }}>
            Ten cuidado al asignar roles de administrador.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsuarios;
