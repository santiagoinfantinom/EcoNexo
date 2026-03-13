"""
MCP Tools for user-related operations.
These tools interact with EcoNexo API to get user data.
"""
import os
import httpx
from typing import Dict, List, Optional, Any
import logging

logger = logging.getLogger(__name__)

ECONEXO_API_URL = os.getenv("ECONEXO_API_URL", "http://localhost:3000/api")


async def get_user_profile(user_id: str) -> Dict[str, Any]:
    """
    Get complete user profile from EcoNexo API.
    
    Args:
        user_id: User ID
        
    Returns:
        Dictionary with user profile data
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{ECONEXO_API_URL}/profiles",
                params={"user_id": user_id}
            )
            response.raise_for_status()
            data = response.json()
            
            # Transform to expected format
            profile = {
                "id": data.get("id", user_id),
                "name": data.get("full_name", data.get("name", "Usuario")),
                "email": data.get("email", ""),
                "location": {
                    "lat": data.get("lat") or 40.4168,  # Default to Madrid
                    "lng": data.get("lng") or -3.7038,
                    "city": data.get("city", "Madrid"),
                    "country": data.get("country", "España"),
                },
                "interests": _parse_interests(data),
                "pastEvents": [],  # Will be populated from history
                "preferences": {
                    "maxDistance": data.get("max_distance", 25),
                    "preferredCategories": _parse_categories(data),
                    "preferredTimes": data.get("preferred_times", ["morning", "afternoon"]),
                    "difficulty": data.get("preferred_difficulty", ["easy", "medium"]),
                    "accessibility": data.get("accessibility_required", False),
                },
                "impactScore": data.get("impact_score", 0),
                "joinDate": data.get("created_at", ""),
                "skills": _parse_skills(data),
                "bio": data.get("bio", data.get("about_me", "")),
            }
            return profile
    except httpx.HTTPError as e:
        logger.error(f"Error fetching user profile: {e}")
        # Return mock profile as fallback
        return _get_mock_profile(user_id)
    except Exception as e:
        logger.error(f"Unexpected error in get_user_profile: {e}")
        return _get_mock_profile(user_id)


async def get_user_history(user_id: str) -> List[Dict[str, Any]]:
    """
    Get user's history of participated events/projects.
    
    Args:
        user_id: User ID
        
    Returns:
        List of events/projects the user has participated in
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Try to get event registrations
            response = await client.get(
                f"{ECONEXO_API_URL}/events/registrations",
                params={"user_id": user_id}
            )
            if response.status_code == 200:
                registrations = response.json()
                return [
                    {
                        "id": reg.get("event_id", ""),
                        "type": "event",
                        "date": reg.get("created_at", ""),
                        "status": reg.get("status", "registered"),
                    }
                    for reg in registrations
                ]
    except Exception as e:
        logger.error(f"Error fetching user history: {e}")
    
    # Return empty list if no history found
    return []


async def get_user_preferences(user_id: str) -> Dict[str, Any]:
    """
    Get user preferences.
    
    Args:
        user_id: User ID
        
    Returns:
        Dictionary with user preferences
    """
    profile = await get_user_profile(user_id)
    return profile.get("preferences", {})


async def update_user_preferences(user_id: str, preferences: Dict[str, Any]) -> bool:
    """
    Update user preferences.
    
    Args:
        user_id: User ID
        preferences: Dictionary with preferences to update
        
    Returns:
        True if successful, False otherwise
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.put(
                f"{ECONEXO_API_URL}/profiles/{user_id}/preferences",
                json=preferences
            )
            response.raise_for_status()
            return True
    except Exception as e:
        logger.error(f"Error updating user preferences: {e}")
        return False


def _parse_interests(data: Dict[str, Any]) -> List[str]:
    """Parse interests from profile data."""
    interests = []
    if data.get("interests"):
        if isinstance(data["interests"], str):
            interests = [i.strip() for i in data["interests"].split(",")]
        elif isinstance(data["interests"], list):
            interests = data["interests"]
    if data.get("passions"):
        if isinstance(data["passions"], str):
            interests.extend([p.strip() for p in data["passions"].split(",")])
    return list(set(interests))  # Remove duplicates


def _parse_categories(data: Dict[str, Any]) -> List[str]:
    """Parse preferred categories from profile data."""
    categories = data.get("preferred_categories", [])
    if isinstance(categories, str):
        return [c.strip() for c in categories.split(",")]
    return categories if isinstance(categories, list) else []


def _parse_skills(data: Dict[str, Any]) -> List[str]:
    """Parse skills from profile data."""
    skills = []
    if data.get("skills"):
        if isinstance(data["skills"], str):
            skills = [s.strip() for s in data["skills"].split(",")]
        elif isinstance(data["skills"], list):
            skills = data["skills"]
    if data.get("areas_of_expertise"):
        if isinstance(data["areas_of_expertise"], str):
            skills.extend([a.strip() for a in data["areas_of_expertise"].split(",")])
    return list(set(skills))


def _get_mock_profile(user_id: str) -> Dict[str, Any]:
    """Return a mock profile as fallback."""
    return {
        "id": user_id,
        "name": "Usuario EcoNexo",
        "email": "",
        "location": {
            "lat": 40.4168,
            "lng": -3.7038,
            "city": "Madrid",
            "country": "España",
        },
        "interests": ["environment", "education", "community"],
        "pastEvents": [],
        "preferences": {
            "maxDistance": 25,
            "preferredCategories": ["Medio ambiente", "Educación"],
            "preferredTimes": ["morning", "afternoon"],
            "difficulty": ["easy", "medium"],
            "accessibility": True,
        },
        "impactScore": 0,
        "joinDate": "",
        "skills": [],
        "bio": "",
    }

