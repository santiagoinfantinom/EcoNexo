import asyncio
import os
import sys
import uuid
import uuid as uuid_lib
import random
from datetime import datetime, timedelta
from dotenv import load_dotenv

# We can use the simple requests library for REST API calls to Supabase to insert data
import requests

# Load env vars
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env.local"))

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing Supabase credentials in .env.local")
    sys.exit(1)

# Add mcp-server to sys.path to import the scraper tools
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "mcp-server", "src")))
try:
    from tools.scraper_tools import search_online_events
except ImportError as e:
    print(f"Error importing scraper tools: {e}")
    sys.exit(1)

CITIES = ["Berlin", "London", "Paris", "Madrid", "Rome", "Amsterdam"]
QUERY = "environmental sustainability eco-friendly workshops volunteer"

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
    print("Importing to Supabase...")
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    success_count = 0
    
    for event in all_events:
        # Map the scraped event to our DB schema
        # Current events table: title, description, image_url, date, city, country, category, capacity, start_time, end_time, etc.
        db_event = {
            "id": str(uuid.uuid4()),
            "title": event.get("title", ""),
            "title_en": event.get("title", ""),
            "description": event.get("description", "") + f"\n\nSource: {event.get('website', '')}",
            "description_en": event.get("description", "") + f"\n\nSource: {event.get('website', '')}",
            "image_url": event.get("image_url", ""),
            "date": event.get("date", datetime.now().strftime("%Y-%m-%d")),
            "city": event.get("city", "Europe"),
            "country": event.get("country", "Europe"),
            "category": event.get("category", "environment"),
            "optional_categories": [],
            "capacity": event.get("spots", 50),
            "notes": "Imported via European Scraping Script",
            # Ensure time exists
            "start_time": event.get("time", "10:00")
        }
        
        # Insert via Supabase REST API
        try:
            res = requests.post(
                f"{SUPABASE_URL}/rest/v1/events",
                headers=headers,
                json=db_event
            )
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
