'use client';

import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Trophy, Calendar, CheckCircle2, TrendingUp, Users, Award, ShieldCheck, Flame, Zap } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  participants: number;
  daysRemaining: number;
  category: string;
  status: 'active' | 'joined' | 'completed';
  icon: string;
}

export default function RetosPage() {
  const { locale } = useI18n();

  const t = (es: string, de: string, en: string) =>
    locale === 'es' ? es : locale === 'de' ? de : en;

  const [joinedCount, setJoinedCount] = useState(2);

  const challenges: Challenge[] = [
    {
      id: '1',
      title: t('30 Días sin Plástico de un Solo Uso', '30 Tage ohne Einwegplastik', '30 Days Without Single-Use Plastic'),
      description: t('Evita botellas, cubiertos y bolsas de plástico durante un mes completo.', 'Vermeide einen Monat lang Plastikflaschen, Besteck und Tüten.', 'Avoid plastic bottles, cutlery, and bags for a full month.'),
      points: 500,
      participants: 1245,
      daysRemaining: 12,
      category: t('Residuos', 'Abfall', 'Waste'),
      status: 'joined',
      icon: '🚫',
    },
    {
      id: '2',
      title: t('Semana de Dieta Basada en Plantas', 'Pflanzenbasierte Diätwoche', 'Plant-Based Diet Week'),
      description: t('Reduce tu impacto comiendo solo vegetales y legumbres durante 7 días.', 'Reduziere deinen Einfluss, indem du 7 Tage lang nur Gemüse und Hülsenfrüchte isst.', 'Reduce your impact by eating only vegetables and legumes for 7 days.'),
      points: 350,
      participants: 856,
      daysRemaining: 5,
      category: t('Alimentación', 'Ernährung', 'Food'),
      status: 'active',
      icon: '🥗',
    },
    {
      id: '3',
      title: t('Transporte Sostenible: 0 km en Coche', 'Nachhaltiger Transport: 0 km im Auto', 'Sustainable Transport: 0 km by Car'),
      description: t('Usa solo bici, transporte público o camina para todos tus desplazamientos.', 'Nutze nur Fahrrad, ÖPNV oder gehe zu Fuß für alle deine Wege.', 'Use only bike, public transport, or walk for all your travels.'),
      points: 400,
      participants: 2103,
      daysRemaining: 18,
      category: t('Movilidad', 'Mobilität', 'Mobility'),
      status: 'joined',
      icon: '🚲',
    },
    {
      id: '4',
      title: t('Apagón Digital Nocturno', 'Nächtlicher digitaler Blackout', 'Nightly Digital Blackout'),
      description: t('Apaga todos los dispositivos electrónicos antes de las 10 PM durante 10 días.', 'Schalte 10 Tage lang alle elektronischen Geräte vor 22 Uhr aus.', 'Turn off all electronic devices before 10 PM for 10 days.'),
      points: 200,
      participants: 567,
      daysRemaining: 22,
      category: t('Energía', 'Energie', 'Energy'),
      status: 'active',
      icon: '🔌',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> {t('Volver al inicio', 'Zurück zur Startseite', 'Back to home')}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
              <Trophy className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {t('Retos Mensuales', 'Monatliche Challenges', 'Monthly Challenges')}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {t('Supera desafíos, gana puntos y mejora el planeta', 'Meistere Challenges, sammle Punkte und verbessere den Planeten', 'Overcome challenges, earn points, and improve the planet')}
              </p>
            </div>
          </div>
        </div>

        {/* User Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-b-4 border-indigo-500 relative overflow-hidden group">
            <Flame className="absolute -right-4 -bottom-4 w-24 h-24 text-indigo-50 dark:text-gray-700 opacity-50 group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg"><Zap className="w-6 h-6 text-indigo-600" /></div>
              <span className="font-bold text-gray-700 dark:text-gray-200">Racha actual</span>
            </div>
            <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">12 {t('días', 'Tage', 'days')}</div>
            <p className="text-xs text-gray-400 font-medium">Top 5% de la comunidad</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-b-4 border-emerald-500 relative overflow-hidden group">
            <Award className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-50 dark:text-gray-700 opacity-50 group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/40 rounded-lg"><Trophy className="w-6 h-6 text-emerald-600" /></div>
              <span className="font-bold text-gray-700 dark:text-gray-200">Impacto total</span>
            </div>
            <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">2,450 XP</div>
            <p className="text-xs text-gray-400 font-medium">Nivel 8: Guardián de Bosques</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-b-4 border-amber-500 relative overflow-hidden group">
            <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-amber-50 dark:text-gray-700 opacity-50 group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/40 rounded-lg"><CheckCircle2 className="w-6 h-6 text-amber-600" /></div>
              <span className="font-bold text-gray-700 dark:text-gray-200">Retos superados</span>
            </div>
            <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">14</div>
            <p className="text-xs text-gray-400 font-medium">3 completados este mes</p>
          </div>
        </div>

        {/* Challenge list */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Retos Disponibles', 'Verfügbare Challenges', 'Available Challenges')}</h2>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white dark:bg-gray-700 rounded-md shadow-sm">{t('Todos', 'Alle', 'All')}</button>
              <button className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-400">{t('Míos', 'Meine', 'Mine')}</button>
            </div>
          </div>

          <div className="grid gap-6">
            {challenges.map((challenge) => (
              <div key={challenge.id} className={`glass-card rounded-2xl p-6 border-l-8 transition-all hover:-translate-x-1 ${
                challenge.status === 'joined' ? 'border-indigo-600 bg-indigo-50/10' : 'border-gray-200 dark:border-gray-800'
              }`}>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl text-5xl shadow-lg ring-1 ring-gray-100 dark:ring-gray-700">
                    {challenge.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-bold uppercase tracking-widest text-gray-500">{challenge.category}</span>
                      <span className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-bold"><Zap className="w-3 h-3" /> {challenge.points} XP</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{challenge.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-2xl text-sm leading-relaxed">{challenge.description}</p>
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Users className="w-4 h-4" /> <strong>{challenge.participants.toLocaleString()}</strong> {t('participando', 'nehmen teil', 'participating')}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="w-4 h-4" /> <strong>{challenge.daysRemaining}</strong> {t('días restantes', 'Tage verbleibend', 'days left')}
                      </div>
                    </div>
                  </div>
                  <div className="md:self-center">
                    {challenge.status === 'joined' ? (
                      <div className="flex flex-col items-center gap-3">
                         <div className="w-32 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-600 rounded-full w-[60%]"></div>
                         </div>
                         <button className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg scale-90 md:scale-100">
                          {t('Registrar Progresov', 'Fortschritt eintragen', 'Log Progress')}
                        </button>
                      </div>
                    ) : (
                      <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg">
                        {t('Apuntarse', 'Teilnehmen', 'Join Challenge')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
