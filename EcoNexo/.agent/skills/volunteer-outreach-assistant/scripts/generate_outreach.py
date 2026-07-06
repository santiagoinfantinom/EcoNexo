import sys
import json
from typing import Dict, Any

def generate_message(user_profile: Dict[str, Any], project: Dict[str, Any]) -> str:
    """
    Genera un mensaje de reclutamiento personalizado.
    """
    user_name = user_profile.get("name", "Voluntario")
    project_name = project.get("name", "nuestro proyecto")
    location = project.get("city", project.get("location", "Remoto"))
    
    # Identificar afinidad
    user_skills = user_profile.get("skills", [])
    project_category = project.get("category", "")
    
    affinity = ""
    if any(s.lower() in project.get("description", "").lower() for s in user_skills):
        common_skill = next((s for s in user_skills if s.lower() in project.get("description", "").lower()), user_skills[0] if user_skills else "")
        affinity = f"tu experiencia en {common_skill} es justo lo que necesitamos"
    elif project_category in user_profile.get("interests", []):
        affinity = f"sabemos que te apasiona el área de {project_category}"
    else:
        affinity = "tu perfil encaja muy bien con los valores del proyecto"

    message = f"""
Asunto: ¡Oportunidad de impacto en EcoNexo para ti, {user_name}!

Hola {user_name},

He visto tu perfil en EcoNexo y me ha impresionado tu trayectoria. Actualmente estamos impulsando "{project_name}" en {location}, y creo que serías una pieza clave porque {affinity}.

Tu contribución nos ayudaría enormemente a conseguir nuestros objetivos de sostenibilidad en {project_category}.

¿Te gustaría participar o que te contemos más detalles?

¡Un saludo!
El equipo de EcoNexo
"""
    return message.strip()

if __name__ == "__main__":
    # Mock data for demonstration if called directly
    user = {"name": "Santiago", "skills": ["Python", "React"], "interests": ["Medio ambiente"]}
    proj = {"name": "Reforestación Urbana", "city": "Madrid", "category": "Medio ambiente", "description": "Buscamos expertos en gestión de proyectos y Python para automatizar el seguimiento."}
    
    print(generate_message(user, proj))
