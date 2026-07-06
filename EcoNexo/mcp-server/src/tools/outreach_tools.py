"""
Tool: outreach_tools
Description: Wraps the volunteer-outreach-assistant skill to generate personalized messages.
"""
import sys
import os
from pathlib import Path
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
import logging

logger = logging.getLogger(__name__)

# Add skill script to path
SKILL_PATH = Path(os.getcwd()) / ".agent" / "skills" / "volunteer-outreach-assistant" / "scripts"
if str(SKILL_PATH) not in sys.path:
    sys.path.append(str(SKILL_PATH))

try:
    from generate_outreach import generate_message
except ImportError:
    logger.error(f"Could not import generate_outreach from {SKILL_PATH}")
    generate_message = None

class OutreachInput(BaseModel):
    """Input schema for generate_outreach_message."""
    user_profile: Dict[str, Any] = Field(..., description="User profile dictionary")
    project: Dict[str, Any] = Field(..., description="Project details dictionary")

async def generate_outreach_message(user_profile: Dict[str, Any], project: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates a personalized outreach message for a volunteer.
    
    Args:
        user_profile: User profile data
        project: Project data
        
    Returns:
        Dictionary with status and generated message
    """
    if not generate_message:
        return {
            "status": "error",
            "message": "Skill script not found or could not be imported"
        }
        
    try:
        message = generate_message(user_profile, project)
        return {
            "status": "success",
            "data": {
                "message": message
            }
        }
    except Exception as e:
        logger.error(f"Error generating outreach message: {e}")
        return {
            "status": "error",
            "message": str(e)
        }

# Tool metadata
TOOL_METADATA = {
    "name": "generate_outreach_message",
    "description": "Genera un mensaje de invitación personalizado para un voluntario basado en su perfil y el proyecto",
    "input_schema": OutreachInput.model_json_schema(),
}
