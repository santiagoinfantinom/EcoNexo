"use client";
import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useParams } from "next/navigation";
import { FORUM_TOPICS } from "@/data/forumTopics";

export default function ForumTopicPage() {
  const { t, locale } = useI18n();
  const params = useParams();
  const topicId = (params as any)?.id;
  const topic = FORUM_TOPICS.find((item) => item.id === topicId);

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold mb-4">{locale === 'es' ? 'Tema no encontrado' : locale === 'de' ? 'Thema nicht gefunden' : 'Topic not found'}</h1>
          <p className="text-slate-300 mb-6">
            {locale === 'es'
              ? 'Este tema ya no está disponible. Regresa al foro para ver otros temas.'
              : locale === 'de'
                ? 'Dieses Thema ist nicht mehr verfügbar. Kehre zum Forum zurück, um andere Themen anzusehen.'
                : 'This topic is no longer available. Return to the forum to see other topics.'}
          </p>
          <Link href="/foros" className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors">
            {locale === 'es' ? 'Volver al Foro' : locale === 'de' ? 'Zurück zum Forum' : 'Back to Forum'}
          </Link>
        </div>
      </div>
    );
  }

  const getTitle = () => {
    if (locale === "en") return topic.title_en;
    if (locale === "de") return topic.title_de;
    return topic.title_es;
  };

  const getDescription = () => {
    if (locale === "en") return topic.description_en;
    if (locale === "de") return topic.description_de;
    return topic.description_es;
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/foros" className="text-slate-300 hover:text-white text-sm font-semibold">
            {locale === 'es' ? '← Volver al Foro' : locale === 'de' ? '← Zurück zum Forum' : '← Back to Forum'}
          </Link>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/15 px-4 py-2 text-emerald-200 text-xs font-bold uppercase tracking-wide mb-4">
            {topic.category}
          </span>
          <h1 className="text-4xl font-black mb-4">{getTitle()}</h1>
          <p className="text-lg text-slate-300 mb-8">{getDescription()}</p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <p className="text-sm uppercase text-slate-400 mb-2">{locale === 'es' ? 'Publicaciones' : locale === 'de' ? 'Beiträge' : 'Posts'}</p>
              <p className="text-3xl font-bold">{topic.posts}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <p className="text-sm uppercase text-slate-400 mb-2">{locale === 'es' ? 'Participantes' : locale === 'de' ? 'Teilnehmer' : 'Participants'}</p>
              <p className="text-3xl font-bold">{topic.participants}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <p className="text-sm uppercase text-slate-400 mb-2">{locale === 'es' ? 'Última actividad' : locale === 'de' ? 'Letzte Aktivität' : 'Last activity'}</p>
              <p className="text-3xl font-bold">{topic.lastActivity}</p>
            </div>
          </div>

          <div className="mt-10 space-y-4 text-slate-200">
            <p>{locale === 'es'
              ? 'Únete a la conversación cambiando al tema correspondiente en el chat de la comunidad.'
              : locale === 'de'
                ? 'Treten Sie dem Gespräch bei, indem Sie das entsprechende Thema im Community-Chat auswählen.'
                : 'Join the conversation by switching to the corresponding topic in the community chat.'}</p>
            <p>{locale === 'es'
              ? 'Estos temas están diseñados para ayudarte a compartir experiencias, aprender y colaborar en soluciones sostenibles.'
              : locale === 'de'
                ? 'Diese Themen sollen Ihnen helfen, Erfahrungen auszutauschen, zu lernen und an nachhaltigen Lösungen zusammenzuarbeiten.'
                : 'These topics are designed to help you share experiences, learn, and collaborate on sustainable solutions.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
