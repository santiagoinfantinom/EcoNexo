"""
Tool: gamification_tools
Description: Wraps the eco-badge-designer skill to manage badges.
"""
import sys
import os
from pathlib import Path
from typing import Dict, Any, List
from pydantic import BaseModel, Field
import logging

logger = logging.getLogger(__name__)

# Add skill script to path
SKILL_PATH = Path(os.getcwd()) / ".agent" / "skills" / "eco-badge-designer" / "scripts"
if str(SKILL_PATH) not in sys.path:
    sys.path.append(str(SKILL_PATH))

try:
    from manage_badges import evaluate_user_badges
except ImportError:
    logger.error(f"Could not import manage_badges from {SKILL_PATH}")
    evaluate_user_badges = None

class BadgeEvaluationInput(BaseModel):
    """Input schema for evaluate_badges."""
    user_profile: Dict[str, Any] = Field(..., description="User profile dictionary")
    user_history: List[Dict[str, Any]] = Field(..., description="List of user's past projects/events")

async def evaluate_badges(user_profile: Dict[str, Any], user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Evaluates and assigns badges to a user based on their history.
    
    Args:
        user_profile: User profile data
        user_history: User's activity history
        
    Returns:
        Dictionary with status and list of new badges
    """
    if not evaluate_user_badges:
        return {
            "status": "error",
            "message": "Skill script not found or could not be imported"
        }
        
    try:
        badges = evaluate_user_badges(user_profile, user_history)
        return {
            "status": "success",
            "data": {
                "badges": badges,
                "count": len(badges)
            }
        }
    except Exception as e:
        logger.error(f"Error evaluating badges: {e}")
        return {
            "status": "error",
            "message": str(e)
        }

# Tool metadata
TOOL_METADATA = {
    "name": "evaluate_badges",
    "description": "Evalúa y asigna insignias (badges) a un usuario basándose en su historial de participación",
    "input_schema": BadgeEvaluationInput.model_json_schema(),
}
