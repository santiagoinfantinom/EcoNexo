📄 DOCUMENTO 1: GUÍA TÉCNICA DE INFRAESTRUCTURA (BACKEND & IA)

Este documento contiene la configuración exacta para revivir tu servidor de Inteligencia Artificial en Hugging Face y unificar los motores de búsqueda semántica.
1. Archivo: Dockerfile

(Crear este archivo en la raíz del Space. Nombre exacto: Dockerfile, respetando la D mayúscula y sin extensión).
Dockerfile

FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . .

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]

2. Archivo: requirements.txt

(Crear este archivo en la raíz del Space. Nombre exacto en minúsculas).
Plaintext

fastapi
sentence-transformers
uvicorn

3. Archivo: app.py

(Código unificado que gestiona el cálculo de similitud semántica mediante la red neuronal all-MiniLM-L6-v2 optimizada para CPU).
Python

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer, util

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo ligero con ejecución explícita en CPU para evitar sobrecarga de memoria
model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')

@app.get("/")
def home():
    return {"status": "El supercerebro de EcoNexo está vivo y corriendo 🚀"}

# --- MOTOR 1: MATCH DE PROYECTOS (Para el Home) ---
@app.post("/match")
async def match_projects(profile: dict):
    user_interests = profile.get("interests", "")
    projects_list = profile.get("projects", [])
    
    if not projects_list or not user_interests:
        return {"matches": []}
        
    user_embedding = model.encode(user_interests, convert_to_tensor=True)
    
    results = []
    for proj in projects_list:
        proj_text = f"{proj.get('title', '')}. {proj.get('description', '')}"
        proj_embedding = model.encode(proj_text, convert_to_tensor=True)
        similarity = util.cos_sim(user_embedding, proj_embedding).item()
        
        match_percentage = max(0, min(100, int((similarity + 1) / 2 * 100)))
        results.append({"id": proj.get("id"), "match": match_percentage})
        
    return {"matches": results}

# --- MOTOR 2: MATCH DE EMPLEOS (Para la sección /matching) ---
@app.post("/match-jobs")
async def match_jobs(profile: dict):
    user_areas = profile.get("areas", "")
    user_experience = float(profile.get("experienceYears", 0))
    jobs_list = profile.get("jobs", [])
    
    if not jobs_list or not user_areas:
        return {"matches": []}
        
    user_text = f"Professional with experience in {user_areas}."
    user_embedding = model.encode(user_text, convert_to_tensor=True)
    
    results = []
    for job in jobs_list:
        job_title = job.get("title", {}).get("es", job.get("title", {}).get("en", ""))
        job_desc = job.get("description", {}).get("es", job.get("description", {}).get("en", ""))
        
        areas_dict = job.get("knowledgeAreas", {})
        areas_list = areas_dict.get("es", areas_dict.get("en", [])) if isinstance(areas_dict, dict) else []
        job_areas = ", ".join(areas_list)
        
        job_text = f"Job Title: {job_title}. Description: {job_desc}. Key areas: {job_areas}."
        job_embedding = model.encode(job_text, convert_to_tensor=True)
        similarity = util.cos_sim(user_embedding, job_embedding).item()
        
        match_percentage = max(0, min(100, int((similarity + 1) / 2 * 100)))
        
        required_experience = float(job.get("experienceYears", 0))
        if user_experience < required_experience:
            diff = required_experience - user_experience
            match_percentage = max(10, match_percentage - int(diff * 15))
            
        results.append({"id": job.get("id"), "match": match_percentage})
        
    results = sorted(results, key=lambda x: x["match"], reverse=True)
    return {"matches": results}