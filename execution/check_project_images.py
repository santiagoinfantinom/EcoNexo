#!/usr/bin/env python3
"""
Validate project image URLs in src/data/projects.ts.

Outputs:
- Console summary with status per unique URL
- JSON report at .tmp/project_image_check_results.json
"""

import json
import os
import re
import ssl
import sys
from pathlib import Path
import urllib.error
import urllib.request
from collections import defaultdict

ROOT_DIR = Path(__file__).resolve().parent.parent
PROJECTS_FILE = ROOT_DIR / "src/data/projects.ts"
OUTPUT_PATH = ROOT_DIR / ".tmp/project_image_check_results.json"
TIMEOUT_SECONDS = 15


def load_projects_file(path: Path) -> str:
    with open(path, "r", encoding="utf-8") as file:
        return file.read()


def extract_project_image_urls(content: str):
    # Capture project id, name, and image_url from project objects.
    pattern = r'id:\s*"([^"]+)".*?name:\s*"([^"]+)".*?image_url:\s*"([^"]+)"'
    return re.findall(pattern, content, re.DOTALL)


def make_ssl_context() -> ssl.SSLContext:
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    return context


def check_url(url: str, context: ssl.SSLContext) -> tuple[bool, int | None, str | None, str | None]:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS, context=context) as response:
            status = response.getcode()
            final_url = response.geturl()
            return True, status, None, final_url
    except urllib.error.HTTPError as err:
        return False, err.code, str(err), None
    except Exception as err:  # noqa: BLE001
        return False, None, str(err), None


def main() -> int:
    content = load_projects_file(PROJECTS_FILE)
    records = extract_project_image_urls(content)

    print(f"{len(records)} projects with image_url found")

    url_to_projects = defaultdict(list)
    for project_id, project_name, image_url in records:
        url_to_projects[image_url].append({"id": project_id, "name": project_name})

    unique_urls = sorted(url_to_projects.keys())
    print(f"{len(unique_urls)} unique image URLs to check")
    print("=" * 80)

    context = make_ssl_context()
    results = []

    for image_url in unique_urls:
        uses = url_to_projects[image_url]
        ok, status, error, final_url = check_url(image_url, context)
        redirected = bool(final_url and final_url != image_url)

        result = {
            "url": image_url,
            "ok": ok,
            "status": status,
            "error": error,
            "redirected": redirected,
            "final_url": final_url if redirected else None,
            "projects": uses,
        }
        results.append(result)

        if ok:
            status_txt = f"✅ {status}"
            if redirected:
                status_txt += f" → {final_url}"
            print(f"{status_txt} | {image_url} ({uses[0]['name']})")
        else:
            status_txt = status if status is not None else "ERR"
            print(f"❌ {status_txt} | {image_url} ({uses[0]['name']}) - {error}")

    broken = [row for row in results if not row["ok"]]
    print("\n" + "=" * 80)
    print(f"SUMMARY: checked {len(results)} URLs, broken {len(broken)}")

    if broken:
        print("\nBROKEN IMAGE URLS:")
        for row in broken:
            names = ", ".join(project["name"] for project in row["projects"][:3])
            print(f"  ❌ {row['url']}")
            print(f"     status: {row.get('status', 'N/A')} | error: {row.get('error', 'N/A')}")
            print(f"     sample projects: {names}")

    os.makedirs(os.path.dirname(str(OUTPUT_PATH)), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as file:
        json.dump(
            {
                "summary": {
                    "projects_count": len(records),
                    "unique_urls_count": len(unique_urls),
                    "broken_count": len(broken),
                },
                "results": results,
                "broken": broken,
            },
            file,
            indent=2,
            ensure_ascii=False,
        )

    print(f"\nSaved full report to {OUTPUT_PATH}")
    return 1 if broken else 0


if __name__ == "__main__":
    sys.exit(main())
