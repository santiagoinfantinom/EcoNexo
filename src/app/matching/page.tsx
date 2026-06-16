"use client";
import React, { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import MatchingAgentChat from '@/components/MatchingAgentChat';
import { useRouter } from 'next/navigation';
import { useSmartContext } from '@/context/SmartContext';
import { PROJECTS } from '@/data/projects';
import { buildCandidateMatches, buildIntelligentProjectMatches, MatchCandidate } from '@/lib/matching';

// URL de tu supercerebro en Hugging Face
const IA_API_URL = "https://santiagoinfantinomoreno-api-econexo.hf.space/match-jobs";

const MOCK_CANDIDATES: MatchCandidate[] = [
  {
    id: 'c1',
    name: 'Laura Méndez',
    city: 'Madrid',
    role: 'Community Organizer',
    skills: ['social', 'teaching', 'gardening'],
    causes: ['Comunidad', 'Alimentación'],
    availability: 'weekends',
  },
  {
    id: 'c2',
    name: 'Jonas Weber',
    city: 'Berlín',
    role: 'Climate Data Analyst',
    skills: ['tech', 'manual'],
    causes: ['Medio ambiente', 'Tecnología'],
    availability: 'flexible',
  },
  {
    id: 'c3',
    name: 'Sofía Ríos',
    city: 'Barcelona',
    role: 'Education Facilitator',
    skills: ['teaching', 'social', 'art'],
    causes: ['Educación', 'Comunidad'],
    availability: 'part-time',
  },
  {
    id: 'c4',
    name: 'Marco Costa',
    city: 'Milán',
    role: 'Ocean Action Volunteer',
    skills: ['manual', 'social', 'gardening'],
    causes: ['Océanos', 'Medio ambiente'],
    availability: 'weekends',
  },
];

export default function MatchingPage() {
  const { locale } = useI18n();
  const router = useRouter();
  const { preferences } = useSmartContext();
  
  // Estados para controlar el cálculo en tiempo real con la IA
  const [jobMatches, setJobMatches] = useState<any[]>([]);
  const [loadingIA, setLoadingIA] = useState(false);

  const intelligentProjectMatches = buildIntelligentProjectMatches(PROJECTS, preferences);
  const peopleMatches = buildCandidateMatches(MOCK_CANDIDATES, preferences, 'Madrid');

  // EFECTO 1: Consulta en tiempo real al modelo Transformers en Hugging Face
  useEffect(() => {
    async function consultarMatchIA() {
      if (!preferences || loadingIA) return;
      
      try {
        setLoadingIA(true);
        
        // Estructuramos el perfil según lo que espera recibir el backend en Python
        const perfilUsuario = {
          areas: preferences.selectedCategories?.join(", ") || "Sostenibilidad",
          experienceYears: 2.0, // Valor base; se puede vincular a un slider del usuario más adelante
          jobs: PROJECTS.map(p => ({
            id: p.id,
            title: { es: p.name, en: p.name },
            description: { es: p.description || "", en: p.description || "" },
            knowledgeAreas: { es: p.tags || [], en: p.tags || [] },
            experienceYears: 1.0
          }))
        };

        const response = await fetch(IA_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(perfilUsuario)
        });

        if (response.ok) {
          const data = await response.json();
          setJobMatches(data.matches || []);
        }
      } catch (error) {
        console.error("Error conectando con el servidor de IA de Hugging Face:", error);
      } finally {
        setLoadingIA(false);
      }
    }

    consultarMatchIA();
  }, [preferences]);

  // EFECTO 2: Refresh preventivo del sistema
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const FLAG = 'econexo:matching-refresh:v1';
    if (sessionStorage.getItem(FLAG)) return;
    sessionStorage.setItem(FLAG, 'done');
    router.refresh();
  }, [router]);

  const handleMatchClick = (match: any) => {
    const applyLink = match.links?.apply || match.apply_url;
    const websiteLink = match.links?.website;
    const targetLink = match.type === 'job' ? applyLink || websiteLink : websiteLink;

    if (typeof targetLink === 'string' && targetLink.startsWith('http')) {
      window.open(targetLink, '_blank', 'noopener,noreferrer');
      return;
    }

    if (match.type === 'project') {
      router.push(`/projects/${match.id}`);
      return;
    }

    const fallbackQuery = encodeURIComponent(match?.name || match?.company || '');
    const jobsRoute = fallbackQuery ? `/trabajos?q=${fallbackQuery}` : '/trabajos';
    router.push(jobsRoute);
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
                {locale === 'es' ? 'Cómo funciona' : locale === 'de' ? 'Wie es funktioniert' : 'How it works'}
              </h2>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>{locale === 'es' ? 'Describe qué tipo de proyectos te interesan' : 'Describe what type of projects interest you'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>{locale === 'es' ? 'La IA analiza semánticamente tus competencias reales' : 'The AI semantically analyzes your real skills'}</span>
                </li>
              </ul>
            </div>

            {/* Panel de Match de Proyectos por IA */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                {locale === 'es' ? '🚀 Matchmaking con IA en Tiempo Real' : '🚀 Real-time AI Matchmaking'}
              </h3>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {locale === 'es' ? 'Proyectos recomendados por Red Neuronal' : 'Projects recommended by Neural Network'}
                </p>
                
                {loadingIA ? (
                  <p className="text-xs text-slate-400 animate-pulse">Calculando similitud semántica con Hugging Face...</p>
                ) : jobMatches.length > 0 ? (
                  jobMatches.slice(0, 3).map((match) => {
                    const projectData = PROJECTS.find(p => p.id === match.id);
                    if (!projectData) return null;
                    return (
                      <button
                        key={match.id}
                        type="button"
                        onClick={() => router.push(`/projects/${match.id}`)}
                        className="w-full text-left rounded-lg border border-green-200 dark:border-green-900/40 p-3 bg-green-50/30 dark:bg-green-900/10 hover:bg-green-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <p className="font-medium text-slate-900 dark:text-white">{projectData.name}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                          {match.match}% de coincidencia IA · {projectData.city}
                        </p>
                      </button>
                    );
                  })
                ) : (
                  // Respaldo estático si la IA está cargando o apagada
                  intelligentProjectMatches.slice(0, 3).map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => router.push(`/projects/${project.id}`)}
                      className="w-full text-left rounded-lg border border-slate-200 dark:border-slate-700 p-3 hover:bg-slate-50 transition-colors"
                    >
                      <p className="font-medium text-slate-900 dark:text-white">{project.name}</p>
                      <p className="text-xs text-slate-500">{project.recommendationScore}% match · {project.city}</p>
                    </button>
                  ))
                )}
              </div>

              {/* Colaboradores Recomendados */}
              <div className="mt-5 space-y-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {locale === 'es' ? 'Personas para colaborar' : 'People to collaborate with'}
                </p>
                {peopleMatches.map((person) => (
                  <div key={person.id} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                    <p className="font-medium text-slate-900 dark:text-white">{person.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{person.role} · {person.city}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {person.matchScore}% match · {person.sharedSkills.join(', ') || 'skills base'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}