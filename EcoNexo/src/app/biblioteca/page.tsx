'use client';

import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, BookOpen, Search, Filter, Book, Video, FileText, Download, Bookmark, Clock, Star } from 'lucide-react';

interface Resource {
  id: string;
  type: 'guide' | 'video' | 'article' | 'report';
  title: string;
  author: string;
  level: string;
  duration: string;
  rating: number;
  tags: string[];
  image: string;
}

export default function BibliotecaPage() {
  const { locale } = useI18n();

  const t = (es: string, de: string, en: string) =>
    locale === 'es' ? es : locale === 'de' ? de : en;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'guide' | 'video' | 'article' | 'report'>('all');

  const resources: Resource[] = [
    {
      id: '1',
      type: 'guide',
      title: t('Guía completa: Compostaje doméstico', 'Vollständiger Leitfaden: Heimkompostierung', 'Complete Guide: Home Composting'),
      author: 'EcoNexo Team',
      level: t('Principiante', 'Anfänger', 'Beginner'),
      duration: '15 min read',
      rating: 4.8,
      tags: ['Residuos', 'Jardín'],
      image: '🍂',
    },
    {
      id: '2',
      type: 'video',
      title: t('Documental: El futuro de la energía solar', 'Dokumentarfilm: Die Zukunft der Solarenergie', 'Documentary: The Future of Solar Energy'),
      author: 'Green Vision',
      level: t('Intermedio', 'Mittel', 'Intermediate'),
      duration: '45 min',
      rating: 4.9,
      tags: ['Energía', 'Tecnología'],
      image: '☀️',
    },
    {
      id: '3',
      type: 'article',
      title: t('10 hábitos Zero Waste para el día a día', '10 Zero-Waste-Gewohnheiten für den Alltag', '10 Zero Waste habits for everyday life'),
      author: 'Marta Ríos',
      level: t('Principiante', 'Anfänger', 'Beginner'),
      duration: '8 min read',
      rating: 4.7,
      tags: ['Estilo de vida', 'Plástico'],
      image: '♻️',
    },
    {
      id: '4',
      type: 'report',
      title: t('Informe: Estado de la biodiversidad 2024', 'Bericht: Zustand der Biodiversität 2024', 'Report: State of Biodiversity 2024'),
      author: 'UN Environment',
      level: t('Avanzado', 'Fortgeschritten', 'Advanced'),
      duration: 'PDF - 42 pág',
      rating: 5.0,
      tags: ['Ciencia', 'Política'],
      image: '🌍',
    },
    {
      id: '5',
      type: 'guide',
      title: t('Huerto urbano en balcones pequeños', 'Urbaner Garten auf kleinen Balkonen', 'Urban garden on small balconies'),
      author: 'Juan Huerta',
      level: t('Principiante', 'Anfänger', 'Beginner'),
      duration: '20 min read',
      rating: 4.6,
      tags: ['Agricultura', 'Urbano'],
      image: '🍅',
    },
    {
      id: '6',
      type: 'video',
      title: t('Taller: Reparación de electrónica básica', 'Workshop: Grundlegende Elektronikreparatur', 'Workshop: Basic Electronics Repair'),
      author: 'Fix It Academy',
      level: t('Intermedio', 'Mittel', 'Intermediate'),
      duration: '32 min',
      rating: 4.5,
      tags: ['Circularidad', 'DIY'],
      image: '🛠️',
    },
  ];

  const typeIcons = {
    guide: <Book className="w-4 h-4" />,
    video: <Video className="w-4 h-4" />,
    article: <FileText className="w-4 h-4" />,
    report: <Download className="w-4 h-4" />,
  };

  const filtered = resources.filter(res => {
    const matchesFilter = activeFilter === 'all' || res.type === activeFilter;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> {t('Volver al inicio', 'Zurück zur Startseite', 'Back to home')}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl">
              <BookOpen className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {t('Biblioteca Verde', 'Grüne Bibliothek', 'Green Library')}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {t('Recursos educativos para un futuro más sostenible', 'Bildungsressourcen für eine nachhaltigere Zukunft', 'Educational resources for a more sustainable future')}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('Buscar recursos...', 'Ressourcen suchen...', 'Search resources...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', label: t('Todo', 'Alles', 'All') },
              { id: 'guide', label: t('Guías', 'Leitfäden', 'Guides') },
              { id: 'video', label: t('Videos', 'Videos', 'Videos') },
              { id: 'article', label: t('Artículos', 'Artikel', 'Articles') },
              { id: 'report', label: t('Informes', 'Berichte', 'Reports') },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === f.id
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> {t('Destacado del mes', 'Highlight des Monats', 'Featured of the month')}
          </h2>
          <div className="bg-amber-600 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row gap-8 items-center relative overflow-hidden ring-4 ring-amber-100 dark:ring-amber-900/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="text-8xl md:text-9xl z-10">📖</div>
            <div className="flex-1 z-10 text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">Masterclass</span>
              <h3 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">{t('Soberanía Alimentaria en el Siglo XXI', 'Ernährungssouveränität im 21. Jahrhundert', 'Food Sovereignty in the 21st Century')}</h3>
              <p className="text-amber-50 text-lg mb-6 max-w-xl opacity-90">{t('Aprende cómo transformar tu relación con la comida y apoyar sistemas locales resilientes.', 'Lerne, wie du deine Beziehung zum Essen veränderst und lokale resiliente Systeme unterstützt.', 'Learn how to transform your relationship with food and support local resilient systems.')}</p>
              <button className="px-8 py-3 bg-white text-amber-600 rounded-full font-bold hover:bg-amber-50 transition-colors shadow-xl">
                {t('Empezar a leer', 'Zuerst lesen', 'Start reading')}
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((res) => (
            <div key={res.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all group flex flex-col">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 p-8 text-center text-7xl flex items-center justify-center min-h-[160px]">
                {res.image}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3">
                  {typeIcons[res.type]}
                  {t(res.type === 'guide' ? 'Guía' : res.type === 'video' ? 'Video' : res.type === 'article' ? 'Artículo' : 'Informe',
                     res.type === 'guide' ? 'Leitfaden' : res.type === 'video' ? 'Video' : res.type === 'article' ? 'Artikel' : 'Bericht',
                     res.type === 'guide' ? 'Guide' : res.type === 'video' ? 'Video' : res.type === 'article' ? 'Article' : 'Report')}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-amber-600 transition-colors">{res.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{t('Por', 'Von', 'By')} {res.author}</p>
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {res.duration}</span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-medium">{res.level}</span>
                  </div>
                  <button className="text-gray-400 hover:text-amber-600 transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
