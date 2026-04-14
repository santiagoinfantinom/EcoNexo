#!/usr/bin/env python3
"""
    Überprüfen Sie alle info_url-Werte der Projekte in EcoNexo, um sicherzustellen, dass sie zugänglich sind.
    Gibt einen JSON-Bericht der fehlerhaften URLs mit vorgeschlagenen Ersetzungen aus.
    """

import re
import json
import urllib.request
import urllib.error
import ssl
import sys
from collections import defaultdict

# Read the projects.ts file
PROJECTS_FILE = "/Users/santiago/Documents/Projects/EcoNexo/src/data/projects.ts"

with open(PROJECTS_FILE, "r", encoding="utf-8") as f:
    content = f.read()

# Extract all project IDs and their info_urls
pattern = r'id:\s*"([^"]+)".*?info_url:\s*"([^"]+)"'
matches = re.findall(pattern, content, re.DOTALL)

# Also extract name for context
id_name_pattern = r'id:\s*"([^"]+)".*?name:\s*"([^"]+)"'
id_names = dict(re.findall(id_name_pattern, content, re.DOTALL))

# Deduplicate URLs but track which projects use each
url_to_projects = defaultdict(list)
for proj_id, url in matches:
    url_to_projects[url].append(proj_id)

unique_urls = sorted(set(url for _, url in matches))

print(f"{len(matches)} Projekte mit info_url gefunden")
print(f"{len(unique_urls)} eindeutige URLs zur Überprüfung gefunden")
print("=" * 80)

# Create SSL context that doesn't verify (for testing accessibility)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

results = []

for url in unique_urls:
    projects = url_to_projects[url]
    project_names = [id_names.get(pid, pid) for pid in projects]
    
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            }
        )
        response = urllib.request.urlopen(req, timeout=15, context=ctx)
        status = response.getcode()
        final_url = response.geturl()
        
        # Check if redirected to an error page
        redirected = final_url != url
        
        result = {
            "url": url,
            "status": status,
            "ok": True,
            "projects": projects,
            "project_names": project_names,
            "final_url": final_url if redirected else None,
        }
        
        status_str = f"✅ {status}"
        if redirected:
            status_str += f" → {final_url}"
        print(f"{status_str} | {url} ({', '.join(project_names[:2])})")
        
    except urllib.error.HTTPError as e:
        result = {
            "url": url,
            "status": e.code,
            "ok": False,
            "error": str(e),
            "projects": projects,
            "project_names": project_names,
        }
        print(f"❌ {e.code} | {url} ({', '.join(project_names[:2])})")
        
    except Exception as e:
        result = {
            "url": url,
            "status": None,
            "ok": False,
            "error": str(e),
            "projects": projects,
            "project_names": project_names,
        }
        print(f"❌ ERR | {url} ({', '.join(project_names[:2])}) - {str(e)[:80]}")
    
    results.append(result)

# Summary
broken = [r for r in results if not r["ok"]]
print("\n" + "=" * 80)
print(f"\nZUSAMMENFASSUNG: {len(results)} URLs überprüft, {len(broken)} fehlerhaft")

if broken:
    print("\nFEHLERHAFTE URLs:")
    for r in broken:
        print(f"  ❌ {r['url']}")
        print(f"     Status: {r.get('status', 'N/A')} | Fehler: {r.get('error', 'N/A')}")
        print(f"     Projekte: {', '.join(r['project_names'])}")
        print()

# Save results to JSON for further processing
output_path = "/Users/santiago/Documents/Projects/EcoNexo/.tmp/url_check_results.json"
import os
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w") as f:
    json.dump({"results": results, "broken": broken}, f, indent=2, ensure_ascii=False)

print(f"\nVollständige Ergebnisse wurden in {output_path} gespeichert")
