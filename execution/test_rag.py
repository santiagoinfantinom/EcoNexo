import sys
import os

# Add src to path
sys.path.append("/Users/santiago/Documents/Projects/EcoNexo/mcp-server")

from src.tools import rag_tools

def test_rag_search(query):
    print(f"\n--- Testing Query: '{query}' ---")
    results = rag_tools.search_knowledge(query)
    
    if not results:
        print("No matches found.")
        return

    print(f"Found {len(results)} matches:")
    for i, r in enumerate(results):
        print(f"\nMatch {i+1} (Score: {r['score']}):")
        print(f"Source: {r['source']} ({r['type']})")
        print(f"Content: {r['content'][:200]}...")

if __name__ == "__main__":
    test_rag_search("plástico")
    test_rag_search("energía")
    test_rag_search("limpieza ríos")
    test_rag_search("noexistenttopic")
