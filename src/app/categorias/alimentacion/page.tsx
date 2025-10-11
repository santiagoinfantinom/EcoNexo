"use client";
import React from 'react';
import { useI18n } from '@/lib/i18n';
import { categoryProjects } from '@/lib/categoryProjects';
import Link from 'next/link';

export default function AlimentacionPage() {
  const { t, locale } = useI18n();
  const projects = categoryProjects['Alimentación'];

  return (
    <div className="min-h-screen bg-gls-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gls-secondary mb-4">
            {locale === 'es' ? 'Alimentación' : locale === 'de' ? 'Ernährung' : 'Food'}
          </h1>
          <p className="text-xl text-gls-secondary opacity-90 max-w-3xl mx-auto">
            {locale === 'es' 
              ? 'Proyectos que promueven la alimentación sostenible, agricultura local y reducción del desperdicio alimentario.'
              : locale === 'de'
              ? 'Projekte zur Förderung nachhaltiger Ernährung, lokaler Landwirtschaft und Reduzierung von Lebensmittelverschwendung.'
              : 'Projects that promote sustainable food, local agriculture and food waste reduction.'
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gls-secondary rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-gls-primary mb-2">{projects.length}</div>
            <div className="text-gls-primary opacity-80">{t('activeProjects')}</div>
          </div>
          <div className="bg-gls-secondary rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-gls-primary mb-2">
              {projects.reduce((sum, p) => sum + (p.volunteers || 0), 0)}
            </div>
            <div className="text-gls-primary opacity-80">{t('connectedVolunteers')}</div>
          </div>
          <div className="bg-gls-secondary rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-gls-primary mb-2">
              {projects.reduce((sum, p) => sum + (p.spots || 0), 0)}
            </div>
            <div className="text-gls-primary opacity-80">{t('availableSpots')}</div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-gls-secondary rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Project Image */}
              <div className="h-48 bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center">
                <div className="text-white text-6xl">🌾</div>
              </div>
              
              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gls-primary mb-2">{project.title}</h3>
                <p className="text-gls-primary opacity-80 mb-4 text-sm">{project.description}</p>
                
                {/* Location */}
                <div className="flex items-center text-gls-primary opacity-70 text-sm mb-3">
                  <span className="mr-2">📍</span>
                  <span>{project.location}</span>
                </div>
                
                {/* Impact */}
                <div className="flex items-center text-lime-600 text-sm mb-4">
                  <span className="mr-2">🎯</span>
                  <span className="font-medium">{project.impact}</span>
                </div>
                
                {/* Stats */}
                <div className="flex justify-between text-sm text-gls-primary opacity-70 mb-4">
                  <span>👥 {project.volunteers} voluntarios</span>
                  <span>🆓 {project.spots} cupos</span>
                </div>
                
                {/* Action Button */}
                <Link 
                  href={`/projects/${project.id}`}
                  className="w-full btn-gls-primary text-center block py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  {t('viewDetails')}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="btn-gls-secondary px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            {t('backToMap')}
          </Link>
        </div>
      </div>
    </div>
  );
}
