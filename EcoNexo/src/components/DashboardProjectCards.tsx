"use client";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { PROJECTS } from "@/data/projects";

import EcoNexoLogo from "./EcoNexoLogo";

export default function DashboardProjectCards() {
  const { t, locale } = useI18n();

  // Get actual featured projects from PROJECTS data
  const featuredProjectIds = ["p1", "p2", "p3"];
  const featuredProjects = PROJECTS.filter(p => featuredProjectIds.includes(p.id));

  const projects = featuredProjects.map(project => {
    // Get localized name
    const title = locale === 'en' && project.name_en
      ? project.name_en
      : locale === 'de' && project.name_de
        ? project.name_de
        : project.name;

    // Get localized description
    const description = locale === 'en' && project.description_en
      ? project.description_en
      : locale === 'de' && project.description_de
        ? project.description_de
        : project.description || '';

    // Get location
    const location = `${project.city}, ${project.country}`;

    // Generate appropriate metric based on project
    let metric = '';
    if (project.id === 'p1') {
      // Reforestación Urbana Berlín
      metric = `2,500 ${t('treesPlanted') || 'trees planted'}`;
    } else if (project.id === 'p2') {
      // Taller de Robótica Educativa
      metric = locale === 'es' ? 'Talleres STEM' : locale === 'de' ? 'STEM-Workshops' : 'STEM Workshops';
    } else if (project.id === 'p3') {
      // Clínica móvil comunitaria
      metric = locale === 'es' ? 'Servicios de salud' : locale === 'de' ? 'Gesundheitsdienste' : 'Health Services';
    }

    // Generate volunteers count
    const volunteers = project.spots
      ? `${project.spots} ${t('volunteersLabel') || 'volunteers'}`
      : `50+ ${t('volunteersLabel') || 'volunteers'}`;

    return {
      id: project.id,
      title,
      description,
      location,
      metric,
      volunteers
    };
  });

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
              <EcoNexoLogo size={24} className="bg-white/20 p-1" />
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
                <EcoNexoLogo size={16} />
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
