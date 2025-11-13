"use client";
import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import MatchingAgentChat from '@/components/MatchingAgentChat';
import { useRouter } from 'next/navigation';

export default function MatchingPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  const handleMatchClick = (match: any) => {
    // Navigate to project detail page
    router.push(`/projects/${match.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {locale === 'es'
              ? 'Asistente de Matching Inteligente'
              : locale === 'de'
              ? 'Intelligenter Matching-Assistent'
              : 'Intelligent Matching Assistant'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {locale === 'es'
              ? 'Encuentra proyectos que se ajusten perfectamente a tus intereses y preferencias'
              : locale === 'de'
              ? 'Finde Projekte, die perfekt zu deinen Interessen und Präferenzen passen'
              : 'Find projects that perfectly match your interests and preferences'}
          </p>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat */}
          <div className="lg:col-span-2">
            <MatchingAgentChat onMatchClick={handleMatchClick} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {locale === 'es'
                  ? 'Cómo funciona'
                  : locale === 'de'
                  ? 'Wie es funktioniert'
                  : 'How it works'}
              </h2>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>
                    {locale === 'es'
                      ? 'Describe qué tipo de proyectos te interesan'
                      : locale === 'de'
                      ? 'Beschreibe, welche Art von Projekten dich interessieren'
                      : 'Describe what type of projects interest you'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>
                    {locale === 'es'
                      ? 'El asistente analiza tu perfil y preferencias'
                      : locale === 'de'
                      ? 'Der Assistent analysiert dein Profil und deine Präferenzen'
                      : 'The assistant analyzes your profile and preferences'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>
                    {locale === 'es'
                      ? 'Recibe recomendaciones personalizadas con explicaciones'
                      : locale === 'de'
                      ? 'Erhalte personalisierte Empfehlungen mit Erklärungen'
                      : 'Receive personalized recommendations with explanations'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>
                    {locale === 'es'
                      ? 'Refina tu búsqueda basándote en feedback'
                      : locale === 'de'
                      ? 'Verfeinere deine Suche basierend auf Feedback'
                      : 'Refine your search based on feedback'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Tips Card */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                {locale === 'es' ? '💡 Consejos' : locale === 'de' ? '💡 Tipps' : '💡 Tips'}
              </h3>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-2">
                <li>
                  {locale === 'es'
                    ? '• Sé específico sobre ubicación y categorías'
                    : locale === 'de'
                    ? '• Sei spezifisch bezüglich Standort und Kategorien'
                    : '• Be specific about location and categories'}
                </li>
                <li>
                  {locale === 'es'
                    ? '• Menciona tus habilidades o experiencia'
                    : locale === 'de'
                    ? '• Erwähne deine Fähigkeiten oder Erfahrung'
                    : '• Mention your skills or experience'}
                </li>
                <li>
                  {locale === 'es'
                    ? '• Proporciona feedback para mejorar resultados'
                    : locale === 'de'
                    ? '• Gib Feedback, um Ergebnisse zu verbessern'
                    : '• Provide feedback to improve results'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

