import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CursoDetalle from './pages/CursoDetalle';
import LeccionView from './pages/LeccionView';
import AdminPanel from './pages/admin/AdminPanel';
import AdminCursos from './pages/admin/AdminCursos';
import AdminEtapas from './pages/admin/AdminEtapas';
import AdminLecciones from './pages/admin/AdminLecciones';
import AdminMedias from './pages/admin/AdminMedias';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminAnalytics from './pages/admin/AdminAnalytics';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/curso/:id" element={<ProtectedRoute><CursoDetalle /></ProtectedRoute>} />
          <Route path="/leccion/:id" element={<ProtectedRoute><LeccionView /></ProtectedRoute>} />
          
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/admin/cursos" element={<AdminRoute><AdminCursos /></AdminRoute>} />
          <Route path="/admin/etapas/:cursoId" element={<AdminRoute><AdminEtapas /></AdminRoute>} />
          <Route path="/admin/lecciones/:etapaId" element={<AdminRoute><AdminLecciones /></AdminRoute>} />
          <Route path="/admin/medias/:leccionId" element={<AdminRoute><AdminMedias /></AdminRoute>} />
          <Route path="/admin/usuarios" element={<AdminRoute><AdminUsuarios /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
