"""
MCP Tools for project-related operations.
These tools interact with EcoNexo API to get project data.
"""
import os
import httpx
from typing import Dict, List, Optional, Any
import logging
import math

logger = logging.getLogger(__name__)

ECONEXO_API_URL = os.getenv("ECONEXO_API_URL", "http://localhost:3000/api")


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance between two coordinates in kilometers using Haversine formula.
    
    Args:
        lat1, lon1: First point coordinates
        lat2, lon2: Second point coordinates
        
    Returns:
        Distance in kilometers
    """
    R = 6371  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


async def search_projects(criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Search for projects based on criteria.
    
    Args:
        criteria: Dictionary with search criteria:
            - category: List of categories
            - city: City name
            - country: Country name
            - lat, lng: Coordinates for location-based search
            - radius_km: Radius in km for location search
            - date_from: Start date (ISO format)
            - date_to: End date (ISO format)
            - difficulty: List of difficulty levels
            - accessibility: Boolean for accessibility requirement
            - available_spots: Minimum available spots
            
    Returns:
        List of matching projects
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Build query parameters
            params = {}
            if criteria.get("category"):
                params["category"] = criteria["category"]
            if criteria.get("city"):
                params["city"] = criteria["city"]
            if criteria.get("country"):
                params["country"] = criteria["country"]
            
            response = await client.get(
                f"{ECONEXO_API_URL}/projects",
                params=params
            )
            response.raise_for_status()
            projects = response.json()
            
            # Apply additional filters
            filtered_projects = []
            for project in projects:
                # Location filter
                if criteria.get("lat") and criteria.get("lng") and criteria.get("radius_km"):
                    distance = calculate_distance(
                        criteria["lat"],
                        criteria["lng"],
                        project.get("lat", 0),
                        project.get("lng", 0)
                    )
                    if distance > criteria["radius_km"]:
                        continue
                
                # Date filter
                if criteria.get("date_from") and project.get("startsAt"):
                    if project["startsAt"] < criteria["date_from"]:
                        continue
                if criteria.get("date_to") and project.get("endsAt"):
                    if project["endsAt"] > criteria["date_to"]:
                        continue
                
                # Availability filter
                if criteria.get("available_spots"):
                    available = project.get("spots", 0)
                    if available < criteria["available_spots"]:
                        continue
                
                filtered_projects.append(project)
            
            return filtered_projects
    except httpx.HTTPError as e:
        logger.error(f"Error searching projects: {e}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error in search_projects: {e}")
        return []


async def get_project_details(project_id: str) -> Optional[Dict[str, Any]]:
    """
    Get detailed information about a specific project.
    
    Args:
        project_id: Project ID
        
    Returns:
        Project details dictionary or None if not found
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{ECONEXO_API_URL}/projects",
                params={"id": project_id}
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        logger.error(f"Error fetching project details: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error in get_project_details: {e}")
        return None


async def get_projects_nearby(lat: float, lng: float, radius_km: float) -> List[Dict[str, Any]]:
    """
    Get projects near a specific location.
    
    Args:
        lat: Latitude
        lng: Longitude
        radius_km: Radius in kilometers
        
    Returns:
        List of nearby projects
    """
    return await search_projects({
        "lat": lat,
        "lng": lng,
        "radius_km": radius_km
    })


async def get_available_spots(project_id: str) -> int:
    """
    Get number of available spots for a project.
    
    Args:
        project_id: Project ID
        
    Returns:
        Number of available spots
    """
    project = await get_project_details(project_id)
    if project:
        return project.get("spots", 0)
    return 0

