"use client";
import React from 'react';
import { useI18n } from '@/lib/i18n';
import { categoryProjects } from '@/lib/categoryProjects';
import CategoryImage from '@/components/CategoryImage';
import Link from 'next/link';

export default function MedioAmbientePage() {
  const { t, locale } = useI18n();
  const projects = categoryProjects['Medio ambiente'];

  return (
    <div className="min-h-screen bg-gls-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gls-secondary mb-4">
            {locale === 'es' ? 'Medio Ambiente' : locale === 'de' ? 'Umwelt' : 'Environment'}
          </h1>
          <p className="text-xl text-gls-secondary opacity-90 max-w-3xl mx-auto">
            {locale === 'es' 
              ? 'Proyectos dedicados a la protección del medio ambiente, conservación de la biodiversidad y lucha contra el cambio climático.'
              : locale === 'de'
              ? 'Projekte zur Umweltschutz, Erhaltung der biologischen Vielfalt und Bekämpfung des Klimawandels.'
              : 'Projects dedicated to environmental protection, biodiversity conservation and climate change mitigation.'
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-black rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">{projects.length}</div>
            <div className="text-white opacity-80">{t('activeProjects')}</div>
          </div>
          <div className="bg-black rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {projects.reduce((sum, p) => sum + (p.volunteers || 0), 0)}
            </div>
            <div className="text-white opacity-80">{t('connectedVolunteers')}</div>
          </div>
          <div className="bg-black rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {projects.reduce((sum, p) => sum + (p.spots || 0), 0)}
            </div>
            <div className="text-white opacity-80">{t('availableSpots')}</div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-gls-secondary rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Project Image */}
              <div className="h-48 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <div className="text-white text-6xl">🌱</div>
              </div>
              
              {/* Project Content */}
              <div className="p-6 bg-black">
                <h3 className="text-xl font-bold text-white mb-2">{project.title[locale]}</h3>
                <p className="text-white opacity-80 mb-4 text-sm">{project.description[locale]}</p>
                
                {/* Location */}
                <div className="flex items-center text-white opacity-70 text-sm mb-3">
                  <span className="mr-2">📍</span>
                  <span>{project.location[locale]}</span>
                </div>
                
                {/* Impact */}
                <div className="flex items-center text-emerald-400 text-sm mb-4">
                  <span className="mr-2">🎯</span>
                  <span className="font-medium">{project.impact[locale]}</span>
                </div>
                
                {/* Stats */}
                <div className="flex justify-between text-sm text-white opacity-70 mb-4">
                  <span>👥 {project.volunteers} {locale === 'es' ? 'voluntarios' : locale === 'de' ? 'Freiwillige' : 'volunteers'}</span>
                  <span>🆓 {project.spots} {locale === 'es' ? 'cupos' : locale === 'de' ? 'Plätze' : 'spots'}</span>
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
