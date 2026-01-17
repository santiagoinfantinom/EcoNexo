"""
Scraping tools for finding external job opportunities.
"""
import logging
import os
from typing import List, Dict, Any, Optional
from duckduckgo_search import DDGS
import asyncio

# Setup file logging for easy debugging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("scraper_debug.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

async def search_online_jobs(
    query: str, 
    location: Optional[str] = None, 
    limit: int = 5
) -> List[Dict[str, Any]]:
    """
    Search for jobs online using DuckDuckGo.
    
    Args:
        query: Job search query (e.g. "Python Developer sustainability")
        location: Preferred location
        limit: Max number of results
        
    Returns:
        List of job dictionaries
    """
    logger.info(f"Scraping online jobs for: {query} in {location}")
    
    results = []
    seen_ids = set()
    
    # Strategy 1: Targeted ATS search for high-quality listings
    search_queries = [
        f'{query} site:greenhouse.io',
        f'{query} site:lever.co',
        f'{query} site:workable.com',
        f'{query} site:ashbyhq.com',
        f'{query} "job" (site:linkedin.com/jobs OR site:indeed.com) {location if location else ""}',
        f'{query} "vacante" OR "oferta" OR "empleo" {location if location else ""}'  # Spanish fallback
    ]
    
    try:
        # Helper function to run blocking DDGS in thread
        def _run_ddg_search(queries_to_run):
            found_hits = []
            with DDGS() as ddgs:
                for q in queries_to_run:
                    if len(found_hits) >= limit * 2: # Get more candidates to filter
                        break
                    try:
                        # logger.info(f"Searching: {q}")
                        hits = list(ddgs.text(q, max_results=5))
                        found_hits.extend(hits)
                    except Exception as e:
                        logger.warning(f"Search failed for {q}: {e}")
            return found_hits

        # Execute primary search
        raw_hits = await asyncio.to_thread(_run_ddg_search, search_queries)
        
        # Strategy 2: Fallback to generic search if specific queries yield nothing
        if not raw_hits:
            logger.info("No results from specific queries. Attempting generic fallback.")
            # Simplify query to first few words
            simple_query = " ".join(query.split()[:3])
            fallback_queries = [
                f'{simple_query} jobs {location if location else ""}',
                f'{simple_query} careers'
            ]
            raw_hits = await asyncio.to_thread(_run_ddg_search, fallback_queries)
            
        # Process and filter results
        for res in raw_hits:
            if len(results) >= limit:
                break
                
            link = res.get('href', '')
            title = res.get('title', '').lower()
            
            # Create unique ID
            job_id = f"ext_{hash(link)}"
            if job_id in seen_ids:
                continue
            seen_ids.add(job_id)
            
            # Filter: Obvious non-jobs (Keywords)
            if any(x in title for x in ['how to', 'course', 'tutorial', 'learn', 'guide', 'question', 'problem', 'error', 'issue']):
                continue
                
            # Filter: Non-job domains (Stack Overflow, GitHub, etc.)
            blocked_domains = [
                'stackoverflow.com', 'stackexchange.com', 'github.com', 'reddit.com', 'quora.com', 'medium.com', 'youtube.com',
                'microsoft.com', 'office.com', 'live.com', 'google.com', 'amazon.com', 'wikipedia.org', 'facebook.com', 'instagram.com',
                'python.org', 'reactjs.org', 'djangoproject.com', 'w3schools.com', 'geeksforgeeks.org', 'developer.mozilla.org',
                '24ur.com'
            ]
            if any(domain in link for domain in blocked_domains):
                continue
            
            # Filter: Login/Auth pages
            if any(x in link.lower() for x in ['login', 'signin', 'auth', 'account', 'register', 'sign-in', 'sign-up']):
                continue
                
            # Filter: Non-Latin characters (CJK)
            if any(ord(c) > 0x2E80 for c in title if c.strip()):
                continue
                
            # Add to results
            results.append({
                "id": job_id,
                "name": res.get('title', 'External Opportunity'),
                "description": res.get('body', 'Click to view details.'),
                "category": "External Opportunity",
                "city": location or "Remote/Internet",
                "country": "Unknown",
                "lat": 0,
                "lng": 0,
                "spots": 1,
                "image_url": "https://cdn-icons-png.flaticon.com/512/3875/3875803.png", 
                "info_url": link,
                "isPermanent": True,
                "is_external": True,
                "source": "Web Search"
            })
            
    except Exception as e:
        logger.error(f"Error scraping jobs: {e}")
        
    return results[:limit]


async def search_online_events(
    query: Optional[str] = None,
    location: str = "Europe",
    limit: int = 5
) -> List[Dict[str, Any]]:
    """
    Search for environmental events online using DuckDuckGo.
    
    Args:
        query: Optional specific query (e.g. "vegan festival")
        location: City or region to search in
        limit: Max number of results
        
    Returns:
        List of event dictionaries
    """
    search_term = query if query else "environmental events sustainability workshops"
    logger.info(f"Scraping online events for: {search_term} in {location}")
    
    results = []
    seen_ids = set()
    
    # Construct search queries
    search_queries = [
        f'"{location}" {search_term} event {2026}',
        f'"{location}" sustainability workshops {2026}',
        f'"{location}" eco-friendly events {2026}',
        f'"{location}" volunteering environment {2026}',
        f'site:eventbrite.com "{location}" environment {2026}',
        f'site:meetup.com "{location}" environment {2026}',
        f'site:facebook.com/events "{location}" environment {2026}'
    ]
    
    try:
        # Helper function to run blocking DDGS in thread
        def _run_ddg_search(queries_to_run):
            found_hits = []
            with DDGS() as ddgs:
                for q in queries_to_run:
                    if len(found_hits) >= limit * 3:
                        break
                    try:
                        hits = list(ddgs.text(q, max_results=5))
                        found_hits.extend(hits)
                    except Exception as e:
                        logger.warning(f"Event search failed for {q}: {e}")
            return found_hits

        # Execute search
        raw_hits = await asyncio.to_thread(_run_ddg_search, search_queries)
            
        # Process and filter results
        for res in raw_hits:
            if len(results) >= limit:
                break
                
            link = res.get('href', '')
            title = res.get('title', '').lower()
            
            # Create unique ID
            event_id = f"ext_evt_{hash(link)}"
            if event_id in seen_ids:
                continue
            seen_ids.add(event_id)
            
            # Filter: Obvious non-events
            if any(x in title for x in ['jobs', 'salary', 'hiring', 'vacancy']):
                continue
                
            # Add to results
            results.append({
                "id": event_id,
                "title": res.get('title', 'External Event'),
                "description": res.get('body', 'Click to view event details.'),
                "category": "External Event",
                "city": location,
                "country": "Unknown",
                "date": "2026-01-01", # Placeholder date as we can't easily parse it from snippet
                "time": "10:00",
                "spots": 0,
                "image_url": "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop", 
                "website": link,
                "is_external": True,
                "verified": False,
                "organizer": "Web Search"
            })
            
    except Exception as e:
        logger.error(f"Error scraping events: {e}")
        
    return results[:limit]
