import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await analyticsService.getDashboard();
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error cargando analytics:', error);
      alert('Error cargando analíticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando dashboard...</div>;
  if (!data) return <div className="p-8 text-center">No hay datos disponibles</div>;

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <nav className="bg-white shadow mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">📊 Dashboard Analítico</h1>
          <button
            onClick={() => navigate('/admin')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Volver al Panel Admin
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 grid gap-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Usuarios Totales</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{data.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Inscripciones Activas</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{data.totalInscripciones}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Tasa de Finalización</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{data.completionRate}%</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Cursos Populares */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-gray-700">🏆 Cursos Más Populares</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.cursosPopulares} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 12}} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Inscripciones" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crecimiento de Usuarios */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-gray-700">📈 Crecimiento de Usuarios</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{r: 4}} name="Nuevos Usuarios" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;
