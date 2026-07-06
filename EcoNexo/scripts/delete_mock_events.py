import os
import requests

url = ""
key = ""

with open(".env.local", "r") as f:
    for line in f:
        line = line.strip()
        if line.startswith("NEXT_PUBLIC_SUPABASE_URL="):
            url = line.split("=", 1)[1].strip().strip('\'"')
        if line.startswith("NEXT_PUBLIC_SUPABASE_ANON_KEY="):
            key = line.split("=", 1)[1].strip().strip('\'"')

print(f"Loaded url: {bool(url)}, key: {bool(key)}")

if url and key:
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}"
    }
    
    # Supabase REST API eq operator
    res = requests.delete(
        f"{url}/rest/v1/events?notes=like.Automated 2026 seeding*",
        headers=headers
    )
    print("Delete status:", res.status_code)
    print("Delete text:", res.text)
else:
    print("Still missing credentials")
