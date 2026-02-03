"""
MCP Server for EcoNexo Matching Agent.
Exposes HTTP endpoints and MCP tools.
"""
import os
import logging
import asyncio
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from .agent.matching_agent import create_matching_agent
from .agent.state import AgentState

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="EcoNexo MCP Server", version="0.1.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agent
matching_agent = None

try:
    matching_agent = create_matching_agent()
    logger.info("Matching agent initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize matching agent: {e}")
    logger.warning("Server will start but matching endpoints will fail")


# Request/Response models
class MatchRequest(BaseModel):
    user_id: str
    query: str
    context: Optional[Dict[str, Any]] = None
    filters: Optional[Dict[str, Any]] = None


class MatchResponse(BaseModel):
    matches: List[Dict[str, Any]]
    explanations: Dict[str, str]
    suggestions: List[str]
    score_summary: Dict[str, float]


class ExplainRequest(BaseModel):
    user_id: str
    project_id: str


class RefineRequest(BaseModel):
    user_id: str
    query: str
    feedback: Dict[str, Any]
    previous_matches: Optional[List[str]] = None


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "agent_initialized": matching_agent is not None
    }


@app.get("/stats")
async def get_stats():
    """
    Get agent saturation stats.
    Returns metrics about agent usage and health.
    """
    if not matching_agent:
        raise HTTPException(status_code=503, detail="Matching agent not initialized")
    
    try:
        # Since LangGraph state is per-thread, we'd ideally aggregate stats.
        # For this MVP, we'll return server-level stats if available, or just mock some
        # indicators that would be real in a production system with a shared state store.
        
        # In a real system, we'd query the checkpointer/store for active threads, average message counts, etc.
        # Here we will infer some stats from the process execution or simple counters if we had them.
        
        # For now, let's return mostly static structure that the frontend can consume, 
        # plus any real info we can grab.
        
        return {
            "status": "healthy",
            "active_threads": 1,  # Mock for demo or simple counter
            "average_response_time_ms": 1200, # Mock
            "message_queue_depth": 0,
            "saturation_index": 0.2,  # 0.0 to 1.0 (Low to High saturation)
            "rate_limits": {
                "remaining_requests": 950,
                "reset_time_seconds": 3600
            }
        }
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        return {"status": "error", "message": str(e)}



class EventSearchRequest(BaseModel):
    query: Optional[str] = None
    city: str


@app.post("/events/search")
async def search_events(request: EventSearchRequest):
    """
    Search for environmental events in a specific city.
    """
    try:
        from .tools.scraper_tools import search_online_events
        
        events = await search_online_events(
            query=request.query,
            location=request.city,
            limit=10
        )
        
        return {"events": events}
    except Exception as e:
        logger.error(f"Error searching events: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/match", response_model=MatchResponse)
async def match_projects(request: MatchRequest):

    """
    Main endpoint for project matching.
    
    Args:
        request: MatchRequest with user_id, query, and optional context
        
    Returns:
        MatchResponse with matches, explanations, and suggestions
    """
    if not matching_agent:
        raise HTTPException(status_code=503, detail="Matching agent not initialized")
    
    try:
        logger.info(f"Received match request for user {request.user_id}")
        logger.info(f"Request filters: {request.filters}")
        logger.info(f"Request query: {request.query}")
        
        # Initialize state
        initial_state: AgentState = {
            "messages": [],
            "user_id": request.user_id,
            "user_profile": None,
            "user_history": None,
            "current_query": request.query,
            "filters": request.filters,  # Pass filters to state
            "intent": None,
            "candidate_projects": [],
            "matched_projects": [],
            "match_scores": {},
            "explanations": {},
            "retrieved_knowledge": [],
            "feedback": None,
            "refinement_needed": False,
            "preferences_updated": False,
            "iteration_count": 0,
        }
        
        # Add user message
        from langchain_core.messages import HumanMessage
        initial_state["messages"] = [HumanMessage(content=request.query)]
        
        # Run agent
        config = {"configurable": {"thread_id": f"user_{request.user_id}"}}
        final_state = await asyncio.to_thread(
            matching_agent.invoke,
            initial_state,
            config
        )
        
        # Extract results
        matches = final_state.get("matched_projects", [])
        explanations = final_state.get("explanations", {})
        scores = final_state.get("match_scores", {})
        
        # Generate suggestions
        suggestions = _generate_suggestions(final_state)
        
        # Format response
        return MatchResponse(
            matches=[_format_project(p) for p in matches],
            explanations=explanations,
            suggestions=suggestions,
            score_summary={p.get("id"): scores.get(p.get("id", ""), 0) for p in matches[:5]}
        )
    
    except Exception as e:
        logger.error(f"Error in match endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/explain")
async def explain_match(request: ExplainRequest):
    """
    Explain why a specific project matches a user.
    
    Args:
        request: ExplainRequest with user_id and project_id
        
    Returns:
        Explanation string
    """
    try:
        from .tools import user_tools, project_tools, matching_tools
        
        # Get user profile and project
        user_profile = await user_tools.get_user_profile(request.user_id)
        project = await project_tools.get_project_details(request.project_id)
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Calculate score and explanation
        score = matching_tools.calculate_match_score(user_profile, project)
        explanation = matching_tools.explain_match(user_profile, project, score)
        
        return {
            "project_id": request.project_id,
            "score": score,
            "explanation": explanation
        }
    
    except Exception as e:
        logger.error(f"Error in explain endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/refine")
async def refine_search(request: RefineRequest):
    """
    Refine search based on user feedback.
    
    Args:
        request: RefineRequest with user_id, query, feedback, and previous matches
        
    Returns:
        Refined MatchResponse
    """
    if not matching_agent:
        raise HTTPException(status_code=503, detail="Matching agent not initialized")
    
    try:
        # Initialize state with feedback
        initial_state: AgentState = {
            "messages": [],
            "user_id": request.user_id,
            "user_profile": None,
            "user_history": None,
            "current_query": request.query,
            "intent": None,
            "candidate_projects": [],
            "matched_projects": [],
            "match_scores": {},
            "explanations": {},
            "retrieved_knowledge": [],
            "feedback": request.feedback,
            "refinement_needed": True,
            "preferences_updated": False,
            "iteration_count": 1,
        }
        
        # Add user message with feedback context
        from langchain_core.messages import HumanMessage
        feedback_msg = f"{request.query} (Feedback: {request.feedback})"
        initial_state["messages"] = [HumanMessage(content=feedback_msg)]
        
        # Run agent
        config = {"configurable": {"thread_id": f"user_{request.user_id}_refine"}}
        final_state = await asyncio.to_thread(
            matching_agent.invoke,
            initial_state,
            config
        )
        
        # Extract results
        matches = final_state.get("matched_projects", [])
        explanations = final_state.get("explanations", {})
        scores = final_state.get("match_scores", {})
        
        # Generate suggestions
        suggestions = _generate_suggestions(final_state)
        
        return MatchResponse(
            matches=[_format_project(p) for p in matches],
            explanations=explanations,
            suggestions=suggestions,
            score_summary={p.get("id"): scores.get(p.get("id", ""), 0) for p in matches[:5]}
        )
    
    except Exception as e:
        logger.error(f"Error in refine endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


def _format_project(project: Dict[str, Any]) -> Dict[str, Any]:
    """Format project for API response."""
    return {
        "id": project.get("id", ""),
        "name": project.get("name", ""),
        "name_en": project.get("name_en"),
        "name_de": project.get("name_de"),
        "description": project.get("description", ""),
        "description_en": project.get("description_en"),
        "description_de": project.get("description_de"),
        "category": project.get("category", ""),
        "city": project.get("city", ""),
        "country": project.get("country", ""),
        "lat": project.get("lat", 0),
        "lng": project.get("lng", 0),
        "spots": project.get("spots", 0),
        "image_url": project.get("image_url"),
        "info_url": project.get("info_url"),
        "startsAt": project.get("startsAt"),
        "endsAt": project.get("endsAt"),
        "isPermanent": project.get("isPermanent", False),
    }


def _generate_suggestions(state: AgentState) -> List[str]:
    """Generate suggestions based on matching results."""
    suggestions = []
    matches = state.get("matched_projects", [])
    user_profile = state.get("user_profile", {})
    
    if not matches:
        suggestions.append("Try expanding your search radius or adjusting your preferences")
        return suggestions
    
    # Category suggestions
    categories = [m.get("category") for m in matches[:5]]
    unique_categories = list(set(categories))
    if len(unique_categories) > 1:
        suggestions.append(f"Explore projects in: {', '.join(unique_categories[:3])}")
    
    # Location suggestions
    user_location = user_profile.get("location", {})
    if user_location.get("city"):
        suggestions.append(f"More projects available in {user_location.get('city')}")
    
    # Time suggestions
    if len(matches) < 3:
        suggestions.append("Consider adjusting your date preferences for more options")
    
    return suggestions


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("MCP_SERVER_PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)

