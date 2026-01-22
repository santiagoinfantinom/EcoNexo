---
name: event-scraper
description: Extracts environmental events from external URLs (Meetup, Eventbrite, websites) and formats them to EcoNexo's event schema. Use when adding external events, importing event batches, or scraping event data from partner sites.
---

# Event Scraper

This skill automates the extraction and formatting of environmental events from external sources into EcoNexo's data format.

## When to Use

- Adding events from Meetup, Eventbrite, or partner organization websites
- Importing a batch of events from an external source
- Populating the events database from scraped data

## Workflow

1. **Identify source URL** - Determine the event source (Meetup event page, Eventbrite listing, etc.)
2. **Run scraper script** - Execute `scripts/scrape_event.py <url>`
3. **Review output** - Check the generated JSON matches expectations
4. **Integrate** - Add to `src/data/events.ts` or database

## Output Format

Events must match the EcoNexo schema:

```typescript
interface Event {
  id: string;                    // Unique slug (e.g., "meetup_berlin_cleanup_2026")
  name: string;                  // Event name
  name_en?: string;              // English translation
  name_de?: string;              // German translation  
  description: string;           // Full description
  category: string;              // medio-ambiente | oceanos | educacion | etc.
  city: string;                  // City name
  country: string;               // Country name
  lat: number;                   // Latitude
  lng: number;                   // Longitude
  startsAt: string;              // ISO date string
  endsAt?: string;               // ISO date string (optional)
  image_url?: string;            // Event image
  info_url?: string;             // External link
  is_external: boolean;          // Always true for scraped events
}
```

## Scripts

- `scripts/scrape_event.py <url>` - Scrapes a single event URL
- `scripts/batch_scrape.py <urls_file>` - Scrapes multiple URLs from a file

## Category Mapping

Map source categories to EcoNexo categories:
- Environment, Nature, Sustainability → `medio-ambiente`
- Ocean, Beach, Marine → `oceanos`
- Education, Workshop, Training → `educacion`
- Health, Wellness → `salud`
- Community, Social → `comunidad`
- Food, Agriculture → `alimentacion`
