#!/usr/bin/env python3
"""
Migrate info_url → links.website in projects.ts

Reads the file, replaces every `info_url: "..."` with `links: { website: "..." }`
while leaving the rest of the file untouched. Handles both multi-line and 
single-line project entries.

This is a deterministic transformation script per the 3-layer architecture.
"""
import re
import sys

FILE_PATH = "src/data/projects.ts"

def migrate(content: str) -> str:
    """
    Replace every occurrence of  info_url: "some_url"
    with                         links: { website: "some_url" }
    """
    # Pattern matches:  info_url: "..." (with optional trailing comma)
    # Handles both single-line inline and multi-line project definitions
    pattern = r'info_url:\s*"([^"]*)"'
    replacement = r'links: { website: "\1" }'
    
    result = re.sub(pattern, replacement, content)
    return result


def main():
    with open(FILE_PATH, "r", encoding="utf-8") as f:
        original = f.read()
    
    # Count occurrences before
    count_before = len(re.findall(r'info_url:', original))
    
    migrated = migrate(original)
    
    # Verify
    count_after = len(re.findall(r'info_url:', migrated))
    count_links = len(re.findall(r'links:\s*\{', migrated))
    
    print(f"info_url occurrences: {count_before} → {count_after}")
    print(f"links: {{ website: ... }} entries added: {count_links}")
    
    if count_after > 0:
        print(f"WARNING: {count_after} info_url entries remain (in type definition?)")
    
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(migrated)
    
    print(f"✅ Migration complete. File written: {FILE_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
