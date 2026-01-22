#!/usr/bin/env python3
"""
Event Scraper for EcoNexo

Extracts event data from external URLs and formats it to EcoNexo's event schema.
Supports: Meetup, Eventbrite, and generic HTML pages with structured data.

Usage:
    python scrape_event.py <url>

Example:
    python scrape_event.py "https://www.meetup.com/berlin-sustainability/events/12345/"
"""

import sys
import json
import re
from datetime import datetime
from urllib.parse import urlparse

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("❌ Missing dependencies. Install with: pip install requests beautifulsoup4")
    sys.exit(1)


CATEGORY_MAPPING = {
    "environment": "medio-ambiente",
    "nature": "medio-ambiente",
    "sustainability": "medio-ambiente",
    "climate": "medio-ambiente",
    "ocean": "oceanos",
    "beach": "oceanos",
    "marine": "oceanos",
    "education": "educacion",
    "workshop": "educacion",
    "training": "educacion",
    "health": "salud",
    "wellness": "salud",
    "community": "comunidad",
    "social": "comunidad",
    "food": "alimentacion",
    "agriculture": "alimentacion",
}


def generate_id(name: str, city: str) -> str:
    """Generate a URL-safe event ID."""
    slug = re.sub(r'[^a-z0-9]+', '_', name.lower())
    city_slug = re.sub(r'[^a-z0-9]+', '_', city.lower())
    return f"ext_{city_slug}_{slug[:30]}"


def detect_category(text: str) -> str:
    """Detect category from event text."""
    text_lower = text.lower()
    for keyword, category in CATEGORY_MAPPING.items():
        if keyword in text_lower:
            return category
    return "medio-ambiente"  # Default


def scrape_generic(url: str, soup: BeautifulSoup) -> dict:
    """Scrape generic HTML page with best-effort extraction."""
    title = soup.find('h1') or soup.find('title')
    title_text = title.get_text(strip=True) if title else "Unknown Event"
    
    description = ""
    for tag in ['article', 'main', '.description', '.content']:
        elem = soup.select_one(tag) if tag.startswith('.') else soup.find(tag)
        if elem:
            description = elem.get_text(strip=True)[:500]
            break
    
    # Try to find structured data (JSON-LD)
    script = soup.find('script', type='application/ld+json')
    if script:
        try:
            data = json.loads(script.string)
            if isinstance(data, list):
                data = data[0]
            if data.get('@type') == 'Event':
                return {
                    "id": generate_id(data.get('name', title_text), "unknown"),
                    "name": data.get('name', title_text),
                    "description": data.get('description', description),
                    "category": detect_category(data.get('description', '')),
                    "city": data.get('location', {}).get('address', {}).get('addressLocality', 'Unknown'),
                    "country": data.get('location', {}).get('address', {}).get('addressCountry', 'Unknown'),
                    "lat": 0,
                    "lng": 0,
                    "startsAt": data.get('startDate', datetime.now().isoformat()),
                    "endsAt": data.get('endDate'),
                    "image_url": data.get('image'),
                    "info_url": url,
                    "is_external": True,
                }
        except json.JSONDecodeError:
            pass
    
    return {
        "id": generate_id(title_text, "unknown"),
        "name": title_text,
        "description": description,
        "category": detect_category(description),
        "city": "Unknown",
        "country": "Unknown",
        "lat": 0,
        "lng": 0,
        "startsAt": datetime.now().isoformat(),
        "info_url": url,
        "is_external": True,
    }


def scrape_event(url: str) -> dict:
    """Main scraping function."""
    print(f"🔍 Scraping: {url}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (compatible; EcoNexo Event Scraper)'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"❌ Failed to fetch URL: {e}")
        return None
    
    soup = BeautifulSoup(response.text, 'html.parser')
    domain = urlparse(url).netloc
    
    # Route to appropriate scraper
    event = scrape_generic(url, soup)
    
    return event


def format_typescript(event: dict) -> str:
    """Format event as TypeScript object."""
    lines = ["  {"]
    for key, value in event.items():
        if value is None:
            continue
        if isinstance(value, bool):
            lines.append(f"    {key}: {str(value).lower()},")
        elif isinstance(value, (int, float)):
            lines.append(f"    {key}: {value},")
        else:
            escaped = str(value).replace('"', '\\"')
            lines.append(f'    {key}: "{escaped}",')
    lines.append("  },")
    return "\n".join(lines)


def main():
    if len(sys.argv) < 2:
        print("Usage: python scrape_event.py <url>")
        print("\nExample:")
        print('  python scrape_event.py "https://www.meetup.com/example-event/"')
        sys.exit(1)
    
    url = sys.argv[1]
    event = scrape_event(url)
    
    if event:
        print("\n✅ Scraped event:")
        print(json.dumps(event, indent=2, ensure_ascii=False))
        print("\n📝 TypeScript format:")
        print(format_typescript(event))
    else:
        print("\n❌ Failed to scrape event")
        sys.exit(1)


if __name__ == "__main__":
    main()
