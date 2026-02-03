import os
import json
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

KNOWLEDGE_DIR = "/Users/santiago/Documents/Projects/EcoNexo/docs/knowledge"

def search_knowledge(query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Search the knowledge base for snippets relevant to the query.
    
    Args:
        query: User search string
        limit: Max snippets to return
        
    Returns:
        List of relevant snippets with source information
    """
    results = []
    query_lower = query.lower()
    
    # 1. Search in extracted_data.json (Projects and Tips)
    json_path = os.path.join(KNOWLEDGE_DIR, "extracted_data.json")
    if os.path.exists(json_path):
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                kb = json.load(f)
                
            # Search projects
            for p in kb.get("projects", []):
                text_to_search = f"{p['title']} {p['description']} {p['impact']}".lower()
                if any(word in text_to_search for word in query_lower.split()):
                    results.append({
                        "content": f"Proyecto: {p['title']}. Descripción: {p['description']}. Impacto: {p['impact']}",
                        "source": p['source'],
                        "type": "project",
                        "score": 0.8  # Simplistic scoring
                    })
            
            # Search tips
            for t in kb.get("tips", []):
                text_to_search = f"{t.get('title_key', '')} {t.get('description_key', '')}".lower()
                if any(word in text_to_search for word in query_lower.split()):
                    results.append({
                        "content": f"Consejo (Tip): ID {t['id']}. Referencia: {t['title_key']}",
                        "source": t['source'],
                        "type": "tip",
                        "score": 0.7
                    })
        except Exception as e:
            logger.error(f"Error reading JSON knowledge base: {e}")

    # 2. Search in Markdown files
    for filename in os.listdir(KNOWLEDGE_DIR):
        if filename.endswith(".md"):
            file_path = os.path.join(KNOWLEDGE_DIR, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Simple keyword match in MD files
                if any(word in content.lower() for word in query_lower.split()):
                    # Extract relevant paragraph or snippet (heuristic)
                    paragraphs = content.split('\n\n')
                    for p in paragraphs:
                        if any(word in p.lower() for word in query_lower.split()):
                            results.append({
                                "content": p.strip()[:500], # Limit snippet size
                                "source": filename,
                                "type": "document",
                                "score": 0.9
                            })
                            # Don't add too many snippets from the same file
                            if len([r for r in results if r['source'] == filename]) > 2:
                                break
            except Exception as e:
                logger.error(f"Error reading {filename}: {e}")

    # Sort results by score and return top limit
    results.sort(key=lambda x: x['score'], reverse=True)
    return results[:limit]
