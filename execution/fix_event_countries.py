"""
Fix country field in the scraped events in events-2026-real.ts
Many backfilled events have country: "" — this script patches them based on city name.
"""
import re

CITY_TO_COUNTRY = {
    "Tirana": "Albania", "Andorra la Vella": "Andorra", "Vienna": "Austria", "Minsk": "Belarus",
    "Brussels": "Belgium", "Sarajevo": "Bosnia and Herzegovina", "Sofia": "Bulgaria", "Zagreb": "Croatia",
    "Nicosia": "Cyprus", "Prague": "Czech Republic", "Copenhagen": "Denmark", "Tallinn": "Estonia",
    "Helsinki": "Finland", "Paris": "France", "Berlin": "Germany", "Athens": "Greece",
    "Budapest": "Hungary", "Reykjavik": "Iceland", "Dublin": "Ireland", "Rome": "Italy",
    "Pristina": "Kosovo", "Riga": "Latvia", "Vaduz": "Liechtenstein", "Vilnius": "Lithuania",
    "Luxembourg": "Luxembourg", "Skopje": "North Macedonia", "Valletta": "Malta",
    "Chisinau": "Moldova", "Monaco": "Monaco", "Podgorica": "Montenegro", "Amsterdam": "Netherlands",
    "Oslo": "Norway", "Warsaw": "Poland", "Lisbon": "Portugal", "Bucharest": "Romania",
    "Moscow": "Russia", "San Marino": "San Marino", "Belgrade": "Serbia", "Bratislava": "Slovakia",
    "Ljubljana": "Slovenia", "Madrid": "Spain", "Stockholm": "Sweden", "Bern": "Switzerland",
    "London": "United Kingdom", "Kiev": "Ukraine",
    # Additional cities already in the file
    "Barcelona": "Spain", "Munich": "Germany", "Valencia": "Spain", "Toulouse": "France",
    "Nice": "France", "Seville": "Spain", "Milan": "Italy", "Lyon": "France",
    "Porto": "Portugal", "Strasbourg": "France", "Zurich": "Switzerland", "Málaga": "Spain",
}

TS_FILE = "src/data/events-2026-real.ts"

with open(TS_FILE, "r") as f:
    content = f.read()

# Fix empty country fields by looking at the city field right above
# Pattern: city: "SomeCity",\n        country: "",
fixed_count = 0
for city, country in CITY_TO_COUNTRY.items():
    pattern = f'city: "{city}",\n        country: ""'
    replacement = f'city: "{city}",\n        country: "{country}"'
    if pattern in content:
        count = content.count(pattern)
        content = content.replace(pattern, replacement)
        fixed_count += count
        print(f"Fixed {count} events in {city} → {country}")

# Also fix country: "Unknown"
for city, country in CITY_TO_COUNTRY.items():
    pattern = f'city: "{city}",\n        country: "Unknown"'
    replacement = f'city: "{city}",\n        country: "{country}"'
    if pattern in content:
        count = content.count(pattern)
        content = content.replace(pattern, replacement)
        fixed_count += count
        print(f"Fixed {count} 'Unknown' events in {city} → {country}")

with open(TS_FILE, "w") as f:
    f.write(content)

print(f"\nTotal fixes: {fixed_count}")
