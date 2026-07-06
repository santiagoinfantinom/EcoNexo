import re

def get_locations(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    cities = re.findall(r'city:\s*["\']([^"\']+)["\']', content)
    return sorted(list(set(cities)))

locations = get_locations('src/data/events-2026-real.ts')
print(json.dumps(locations))
