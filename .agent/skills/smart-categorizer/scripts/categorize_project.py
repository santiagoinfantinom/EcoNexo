import sys
import json
from typing import Dict, List, Any

OFFICIAL_CATEGORIES = [
    "Medio ambiente", "Educación", "Salud", 
    "Comunidad", "Océanos", "Alimentación", "Tecnología"
]

KEYWORDS_MAP = {
    "Medio ambiente": ["árboles", "reforestación", "naturaleza", "clima", "sostenible", "ecológico", "bosque", "planeta"],
    "Educación": ["clases", "enseñanza", "niños", "escuela", "formación", "aprender", "taller", "mentoria"],
    "Salud": ["médico", "bienestar", "nutrición", "deporte", "hospital", "pacientes", "psicología"],
    "Comunidad": ["vecinos", "barrio", "social", "ayuda", "integración", "voluntariado", "local"],
    "Océanos": ["mar", "playa", "agua", "marino", "peces", "corales", "limpieza", "costa"],
    "Alimentación": ["comida", "hambre", "huerto", "cocina", "agrícola", "nutricional", "residuos"],
    "Tecnología": ["web", "app", "software", "programación", "datos", "digital", "herramientas"]
}

def suggest_categories(text: str) -> Dict[str, Any]:
    """
    Analiza un texto y sugiere categorías y tags.
    """
    text = text.lower()
    suggested_cats = []
    suggested_tags = []
    
    for cat, keywords in KEYWORDS_MAP.items():
        if any(k in text for k in keywords):
            suggested_cats.append(cat)
            
    # Sugerir tags como palabras clave encontradas
    for keywords in KEYWORDS_MAP.values():
        for k in keywords:
            if k in text and k not in suggested_tags:
                suggested_tags.append(k.title())
                
    return {
        "categories": suggested_cats if suggested_cats else ["Comunidad"],
        "tags": suggested_tags[:5],
        "confidence": "high" if len(suggested_cats) > 0 else "low"
    }

if __name__ == "__main__":
    test_desc = "Buscamos voluntarios para limpiar la playa de Barcelona y concienciar sobre la contaminación marina de los océanos."
    result = suggest_categories(test_desc)
    print(json.dumps(result, indent=2, ensure_ascii=False))
