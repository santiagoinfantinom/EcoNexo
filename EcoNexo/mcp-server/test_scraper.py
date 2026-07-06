
import asyncio
import logging
from src.tools.scraper_tools import search_online_jobs

# Configure logging
logging.basicConfig(level=logging.INFO)

async def main():
    print("Testing scraper...")
    results = await search_online_jobs("Python Developer", "Remote")
    print(f"Found {len(results)} results:")
    for r in results:
        print(f"- {r['name']} ({r['info_url']})")

if __name__ == "__main__":
    asyncio.run(main())
