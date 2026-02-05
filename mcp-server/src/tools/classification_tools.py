"""
Tool: classification_tools
Description: Wraps the smart-categorizer skill to categorize projects.
"""
import sys
import os
from pathlib import Path
from typing import Dict, Any, List
from pydantic import BaseModel, Field
import logging

logger = logging.getLogger(__name__)

# Add skill script to path
SKILL_PATH = Path(os.getcwd()) / ".agent" / "skills" / "smart-categorizer" / "scripts"
if str(SKILL_PATH) not in sys.path:
    sys.path.append(str(SKILL_PATH))

try:
    from categorize_project import suggest_categories
except ImportError:
    logger.error(f"Could not import categorize_project from {SKILL_PATH}")
    suggest_categories = None

class CategorizationInput(BaseModel):
    """Input schema for categorize_project_text."""
    text: str = Field(..., description="Text content (title + description) of the project to categorize")

async def categorize_project_text(text: str) -> Dict[str, Any]:
    """
    Categorizes a project based on its text description.
    
    Args:
        text: Project title and description combined
        
    Returns:
        Dictionary with status, categories, and tags
    """
    if not suggest_categories:
        return {
            "status": "error",
            "message": "Skill script not found or could not be imported"
        }
        
    try:
        result = suggest_categories(text)
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        logger.error(f"Error categorizing project: {e}")
        return {
            "status": "error",
            "message": str(e)
        }

# Tool metadata
TOOL_METADATA = {
    "name": "categorize_project_text",
    "description": "Analiza el texto de un proyecto para sugerir categorías y etiquetas automáticamente",
    "input_schema": CategorizationInput.model_json_schema(),
}
