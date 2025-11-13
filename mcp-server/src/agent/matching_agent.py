"""
LangGraph agent for intelligent volunteer matching.
"""
import os
import logging
from typing import Dict, Any, List
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver

from .state import AgentState
from ..tools import user_tools, project_tools, matching_tools

logger = logging.getLogger(__name__)

# Initialize Gemini LLM
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable is required")

llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    google_api_key=GOOGLE_API_KEY,
    temperature=0.7,
)


def analyze_profile(state: AgentState) -> AgentState:
    """Node 1: Analyze user profile and load history."""
    logger.info(f"Analyzing profile for user: {state['user_id']}")
    
    # Load user profile (synchronous wrapper for async functions)
    import asyncio
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    profile = loop.run_until_complete(user_tools.get_user_profile(state["user_id"]))
    history = loop.run_until_complete(user_tools.get_user_history(state["user_id"]))
    
    state["user_profile"] = profile
    state["user_history"] = history
    
    # Add system message with user context
    system_msg = SystemMessage(content=f"""
You are an intelligent matching assistant for EcoNexo, a platform connecting volunteers with sustainable projects.

User Profile:
- Name: {profile.get('name', 'User')}
- Location: {profile.get('location', {}).get('city', 'Unknown')}, {profile.get('location', {}).get('country', 'Unknown')}
- Interests: {', '.join(profile.get('interests', []))}
- Preferred Categories: {', '.join(profile.get('preferences', {}).get('preferredCategories', []))}
- Max Distance: {profile.get('preferences', {}).get('maxDistance', 25)} km
- Past Events: {len(history)} events participated

Your goal is to understand the user's intent and find the best matching projects.
""")
    
    state["messages"] = [system_msg]
    
    return state


def understand_intent(state: AgentState) -> AgentState:
    """Node 2: Understand user intent and extract search criteria."""
    logger.info("Understanding user intent")
    
    query = state.get("current_query", "")
    if not query:
        query = state["messages"][-1].content if state["messages"] else ""
    
    # Use Gemini to extract intent
    prompt = ChatPromptTemplate.from_messages([
        ("system", """Extract search criteria from the user's query. Return a JSON object with:
- category: list of categories (Medio ambiente, Educación, Salud, Comunidad, Océanos, Alimentación, Tecnología)
- city: city name (optional)
- country: country name (optional)
- date_from: start date in ISO format (optional)
- date_to: end date in ISO format (optional)
- difficulty: list of difficulty levels (easy, medium, hard) (optional)
- accessibility: boolean (optional)
- radius_km: search radius in km (optional)
- is_refinement: boolean indicating if this is a refinement of previous search

Return ONLY valid JSON, no other text."""),
        ("human", "{query}")
    ])
    
    chain = prompt | llm
    try:
        response = chain.invoke({"query": query})
        import json
        intent_str = response.content.strip()
        # Remove markdown code blocks if present
        if intent_str.startswith("```"):
            intent_str = intent_str.split("```")[1]
            if intent_str.startswith("json"):
                intent_str = intent_str[4:]
        intent_str = intent_str.strip()
        
        intent = json.loads(intent_str)
        
        # Add user location if not specified
        if state.get("user_profile") and not intent.get("city"):
            user_loc = state["user_profile"].get("location", {})
            if user_loc.get("lat") and user_loc.get("lng"):
                intent["lat"] = user_loc["lat"]
                intent["lng"] = user_loc["lng"]
                intent["radius_km"] = intent.get("radius_km") or state["user_profile"].get("preferences", {}).get("maxDistance", 25)
        
        state["intent"] = intent
    except Exception as e:
        logger.error(f"Error understanding intent: {e}")
        # Default intent
        state["intent"] = {
            "category": state.get("user_profile", {}).get("preferences", {}).get("preferredCategories", []),
            "radius_km": state.get("user_profile", {}).get("preferences", {}).get("maxDistance", 25),
            "is_refinement": False
        }
    
    return state


def search_projects(state: AgentState) -> AgentState:
    """Node 3: Search for projects based on criteria."""
    logger.info("Searching for projects")
    
    intent = state.get("intent", {})
    
    # Build search criteria
    criteria = {}
    if intent.get("category"):
        criteria["category"] = intent["category"]
    if intent.get("city"):
        criteria["city"] = intent["city"]
    if intent.get("country"):
        criteria["country"] = intent["country"]
    if intent.get("lat") and intent.get("lng"):
        criteria["lat"] = intent["lat"]
        criteria["lng"] = intent["lng"]
        criteria["radius_km"] = intent.get("radius_km", 25)
    if intent.get("date_from"):
        criteria["date_from"] = intent["date_from"]
    if intent.get("date_to"):
        criteria["date_to"] = intent["date_to"]
    if intent.get("accessibility") is not None:
        criteria["accessibility"] = intent["accessibility"]
    
    # Search projects (synchronous wrapper)
    import asyncio
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    projects = loop.run_until_complete(project_tools.search_projects(criteria))
    
    state["candidate_projects"] = projects
    
    return state


def calculate_matches(state: AgentState) -> AgentState:
    """Node 4: Calculate match scores for candidate projects."""
    logger.info("Calculating match scores")
    
    user_profile = state.get("user_profile")
    if not user_profile:
        state["matched_projects"] = []
        state["match_scores"] = {}
        return state
    
    candidates = state.get("candidate_projects", [])
    scores = {}
    explanations = {}
    
    for project in candidates:
        score = matching_tools.calculate_match_score(user_profile, project)
        project_id = project.get("id", "")
        scores[project_id] = score
        explanations[project_id] = matching_tools.explain_match(user_profile, project, score)
    
    # Sort by score and take top 10
    sorted_projects = sorted(
        candidates,
        key=lambda p: scores.get(p.get("id", ""), 0),
        reverse=True
    )[:10]
    
    state["matched_projects"] = sorted_projects
    state["match_scores"] = scores
    state["explanations"] = explanations
    
    return state


def rank_matches(state: AgentState) -> AgentState:
    """Node 5: Use Gemini for intelligent re-ranking."""
    logger.info("Re-ranking matches with AI")
    
    matches = state.get("matched_projects", [])
    scores = state.get("match_scores", {})
    user_profile = state.get("user_profile", {})
    
    if not matches:
        return state
    
    # Prepare context for re-ranking
    matches_context = []
    for project in matches[:10]:  # Top 10 for re-ranking
        project_id = project.get("id", "")
        matches_context.append({
            "id": project_id,
            "name": project.get("name", ""),
            "category": project.get("category", ""),
            "description": project.get("description", "")[:200],
            "score": scores.get(project_id, 0)
        })
    
    # Use Gemini to re-rank
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are re-ranking project matches for a user. Consider:
- User preferences: {preferences}
- User interests: {interests}
- Conversation context: {query}

Re-rank the projects by relevance. Return a JSON array of project IDs in order of best match first.
Return ONLY the JSON array, no other text."""),
        ("human", "Projects to rank:\n{projects}")
    ])
    
    try:
        import json
        preferences_str = json.dumps(user_profile.get("preferences", {}))
        interests_str = ", ".join(user_profile.get("interests", []))
        query = state.get("current_query", "")
        projects_str = json.dumps(matches_context)
        
        chain = prompt | llm
        response = chain.invoke({
            "preferences": preferences_str,
            "interests": interests_str,
            "query": query,
            "projects": projects_str
        })
        
        ranked_ids_str = response.content.strip()
        if ranked_ids_str.startswith("```"):
            ranked_ids_str = ranked_ids_str.split("```")[1]
            if ranked_ids_str.startswith("json"):
                ranked_ids_str = ranked_ids_str[4:]
        ranked_ids_str = ranked_ids_str.strip()
        
        ranked_ids = json.loads(ranked_ids_str)
        
        # Re-order matches based on ranking
        id_to_project = {p.get("id"): p for p in matches}
        reordered = [id_to_project.get(pid) for pid in ranked_ids if pid in id_to_project]
        # Add any projects not in ranking
        for project in matches:
            if project.get("id") not in ranked_ids:
                reordered.append(project)
        
        state["matched_projects"] = reordered[:10]
    except Exception as e:
        logger.error(f"Error in re-ranking: {e}")
        # Keep original order if re-ranking fails
        pass
    
    return state


def generate_explanation(state: AgentState) -> AgentState:
    """Node 6: Generate natural language explanation."""
    logger.info("Generating explanation")
    
    matches = state.get("matched_projects", [])[:5]  # Top 5 for explanation
    scores = state.get("match_scores", {})
    explanations = state.get("explanations", {})
    user_profile = state.get("user_profile", {})
    
    if not matches:
        state["explanations"] = {"general": "No matching projects found. Try adjusting your search criteria."}
        return state
    
    # Use Gemini to generate a natural explanation
    prompt = ChatPromptTemplate.from_messages([
        ("system", """Generate a friendly, personalized explanation for why these projects match the user.
User: {user_name}
Interests: {interests}
Location: {location}

Be conversational and highlight the best matches. Keep it concise (2-3 sentences)."""),
        ("human", """Top matches:
{matches}

Generate an explanation."""),
    ])
    
    try:
        matches_str = "\n".join([
            f"- {p.get('name', 'Project')} ({scores.get(p.get('id', ''), 0):.0f}% match): {explanations.get(p.get('id', ''), '')}"
            for p in matches
        ])
        
        chain = prompt | llm
        response = chain.invoke({
            "user_name": user_profile.get("name", "User"),
            "interests": ", ".join(user_profile.get("interests", [])[:5]),
            "location": f"{user_profile.get('location', {}).get('city', '')}, {user_profile.get('location', {}).get('country', '')}",
            "matches": matches_str
        })
        
        state["explanations"]["general"] = response.content
    except Exception as e:
        logger.error(f"Error generating explanation: {e}")
        state["explanations"]["general"] = "Found several projects that match your preferences!"
    
    return state


def handle_feedback(state: AgentState) -> AgentState:
    """Node 7: Handle user feedback and update preferences."""
    logger.info("Handling feedback")
    
    feedback = state.get("feedback")
    if not feedback:
        state["refinement_needed"] = False
        return state
    
    # Detect negative feedback
    is_negative = feedback.get("negative", False)
    if is_negative:
        # Update preferences based on what user didn't like
        user_profile = state.get("user_profile", {})
        preferences = user_profile.get("preferences", {})
        
        # Simple preference update (can be enhanced)
        if feedback.get("reason"):
            reason = feedback["reason"].lower()
            # Remove disliked categories
            if "no me gusta" in reason or "no me interesa" in reason:
                # This would need more sophisticated parsing
                pass
        
        # Mark for refinement
        state["refinement_needed"] = True
        state["preferences_updated"] = True
        
        # Update iteration count
        state["iteration_count"] = state.get("iteration_count", 0) + 1
    
    return state


def should_continue(state: AgentState) -> str:
    """Conditional edge: continue to feedback or end."""
    if state.get("refinement_needed"):
        return "handle_feedback"
    return "end"


def create_matching_agent() -> StateGraph:
    """Create and configure the matching agent graph."""
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("analyze_profile", analyze_profile)
    workflow.add_node("understand_intent", understand_intent)
    workflow.add_node("search_projects", search_projects)
    workflow.add_node("calculate_matches", calculate_matches)
    workflow.add_node("rank_matches", rank_matches)
    workflow.add_node("generate_explanation", generate_explanation)
    workflow.add_node("handle_feedback", handle_feedback)
    
    # Define edges
    workflow.set_entry_point("analyze_profile")
    workflow.add_edge("analyze_profile", "understand_intent")
    workflow.add_edge("understand_intent", "search_projects")
    workflow.add_edge("search_projects", "calculate_matches")
    workflow.add_edge("calculate_matches", "rank_matches")
    workflow.add_edge("rank_matches", "generate_explanation")
    workflow.add_conditional_edges(
        "generate_explanation",
        should_continue,
        {
            "handle_feedback": "handle_feedback",
            "end": END
        }
    )
    workflow.add_edge("handle_feedback", "understand_intent")  # Refinement loop
    
    # Add memory for conversation
    memory = MemorySaver()
    
    return workflow.compile(checkpointer=memory)

