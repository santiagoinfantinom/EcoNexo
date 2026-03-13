#!/usr/bin/env python3
"""
Hardcoded String Finder for EcoNexo

Scans TSX/JSX files for potential hardcoded strings that should be translated.

Usage:
    python find_hardcoded.py [--src path/to/src]

Example:
    python find_hardcoded.py
    python find_hardcoded.py --src src/app
"""

import sys
import re
import argparse
from pathlib import Path
from dataclasses import dataclass
from typing import List


@dataclass
class Finding:
    file: str
    line: int
    text: str
    context: str


# Patterns that indicate hardcoded user-facing text
HARDCODED_PATTERNS = [
    # JSX text content between tags
    r'>([A-Z][a-zA-Z\s]{3,50})</',
    # Placeholder attributes with text
    r'placeholder=["\']([A-Z][a-zA-Z\s]{3,30})["\']',
    # Title attributes
    r'title=["\']([A-Z][a-zA-Z\s]{3,50})["\']',
    # Alt text
    r'alt=["\']([A-Z][a-zA-Z\s]{3,50})["\']',
    # Button/link text
    r'<button[^>]*>([A-Z][a-zA-Z\s]{2,20})</button>',
    r'<a[^>]*>([A-Z][a-zA-Z\s]{2,20})</a>',
]

# Patterns to exclude (already translated or technical)
EXCLUDE_PATTERNS = [
    r'\{t\(',          # Already using t() function
    r'className=',     # CSS classes
    r'key=',           # React keys
    r'id=',            # IDs
    r'type=',          # Input types
    r'console\.',      # Console logs
    r'import ',        # Import statements
    r'export ',        # Export statements
    r'//.*',           # Comments
]


def should_exclude(line: str) -> bool:
    """Check if line should be excluded from analysis."""
    for pattern in EXCLUDE_PATTERNS:
        if re.search(pattern, line):
            return True
    return False


def find_hardcoded_in_file(file_path: Path) -> List[Finding]:
    """Find hardcoded strings in a single file."""
    findings = []
    
    try:
        content = file_path.read_text()
        lines = content.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            if should_exclude(line):
                continue
            
            for pattern in HARDCODED_PATTERNS:
                for match in re.finditer(pattern, line):
                    text = match.group(1).strip()
                    if len(text) > 2 and not text.isupper():  # Skip short or ALL_CAPS
                        findings.append(Finding(
                            file=str(file_path),
                            line=line_num,
                            text=text,
                            context=line.strip()[:80]
                        ))
    except Exception as e:
        print(f"⚠️  Error reading {file_path}: {e}")
    
    return findings


def scan_directory(src_path: Path) -> List[Finding]:
    """Scan directory for hardcoded strings."""
    all_findings = []
    
    patterns = ['**/*.tsx', '**/*.jsx']
    
    for pattern in patterns:
        for file_path in src_path.glob(pattern):
            # Skip node_modules and build directories
            if 'node_modules' in str(file_path) or '.next' in str(file_path):
                continue
            
            findings = find_hardcoded_in_file(file_path)
            all_findings.extend(findings)
    
    return all_findings


def print_report(findings: List[Finding]):
    """Print findings report."""
    print("\n" + "=" * 60)
    print("HARDCODED STRING AUDIT REPORT")
    print("=" * 60)
    
    if not findings:
        print("\n✅ No obvious hardcoded strings found!")
        return True
    
    # Group by file
    by_file = {}
    for f in findings:
        by_file.setdefault(f.file, []).append(f)
    
    print(f"\n⚠️  Found {len(findings)} potential hardcoded string(s) in {len(by_file)} file(s):\n")
    
    for file_path, file_findings in sorted(by_file.items()):
        rel_path = file_path.replace('/Users/santiago/Documents/Projects/EcoNexo/', '')
        print(f"📄 {rel_path}")
        for f in file_findings[:5]:  # Limit per file
            print(f"   Line {f.line}: \"{f.text}\"")
        if len(file_findings) > 5:
            print(f"   ... and {len(file_findings) - 5} more")
        print()
    
    return False


def main():
    parser = argparse.ArgumentParser(description="Find hardcoded strings in TSX/JSX")
    parser.add_argument("--src", default="src",
                        help="Source directory to scan (default: src)")
    
    args = parser.parse_args()
    
    src_path = Path(args.src)
    
    if not src_path.exists():
        print(f"❌ Source directory not found: {src_path}")
        sys.exit(1)
    
    print(f"🔍 Scanning: {src_path}")
    
    findings = scan_directory(src_path)
    success = print_report(findings)
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
