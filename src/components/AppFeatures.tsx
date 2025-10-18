'use client';

import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  link: string;
  color: string;
}

export default function AppFeatures() {
  const { t, locale } = useI18n();

  const features: Feature[] = [
    {
      id: 'map',
      icon: '🗺️',
      title: t('sustainableProjectsMap'),
      description: locale === 'es' ? 'Explora proyectos sostenibles en el mapa interactivo de Europa' :
                   locale === 'de' ? 'Erkunden Sie nachhaltige Projekte auf der interaktiven Europakarte' :
                   'Explore sustainable projects on the interactive Europe map',
      link: '/',
      color: 'bg-green-500'
    },
    {
      id: 'events',
      icon: '📅',
      title: t('events'),
      description: locale === 'es' ? 'Descubre eventos ambientales y oportunidades de voluntariado' :
                   locale === 'de' ? 'Entdecken Sie Umweltveranstaltungen und Freiwilligenmöglichkeiten' :
                   'Discover environmental events and volunteer opportunities',
      link: '/eventos',
      color: 'bg-blue-500'
    },
    {
      id: 'jobs',
      icon: '💼',
      title: t('greenJobs'),
      description: locale === 'es' ? 'Encuentra trabajos verdes y oportunidades de carrera sostenible' :
                   locale === 'de' ? 'Finden Sie grüne Jobs und nachhaltige Karrieremöglichkeiten' :
                   'Find green jobs and sustainable career opportunities',
      link: '/trabajos',
      color: 'bg-purple-500'
    },
    {
      id: 'chat',
      icon: '💬',
      title: t('communityChat'),
      description: locale === 'es' ? 'Conecta con la comunidad ambiental y comparte ideas' :
                   locale === 'de' ? 'Verbinden Sie sich mit der Umweltgemeinschaft und teilen Sie Ideen' :
                   'Connect with the environmental community and share ideas',
      link: '/chat',
      color: 'bg-orange-500'
    },
    {
      id: 'profile',
      icon: '👤',
      title: t('profile'),
      description: locale === 'es' ? 'Gestiona tu perfil y proyectos guardados' :
                   locale === 'de' ? 'Verwalten Sie Ihr Profil und gespeicherte Projekte' :
                   'Manage your profile and saved projects',
      link: '/perfil',
      color: 'bg-pink-500'
    },
    {
      id: 'calendar',
      icon: '📆',
      title: t('calendar'),
      description: locale === 'es' ? 'Organiza tu calendario de eventos ambientales' :
                   locale === 'de' ? 'Organisieren Sie Ihren Kalender für Umweltveranstaltungen' :
                   'Organize your environmental events calendar',
      link: '/calendario',
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {locale === 'es' ? 'Características de EcoNexo' :
             locale === 'de' ? 'EcoNexo Funktionen' :
             'EcoNexo Features'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {locale === 'es' ? 'Descubre todas las herramientas que EcoNexo pone a tu disposición para construir un futuro más sostenible' :
             locale === 'de' ? 'Entdecken Sie alle Tools, die EcoNexo Ihnen zur Verfügung stellt, um eine nachhaltigere Zukunft aufzubauen' :
             'Discover all the tools EcoNexo puts at your disposal to build a more sustainable future'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={feature.link}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`${feature.color} rounded-lg p-3 text-white text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center text-green-600 text-sm font-medium group-hover:text-green-700">
                {locale === 'es' ? 'Explorar' :
                 locale === 'de' ? 'Erkunden' :
                 'Explore'}
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-green-50 rounded-xl p-8 border border-green-200">
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              {locale === 'es' ? '¿Listo para empezar?' :
               locale === 'de' ? 'Bereit anzufangen?' :
               'Ready to get started?'}
            </h3>
            <p className="text-green-700 mb-6">
              {locale === 'es' ? 'Únete a la comunidad EcoNexo y comienza a hacer la diferencia hoy mismo' :
               locale === 'de' ? 'Treten Sie der EcoNexo-Community bei und beginnen Sie noch heute, einen Unterschied zu machen' :
               'Join the EcoNexo community and start making a difference today'}
            </p>
            <Link
              href="/perfil"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              {locale === 'es' ? 'Crear Cuenta' :
               locale === 'de' ? 'Konto erstellen' :
               'Create Account'}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
