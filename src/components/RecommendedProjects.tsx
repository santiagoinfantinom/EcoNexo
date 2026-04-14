"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSmartContext } from '@/context/SmartContext';
import { FeedProject, getFeedProjects } from '@/lib/matching';
import { PROJECTS } from '@/data/projects';
import Link from 'next/link';
import { useI18n, categoryLabel } from '@/lib/i18n';
import ImageWithFallback from '@/components/ImageWithFallback';
import { trackEvent } from '@/lib/analytics';

const FEEDBACK_KEY = 'econexo-feed-feedback';
const FEED_SESSION_KEY = 'econexo-feed-session-id';

export default function RecommendedProjects() {
  const { preferences } = useSmartContext();
  const { locale } = useI18n();
  const [feedback, setFeedback] = useState<Record<string, -1 | 0 | 1>>({});
  const [feedSessionId, setFeedSessionId] = useState<string>('');
  const trackedSectionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    try {
      const rawValue = localStorage.getItem(FEEDBACK_KEY);
      if (rawValue) {
        setFeedback(JSON.parse(rawValue));
      }
    } catch (error) {
      console.error('Cannot load feed feedback', error);
    }
  }, []);

  useEffect(() => {
    try {
      const existingSessionId = sessionStorage.getItem(FEED_SESSION_KEY);
      if (existingSessionId) {
        setFeedSessionId(existingSessionId);
        return;
      }
      const generatedSessionId = `feed_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(FEED_SESSION_KEY, generatedSessionId);
      setFeedSessionId(generatedSessionId);
    } catch {
      setFeedSessionId(`feed_fallback_${Date.now()}`);
    }
  }, []);

  const feed = useMemo(() => getFeedProjects(PROJECTS, preferences, feedback), [feedback, preferences]);

  const forYou = feed.slice(0, 4);
  const nearby = [...feed]
    .filter((project) => project.distanceKm <= 400)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 4);
  const trending = [...feed]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 4);

  const setProjectFeedback = (projectId: string, value: -1 | 1) => {
    const safeSessionId = feedSessionId || 'feed_unknown_session';
    setFeedback((prev) => {
      const next = { ...prev, [projectId]: value };
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(next));
      trackEvent(value === 1 ? 'feed_feedback_positive' : 'feed_feedback_negative', {
        projectId,
        session_id: safeSessionId,
        ts: Date.now(),
      });
      return next;
    });
  };

  useEffect(() => {
    if (!feedSessionId) return;
    const sections = [
      { key: 'for_you', count: forYou.length },
      { key: 'near_you', count: nearby.length > 0 ? nearby.length : forYou.length },
      { key: 'green_trends', count: trending.length },
    ];

    sections.forEach((section) => {
      if (section.count > 0 && !trackedSectionsRef.current.has(section.key)) {
        trackEvent('feed_section_view', {
          section: section.key,
          items: section.count,
          session_id: feedSessionId,
          ts: Date.now(),
        });
        trackedSectionsRef.current.add(section.key);
      }
    });
  }, [feedSessionId, forYou.length, nearby.length, trending.length]);

  const sectionTitle = (key: 'forYou' | 'nearby' | 'trending') => {
    if (locale === 'de') {
      if (key === 'forYou') return 'Für dich';
      if (key === 'nearby') return 'In deiner Nähe';
      return 'Grüne Trends';
    }
    if (locale === 'en') {
      if (key === 'forYou') return 'For You';
      if (key === 'nearby') return 'Near You';
      return 'Green Trends';
    }
    if (key === 'forYou') return 'Para ti';
    if (key === 'nearby') return 'Cerca de ti';
    return 'Tendencias verdes';
  };

  const renderCard = (project: FeedProject) => (
    <div
      key={`${project.id}-${project.recommendationScore}`}
      className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all p-5 border border-green-100 dark:border-slate-700 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
        {project.recommendationScore}% Match
      </div>

      <Link
        href={`/projects/${project.id}`}
        className="block"
        onClick={() =>
          trackEvent('feed_click', {
            projectId: project.id,
            section: 'feed_card',
            score: project.recommendationScore,
            session_id: feedSessionId || 'feed_unknown_session',
            ts: Date.now(),
          })
        }
      >
        <div className="h-36 -mx-5 -mt-5 mb-4 overflow-hidden relative">
          <ImageWithFallback
            src={project.image_url || '/assets/default-event.png'}
            alt={project.name}
            category={project.category}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <span className="text-white font-medium text-sm">{project.city}</span>
          </div>
        </div>

        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2 line-clamp-1">
          {locale === 'en' ? project.name_en : locale === 'de' ? project.name_de : project.name}
        </h3>
      </Link>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-xs">
          {categoryLabel(project.category, locale)}
        </span>
        <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded text-xs">
          {Math.round(project.distanceKm)} km
        </span>
        <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded text-xs">
          {project.likes} likes · {project.comments} comentarios
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setProjectFeedback(project.id, 1)}
          className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
            feedback[project.id] === 1
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {locale === 'en' ? 'More like this' : locale === 'de' ? 'Mehr davon' : 'Más como esto'}
        </button>
        <button
          type="button"
          onClick={() => setProjectFeedback(project.id, -1)}
          className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
            feedback[project.id] === -1
              ? 'bg-rose-600 text-white border-rose-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {locale === 'en' ? 'Less like this' : locale === 'de' ? 'Weniger davon' : 'Menos como esto'}
        </button>
      </div>
    </div>
  );

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border-y border-green-100 dark:border-slate-700">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            {locale === 'en' ? 'Personalized Feed' : locale === 'de' ? 'Personalisierter Feed' : 'Feed personalizado'}
          </h2>
          <span className="text-xs md:text-sm rounded-full px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            KPI objetivo: +20% clics feed · +10% sesiones repetidas (2-3 semanas)
          </span>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">{sectionTitle('forYou')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">{forYou.map(renderCard)}</div>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">{sectionTitle('nearby')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {(nearby.length > 0 ? nearby : forYou).map(renderCard)}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">{sectionTitle('trending')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">{trending.map(renderCard)}</div>
        </div>
      </div>
    </section>
  );
}
