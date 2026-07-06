import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

// Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400;

// Keyword → category mapping with relevant Unsplash fallback images
const CATEGORY_MAP: { keywords: string[]; category: string; fallbackImage: string }[] = [
  {
    keywords: ['ocean', 'sea', 'marine', 'coral', 'fish', 'whale', 'shark', 'coastal', 'underwater'],
    category: 'Oceans',
    fallbackImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800&auto=format&fit=crop',
  },
  {
    keywords: ['forest', 'tree', 'deforestation', 'wildfire', 'woodland', 'jungle', 'amazon', 'timber', 'logging'],
    category: 'Forests',
    fallbackImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop',
  },
  {
    keywords: ['climate', 'warming', 'temperature', 'greenhouse', 'co2', 'carbon', 'emission', 'paris agreement'],
    category: 'Climate',
    fallbackImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=800&auto=format&fit=crop',
  },
  {
    keywords: ['solar', 'wind', 'renewable', 'energy', 'battery', 'electric', 'hydrogen', 'turbine'],
    category: 'Energy',
    fallbackImage: 'https://images.unsplash.com/photo-1509391366360-da497924c694?q=80&w=800&auto=format&fit=crop',
  },
  {
    keywords: ['ice', 'glacier', 'arctic', 'antarctic', 'polar', 'permafrost', 'ice sheet', 'melt', 'subglacial'],
    category: 'Arctic & Ice',
    fallbackImage: 'https://images.unsplash.com/photo-1494564605686-2e931f77a8a2?q=80&w=800&auto=format&fit=crop',
  },
  {
    keywords: ['biodiversity', 'species', 'extinction', 'wildlife', 'animal', 'bird', 'insect', 'ecosystem', 'habitat'],
    category: 'Biodiversity',
    fallbackImage: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?q=80&w=800&auto=format&fit=crop',
  },
  {
    keywords: ['pollution', 'plastic', 'microplastic', 'waste', 'contamina', 'toxic', 'chemical', 'pharmaceutical'],
    category: 'Pollution',
    fallbackImage: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?q=80&w=800&auto=format&fit=crop',
  },
  {
    keywords: ['water', 'river', 'lake', 'drought', 'flood', 'rain', 'freshwater', 'aquifer', 'drinking'],
    category: 'Water',
    fallbackImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop',
  },
  {
    keywords: ['agriculture', 'farm', 'crop', 'soil', 'food', 'organic', 'pesticide', 'fertilizer'],
    category: 'Agriculture',
    fallbackImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
  },
  {
    keywords: ['city', 'urban', 'transport', 'building', 'infrastructure', 'smart city'],
    category: 'Urban',
    fallbackImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800&auto=format&fit=crop',
  },
  {
    keywords: ['ai', 'satellite', 'technology', 'data', 'model', 'predict', 'sensor', 'monitor'],
    category: 'Tech & Science',
    fallbackImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  },
];

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop';

const FEEDS_BY_LANG: Record<string, string[]> = {
  // Keep sources environment-focused whenever possible.
  de: [
    'https://www.deutschlandfunk.de/umwelt-100.rss',
    'https://rss.dw.com/xml/rss-de-umwelt',
  ],
  es: [
    'https://www.efeverde.com/feed/',
    'https://www.ecoticias.com/feed/',
  ],
  en: [
    'https://phys.org/rss-feed/earth-news/environment/',
    'https://www.theguardian.com/environment/rss',
  ],
};

const ENVIRONMENT_KEYWORDS: Record<string, string[]> = {
  de: [
    'umwelt', 'klima', 'klimawandel', 'emission', 'co2', 'biodivers', 'natur',
    'ozean', 'meer', 'plastik', 'recycling', 'erneuerbar', 'energie',
    'nachhaltig', 'wald', 'luft', 'wasser', 'verschmutz', 'artenschutz',
  ],
  es: [
    'medio ambiente', 'ambiental', 'clima', 'calentamiento', 'emisiones', 'co2',
    'biodiversidad', 'naturaleza', 'océano', 'oceano', 'mar', 'plástico',
    'plastico', 'reciclaje', 'energía', 'energia', 'renovable', 'sostenible',
    'bosque', 'agua', 'contaminación', 'contaminacion', 'especies',
  ],
  en: [
    'environment', 'climate', 'warming', 'emission', 'co2', 'biodiversity',
    'nature', 'ocean', 'sea', 'plastic', 'recycling', 'renewable', 'energy',
    'sustainable', 'forest', 'water', 'pollution', 'wildlife', 'ecosystem',
  ],
};

const CATEGORY_I18N: Record<string, { de: string; es: string; en: string }> = {
  Oceans: { de: 'Ozeane', es: 'Océanos', en: 'Oceans' },
  Forests: { de: 'Wälder', es: 'Bosques', en: 'Forests' },
  Climate: { de: 'Klima', es: 'Clima', en: 'Climate' },
  Energy: { de: 'Energie', es: 'Energía', en: 'Energy' },
  'Arctic & Ice': { de: 'Arktis & Eis', es: 'Ártico y hielo', en: 'Arctic & Ice' },
  Biodiversity: { de: 'Biodiversität', es: 'Biodiversidad', en: 'Biodiversity' },
  Pollution: { de: 'Verschmutzung', es: 'Contaminación', en: 'Pollution' },
  Water: { de: 'Wasser', es: 'Agua', en: 'Water' },
  Agriculture: { de: 'Landwirtschaft', es: 'Agricultura', en: 'Agriculture' },
  Urban: { de: 'Stadt', es: 'Urbano', en: 'Urban' },
  'Tech & Science': { de: 'Technik & Wissenschaft', es: 'Tecnología y ciencia', en: 'Tech & Science' },
  Environment: { de: 'Umwelt', es: 'Medio ambiente', en: 'Environment' },
};

function localizeCategory(category: string, lang: string): string {
  const key = category in CATEGORY_I18N ? category : 'Environment';
  if (lang === 'de') return CATEGORY_I18N[key].de;
  if (lang === 'es') return CATEGORY_I18N[key].es;
  return CATEGORY_I18N[key].en;
}

function looksLikeLanguage(text: string, lang: string): boolean {
  const value = text.toLowerCase();
  if (!value.trim()) return false;
  if (lang === 'en') return true;
  if (lang === 'de') {
    const markers = [' der ', ' die ', ' und ', ' mit ', ' für ', ' nicht ', ' ist ', ' klima', ' umwelt', 'über', 'ä', 'ö', 'ü', 'ß'];
    return markers.some((m) => value.includes(m.trim()) || value.includes(m));
  }
  if (lang === 'es') {
    const markers = [' el ', ' la ', ' de ', ' y ', ' con ', ' para ', ' que ', ' medio ambiente', 'clima', 'á', 'é', 'í', 'ó', 'ú', 'ñ'];
    return markers.some((m) => value.includes(m.trim()) || value.includes(m));
  }
  return true;
}

function localizeTitle(title: string, lang: string, category: string): string {
  if (looksLikeLanguage(title, lang)) return title;
  if (lang === 'de') {
    return `Aktuelles Update: ${localizeCategory(category, 'de')} und Nachhaltigkeit in Europa`;
  }
  if (lang === 'es') {
    return `Actualización: ${localizeCategory(category, 'es')} y sostenibilidad en Europa`;
  }
  return title;
}

function fallbackNews(lang: string) {
  if (lang === 'de') {
    return [
      {
        title: 'Europäische Städte beschleunigen ihre Klimaanpassungspläne',
        link: 'https://climate.ec.europa.eu/',
        date: 'Heute',
        category: 'Klima',
        image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop',
      },
      {
        title: 'Aufforstungsinitiativen verbessern die Luftqualität in Metropolregionen',
        link: 'https://environment.ec.europa.eu/',
        date: 'Heute',
        category: 'Wälder',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop',
      },
      {
        title: 'Neue Kreislaufwirtschaftsmaßnahmen zur Reduktion von Plastikabfällen',
        link: 'https://environment.ec.europa.eu/topics/waste-and-recycling_en',
        date: 'Heute',
        category: 'Verschmutzung',
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop',
      },
      {
        title: 'Erneuerbare Energien erreichen neue Ausbaurekorde in Europa',
        link: 'https://energy.ec.europa.eu/topics/renewable-energy_en',
        date: 'Heute',
        category: 'Energie',
        image: 'https://images.unsplash.com/photo-1509391366360-da497924c694?q=80&w=800&auto=format&fit=crop',
      },
    ];
  }

  if (lang === 'es') {
    return [
      {
        title: 'Ciudades europeas aceleran sus planes de adaptación climática',
        link: 'https://climate.ec.europa.eu/',
        date: 'Hoy',
        category: 'Clima',
        image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop',
      },
      {
        title: 'Iniciativas de reforestación mejoran la calidad del aire urbano',
        link: 'https://environment.ec.europa.eu/',
        date: 'Hoy',
        category: 'Bosques',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop',
      },
      {
        title: 'Nuevas medidas de economía circular para reducir plásticos',
        link: 'https://environment.ec.europa.eu/topics/waste-and-recycling_en',
        date: 'Hoy',
        category: 'Contaminación',
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop',
      },
      {
        title: 'Las energías renovables baten récords de despliegue en Europa',
        link: 'https://energy.ec.europa.eu/topics/renewable-energy_en',
        date: 'Hoy',
        category: 'Energía',
        image: 'https://images.unsplash.com/photo-1509391366360-da497924c694?q=80&w=800&auto=format&fit=crop',
      },
    ];
  }

  return [
    {
      title: 'European cities accelerate climate adaptation plans',
      link: 'https://climate.ec.europa.eu/',
      date: 'Today',
      category: 'Climate',
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Reforestation programs improve air quality in urban regions',
      link: 'https://environment.ec.europa.eu/',
      date: 'Today',
      category: 'Forests',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Circular economy policies target plastic waste reduction',
      link: 'https://environment.ec.europa.eu/topics/waste-and-recycling_en',
      date: 'Today',
      category: 'Pollution',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Renewables hit new deployment milestones across Europe',
      link: 'https://energy.ec.europa.eu/topics/renewable-energy_en',
      date: 'Today',
      category: 'Energy',
      image: 'https://images.unsplash.com/photo-1509391366360-da497924c694?q=80&w=800&auto=format&fit=crop',
    },
  ];
}

function classifyArticle(title: string): { category: string; fallbackImage: string } {
  const lower = title.toLowerCase();
  for (const entry of CATEGORY_MAP) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return { category: entry.category, fallbackImage: entry.fallbackImage };
    }
  }
  return { category: 'Environment', fallbackImage: DEFAULT_FALLBACK };
}

function isEnvironmentArticle(item: any, lang: string): boolean {
  const text = `${item?.title || ''} ${item?.contentSnippet || ''} ${item?.content || ''}`.toLowerCase();
  const keywords = ENVIRONMENT_KEYWORDS[lang] || ENVIRONMENT_KEYWORDS.en;
  return keywords.some((kw) => text.includes(kw));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get('lang') || 'en').toLowerCase();
    const parser = new Parser({
      customFields: {
        item: [
          ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
          ['media:content', 'mediaContent', { keepArray: true }],
        ]
      }
    });

    const feedUrls = FEEDS_BY_LANG[lang] || FEEDS_BY_LANG.en;
    const feedResults = await Promise.allSettled(feedUrls.map((url) => parser.parseURL(url)));
    const allItems = feedResults
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .flatMap((result) => result.value.items || []);

    const uniqueItems = allItems.filter((item: any, index: number, arr: any[]) => {
      const link = item?.link || '';
      if (!link) return index < 40; // keep some items even without links
      return arr.findIndex((x) => x?.link === link) === index;
    });

    const prioritizedItems = uniqueItems.filter((item: any) => isEnvironmentArticle(item, lang));
    const itemsToUse = (prioritizedItems.length >= 15
      ? prioritizedItems
      : [...prioritizedItems, ...uniqueItems.filter((i: any) => !prioritizedItems.includes(i))]
    ).slice(0, 15);

    const articles = itemsToUse.map((item: any) => {
      const title = item.title || 'Untitled';
      const { category, fallbackImage } = classifyArticle(title);

      // 1. Try media:thumbnail (phys.org provides these) — upscale from 90px thumb to 800px
      let image = '';
      if (item.mediaThumbnail && item.mediaThumbnail.length > 0 && item.mediaThumbnail[0].$?.url) {
        image = item.mediaThumbnail[0].$.url.replace('/tmb/', '/800/');
      }
      // 2. Try media:content
      if (!image && item.mediaContent && item.mediaContent.length > 0 && item.mediaContent[0].$?.url) {
        image = item.mediaContent[0].$.url;
      }
      // 3. Try extracting <img> from content
      if (!image) {
        const imgMatch = (item.content || item['content:encoded'] || '').match(/<img[^>]+src="([^"]+)"/);
        if (imgMatch) image = imgMatch[1];
      }
      // 4. Use topic-relevant Unsplash fallback
      if (!image) {
        image = fallbackImage;
      }

      return {
        title: localizeTitle(title, lang, category),
        link: item.link,
        date: item.pubDate
          ? new Date(item.pubDate).toLocaleDateString(
              lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : 'en-US',
              { year: 'numeric', month: 'short', day: 'numeric' }
            )
          : (lang === 'de' ? 'Heute' : lang === 'es' ? 'Hoy' : 'Today'),
        category: localizeCategory(category, lang),
        image,
      };
    });

    return NextResponse.json({ news: articles.length > 0 ? articles : fallbackNews(lang) });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    const lang = (() => {
      try {
        const { searchParams } = new URL(request.url);
        return (searchParams.get('lang') || 'en').toLowerCase();
      } catch {
        return 'en';
      }
    })();
    return NextResponse.json({ news: fallbackNews(lang), fallback: true }, { status: 200 });
  }
}
