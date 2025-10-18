'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalProjects: number;
  totalJobs: number;
  activeUsers: number;
}

interface AdminEvent {
  id: string;
  title: string;
  date: string;
  participants: number;
  status: 'active' | 'completed' | 'cancelled';
}

interface AdminProject {
  id: string;
  title: string;
  creator: string;
  status: 'draft' | 'active' | 'completed';
  volunteers: number;
}

export function AdminPanel() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalProjects: 0,
    totalJobs: 0,
    activeUsers: 0
  });
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'projects' | 'users'>('overview');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Mock data - replace with actual API calls
      setStats({
        totalUsers: 1247,
        totalEvents: 89,
        totalProjects: 156,
        totalJobs: 234,
        activeUsers: 892
      });

      setEvents([
        {
          id: '1',
          title: 'Limpieza de Playa Barcelona',
          date: '2024-01-20',
          participants: 45,
          status: 'active'
        },
        {
          id: '2',
          title: 'Plantación de Árboles Madrid',
          date: '2024-01-25',
          participants: 32,
          status: 'active'
        }
      ]);

      setProjects([
        {
          id: '1',
          title: 'Huerto Comunitario Valencia',
          creator: 'María García',
          status: 'active',
          volunteers: 12
        },
        {
          id: '2',
          title: 'Energía Solar Barrio',
          creator: 'Carlos López',
          status: 'draft',
          volunteers: 0
        }
      ]);

      trackEvent('Admin Panel Accessed');
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleEventAction = (eventId: string, action: string) => {
    trackEvent('Admin Event Action', { eventId, action });
    // Implement event actions
  };

  const handleProjectAction = (projectId: string, action: string) => {
    trackEvent('Admin Project Action', { projectId, action });
    // Implement project actions
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Usuarios Totales</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-1">+12% este mes</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Eventos Activos</h3>
        <p className="text-3xl font-bold text-green-600">{stats.totalEvents}</p>
        <p className="text-sm text-gray-500 mt-1">+8% este mes</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Proyectos</h3>
        <p className="text-3xl font-bold text-purple-600">{stats.totalProjects}</p>
        <p className="text-sm text-gray-500 mt-1">+15% este mes</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Empleos Verdes</h3>
        <p className="text-3xl font-bold text-yellow-600">{stats.totalJobs}</p>
        <p className="text-sm text-gray-500 mt-1">+5% este mes</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Usuarios Activos</h3>
        <p className="text-3xl font-bold text-indigo-600">{stats.activeUsers}</p>
        <p className="text-sm text-gray-500 mt-1">Últimos 30 días</p>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Gestión de Eventos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Evento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participantes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {event.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.participants}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    event.status === 'active' ? 'bg-green-100 text-green-800' :
                    event.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {event.status === 'active' ? 'Activo' :
                     event.status === 'completed' ? 'Completado' : 'Cancelado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEventAction(event.id, 'edit')}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEventAction(event.id, 'delete')}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Gestión de Proyectos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proyecto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Creador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Voluntarios
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {project.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.creator}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.volunteers}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status === 'active' ? 'Activo' :
                     project.status === 'completed' ? 'Completado' : 'Borrador'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleProjectAction(project.id, 'approve')}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleProjectAction(project.id, 'edit')}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleProjectAction(project.id, 'delete')}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="mt-2 text-gray-600">Gestiona eventos, proyectos y personas usuarias de EcoNexo</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Resumen', icon: '📊' },
              { id: 'events', name: 'Eventos', icon: '📅' },
              { id: 'projects', name: 'Proyectos', icon: '🚀' },
              { id: 'users', name: 'Usuarios', icon: '👥' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'users' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestión de Usuarios</h3>
            <p className="text-gray-600">Funcionalidad de gestión de personas usuarias en desarrollo...</p>
          </div>
        )}
      </div>
    </div>
  );
}
