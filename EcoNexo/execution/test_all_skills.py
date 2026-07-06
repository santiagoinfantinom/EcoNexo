import sys
import os
import json
from pathlib import Path

# Add project root to path to import skill scripts directly
def test_real_data():
    print("=== TEST CON DATOS REALES DE ECONEXO ===\n")
    
    from generate_outreach import generate_message as outreach_gen
    from manage_badges import evaluate_user_badges
    from categorize_project import suggest_categories

    # Datos extraídos de src/data/projects.ts
    project_p1 = {
        "id": "p1",
        "name": "Reforestación Urbana Berlín",
        "category": "Medio ambiente",
        "city": "Berlín",
        "description": "Plantación de árboles nativos y creación de corredores verdes para mejorar calidad del aire y hábitats urbanos en Berlín.",
        "tags": ["outdoors", "physical", "nature", "community"]
    }
    
    project_p4 = {
        "id": "p4",
        "name": "Recuperación de playas",
        "category": "Océanos",
        "city": "Marsella",
        "description": "Limpieza de costas, monitoreo de microplásticos y restauración de ecosistemas marinos en el litoral mediterráneo.",
        "tags": ["outdoors", "water", "science", "physical"]
    }
    
    # Perfil de usuario (Santiago)
    user_santiago = {
        "name": "Santiago",
        "skills": ["React", "TypeScript", "Python"],
        "interests": ["Medio ambiente", "Océanos", "Tecnología"],
        "badges": []
    }
    
    # Historial simulado para badges
    history = [
        {"id": "h1", "category": "Océanos"},
        {"id": "h2", "category": "Océanos"},
        {"id": "h3", "category": "Océanos"},
        {"id": "h4", "category": "Medio ambiente"}
    ]

    print("--- 1. Testing volunteer-outreach-assistant ---")
    msg = outreach_gen(user_santiago, project_p1)
    print(f"Invitación para {project_p1['name']}:\n{msg}\n")
    
    print("--- 2. Testing eco-badge-designer ---")
    badges = evaluate_user_badges(user_santiago, history)
    print(f"Insignias ganadas por Santiago:\n{json.dumps(badges, indent=2, ensure_ascii=False)}\n")
    
    print("--- 3. Testing smart-categorizer ---")
    print(f"Categorizando: {project_p4['name']}")
    cat_result = suggest_categories(project_p4['name'] + " " + project_p4['description'])
    print(f"Resultado:\n{json.dumps(cat_result, indent=2, ensure_ascii=False)}\n")

if __name__ == "__main__":
    base_path = Path("/Users/santiago/Documents/Projects/EcoNexo/.agent/skills")
    
    # Add script paths
    sys.path.append(str(base_path / "volunteer-outreach-assistant/scripts"))
    sys.path.append(str(base_path / "eco-badge-designer/scripts"))
    sys.path.append(str(base_path / "smart-categorizer/scripts"))
    
    test_real_data()
