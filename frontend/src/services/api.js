import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL
});

// Interceptor para agregar token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile')
};

export const cursoService = {
  getAll: () => api.get('/cursos'),
  getById: (id) => api.get(`/cursos/${id}`),
  create: (data) => api.post('/cursos', data),
  update: (id, data) => api.put(`/cursos/${id}`, data),
  delete: (id) => api.delete(`/cursos/${id}`)
};

export const etapaService = {
  create: (data) => api.post('/etapas', data),
  update: (id, data) => api.put(`/etapas/${id}`, data),
  delete: (id) => api.delete(`/etapas/${id}`)
};

export const leccionService = {
  getById: (id) => api.get(`/lecciones/${id}`),
  create: (data) => api.post('/lecciones', data),
  update: (id, data) => api.put(`/lecciones/${id}`, data),
  delete: (id) => api.delete(`/lecciones/${id}`)
};

export const mediaService = {
  upload: (formData) => api.post('/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/media/${id}`, data),
  delete: (id) => api.delete(`/media/${id}`)
};

export const inscripcionService = {
  inscribirse: (cursoId) => api.post('/inscripciones', { cursoId }),
  getMisInscripciones: () => api.get('/inscripciones'),
  getDetalle: (cursoId) => api.get(`/inscripciones/${cursoId}`)
};

export const progresoService = {
  marcarCompletada: (leccionId) => api.post('/progreso/completar', { leccionId }),
  getProgresoCurso: (cursoId) => api.get(`/progreso/curso/${cursoId}`)
};

export const adminService = {
  getEstadisticas: () => api.get('/admin/estadisticas'),
  getUsuarios: () => api.get('/admin/usuarios'),
  getInscripciones: () => api.get('/admin/inscripciones'),
  updateRole: (id, role) => api.put(`/admin/usuarios/${id}/role`, { role })
};

export const comentarioService = {
  create: (data) => api.post('/comentarios', data),
  getByLeccion: (leccionId) => api.get(`/comentarios/leccion/${leccionId}`),
  delete: (id) => api.delete(`/comentarios/${id}`)
};

export const gamificationService = {
  getStats: () => api.get('/gamification/stats')
};

export const certificadoService = {
  download: (cursoId) => api.get(`/certificados/${cursoId}`, { responseType: 'blob' })
};

export const quizService = {
  getByLeccion: (leccionId) => api.get(`/quizzes/leccion/${leccionId}`),
  submit: (data) => api.post('/quizzes/submit', data),
  create: (data) => api.post('/quizzes', data)
};

export const liveService = {
  getAll: () => api.get('/live'),
  create: (data) => api.post('/live', data),
  delete: (id) => api.delete(`/live/${id}`)
};

export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard')
};

export default api;
