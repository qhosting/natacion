import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cursoService, leccionService } from '../../services/api';

const AdminLecciones = () => {
  const { etapaId } = useParams();
  const [etapa, setEtapa] = useState(null);
  const [lecciones, setLecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLeccion, setEditingLeccion] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    orden: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [etapaId]);

  const loadData = async () => {
    try {
      const response = await cursoService.getAll();
      const cursos = response.data.data;
      
      let etapaEncontrada = null;
      for (const curso of cursos) {
        const e = curso.etapas?.find(et => et.id === parseInt(etapaId));
        if (e) {
          etapaEncontrada = e;
          break;
        }
      }
      
      if (etapaEncontrada) {
        setEtapa(etapaEncontrada);
        setLecciones(etapaEncontrada.lecciones || []);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar etapa y lecciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingLeccion) {
        await leccionService.update(editingLeccion.id, formData);
        alert('Lección actualizada exitosamente');
      } else {
        await leccionService.create({ ...formData, etapaId: parseInt(etapaId) });
        alert('Lección creada exitosamente');
      }
      
      setShowModal(false);
      setFormData({ titulo: '', contenido: '', orden: 0 });
      setEditingLeccion(null);
      loadData();
    } catch (error) {
      console.error('Error guardando lección:', error);
      alert(error.response?.data?.message || 'Error al guardar lección');
    }
  };

  const handleEdit = (leccion) => {
    setEditingLeccion(leccion);
    setFormData({
      titulo: leccion.titulo,
      contenido: leccion.contenido || '',
      orden: leccion.orden
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta lección? Se eliminarán también todos sus medios.')) return;

    try {
      await leccionService.delete(id);
      alert('Lección eliminada exitosamente');
      loadData();
    } catch (error) {
      console.error('Error eliminando lección:', error);
      alert('Error al eliminar lección');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openNewModal = () => {
    setEditingLeccion(null);
    setFormData({ titulo: '', contenido: '', orden: 0 });
    setShowModal(true);
  };

  if (loading) return <div className="loading"><div className="loader"></div></div>;
  if (!etapa) return <div className="container"><p>Etapa no encontrada</p></div>;

  return (
    <div>
      <nav className="navbar">
        <div>
          <h2>Lecciones: {etapa.titulo}</h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Gestiona las lecciones de la etapa</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={openNewModal} className="btn btn-primary">+ Nueva Lección</button>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">Volver</button>
        </div>
      </nav>

      <div className="container">
        <div className="grid grid-cols-1">
          {lecciones.length === 0 ? (
            <div className="card">
              <p>No hay lecciones registradas. Crea la primera lección.</p>
            </div>
          ) : (
            lecciones.map((leccion, index) => (
              <div key={leccion.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3>{index + 1}. {leccion.titulo}</h3>
                    {leccion.contenido && (
                      <p style={{ color: '#64748b', marginTop: '8px', maxHeight: '60px', overflow: 'hidden' }}>
                        {leccion.contenido.substring(0, 150)}...
                      </p>
                    )}
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                      <span className="badge badge-primary">Orden: {leccion.orden}</span>
                      <span className="badge badge-primary">{leccion.medios?.length || 0} medios</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/admin/medias/${leccion.id}`)}
                      className="btn btn-primary"
                    >
                      Gestionar Medios
                    </button>
                    <button onClick={() => handleEdit(leccion)} className="btn btn-secondary">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(leccion.id)} className="btn btn-danger">
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
          <div className="card" style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
            <h2>{editingLeccion ? 'Editar Lección' : 'Nueva Lección'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
              <input
                type="text"
                name="titulo"
                placeholder="Título de la lección"
                value={formData.titulo}
                onChange={handleChange}
                className="input"
                required
              />
              <textarea
                name="contenido"
                placeholder="Contenido de la lección"
                value={formData.contenido}
                onChange={handleChange}
                className="input"
                rows="8"
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
                  {editingLeccion ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingLeccion(null);
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

export default AdminLecciones;
