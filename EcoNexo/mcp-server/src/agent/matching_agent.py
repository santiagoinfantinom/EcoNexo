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
from ..tools import user_tools, project_tools, matching_tools, scraper_tools, rag_tools, distance_calculator, gamification_tools, outreach_tools, classification_tools

logger = logging.getLogger(__name__)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    google_api_key=os.getenv("GOOGLE_API_KEY")
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
    
    # Get gamification badges
    badges_result = loop.run_until_complete(gamification_tools.evaluate_badges(profile, history))
    badges = badges_result.get("data", {}).get("badges", [])
    
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
- Badges: {', '.join([b.get('name') for b in badges]) if badges else 'None'}

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
- skills: list of skills mentioned (e.g. "Python", "React", "Project Management")
- experience: string describing experience level/details (e.g. "Senior", "Junior", "5 years experience")
- date_from: start date in ISO format (optional)
- date_to: end date in ISO format (optional)
- difficulty: list of difficulty levels (easy, medium, hard) (optional)
- accessibility: boolean (optional)
- radius_km: search radius in km (optional)
- is_refinement: boolean indicating if this is a refinement of previous search
- search_online_jobs: boolean (true if user asks for online/external jobs, work, remote jobs, or scraped data)
- search_query: string (concise search terms for job search engine e.g. "Python Developer Remote", "Electrical Engineer Berlin")

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


def retrieve_knowledge(state: AgentState) -> AgentState:
    """Node 2.5: Retrieve relevant knowledge from RAG hub."""
    logger.info("Retrieving knowledge snippets")
    
    query = state.get("current_query", "")
    if not query:
        query = state["messages"][-1].content if state["messages"] else ""
    
    # Use the new RAG search tool
    snippets = rag_tools.search_knowledge(query)
    state["retrieved_knowledge"] = snippets
    
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
    
    # Search internal projects
    try:
        import asyncio
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
        projects = loop.run_until_complete(project_tools.search_projects(criteria))
        
        # Simple string match for demonstration
        if state.get("current_query"):
            query_lower = state.get("current_query").lower()
            filtered_projects = [
                p for p in projects 
                if query_lower in p.get("name", "").lower() or query_lower in p.get("description", "").lower()
            ]
            if filtered_projects:
                projects = filtered_projects
                
        state["candidate_projects"] = projects
    except Exception as e:
        logger.error(f"Error searching projects: {e}")
        state["candidate_projects"] = []
        
    return state


def search_external_jobs(state: AgentState) -> AgentState:
    """Node 3.5: Search for external jobs if requested or needed."""
    logger.info("Searching for external jobs")
    
    intent = state.get("intent", {})
    query = state.get("current_query", "")
    candidate_projects = state.get("candidate_projects", [])
    
    # Determine if we should search externally
    should_search_external = (
        intent.get("search_online_jobs") or 
        len(candidate_projects) < 3 or
        "trabajo" in query.lower() or 
        "job" in query.lower() or
        "empleo" in query.lower() or
        "remote" in query.lower() or
        "remoto" in query.lower()
    )
    
    if should_search_external:
        import asyncio
        profile = state.get("user_profile", {})
        # Get query terms from explicit filters (priority) or intent
        filters = state.get("filters") or {}
        logger.info(f"State filters: {filters}")
        
        search_query = ""
        # Improved location logic: Allow "Remote" AND specific location (e.g. Remote Europe)
        loc_parts = []
        if filters.get("isRemote"):
            loc_parts.append("Remote")
        
        if filters.get("location"):
             loc_parts.append(filters.get("location"))
        elif not filters.get("isRemote"):
             # Fallback to profile city ONLY if not searching Remote
             # (If Remote is checked but no location specified, we want GLOBAL remote, not Remote Madrid)
             extracted_loc = intent.get("city") or profile.get("location", {}).get("city")
             if extracted_loc:
                 loc_parts.append(extracted_loc)
             
        location = " ".join(loc_parts)

        # Construct query from explicit filters
        # Check if ANY filter is active (including salary)
        if filters and (filters.get("skills") or filters.get("location") or filters.get("isRemote") or (filters.get("salary") and filters.get("salary") != "Any")):
             parts = []
             # Add skills as OR group for broader matching
             if filters.get("skills"):
                 # Handle if skills is list or string
                 skills_val = filters["skills"]
                 skill_list = []
                 if isinstance(skills_val, list):
                     skill_list = skills_val
                 else:
                     skill_list = [str(skills_val)]
                 
                 # Join with OR and wrap in parenthesis
                 if len(skill_list) > 1:
                     parts.append(f"({' OR '.join(skill_list)})")
                 else:
                     parts.append(skill_list[0])
             
             # Add specific keywords from experience level
             experience = filters.get("experience")
             if experience and str(experience) != "0":
                 # Remove "Junior" from parts/query if it was added by skill selection or typed input
                 # to avoid "Junior ... Junior" redundancy
                 if int(experience) > 3:
                     parts.append("Senior")
                 elif int(experience) <= 1:
                     parts.append("Junior")
            
             # Add salary if present
             salary = filters.get("salary")
             if salary and salary != "Any":
                 parts.append(f"{salary}")

             # Add location/remote to query specific
             if filters.get("isRemote"):
                 parts.append("Remote")
                 
             # CRITICAL: If no explicit skills filter, allow text query to contribute
             if not filters.get("skills"):
                 raw_text = intent.get("search_query") or query
                 
                 # Intelligent Fallback Extraction (since LLM might 404)
                 # If text is long (> 5 words), try to extract keywords instead of using raw text
                 import re
                 words = raw_text.split()
                 if len(words) > 5:
                     # 1. Extract known tech keywords (case insensitive)
                     tech_keywords = [
                         "python", "javascript", "typescript", "react", "node", "django", "flask", 
                         "fastapi", "java", "c++", "c#", "go", "golang", "rust", "php", "ruby", 
                         "rails", "aws", "azure", "gcp", "docker", "kubernetes", "sql", "nosql", 
                         "openai", "llm", "ai", "ml", "machine learning", "deep learning", 
                         "nlp", "prompt", "engineering", "data", "analyst", "science", 
                         "frontend", "backend", "fullstack", "devops", "marketing", "sales", 
                         "design", "product", "manager", "junior", "senior", "lead",
                         "creativity", "creative", "creatividad", "creativo", "creativa",
                         "analytical", "analítico", "analítica", "analysis", "análisis", 
                         "thinking", "pensamiento", "leadership", "liderazgo", 
                         "communication", "comunicación", "team", "equipo", "proactive", "proactivo",
                         "resolution", "resolución", "solving", "problem"
                     ]
                     extracted = []
                     
                     # Check for known keywords
                     lower_text = raw_text.lower()
                     for k in tech_keywords:
                         if k in lower_text:
                             # Find the actual casing in text if possible, or title case
                             # Simple regex to find the word boundary matches
                             if re.search(r'\b' + re.escape(k) + r'\b', lower_text):
                                 extracted.append(k.title())
                                 
                     # 2. Extract capitalized words (heuristic for proper nouns/skills in Spanish too)
                     # Avoid start of sentence capitalization if it's not a keyword
                     cap_words = re.findall(r'\b[A-Z][a-zA-Z]+\b', raw_text)
                     # Filter out common non-keywords if needed, or just add them
                     # Merge unique
                     for w in cap_words:
                         if w.lower() not in [e.lower() for e in extracted] and len(w) > 2:
                             # Basic filter for common start words
                             if w.lower() not in ["hola", "tienes", "programo", "estoy", "busco", "necesito", "quiero"]:
                                 extracted.append(w)
                                 
                     if extracted:
                         parts.insert(0, f"({' OR '.join(extracted)})")
                     else:
                          # Fallback to cleaning if extraction failed
                          cleaned_text = raw_text.strip(".,;:!? ")
                          parts.insert(0, cleaned_text)
                 else:
                     # Short query, just use it cleaned
                     prefixes = ["ayudame", "ayúdame", "necesito", "busco", "quiero", "no", "tengo", "hola", "hi", "estoy", "buscando", "tienes", "ofertas"]
                     for p in prefixes:
                         if raw_text.lower().startswith(p + " "):
                             raw_text = raw_text[len(p):].strip()
                         elif raw_text.lower() == p:
                             raw_text = ""
                     
                     cleaned_text = raw_text.strip(".,;:!? ")
                     if cleaned_text:
                         parts.insert(0, cleaned_text)

             search_query = " ".join(parts)
        
        if not search_query:
             # Clean the raw query from "Ayudame", "Busco", etc if filters are empty
             raw_query = intent.get("search_query") or query
             # Remove common prefixes that confuse the scraper
             prefixes = ["ayudame", "ayúdame", "necesito", "busco", "quiero", "no", "tengo", "hola", "hi"]
             # Loop to remove multiple prefixes if present
             cleaned = False
             while not cleaned:
                 cleaned = True
                 for p in prefixes:
                     if raw_query.lower().startswith(p + " "):
                         raw_query = raw_query[len(p):].strip()
                         cleaned = False # Check again
                     elif raw_query.lower() == p: # Exact match
                         raw_query = ""
             
             search_query = raw_query.strip(".,;:!? ")

        
        # If extraction failed or returned nothing useful, clean the raw query manually
        if not search_query:
             # Remove common stop words in Spanish/English to leave just keywords
             # Extensive list to handle verbose user descriptions like "Tengo experiencia en..."
             stop_words = [
                 # Core job search fillers
                 "busco", "quiero", "necesito", "trabajo", "empleo", "puesto", "en", "de", "con", "para", 
                 "remoto", "remote", "job", "work", "looking", "for", "need", "hiring", "buscar", "ayudar", "ayudas", "puedes", "eso",
                 "tengo", "experiencia", "experience", "years", "anios", "años", "librerias", "libraries", 
                 "librerías", "como", "me", "interesan", "interesa", "los", "las", "el", "la", "un", "una", 
                 "sectores", "sociales", "social", "sector", "industry", "knowledge", "conocimiento",
                 "habilidades", "skills", "soy", "i", "am", "have", "with", "and", "y", "o", "or",
                 "mas", "más", "desarrollo", "nivel",
                 
                 # Common accented words and errors (tilde variations)
                 "mi", "mí", "tu", "tú", "el", "él", "se", "sé", "si", "sí", "de", "dé", "te", "té", "mas", "más", "aun", "aún",
                 "que", "qué", "cual", "cuál", "quien", "quién", "como", "cómo", "cuanto", "cuánto", "cuando", "cuándo", "donde", "dónde",
                 "este", "esté", "esta", "está", "ese", "ése", "esa", "ésa", "aquel", "aquél", "solo", "sólo",
                 "tambien", "también", "ademas", "además", "asi", "así", "aqui", "aquí", "alli", "allí", "ahi", "ahí", "aca", "acá",
                 "despues", "después", "segun", "según", "quizas", "quizás", "atraves", "través", "podria", "podría", "deberia", "debería",
                 "gustaria", "gustaría", "seria", "sería", "habia", "había", "estaria", "estaría", "tendria", "tendría",
                 "informacion", "información", "codigo", "código", "pagina", "página", "numero", "número", 
                 "area", "área", "dia", "día", "dias", "días", "ultimo", "último", "ultima", "última",
                 "practicas", "prácticas", "tecnologia", "tecnología", "tecnico", "técnico", "analisis", "análisis",
                 "busqueda", "búsqueda", "interes", "interés", "inglés", "ingles", "español", "espanol",
                 "exito", "éxito", "facil", "fácil", "dificil", "difícil", "rapido", "rápido", "util", "útil",
                 "comun", "común", "jovenes", "jóvenes", "imagenes", "imágenes", "examenes", "exámenes"
             ]
             words = query.lower().replace(".", " ").replace(",", " ").split()
             keywords = [w for w in words if w not in stop_words]
             
             # If still too long, apply heuristics
             if len(keywords) > 5:
                 # Heuristic 1: Keep capitalized words from original query (often technologies)
                 # We look at original query to check capitalization
                 original_words = query.replace(".", " ").replace(",", " ").split()
                 caps = [w for w in original_words if w and w[0].isupper() and w.lower() not in stop_words]
                 if len(caps) >= 1:
                     search_query = " ".join(caps)
                 else:
                     # Heuristic 2: Just take the first 3 cleaned keywords
                     search_query = " ".join(keywords[:3])
             else:
                 search_query = " ".join(keywords)
             
             # If result is empty, default to "python" or "developer" if present in original
             if not search_query:
                 if "python" in query.lower(): search_query = "python"
                 elif "developer" in query.lower(): search_query = "developer"
                 else: search_query = query # Last resort
        
        # Append skills if available (from extraction) to refine the search
        # Note: If LLM failed, skills will be empty, so the manual fallback above is critical
        skills = intent.get("skills", [])
        if skills:
            # Add top 2 skills to query
            search_query += " " + " ".join(skills[:2])

        # Append experience level if available
        experience = intent.get("experience")
        if experience:
             if "senior" in experience.lower(): search_query += " senior"
             elif "junior" in experience.lower(): search_query += " junior"

        external_jobs = asyncio.run(scraper_tools.search_online_jobs(
            query=search_query,
            location=location,
            limit=5
        ))
        # Combine results
        state["candidate_projects"] = candidate_projects + external_jobs
    
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
    intent = state.get("intent", {})
    
    if not matches:
        state["explanations"] = {"general": "No matching projects found. Please try adjusting your filters (location, exp, skills) or checking for typos."}
        return state

    # If we have matches, generate a simple explanation based on context
    # Try to detection language from query
    query_text = state.get("current_query", "").lower()
    is_spanish = any(w in query_text for w in ["hola", "ayuda", "trabajo", "busco", "quiero", "gracias", "traducelo", "idioma", "español", "spanish"])
    
    # Try using LLM for explanation first
    try:
        if matches:
            # Construct context for LLM
            matches_summary = "\n".join([f"- {m.get('name')} ({m.get('city')})" for m in matches])
            prompt = f"""
            You are a helpful assistant. The user searched for: "{state.get("current_query")}".
            I found these matches:
            {matches_summary}
            
            Write a very brief (1 sentence) explanation introducing these results in the SAME LANGUAGE as the user's query (Spanish or English).
            If the user asks for translation, ensure the response is in the requested language.
            """
            response = llm.invoke(prompt)
            explanation = response.content.strip()
    except Exception:
        # Fallback if LLM fails
        if intent.get("search_online_jobs") or any(m.get("is_external") for m in matches):
            count = len(matches)
            if is_spanish:
                explanation = f"He encontrado {count} oportunidades que coinciden con tu búsqueda."
            else:
                explanation = f"Found {count} opportunities that match your criteria."
            
            if intent.get("search_query"):
                 if is_spanish:
                     explanation += f" Enfocado en: {intent.get('search_query')}."
                 else:
                     explanation += f" Focused on: {intent.get('search_query')}."
        else:
            top_match = matches[0] if matches else None
            if top_match:
                 if is_spanish:
                     explanation = f"He encontrado varios proyectos. El mejor es {top_match.get('name')} en {top_match.get('city')}."
                 else:
                     explanation = f"I found several projects for you. The top match is {top_match.get('name')} in {top_match.get('city')}."
            else:
                 if is_spanish:
                     explanation = "Aquí tienes los mejores resultados que he encontrado."
                 else:
                     explanation = "Here are the best matches I could find."
    
    # Augment explanation with RAG context if available
    snippets = state.get("retrieved_knowledge", [])
    if snippets:
        rag_context = "\n\nInformación Adicional (Fuentes):\n"
        for s in snippets:
            rag_context += f"- {s['content']} (Fuente: {s['source']})\n"
        
        # Use LLM to blend the information naturally if possible
        try:
            blend_prompt = f"""
            Basándote en estos resultados de búsqueda:
            {explanation}
            
            Y esta información adicional:
            {rag_context}
            
            Escribe una sola respuesta coherente y amable que integre ambos. 
            Cita las fuentes (archivo.md o JSON) brevemente entre paréntesis.
            Mantén el idioma original (español si el input es español).
            """
            response = llm.invoke(blend_prompt)
            explanation = response.content.strip()
        except:
             explanation += rag_context

    state["explanations"] = {"general": explanation}
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
    workflow.add_node("retrieve_knowledge", retrieve_knowledge) # New node
    workflow.add_node("search_projects", search_projects)
    workflow.add_node("search_external_jobs", search_external_jobs)
    workflow.add_node("calculate_matches", calculate_matches)
    workflow.add_node("rank_matches", rank_matches)
    workflow.add_node("generate_explanation", generate_explanation)
    workflow.add_node("handle_feedback", handle_feedback)
    
    # Define edges
    workflow.set_entry_point("analyze_profile")
    workflow.add_edge("analyze_profile", "understand_intent")
    workflow.add_edge("understand_intent", "retrieve_knowledge") # Path updated
    workflow.add_edge("retrieve_knowledge", "search_projects")    # Path updated
    workflow.add_edge("search_projects", "search_external_jobs")
    workflow.add_edge("search_external_jobs", "calculate_matches")
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

