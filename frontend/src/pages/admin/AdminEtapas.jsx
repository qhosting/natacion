import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cursoService, etapaService } from '../../services/api';

const AdminEtapas = () => {
  const { cursoId } = useParams();
  const [curso, setCurso] = useState(null);
  const [etapas, setEtapas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEtapa, setEditingEtapa] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    orden: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [cursoId]);

  const loadData = async () => {
    try {
      const response = await cursoService.getById(cursoId);
      setCurso(response.data.data);
      setEtapas(response.data.data.etapas || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar curso y etapas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingEtapa) {
        await etapaService.update(editingEtapa.id, formData);
        alert('Etapa actualizada exitosamente');
      } else {
        await etapaService.create({ ...formData, cursoId: parseInt(cursoId) });
        alert('Etapa creada exitosamente');
      }
      
      setShowModal(false);
      setFormData({ titulo: '', descripcion: '', orden: 0 });
      setEditingEtapa(null);
      loadData();
    } catch (error) {
      console.error('Error guardando etapa:', error);
      alert(error.response?.data?.message || 'Error al guardar etapa');
    }
  };

  const handleEdit = (etapa) => {
    setEditingEtapa(etapa);
    setFormData({
      titulo: etapa.titulo,
      descripcion: etapa.descripcion || '',
      orden: etapa.orden
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta etapa? Se eliminarán también todas sus lecciones.')) return;

    try {
      await etapaService.delete(id);
      alert('Etapa eliminada exitosamente');
      loadData();
    } catch (error) {
      console.error('Error eliminando etapa:', error);
      alert('Error al eliminar etapa');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openNewModal = () => {
    setEditingEtapa(null);
    setFormData({ titulo: '', descripcion: '', orden: 0 });
    setShowModal(true);
  };

  if (loading) return <div className="loading"><div className="loader"></div></div>;
  if (!curso) return <div className="container"><p>Curso no encontrado</p></div>;

  return (
    <div>
      <nav className="navbar">
        <div>
          <h2>Etapas: {curso.titulo}</h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Gestiona las etapas del curso</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={openNewModal} className="btn btn-primary">+ Nueva Etapa</button>
          <Link to="/admin/cursos" className="btn btn-secondary">Volver</Link>
        </div>
      </nav>

      <div className="container">
        <div className="grid grid-cols-1">
          {etapas.length === 0 ? (
            <div className="card">
              <p>No hay etapas registradas. Crea la primera etapa.</p>
            </div>
          ) : (
            etapas.map((etapa, index) => (
              <div key={etapa.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3>{index + 1}. {etapa.titulo}</h3>
                    <p style={{ color: '#64748b', marginTop: '8px' }}>{etapa.descripcion}</p>
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                      <span className="badge badge-primary">Orden: {etapa.orden}</span>
                      <span className="badge badge-primary">{etapa.lecciones?.length || 0} lecciones</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/admin/lecciones/${etapa.id}`)}
                      className="btn btn-primary"
                    >
                      Ver Lecciones
                    </button>
                    <button onClick={() => handleEdit(etapa)} className="btn btn-secondary">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(etapa.id)} className="btn btn-danger">
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
          <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
            <h2>{editingEtapa ? 'Editar Etapa' : 'Nueva Etapa'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
              <input
                type="text"
                name="titulo"
                placeholder="Título de la etapa"
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
                type="number"
                name="orden"
                placeholder="Orden"
                value={formData.orden}
                onChange={handleChange}
                className="input"
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingEtapa ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingEtapa(null);
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

export default AdminEtapas;
