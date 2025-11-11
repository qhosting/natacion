import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cursoService } from '../../services/api';

const AdminCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCurso, setEditingCurso] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: '',
    activo: true,
    orden: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadCursos();
  }, []);

  const loadCursos = async () => {
    try {
      const response = await cursoService.getAll();
      setCursos(response.data.data);
    } catch (error) {
      console.error('Error cargando cursos:', error);
      alert('Error al cargar cursos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCurso) {
        await cursoService.update(editingCurso.id, formData);
        alert('Curso actualizado exitosamente');
      } else {
        await cursoService.create(formData);
        alert('Curso creado exitosamente');
      }
      
      setShowModal(false);
      setFormData({ titulo: '', descripcion: '', imagen: '', activo: true, orden: 0 });
      setEditingCurso(null);
      loadCursos();
    } catch (error) {
      console.error('Error guardando curso:', error);
      alert(error.response?.data?.message || 'Error al guardar curso');
    }
  };

  const handleEdit = (curso) => {
    setEditingCurso(curso);
    setFormData({
      titulo: curso.titulo,
      descripcion: curso.descripcion || '',
      imagen: curso.imagen || '',
      activo: curso.activo,
      orden: curso.orden
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este curso?')) return;

    try {
      await cursoService.delete(id);
      alert('Curso eliminado exitosamente');
      loadCursos();
    } catch (error) {
      console.error('Error eliminando curso:', error);
      alert('Error al eliminar curso');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const openNewModal = () => {
    setEditingCurso(null);
    setFormData({ titulo: '', descripcion: '', imagen: '', activo: true, orden: 0 });
    setShowModal(true);
  };

  if (loading) return <div className="loading"><div className="loader"></div></div>;

  return (
    <div>
      <nav className="navbar">
        <h2>Gestión de Cursos</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={openNewModal} className="btn btn-primary">+ Nuevo Curso</button>
          <Link to="/admin" className="btn btn-secondary">Volver</Link>
        </div>
      </nav>

      <div className="container">
        <div className="grid grid-cols-1">
          {cursos.length === 0 ? (
            <div className="card">
              <p>No hay cursos registrados. Crea el primer curso.</p>
            </div>
          ) : (
            cursos.map((curso) => (
              <div key={curso.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3>{curso.titulo}</h3>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>{curso.descripcion}</p>
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span className={`badge ${curso.activo ? 'badge-success' : 'badge-warning'}`}>
                        {curso.activo ? 'Activo' : 'Inactivo'}
                      </span>
                      <span className="badge badge-primary">
                        Orden: {curso.orden}
                      </span>
                      <span className="badge badge-primary">
                        {curso.etapas?.length || 0} etapas
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/admin/etapas/${curso.id}`)}
                      className="btn btn-primary"
                    >
                      Ver Etapas
                    </button>
                    <button onClick={() => handleEdit(curso)} className="btn btn-secondary">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(curso.id)} className="btn btn-danger">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
            <h2>{editingCurso ? 'Editar Curso' : 'Nuevo Curso'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
              <input
                type="text"
                name="titulo"
                placeholder="Título del curso"
                value={formData.titulo}
                onChange={handleChange}
                className="input"
                required
              />
              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={handleChange}
                className="input"
                rows="4"
              />
              <input
                type="text"
                name="imagen"
                placeholder="URL de la imagen"
                value={formData.imagen}
                onChange={handleChange}
                className="input"
              />
              <input
                type="number"
                name="orden"
                placeholder="Orden"
                value={formData.orden}
                onChange={handleChange}
                className="input"
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                />
                Curso activo
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingCurso ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCurso(null);
                  }}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCursos;
