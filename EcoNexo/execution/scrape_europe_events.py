import asyncio
import os
import sys
import uuid
import random
from datetime import datetime, timedelta
import requests

# Add mcp-server to sys.path to import the scraper tools
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "mcp-server", "src")))
try:
    from tools.scraper_tools import search_online_events
except ImportError as e:
    print(f"Error importing scraper tools: {e}")
    sys.exit(1)

CITIES = ["Berlin", "London", "Paris", "Madrid", "Rome", "Amsterdam"]
QUERY = "environmental sustainability eco-friendly workshops volunteer"
API_URL = "http://localhost:3000/api/events"

async def main():
    print("Starting European events scraping process...")
    all_events = []
    
    for city in CITIES:
        print(f"Scraping events for {city}...")
        try:
            # We fetch 10 events per city
            events = await search_online_events(query=QUERY, location=city, limit=10)
            print(f"  Found {len(events)} events in {city}.")
            all_events.extend(events)
        except Exception as e:
            print(f"  Error scraping {city}: {e}")
            
    print(f"\nTotal events scraped: {len(all_events)}")
    print("Importing to EcoNexo NextJS API...")
    
    success_count = 0
    
    for event in all_events:
        db_event = {
            "title": event.get("title", ""),
            "title_en": event.get("title", ""),
            "description": event.get("description", "") + f"\n\nSource: {event.get('website', '')}",
            "description_en": event.get("description", "") + f"\n\nSource: {event.get('website', '')}",
            "image_url": event.get("image_url", ""),
            "date": event.get("date", datetime.now().strftime("%Y-%m-%d")),
            "city": event.get("city", "Europe"),
            "country": event.get("country", "Europe"),
            "category": event.get("category", "environment"),
            "capacity": event.get("spots", 50),
            "notes": "Imported via European Scraping Script",
            "start_time": event.get("time", "10:00")
        }
        
        try:
            res = requests.post(API_URL, json=db_event)
            if res.status_code in [200, 201]:
                success_count += 1
            else:
                print(f"  Failed to insert {db_event['title'][:20]}: {res.status_code} {res.text}")
        except Exception as e:
            print(f"  Request error for {db_event['title'][:20]}: {e}")
            
    print(f"\nSuccessfully imported {success_count} events into the database.")
    print("Done!")

if __name__ == "__main__":
    asyncio.run(main())
