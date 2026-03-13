"use client";
import { useState, useEffect } from "react";
import { useI18n, categoryLabel } from "@/lib/i18n";
import Link from "next/link";
import { PROJECTS } from "@/data/projects";
import { MapPin, Leaf, Users, Sprout, ChevronLeft, ChevronRight } from "lucide-react";
import { useSmartContext } from "@/context/SmartContext";
import { calculateMatchScore } from "@/lib/matching";
import ImageWithFallback from "@/components/ImageWithFallback";

export default function FeaturedProjectsSlider() {
  const { t, locale } = useI18n();
  const { preferences } = useSmartContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get active projects (filter out events that have ended)
  // Also ensure each project has required fields (id, name, image_url, description)
  const activeProjects = PROJECTS.filter(project => {
    // Validate required fields - each project must have at least id and name
    if (!project.id || !project.name) {
      console.warn(`Project missing required fields (id or name):`, project);
      return false;
    }

    // If project has end date and it's in the past, exclude it
    if (project.endsAt) {
      const endDate = new Date(project.endsAt);
      const now = new Date();
      if (endDate < now) return false;
    }
    // Include permanent projects and projects without end dates
    return project.isPermanent !== false;
  });

  // Format project function - must be defined before use
  const formatProject = (project: typeof activeProjects[0]) => {
    // Ensure project has all required fields
    if (!project.id || !project.name) {
      console.error('Invalid project in slider:', project);
      return null;
    }

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

    // Ensure location fields exist
    const city = project.city || '';
    const country = project.country || '';
    const location = city && country ? `${city}, ${country}` : city || country || '';

    // Generate appropriate metric based on project category
    let metric = '';
    const category = (project.category || '').toLowerCase();
    if (category.includes('medio ambiente') || category.includes('environment')) {
      metric = t('environmentalProject');
    } else if (category.includes('educación') || category.includes('education')) {
      metric = t('educationalProject');
    } else if (category.includes('salud') || category.includes('health')) {
      metric = t('healthServices');
    } else if (category.includes('comunidad') || category.includes('community')) {
      metric = t('communityProject');
    } else if (category.includes('alimentación') || category.includes('food')) {
      metric = t('foodProject');
    } else {
      metric = t('activeProject');
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
      image_url: project.image_url,
      category: project.category
    };
  };

  // Show 1 project at a time, rotate through all active projects
  const projectsPerView = 1;
  // Format all projects first to filter out invalid ones, then calculate slides
  const validFormattedProjects = activeProjects
    .map(p => {
      const hasPreferences = preferences.selectedCategories.length > 0 || preferences.selectedSkills.length > 0;
      return { project: p, score: hasPreferences ? calculateMatchScore(p, preferences) : 0 };
    })
    .sort((a, b) => b.score - a.score)
    .map(ps => ps.project)
    .map(formatProject)
    .filter((project): project is NonNullable<ReturnType<typeof formatProject>> => project !== null);
  const totalSlides = Math.max(1, Math.ceil(validFormattedProjects.length / projectsPerView));

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

  // Get projects for current slide (already formatted and validated)
  const getCurrentProjects = () => {
    const start = currentIndex * projectsPerView;
    return validFormattedProjects.slice(start, start + projectsPerView);
  };

  const currentProjects = getCurrentProjects();

  return (
    <div className="relative">
      {/* Slider Container */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {Array.from({ length: totalSlides }).map((_, slideIndex) => {
            const slideProjects = validFormattedProjects
              .slice(slideIndex * projectsPerView, (slideIndex + 1) * projectsPerView);

            // Skip empty slides
            if (slideProjects.length === 0) return null;

            return (
              <div
                key={slideIndex}
                className="min-w-full flex justify-center px-2 flex-shrink-0"
              >
                {slideProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 hover-lift border border-gray-200 dark:border-slate-700 group max-w-md w-full"
                  >
                    {/* Project Image - Always show image with fallback */}
                    <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 relative flex items-center justify-center">
                      <ImageWithFallback
                        src={project.image_url || '/assets/default-event.png'}
                        alt={project.title}
                        category={project.category}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Header with icon */}
                    <div className="bg-green-500 p-4 text-white">
                      <div className="flex items-center gap-2">
                        <Sprout className="w-6 h-6" />
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
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{project.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                          <Leaf className="w-4 h-4" />
                          <span>{project.metric}</span>
                        </div>

                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <Users className="w-4 h-4" />
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
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-slate-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover-lift z-10 border border-gray-200 dark:border-slate-700 group"
            aria-label="Previous projects"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-green-600 transition-colors" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-slate-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover-lift z-10 border border-gray-200 dark:border-slate-700 group"
            aria-label="Next projects"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-green-600 transition-colors" />
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
              className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
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
          ? `Mostrando ${currentProjects.length} de ${validFormattedProjects.length} proyectos activos`
          : locale === 'de'
            ? `${currentProjects.length} von ${validFormattedProjects.length} aktiven Projekten angezeigt`
            : `Showing ${currentProjects.length} of ${validFormattedProjects.length} active projects`
        }
      </div>
    </div>
  );
}

