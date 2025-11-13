"use client";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { PROJECTS } from "@/data/projects";

export default function FeaturedProjectsSlider() {
  const { t, locale } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get active projects (filter out events that have ended)
  const activeProjects = PROJECTS.filter(project => {
    // If project has end date and it's in the past, exclude it
    if (project.endsAt) {
      const endDate = new Date(project.endsAt);
      const now = new Date();
      if (endDate < now) return false;
    }
    // Include permanent projects and projects without end dates
    return project.isPermanent !== false;
  });

  // Show 3 projects at a time, rotate through all active projects
  const projectsPerView = 3;
  const totalSlides = Math.ceil(activeProjects.length / projectsPerView);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Get projects for current slide
  const getCurrentProjects = () => {
    const start = currentIndex * projectsPerView;
    return activeProjects.slice(start, start + projectsPerView);
  };

  const formatProject = (project: typeof activeProjects[0]) => {
    const title = locale === 'en' && project.name_en 
      ? project.name_en 
      : locale === 'de' && project.name_de 
      ? project.name_de 
      : project.name;
    
    const description = locale === 'en' && project.description_en 
      ? project.description_en 
      : locale === 'de' && project.description_de 
      ? project.description_de 
      : project.description || '';
    
    const location = `${project.city}, ${project.country}`;
    
    // Generate appropriate metric based on project category
    let metric = '';
    const category = project.category.toLowerCase();
    if (category.includes('medio ambiente') || category.includes('environment')) {
      metric = locale === 'es' ? 'Proyecto ambiental' : locale === 'de' ? 'Umweltprojekt' : 'Environmental project';
    } else if (category.includes('educación') || category.includes('education')) {
      metric = locale === 'es' ? 'Proyecto educativo' : locale === 'de' ? 'Bildungsprojekt' : 'Educational project';
    } else if (category.includes('salud') || category.includes('health')) {
      metric = locale === 'es' ? 'Servicios de salud' : locale === 'de' ? 'Gesundheitsdienste' : 'Health services';
    } else if (category.includes('comunidad') || category.includes('community')) {
      metric = locale === 'es' ? 'Proyecto comunitario' : locale === 'de' ? 'Gemeinschaftsprojekt' : 'Community project';
    } else if (category.includes('alimentación') || category.includes('food')) {
      metric = locale === 'es' ? 'Proyecto alimentario' : locale === 'de' ? 'Ernährungsprojekt' : 'Food project';
    } else {
      metric = locale === 'es' ? 'Proyecto activo' : locale === 'de' ? 'Aktives Projekt' : 'Active project';
    }
    
    const volunteers = project.spots 
      ? `${project.spots} ${t('volunteersLabel') || 'volunteers'}`
      : `50+ ${t('volunteersLabel') || 'volunteers'}`;
    
    return {
      id: project.id,
      title,
      description,
      location,
      metric,
      volunteers,
      image_url: project.image_url
    };
  };

  const currentProjects = getCurrentProjects().map(formatProject);

  return (
    <div className="relative">
      {/* Slider Container */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {Array.from({ length: totalSlides }).map((_, slideIndex) => {
            const slideProjects = activeProjects
              .slice(slideIndex * projectsPerView, (slideIndex + 1) * projectsPerView)
              .map(formatProject);
            
            return (
              <div
                key={slideIndex}
                className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-6 px-2 flex-shrink-0"
              >
                {slideProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 hover-lift border border-gray-200 dark:border-slate-700"
                  >
                    {/* Project Image - Always show image with fallback */}
                    <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback to gradient background if image fails to load
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl opacity-50">🌱</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Header with icon */}
                    <div className="bg-green-500 p-4 text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🌱</span>
                        <h3 className="text-lg font-bold line-clamp-2">{project.title}</h3>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 bg-yellow-50 dark:bg-slate-700">
                      <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <span>📍</span>
                          <span className="line-clamp-1">{project.location}</span>
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
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-slate-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover-lift z-10 border border-gray-200 dark:border-slate-700"
            aria-label="Previous projects"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-slate-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover-lift z-10 border border-gray-200 dark:border-slate-700"
            aria-label="Next projects"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-green-600'
                  : 'w-2 bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Project Counter */}
      <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        {locale === 'es' 
          ? `Mostrando ${currentProjects.length} de ${activeProjects.length} proyectos activos`
          : locale === 'de'
          ? `${currentProjects.length} von ${activeProjects.length} aktiven Projekten angezeigt`
          : `Showing ${currentProjects.length} of ${activeProjects.length} active projects`
        }
      </div>
    </div>
  );
}

