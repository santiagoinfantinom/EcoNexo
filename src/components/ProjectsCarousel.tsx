"use client";
import { useRef, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { PROJECTS } from "@/data/projects";
import { ensureEventImage } from "@/lib/eventImages";

export default function ProjectsCarousel() {
  const { t, locale } = useI18n();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Get active projects
  const activeProjects = PROJECTS.filter(project => {
    if (project.endsAt) {
      const endDate = new Date(project.endsAt);
      const now = new Date();
      if (endDate < now) return false;
    }
    return project.isPermanent !== false;
  }).slice(0, 12); // Limit to 12 projects for carousel

  const getProjectName = (project: typeof PROJECTS[0]) => {
    if (locale === 'en' && project.name_en) return project.name_en;
    if (locale === 'de' && project.name_de) return project.name_de;
    return project.name;
  };

  const getProjectDescription = (project: typeof PROJECTS[0]) => {
    if (locale === 'en' && project.description_en) return project.description_en;
    if (locale === 'de' && project.description_de) return project.description_de;
    return project.description || '';
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      });
    }
  };

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gls-primary">
          {locale === 'es'
            ? 'Proyectos Destacados'
            : locale === 'de'
            ? 'Ausgewählte Projekte'
            : 'Featured Projects'}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-gls-primary flex items-center justify-center transition-colors"
            aria-label={locale === 'es' ? 'Anterior' : locale === 'de' ? 'Vorherige' : 'Previous'}
          >
            ←
          </button>
          <button
            onClick={scrollRight}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-gls-primary flex items-center justify-center transition-colors"
            aria-label={locale === 'es' ? 'Siguiente' : locale === 'de' ? 'Nächste' : 'Next'}
          >
            →
          </button>
        </div>
      </div>

      {/* Scrollable Carousel */}
      <div
        ref={scrollContainerRef}
        className={`flex gap-4 overflow-x-auto pb-4 scroll-smooth hide-scrollbar ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } select-none`}
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {activeProjects.map((project) => {
          const imageSrc = ensureEventImage({
            image_url: project.image_url,
            category: project.category,
            website: project.info_url
          });

          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex-shrink-0 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 hover-lift group"
            >
              {/* Project Image */}
              <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800">
                {project.image_url ? (
                  <img
                    src={imageSrc}
                    alt={getProjectName(project)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🌿
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2 flex-1">
                    {getProjectName(project)}
                  </h4>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {getProjectDescription(project)}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    📍 {project.city}, {project.country}
                  </span>
                  {project.spots && (
                    <span className="flex items-center gap-1">
                      👥 {project.spots}
                    </span>
                  )}
                </div>

                {/* Category Badge */}
                <div className="mt-3">
                  <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-full text-xs font-medium">
                    {project.category}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}

