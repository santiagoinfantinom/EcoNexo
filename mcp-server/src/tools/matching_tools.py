"""
MCP Tools for matching operations.
These tools calculate match scores and provide explanations.
"""
import os
from typing import Dict, List, Optional, Any
import logging
from .project_tools import calculate_distance as calc_distance

logger = logging.getLogger(__name__)


def calculate_match_score(user_profile: Dict[str, Any], project: Dict[str, Any]) -> float:
    """
    Calculate match score between user profile and project (0-100).
    
    Args:
        user_profile: User profile dictionary
        project: Project dictionary
        
    Returns:
        Match score from 0 to 100
    """
    score = 0.0
    max_score = 100.0
    
    preferences = user_profile.get("preferences", {})
    user_location = user_profile.get("location", {})
    
    # Distance factor (30 points max)
    if user_location.get("lat") and user_location.get("lng"):
        distance = calc_distance(
            user_location["lat"],
            user_location["lng"],
            project.get("lat", 0),
            project.get("lng", 0)
        )
        max_distance = preferences.get("maxDistance", 25)
        if distance <= max_distance:
            # Closer = higher score
            distance_score = 30 * (1 - (distance / max_distance))
            score += distance_score
        else:
            # Penalty for being too far
            score -= 10
    
    # Category preference (25 points max)
    preferred_categories = preferences.get("preferredCategories", [])
    project_category = project.get("category", "")
    if project_category in preferred_categories:
        score += 25
    elif any(cat.lower() in project_category.lower() for cat in preferred_categories):
        score += 15
    
    # Interests match (20 points max)
    user_interests = user_profile.get("interests", [])
    project_desc = (
        project.get("description", "") + " " + 
        project.get("name", "") + " " +
        project.get("category", "")
    ).lower()
    
    interest_matches = sum(1 for interest in user_interests if interest.lower() in project_desc)
    if interest_matches > 0:
        score += min(20, interest_matches * 5)
    
    # Skills match (15 points max)
    user_skills = user_profile.get("skills", [])
    if user_skills:
        skill_matches = sum(1 for skill in user_skills if skill.lower() in project_desc)
        if skill_matches > 0:
            score += min(15, skill_matches * 5)
    
    # Availability (10 points max)
    available_spots = project.get("spots", 0)
    if available_spots > 0:
        score += min(10, available_spots / 5)  # More spots = higher score
    
    # Impact score bonus (for engaged users)
    impact_score = user_profile.get("impactScore", 0)
    if impact_score > 70:
        # High-impact users prefer high-impact projects
        if "alto impacto" in project_desc.lower() or "high impact" in project_desc.lower():
            score += 10
    
    # Ensure score is between 0 and 100
    return max(0.0, min(max_score, score))


def get_similar_users(user_id: str, user_profiles: List[Dict[str, Any]], limit: int = 5) -> List[Dict[str, Any]]:
    """
    Find users with similar interests and preferences.
    
    Args:
        user_id: Current user ID
        user_profiles: List of all user profiles
        limit: Maximum number of similar users to return
        
    Returns:
        List of similar user profiles
    """
    # Find current user
    current_user = next((u for u in user_profiles if u.get("id") == user_id), None)
    if not current_user:
        return []
    
    current_interests = set(current_user.get("interests", []))
    current_categories = set(current_user.get("preferences", {}).get("preferredCategories", []))
    
    # Calculate similarity scores
    similarities = []
    for user in user_profiles:
        if user.get("id") == user_id:
            continue
        
        user_interests = set(user.get("interests", []))
        user_categories = set(user.get("preferences", {}).get("preferredCategories", []))
        
        # Jaccard similarity for interests
        interest_intersection = len(current_interests & user_interests)
        interest_union = len(current_interests | user_interests)
        interest_similarity = interest_intersection / interest_union if interest_union > 0 else 0
        
        # Category similarity
        category_intersection = len(current_categories & user_categories)
        category_union = len(current_categories | user_categories)
        category_similarity = category_intersection / category_union if category_union > 0 else 0
        
        # Combined similarity score
        similarity_score = (interest_similarity * 0.6 + category_similarity * 0.4)
        
        similarities.append({
            "user": user,
            "similarity": similarity_score
        })
    
    # Sort by similarity and return top N
    similarities.sort(key=lambda x: x["similarity"], reverse=True)
    return [s["user"] for s in similarities[:limit]]


def get_common_projects(user1_id: str, user2_id: str, 
                       user1_history: List[Dict[str, Any]], 
                       user2_history: List[Dict[str, Any]]) -> List[str]:
    """
    Get projects that both users have participated in.
    
    Args:
        user1_id: First user ID
        user2_id: Second user ID
        user1_history: First user's history
        user2_history: Second user's history
        
    Returns:
        List of common project IDs
    """
    user1_project_ids = {h.get("id") for h in user1_history if h.get("type") in ["event", "project"]}
    user2_project_ids = {h.get("id") for h in user2_history if h.get("type") in ["event", "project"]}
    
    return list(user1_project_ids & user2_project_ids)


def explain_match(user_profile: Dict[str, Any], project: Dict[str, Any], score: float) -> str:
    """
    Generate a detailed explanation of why a project matches a user.
    
    Args:
        user_profile: User profile dictionary
        project: Project dictionary
        score: Calculated match score
        
    Returns:
        Explanation string
    """
    reasons = []
    preferences = user_profile.get("preferences", {})
    user_location = user_profile.get("location", {})
    
    # Distance explanation
    if user_location.get("lat") and user_location.get("lng"):
        distance = calc_distance(
            user_location["lat"],
            user_location["lng"],
            project.get("lat", 0),
            project.get("lng", 0)
        )
        max_distance = preferences.get("maxDistance", 25)
        if distance <= max_distance:
            reasons.append(f"A solo {distance:.1f} km de tu ubicación")
    
    # Category match
    preferred_categories = preferences.get("preferredCategories", [])
    project_category = project.get("category", "")
    if project_category in preferred_categories:
        reasons.append(f"Coincide con tu interés en {project_category}")
    
    # Interests match
    user_interests = user_profile.get("interests", [])
    project_desc = (
        project.get("description", "") + " " + 
        project.get("name", "")
    ).lower()
    
    matched_interests = [i for i in user_interests if i.lower() in project_desc]
    if matched_interests:
        reasons.append(f"Relacionado con tus intereses: {', '.join(matched_interests[:3])}")
    
    # Availability
    available_spots = project.get("spots", 0)
    if available_spots > 0:
        reasons.append(f"{available_spots} plazas disponibles")
    
    # Impact
    impact_score = user_profile.get("impactScore", 0)
    if impact_score > 70 and "alto impacto" in project_desc.lower():
        reasons.append("Alto impacto ambiental")
    
    if not reasons:
        reasons.append("Proyecto disponible en tu área")
    
    explanation = f"Match del {score:.0f}%: " + ". ".join(reasons) + "."
    return explanation

