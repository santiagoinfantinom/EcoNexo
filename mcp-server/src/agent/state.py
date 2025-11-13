"""
State definitions for the LangGraph matching agent.
"""
from typing import TypedDict, List, Optional, Dict, Any
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage


class AgentState(TypedDict):
    """State of the matching agent."""
    # Conversation history
    messages: List[BaseMessage]
    
    # User information
    user_id: str
    user_profile: Optional[Dict[str, Any]]
    user_history: Optional[List[Dict[str, Any]]]
    
    # Current query and intent
    current_query: str
    intent: Optional[Dict[str, Any]]  # Extracted intent with criteria
    
    # Matching results
    candidate_projects: List[Dict[str, Any]]
    matched_projects: List[Dict[str, Any]]
    match_scores: Dict[str, float]  # project_id -> score
    explanations: Dict[str, str]  # project_id -> explanation
    
    # Feedback and refinement
    feedback: Optional[Dict[str, Any]]  # User feedback on matches
    refinement_needed: bool
    preferences_updated: bool
    
    # Metadata
    iteration_count: int  # Track number of refinements

