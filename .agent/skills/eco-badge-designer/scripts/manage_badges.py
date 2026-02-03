import json
from typing import Dict, List, Any

BADGE_CATALOG = {
    "pioneer": {
        "name": "Eco-Pionero",
        "description": "Completó su primera misión en EcoNexo",
        "icon": "/assets/badges/pioneer.png"
    },
    "ocean-guardian": {
        "name": "Protector del Océano",
        "description": "Participó en 3 o más proyectos de conservación marina",
        "icon": "/assets/badges/ocean.png"
    },
    "forest-hero": {
        "name": "Héroe del Bosque",
        "description": "Participó en 3 o más proyectos de reforestación",
        "icon": "/assets/badges/forest.png"
    }
}

def evaluate_user_badges(user_profile: Dict[str, Any], user_history: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Evalúa qué insignias debería tener el usuario basado en su historial.
    """
    current_badges = user_profile.get("badges", [])
    new_badges = []
    
    # 1. Pioneer check
    if len(user_history) >= 1 and "pioneer" not in [b.get("id") for b in current_badges]:
        new_badges.append({"id": "pioneer", **BADGE_CATALOG["pioneer"]})
        
    # 2. Ocean Guardian check
    ocean_projects = [h for h in user_history if h.get("category") == "Océanos"]
    if len(ocean_projects) >= 3 and "ocean-guardian" not in [b.get("id") for b in current_badges]:
        new_badges.append({"id": "ocean-guardian", **BADGE_CATALOG["ocean-guardian"]})
        
    return new_badges

if __name__ == "__main__":
    # Mock data
    user = {"name": "Santiago", "badges": []}
    history = [
        {"id": "1", "category": "Océanos"},
        {"id": "2", "category": "Océanos"},
        {"id": "3", "category": "Océanos"}
    ]
    
    badges = evaluate_user_badges(user, history)
    print(f"Nuevas insignias ganadas: {json.dumps(badges, indent=2, ensure_ascii=False)}")
