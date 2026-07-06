"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import FeaturedProjectsSlider from "@/components/FeaturedProjectsSlider";
import { PROJECTS } from "@/data/projects";

export default function SliderDemoPage() {
  const { t, locale } = useI18n();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Calcular información de debug
    const now = new Date();
    
    const activeProjects = PROJECTS.filter(project => {
      if (!project.id || !project.name) return false;
      if (project.endsAt) {
        const endDate = new Date(project.endsAt);
        if (endDate < now) return false;
      }
      return project.isPermanent !== false;
    });

    const projectsWithIssues = PROJECTS.filter(project => {
      return !project.id || !project.name;
    });

    const expiredProjects = PROJECTS.filter(project => {
      if (project.endsAt) {
        const endDate = new Date(project.endsAt);
        return endDate < now;
      }
      return false;
    });

    setDebugInfo({
      totalProjects: PROJECTS.length,
      activeProjects: activeProjects.length,
      projectsWithIssues: projectsWithIssues.length,
      expiredProjects: expiredProjects.length,
      activeProjectsList: activeProjects.map(p => ({
        id: p.id,
        name: p.name,
        city: p.city,
        country: p.country,
        hasImage: !!p.image_url,
        hasDescription: !!p.description,
        category: p.category,
        isPermanent: p.isPermanent,
        endsAt: p.endsAt
      }))
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            🎯 Demo del Slider de Proyectos Destacados
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Página de prueba para verificar el estado actual del slider y los proyectos activos
          </p>
        </div>

        {/* Debug Info Panel */}
        {debugInfo && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              📊 Información de Estado
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {debugInfo.totalProjects}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Total de Proyectos
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {debugInfo.activeProjects}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Proyectos Activos
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {debugInfo.projectsWithIssues}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Con Problemas
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {debugInfo.expiredProjects}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Expirados
                </div>
              </div>
            </div>

            {/* Lista de proyectos activos */}
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                📋 Lista de Proyectos Activos ({debugInfo.activeProjects})
              </h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {debugInfo.activeProjectsList.map((project: any, index: number) => (
                  <div
                    key={project.id}
                    className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                            #{index + 1}
                          </span>
                          <span className="font-mono text-xs bg-gray-200 dark:bg-slate-600 px-2 py-1 rounded">
                            {project.id}
                          </span>
                          <h4 className="font-bold text-gray-800 dark:text-white">
                            {project.name}
                          </h4>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 ml-6">
                          📍 {project.city}, {project.country} | 
                          🏷️ {project.category} |
                          {project.hasImage ? ' ✅ Imagen' : ' ❌ Sin imagen'} |
                          {project.hasDescription ? ' ✅ Descripción' : ' ❌ Sin descripción'} |
                          {project.isPermanent ? ' ♾️ Permanente' : project.endsAt ? ` 📅 Hasta ${new Date(project.endsAt).toLocaleDateString()}` : ' 📅 Sin fecha'}
                        </div>
                      </div>
                      <a
                        href={`/projects/${project.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      >
                        Ver →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Slider Demo */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            🎠 Slider de Proyectos Destacados
          </h2>
          <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-lg">
            <FeaturedProjectsSlider />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            ℹ️ Instrucciones
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>✅ <strong>Proyectos Activos:</strong> Proyectos que se muestran en el slider (tienen id, name y no han expirado)</li>
            <li>⚠️ <strong>Con Problemas:</strong> Proyectos que no tienen id o name (no se muestran en el slider)</li>
            <li>❌ <strong>Expirados:</strong> Proyectos con fecha de fin pasada (no se muestran en el slider)</li>
            <li>🔗 <strong>Ver:</strong> Haz clic en "Ver →" para abrir la página de detalle de cada proyecto</li>
            <li>🎯 <strong>Slider:</strong> El slider muestra 3 proyectos por slide y rota automáticamente cada 5 segundos</li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            ← Volver a la página principal
          </a>
        </div>
      </div>
    </div>
  );
}

