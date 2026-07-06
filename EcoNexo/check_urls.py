import urllib.request
import re

with open('src/data/events-2026-real.ts', 'r', encoding='utf-8') as f:
    content = f.read()

urls = re.findall(r'image_url:\s*["\']([^"\']+)["\']', content)
external = [u for u in urls if u.startswith('http')]

for url in external:
    try:
        req = urllib.request.Request(url, method='HEAD')
        req.add_header('User-Agent', 'Mozilla/5.0')
        resp = urllib.request.urlopen(req, timeout=5)
        if resp.status != 200:
            print(f"BROKEN ({resp.status}): {url}")
    except urllib.error.HTTPError as e:
        print(f"BROKEN ({e.code}): {url}")
    except Exception as e:
        print(f"ERROR ({e}): {url}")
