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

function classifyArticle(title: string): { category: string; fallbackImage: string } {
  const lower = title.toLowerCase();
  for (const entry of CATEGORY_MAP) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return { category: entry.category, fallbackImage: entry.fallbackImage };
    }
  }
  return { category: 'Environment', fallbackImage: DEFAULT_FALLBACK };
}

export async function GET() {
  try {
    const parser = new Parser({
      customFields: {
        item: [
          ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
          ['media:content', 'mediaContent', { keepArray: true }],
        ]
      }
    });

    // Phys.org Environment News — reliable, daily updated
    const feedUrl = 'https://phys.org/rss-feed/earth-news/environment/';
    const feed = await parser.parseURL(feedUrl);

    const articles = feed.items.slice(0, 15).map((item: any) => {
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
        title,
        link: item.link,
        date: item.pubDate
          ? new Date(item.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          : 'Today',
        category,
        image,
      };
    });

    return NextResponse.json({ news: articles });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
