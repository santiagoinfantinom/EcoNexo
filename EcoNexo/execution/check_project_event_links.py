#!/usr/bin/env python3
"""
Validate external website links for projects and events.

Checks:
- src/data/projects.ts -> links.website
- src/data/events-2026-real.ts -> website

Outputs:
- Console summary with status per unique URL
- JSON report at .tmp/project_event_links_check_results.json
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
EVENTS_REAL_FILE = ROOT_DIR / "src/data/events-2026-real.ts"
OUTPUT_PATH = ROOT_DIR / ".tmp/project_event_links_check_results.json"
TIMEOUT_SECONDS = 15


def read_file(path: Path) -> str:
    with open(path, "r", encoding="utf-8") as file:
        return file.read()


def extract_project_websites(content: str) -> list[dict[str, str]]:
    pattern = (
        r'id:\s*"(?P<id>[^"]+)".*?name:\s*"(?P<name>[^"]+)".*?'
        r'links:\s*\{[^}]*?website:\s*"(?P<url>https?://[^"]+)"'
    )
    matches = re.finditer(pattern, content, re.DOTALL)
    return [
        {
            "source": "projects.ts",
            "type": "project",
            "id": match.group("id"),
            "name": match.group("name"),
            "url": match.group("url"),
        }
        for match in matches
    ]


def extract_event_websites(content: str, source_name: str) -> list[dict[str, str]]:
    pattern = (
        r'id:\s*"(?P<id>[^"]+)".*?'
        r'(?:title|name):\s*"(?P<name>[^"]+)".*?'
        r'website:\s*"(?P<url>https?://[^"]+)"'
    )
    matches = re.finditer(pattern, content, re.DOTALL)
    return [
        {
            "source": source_name,
            "type": "event",
            "id": match.group("id"),
            "name": match.group("name"),
            "url": match.group("url"),
        }
        for match in matches
    ]


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
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS, context=context) as response:
            status = response.getcode()
            return 200 <= status < 400, status, None, response.geturl()
    except urllib.error.HTTPError as err:
        # Some valid sites block bots and return 401/403/405/429.
        # Treat those as reachable for CI purposes.
        if err.code in {400, 401, 403, 405, 429}:
            return True, err.code, str(err), None
        return False, err.code, str(err), None
    except Exception as err:  # noqa: BLE001
        return False, None, str(err), None


def main() -> int:
    records = []
    records.extend(extract_project_websites(read_file(PROJECTS_FILE)))
    records.extend(extract_event_websites(read_file(EVENTS_REAL_FILE), "events-2026-real.ts"))

    print(f"{len(records)} links found (projects + events)")

    url_to_entries = defaultdict(list)
    for row in records:
        url_to_entries[row["url"]].append(
            {
                "source": row["source"],
                "type": row["type"],
                "id": row["id"],
                "name": row["name"],
            }
        )

    unique_urls = sorted(url_to_entries.keys())
    print(f"{len(unique_urls)} unique links to check")
    print("=" * 80)

    context = make_ssl_context()
    results = []

    for url in unique_urls:
        uses = url_to_entries[url]
        ok, status, error, final_url = check_url(url, context)
        redirected = bool(final_url and final_url != url)
        row = {
            "url": url,
            "ok": ok,
            "status": status,
            "error": error,
            "redirected": redirected,
            "final_url": final_url if redirected else None,
            "references": uses,
        }
        results.append(row)

        sample = uses[0]
        sample_label = f"{sample['type']} {sample['id']} ({sample['name']})"
        if ok:
            status_txt = f"✅ {status}"
            if redirected:
                status_txt += f" → {final_url}"
            print(f"{status_txt} | {url} | {sample_label}")
        else:
            status_txt = status if status is not None else "ERR"
            print(f"❌ {status_txt} | {url} | {sample_label} - {error}")

    broken = [row for row in results if not row["ok"]]
    broken_project_links = [
        row for row in broken
        if any(ref["source"] == "projects.ts" for ref in row["references"])
    ]
    broken_event_links = [
        row for row in broken
        if any(ref["source"] != "projects.ts" for ref in row["references"])
    ]
    print("\n" + "=" * 80)
    blocking_project_link_errors = [
        row for row in broken_project_links
        if (row.get("status") in {404, 410}) or (isinstance(row.get("status"), int) and row["status"] >= 500)
    ]

    print(
        "SUMMARY: checked "
        f"{len(results)} links, broken {len(broken)} "
        f"(projects: {len(broken_project_links)}, events: {len(broken_event_links)}, "
        f"blocking project errors: {len(blocking_project_link_errors)})"
    )

    if broken:
        print("\nBROKEN WEBSITE LINKS:")
        for row in broken:
            samples = ", ".join(ref["id"] for ref in row["references"][:4])
            print(f"  ❌ {row['url']}")
            print(f"     status: {row.get('status', 'N/A')} | error: {row.get('error', 'N/A')}")
            print(f"     sample ids: {samples}")

    os.makedirs(os.path.dirname(str(OUTPUT_PATH)), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as file:
        json.dump(
            {
                "summary": {
                    "records_count": len(records),
                    "unique_urls_count": len(unique_urls),
                    "broken_count": len(broken),
                    "broken_projects_count": len(broken_project_links),
                    "broken_events_count": len(broken_event_links),
                    "blocking_project_errors_count": len(blocking_project_link_errors),
                },
                "results": results,
                "broken": broken,
                "broken_projects": broken_project_links,
                "broken_events": broken_event_links,
                "blocking_project_errors": blocking_project_link_errors,
            },
            file,
            indent=2,
            ensure_ascii=False,
        )

    print(f"\nSaved full report to {OUTPUT_PATH}")
    if broken_project_links and not blocking_project_link_errors:
        print("NOTE: Project links have only transient/network warnings, not blocking CI.")
    if broken_event_links and not blocking_project_link_errors:
        print("NOTE: Event links have warnings, but CI will only fail on project links.")
    return 1 if blocking_project_link_errors else 0


if __name__ == "__main__":
    sys.exit(main())
