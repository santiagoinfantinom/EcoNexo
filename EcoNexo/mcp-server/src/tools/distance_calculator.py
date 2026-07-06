"""
Tool: distance_calculator
Description: Calcula la distancia entre dos coordenadas (lat, lng) para filtrar proyectos cercanos
Created: 2026-02-03
"""
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field
import logging

logger = logging.getLogger(__name__)


import math

class DistanceCalculatorInput(BaseModel):
    """Input schema for distance_calculator."""
    lat1: float = Field(..., description="Latitude of the first point")
    lng1: float = Field(..., description="Longitude of the first point")
    lat2: float = Field(..., description="Latitude of the second point")
    lng2: float = Field(..., description="Longitude of the second point")


async def distance_calculator(lat1: float, lng1: float, lat2: float, lng2: float) -> Dict[str, Any]:
    """
    Calcula la distancia entre dos coordenadas (lat, lng) usando la fórmula de Haversine.
    
    Args:
        lat1: Latitude of the first point
        lng1: Longitude of the first point
        lat2: Latitude of the second point
        lng2: Longitude of the second point
        
    Returns:
        Dictionary with status and distance in kilometers
    """
    logger.info(f"distance_calculator called for ({lat1}, {lng1}) and ({lat2}, {lng2})")
    
    try:
        # Earth radius in kilometers
        R = 6371.0
        
        phi1, phi2 = math.radians(lat1), math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlamba = math.radians(lng2 - lng1)
        
        a = math.sin(dphi / 2)**2 + \
            math.cos(phi1) * math.cos(phi2) * math.sin(dlamba / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = R * c
        
        return {
            "status": "success",
            "data": {
                "distance": round(distance, 2),
                "unit": "km"
            },
            "message": "Distance calculated successfully"
        }
        
    except Exception as e:
        logger.error(f"Error in distance_calculator: {e}")
        return {
            "status": "error",
            "data": {},
            "message": str(e)
        }


# Tool metadata for LangGraph registration
TOOL_METADATA = {
    "name": "distance_calculator",
    "description": "Calcula la distancia entre dos coordenadas (lat, lng) para filtrar proyectos cercanos",
    "input_schema": DistanceCalculatorInput.model_json_schema(),
}
