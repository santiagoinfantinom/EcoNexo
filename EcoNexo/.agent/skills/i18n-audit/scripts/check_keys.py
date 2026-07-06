#!/usr/bin/env python3
"""
i18n Key Consistency Checker for EcoNexo

Verifies that all translation keys exist across all supported languages.

Usage:
    python check_keys.py [--i18n-file path/to/i18n.ts]

Example:
    python check_keys.py
    python check_keys.py --i18n-file src/lib/i18n.ts
"""

import sys
import re
import argparse
from pathlib import Path
from collections import defaultdict


SUPPORTED_LANGUAGES = ['en', 'es', 'de', 'fr', 'it', 'pl', 'nl']
DEFAULT_I18N_PATH = 'src/lib/i18n.ts'


def extract_keys_from_i18n(file_path: Path) -> dict:
    """Extract translation keys from i18n.ts file."""
    content = file_path.read_text()
    
    # Find all language blocks
    languages = {}
    
    # Pattern to match language blocks like: en: { ... }
    lang_pattern = r"(\w{2}):\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}"
    
    for match in re.finditer(lang_pattern, content, re.DOTALL):
        lang = match.group(1)
        if lang in SUPPORTED_LANGUAGES:
            block = match.group(2)
            # Extract keys (simple key: value pattern)
            keys = set(re.findall(r"(\w+):\s*['\"`]", block))
            languages[lang] = keys
    
    return languages


def check_key_consistency(languages: dict) -> dict:
    """Check for missing keys across languages."""
    if not languages:
        return {"error": "No languages found"}
    
    # Use first language as reference (usually 'en')
    reference_lang = 'en' if 'en' in languages else list(languages.keys())[0]
    reference_keys = languages.get(reference_lang, set())
    
    issues = defaultdict(list)
    
    for lang, keys in languages.items():
        # Keys in reference but missing in this language
        missing = reference_keys - keys
        if missing:
            issues[lang].extend([f"Missing: {key}" for key in sorted(missing)])
        
        # Keys in this language but not in reference (extra keys)
        extra = keys - reference_keys
        if extra:
            issues[lang].extend([f"Extra: {key}" for key in sorted(extra)])
    
    return dict(issues)


def print_report(languages: dict, issues: dict):
    """Print audit report."""
    print("\n" + "=" * 60)
    print("i18n KEY CONSISTENCY REPORT")
    print("=" * 60)
    
    # Summary
    print(f"\n📊 Languages found: {', '.join(sorted(languages.keys()))}")
    print(f"📊 Reference language: en ({len(languages.get('en', []))} keys)")
    
    # Issues
    if not issues:
        print("\n✅ All languages have consistent keys!")
        return True
    
    print(f"\n⚠️  Found issues in {len(issues)} language(s):\n")
    
    for lang, lang_issues in sorted(issues.items()):
        print(f"  [{lang.upper()}]")
        for issue in lang_issues[:10]:  # Limit output
            print(f"    - {issue}")
        if len(lang_issues) > 10:
            print(f"    ... and {len(lang_issues) - 10} more")
        print()
    
    return False


def main():
    parser = argparse.ArgumentParser(description="Check i18n key consistency")
    parser.add_argument("--i18n-file", default=DEFAULT_I18N_PATH,
                        help="Path to i18n.ts file")
    
    args = parser.parse_args()
    
    i18n_path = Path(args.i18n_file)
    
    if not i18n_path.exists():
        print(f"❌ i18n file not found: {i18n_path}")
        print(f"   Run from project root or specify --i18n-file")
        sys.exit(1)
    
    print(f"🔍 Analyzing: {i18n_path}")
    
    languages = extract_keys_from_i18n(i18n_path)
    
    if not languages:
        print("❌ Could not extract language blocks from file")
        sys.exit(1)
    
    issues = check_key_consistency(languages)
    success = print_report(languages, issues)
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
