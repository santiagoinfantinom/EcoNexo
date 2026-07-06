import requests
import random
from datetime import datetime, timedelta

API_URL = "http://localhost:3000/api/events"

CAPITALS = [
    ("Tirana", "Albania"), ("Andorra la Vella", "Andorra"), ("Vienna", "Austria"), ("Minsk", "Belarus"), 
    ("Brussels", "Belgium"), ("Sarajevo", "Bosnia"), ("Sofia", "Bulgaria"), ("Zagreb", "Croatia"),
    ("Nicosia", "Cyprus"), ("Prague", "Czechia"), ("Copenhagen", "Denmark"), ("Tallinn", "Estonia"),
    ("Helsinki", "Finland"), ("Paris", "France"), ("Berlin", "Germany"), ("Athens", "Greece"),
    ("Budapest", "Hungary"), ("Reykjavik", "Iceland"), ("Dublin", "Ireland"), ("Rome", "Italy"),
    ("Pristina", "Kosovo"), ("Riga", "Latvia"), ("Vaduz", "Liechtenstein"), ("Vilnius", "Lithuania"),
    ("Luxembourg", "Luxembourg"), ("Skopje", "North Macedonia"), ("Valletta", "Malta"), 
    ("Chisinau", "Moldova"), ("Monaco", "Monaco"), ("Podgorica", "Montenegro"), ("Amsterdam", "Netherlands"),
    ("Oslo", "Norway"), ("Warsaw", "Poland"), ("Lisbon", "Portugal"), ("Bucharest", "Romania"),
    ("Moscow", "Russia"), ("San Marino", "San Marino"), ("Belgrade", "Serbia"), ("Bratislava", "Slovakia"),
    ("Ljubljana", "Slovenia"), ("Madrid", "Spain"), ("Stockholm", "Sweden"), ("Bern", "Switzerland"),
    ("London", "United Kingdom"), ("Kiev", "Ukraine")
]

CATEGORIES = [
    "Medio ambiente", "Educación", "Salud", "Comunidad", 
    "Océanos", "Alimentación", "Tecnología"
]

COMPANIES_ORGS = [
    "EcoFuture", "Green Horizon", "Planet First", "Oceanic Save", "EduEco", 
    "Health and Earth", "Community Connect", "Blue Waters", "Tech for Good",
    "Sustainable Living", "AgriNatura", "ForestGuard", "Wind Pioneers", "SolarTech"
]

TITLES_BY_CATEGORY = {
    "Medio ambiente": ["Reforestación de la zona metropolitana", "Taller de reciclaje urbano", "Limpieza de bosque", "Conservación de parques", "Implementación de paneles solares vecinales"],
    "Educación": ["Conferencia de educación sostenible", "Aula abierta sobre el clima", "Foro de energías limpias", "Demostración de ciencia ambiental", "Taller de ahorro de energía", "Educación verde"],
    "Salud": ["Jornada de medicina natural", "Taller de yoga y salud mental al aire libre", "Alimentación saludable urbana", "Campaña de vida activa", "Foro de salud comunitaria"],
    "Comunidad": ["Feria comunitaria ecológica", "Limpieza de calles barriales", "Pintura de murales sostenibles", "Intercambio de recursos vecinal", "Voluntariado de asistencia local"],
    "Océanos": ["Limpieza del cauce y río principal", "Concientización sobre microplásticos", "Jornada por los ecosistemas acuáticos", "Simposio de biología marina urbana"],
    "Alimentación": ["Taller de huertos comunitarios", "Festival de comida vegana", "Aprovechamiento de alimentos y compostaje", "Agricultura urbana para todos", "Mercado de orgánicos locales"],
    "Tecnología": ["Hackathon por la ecología", "Taller de robótica para el desarrollo verde", "Desarrollo de Apps para el clima", "Seminario de impresión 3D reciclable", "Foro de innovación sostenible"]
}

def generate_random_date_2026():
    # We want events heavily focused on Feb-April 2026 but spread across the year
    weights = []
    days = []
    start = datetime(2026, 1, 1)
    
    # Pre-calculate days
    for i in range(365):
        current = start + timedelta(days=i)
        days.append(current)
        if current.month in [2, 3, 4]:
            weights.append(50)  # High probability for Feb, Mar, Apr
        else:
            weights.append(5)   # Lower probability for rest of year
            
    chosen_date = random.choices(days, weights=weights, k=1)[0]
    return chosen_date.strftime("%Y-%m-%d")

def generate_event(city, country):
    cat = random.choice(CATEGORIES)
    base_title = random.choice(TITLES_BY_CATEGORY[cat])
    org = random.choice(COMPANIES_ORGS)
    
    title = f"{base_title} - {org} {city}"
    
    hh = random.randint(8, 18)
    mm = random.choice(["00", "15", "30", "45"])
    start_time = f"{hh:02d}:{mm}"
    
    end_hh = hh + random.randint(1, 4)
    end_time = f"{end_hh:02d}:{mm}"
    
    return {
        "title": title,
        "title_en": title,
        "description": f"A great {cat.lower()} event organized by {org} located in the heart of {city}, {country}. We are committed to a sustainable future.",
        "description_en": f"A great {cat.lower()} event organized by {org} located in the heart of {city}, {country}. We are committed to a sustainable future.",
        "image_url": f"https://source.unsplash.com/800x600/?{cat.replace(' ', ',')},green,city",
        "date": generate_random_date_2026(),
        "city": city,
        "country": country,
        "category": cat,
        "capacity": random.choice([20, 50, 100, 200, 500]),
        "notes": f"Automated 2026 seeding for {city}",
        "start_time": start_time,
        "end_time": end_time
    }

def main():
    events_to_create = []
    
    # Let's generate around 10-15 events per capital
    print(f"Preparing to seed data for {len(CAPITALS)} capitals...")
    for city, country in CAPITALS:
        count = random.randint(10, 15)
        for _ in range(count):
            events_to_create.append(generate_event(city, country))
            
    print(f"Total events generated: {len(events_to_create)}")
    
    success = 0
    fail = 0
    for i, evt in enumerate(events_to_create):
        try:
            res = requests.post(API_URL, json=evt)
            if res.status_code in [200, 201]:
                success += 1
            else:
                fail += 1
                if fail < 5:
                    print(f"Err {res.status_code}: {res.text}")
        except Exception as e:
            fail += 1
            
        if (i+1) % 50 == 0:
            print(f"Processed {i+1} / {len(events_to_create)}...")
            
    print(f"\\nSeeded {success} successfully. Failed: {fail}")

if __name__ == "__main__":
    main()
