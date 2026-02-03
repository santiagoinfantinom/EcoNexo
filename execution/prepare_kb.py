import re
import json
import os

def extract_projects(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple regex to find project objects in the categoryProjects record
    # This is a heuristic approach to extract structured data from TypeScript
    projects = []
    
    # Find segments like { id: '...', title: { ... }, ... }
    # Using a slightly more robust regex for the nested structure
    project_matches = re.findall(r'\{\s+id:\s+[\'"]([^\'"]+)[\'"],\s+title:\s+\{([^}]+)\},\s+description:\s+\{([^}]+)\}.*?impact:\s+\{([^}]+)\}\s+\}', content, re.DOTALL)
    
    for mid, title_raw, desc_raw, impact_raw in project_matches:
        # Extract title strings
        title_en = re.search(r'en:\s+[\'"]([^\'"]+)[\'"]', title_raw)
        title_es = re.search(r'es:\s+[\'"]([^\'"]+)[\'"]', title_raw)
        
        # Extract description strings
        desc_en = re.search(r'en:\s+[\'"]([^\'"]+)[\'"]', desc_raw)
        desc_es = re.search(r'es:\s+[\'"]([^\'"]+)[\'"]', desc_raw)

        # Extract impact
        impact_en = re.search(r'en:\s+[\'"]([^\'"]+)[\'"]', impact_raw)
        
        projects.append({
            "id": mid,
            "title": title_en.group(1) if title_en else "",
            "title_es": title_es.group(1) if title_es else "",
            "description": desc_en.group(1) if desc_en else "",
            "description_es": desc_es.group(1) if desc_es else "",
            "impact": impact_en.group(1) if impact_en else "",
            "source": "categoryProjects.ts"
        })
        
    return projects

def extract_tips(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # The tips use i18n keys, so we might need a more indirect approach
    # For now, let's look for the getEcoTips function structure
    tips = []
    
    # We'll rely on the structure of the objects in the array
    tip_matches = re.findall(r'id:\s+[\'"]([^\'"]+)[\'"],\s+category:\s+t\([^\)]+\).*?title:\s+t\([\'"]([^\'"]+)[\'"]\),\s+description:\s+t\([\'"]([^\'"]+)[\'"]\)', content, re.DOTALL)
    
    # Since they use translation keys, we might need to parse dictionaries.ts too
    # But for a simpler dynamic RAG, let's try to match the keys later if needed
    # Or just hardcode the most important ones for the MVP
    
    for tid, title_key, desc_key in tip_matches:
        tips.append({
            "id": tid,
            "title_key": title_key,
            "description_key": desc_key,
            "source": "EcoTips.tsx"
        })
        
    return tips

def main():
    root_dir = "/Users/santiago/Documents/Projects/EcoNexo"
    projects_file = os.path.join(root_dir, "src/lib/categoryProjects.ts")
    tips_file = os.path.join(root_dir, "src/components/EcoTips.tsx")
    output_file = os.path.join(root_dir, "docs/knowledge/extracted_data.json")
    
    print(f"Extracting projects from {projects_file}...")
    projects = extract_projects(projects_file)
    print(f"Found {len(projects)} projects.")
    
    print(f"Extracting tips from {tips_file}...")
    tips = extract_tips(tips_file)
    print(f"Found {len(tips)} tips.")
    
    knowledge_base = {
        "projects": projects,
        "tips": tips
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(knowledge_base, f, indent=4, ensure_ascii=False)
    
    print(f"Knowledge base saved to {output_file}")

if __name__ == "__main__":
    main()
