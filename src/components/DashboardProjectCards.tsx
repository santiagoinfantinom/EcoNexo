"use client";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function DashboardProjectCards() {
  const { t, locale } = useI18n();

  const projects = [
    {
      id: "p1",
      title: t('urbanReforestationBerlin'),
      description: t('urbanReforestationDesc'),
      location: t('locationBerlin'),
      metric: `2,500 ${t('treesPlanted')}`,
      volunteers: `150 ${t('volunteersLabel')}`
    },
    {
      id: "p2", 
      title: t('seineRiverCleanup'),
      description: t('seineRiverCleanupDesc'),
      location: t('locationParis'),
      metric: `5 ${t('wasteCollected')}`,
      volunteers: `200 ${t('volunteersLabel')}`
    },
    {
      id: "p3",
      title: t('communityGardensMadrid'),
      description: t('communityGardensDesc'),
      location: t('locationMadrid'),
      metric: `15 ${t('communityGardensActive')}`,
      volunteers: `80 ${t('volunteersLabel')}`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {projects.map((project) => (
        <Link 
          key={project.id} 
          href={`/projects/${project.id}`}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
        >
          {/* Header with icon */}
          <div className="bg-green-500 p-4 text-white">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <h3 className="text-lg font-bold">{project.title}</h3>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 bg-yellow-50 dark:bg-slate-700">
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
              {project.description}
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span>📍</span>
                <span>{project.location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                <span>🍃</span>
                <span>{project.metric}</span>
              </div>
              
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <span>👥</span>
                <span>{project.volunteers}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
