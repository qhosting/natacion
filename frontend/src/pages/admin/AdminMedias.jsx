import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leccionService, mediaService } from '../../services/api';

const AdminMedias = () => {
  const { leccionId } = useParams();
  const [leccion, setLeccion] = useState(null);
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    orden: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [leccionId]);

  const loadData = async () => {
    try {
      const response = await leccionService.getById(leccionId);
      setLeccion(response.data.data);
      setMedias(response.data.data.medios || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar lección y medios');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Selecciona un archivo');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', selectedFile);
    formDataUpload.append('leccionId', leccionId);
    formDataUpload.append('titulo', formData.titulo || selectedFile.name);
    formDataUpload.append('orden', formData.orden);

    setUploading(true);
    try {
      await mediaService.upload(formDataUpload);
      alert('Archivo subido exitosamente. La conversión a HLS puede tomar unos minutos para videos.');
      setSelectedFile(null);
      setFormData({ titulo: '', orden: 0 });
      document.getElementById('fileInput').value = '';
      loadData();
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      alert(error.response?.data?.message || 'Error al subir archivo');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este medio?')) return;

    try {
      await mediaService.delete(id);
      alert('Medio eliminado exitosamente');
      loadData();
    } catch (error) {
      console.error('Error eliminando medio:', error);
      alert('Error al eliminar medio');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="loading"><div className="loader"></div></div>;
  if (!leccion) return <div className="container"><p>Lección no encontrada</p></div>;

  return (
    <div>
      <nav className="navbar">
        <div>
          <h2>Medios: {leccion.titulo}</h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Gestiona archivos multimedia de la lección</p>
        </div>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">Volver</button>
      </nav>

      <div className="container">
        <div className="card">
          <h3>Subir Nuevo Archivo</h3>
          <form onSubmit={handleUpload} style={{ marginTop: '16px' }}>
            <input
              id="fileInput"
              type="file"
              accept="video/*,audio/*,image/*"
              onChange={handleFileChange}
              style={{ marginBottom: '12px' }}
              required
            />
            {selectedFile && (
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
                Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            <input
              type="text"
              name="titulo"
              placeholder="Título (opcional)"
              value={formData.titulo}
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
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={uploading}>
              {uploading ? 'Subiendo...' : 'Subir Archivo'}
            </button>
          </form>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px' }}>
            Formatos soportados: Video (MP4, WebM), Audio (MP3, WAV), Imagen (JPG, PNG, WebP)
            <br />
            Tamaño máximo: 500 MB
            <br />
            Los videos se convertirán automáticamente a formato HLS para streaming seguro.
          </p>
        </div>

        <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Archivos Subidos</h2>
        
        {medias.length === 0 ? (
          <div className="card">
            <p>No hay archivos multimedia para esta lección.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1">
            {medias.map((media, index) => (
              <div key={media.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3>{index + 1}. {media.titulo || 'Sin título'}</h3>
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="badge badge-primary">{media.tipo}</span>
                      <span className="badge badge-primary">Orden: {media.orden}</span>
                      {media.tamano && (
                        <span className="badge badge-primary">
                          {(media.tamano / 1024 / 1024).toFixed(2)} MB
                        </span>
                      )}
                      {media.urlHls && (
                        <span className="badge badge-success">HLS Disponible</span>
                      )}
                    </div>
                    <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
                      URL: {media.url}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(media.id)} className="btn btn-danger">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMedias;
