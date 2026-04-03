import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

// Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400;

export async function GET() {
  try {
    const parser = new Parser({
      customFields: {
        item: [
          ['media:content', 'mediaContent', { keepArray: true }]
        ]
      }
    });

    // We use a reliable environmental news RSS feed.
    // Example: SciTechDaily Environment News or similar
    const feedUrl = 'https://scitechdaily.com/news/earth/environment/feed/';
    
    const feed = await parser.parseURL(feedUrl);

    // Map the articles to match our frontend interface
    const articles = feed.items.slice(0, 15).map((item) => {
      
      // Extract main image if available in media:content or description
      let image = "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=800&auto=format&fit=crop"; 
      
      // Attempt to extract image from description content if 'mediaContent' is empty
      const imgRegex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;
      const match = imgRegex.exec(item.content || '');
      if (match && match[1]) {
        image = match[1];
      } else if (item.mediaContent && item.mediaContent.length > 0 && item.mediaContent[0].$) {
        image = item.mediaContent[0].$.url;
      }

      return {
        title: item.title,
        link: item.link,
        date: item.pubDate ? new Date(item.pubDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric'}) : "Today",
        category: "Environment",
        image: image
      };
    });

    return NextResponse.json({ news: articles });

  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
