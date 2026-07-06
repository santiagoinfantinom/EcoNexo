#!/usr/bin/env python3
"""
Deploy Preflight Checker for EcoNexo

Runs pre-deployment verification checks.

Usage:
    python preflight.py [--check CHECK] [--skip CHECK]

Example:
    python preflight.py
    python preflight.py --check build
    python preflight.py --skip mcp
"""

import sys
import subprocess
import argparse
from pathlib import Path
from dataclasses import dataclass
from typing import List, Tuple, Optional
import os


@dataclass
class CheckResult:
    name: str
    passed: bool
    message: str
    details: Optional[str] = None


class PreflightChecker:
    def __init__(self, project_root: Path):
        self.root = project_root
        self.results: List[CheckResult] = []
    
    def run_command(self, cmd: List[str], cwd: Optional[Path] = None) -> Tuple[int, str, str]:
        """Run a command and return exit code, stdout, stderr."""
        try:
            result = subprocess.run(
                cmd,
                cwd=cwd or self.root,
                capture_output=True,
                text=True,
                timeout=120
            )
            return result.returncode, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            return -1, "", "Command timed out"
        except Exception as e:
            return -1, "", str(e)
    
    def check_typescript(self) -> CheckResult:
        """Check TypeScript compilation."""
        print("  🔍 TypeScript compilation...")
        code, stdout, stderr = self.run_command(["npx", "tsc", "--noEmit"])
        
        if code == 0:
            return CheckResult("typescript", True, "TypeScript compiles successfully")
        else:
            error_count = stderr.count("error TS")
            return CheckResult(
                "typescript", False, 
                f"TypeScript has {error_count} error(s)",
                stderr[:500]
            )
    
    def check_eslint(self) -> CheckResult:
        """Check ESLint."""
        print("  🔍 ESLint...")
        code, stdout, stderr = self.run_command(["npx", "eslint", "src/", "--max-warnings=0"])
        
        if code == 0:
            return CheckResult("eslint", True, "ESLint passed")
        else:
            return CheckResult("eslint", False, "ESLint has warnings/errors", stdout[:500])
    
    def check_env_frontend(self) -> CheckResult:
        """Check frontend environment variables."""
        print("  🔍 Frontend environment...")
        env_file = self.root / ".env.local"
        
        if not env_file.exists():
            return CheckResult("env_frontend", False, ".env.local not found")
        
        content = env_file.read_text()
        required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]
        missing = [v for v in required if v not in content]
        
        if missing:
            return CheckResult("env_frontend", False, f"Missing: {', '.join(missing)}")
        
        return CheckResult("env_frontend", True, "Frontend env configured")
    
    def check_env_backend(self) -> CheckResult:
        """Check backend environment variables."""
        print("  🔍 Backend environment...")
        env_file = self.root / "mcp-server" / ".env"
        
        if not env_file.exists():
            return CheckResult("env_backend", False, "mcp-server/.env not found")
        
        content = env_file.read_text()
        required = ["GOOGLE_API_KEY"]
        missing = [v for v in required if v not in content or f"{v}=" not in content]
        
        if missing:
            return CheckResult("env_backend", False, f"Missing: {', '.join(missing)}")
        
        return CheckResult("env_backend", True, "Backend env configured")
    
    def check_build(self) -> CheckResult:
        """Check Next.js build."""
        print("  🔍 Build check (this may take a minute)...")
        code, stdout, stderr = self.run_command(["npm", "run", "build"])
        
        if code == 0:
            return CheckResult("build", True, "Build successful")
        else:
            return CheckResult("build", False, "Build failed", stderr[:500])
    
    def check_mcp_health(self) -> CheckResult:
        """Check if MCP server can start and respond."""
        print("  🔍 MCP server health...")
        
        try:
            import requests
            response = requests.get("http://localhost:8001/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                if data.get("agent_initialized"):
                    return CheckResult("mcp", True, "MCP server healthy")
                else:
                    return CheckResult("mcp", False, "MCP agent not initialized")
            else:
                return CheckResult("mcp", False, f"MCP returned {response.status_code}")
        except Exception as e:
            return CheckResult("mcp", False, "MCP server not reachable", str(e))
    
    def run_all(self, skip: List[str] = None) -> bool:
        """Run all checks."""
        skip = skip or []
        
        checks = [
            ("typescript", self.check_typescript),
            ("eslint", self.check_eslint),
            ("env_frontend", self.check_env_frontend),
            ("env_backend", self.check_env_backend),
            ("build", self.check_build),
            ("mcp", self.check_mcp_health),
        ]
        
        for name, check_fn in checks:
            if name in skip:
                print(f"  ⏭️  Skipping {name}")
                continue
            
            result = check_fn()
            self.results.append(result)
        
        return all(r.passed for r in self.results)
    
    def print_report(self):
        """Print results report."""
        print("\n" + "=" * 60)
        print("DEPLOY PREFLIGHT REPORT")
        print("=" * 60 + "\n")
        
        passed = sum(1 for r in self.results if r.passed)
        total = len(self.results)
        
        for result in self.results:
            icon = "✅" if result.passed else "❌"
            print(f"{icon} {result.name}: {result.message}")
            if result.details and not result.passed:
                print(f"   └─ {result.details[:200]}")
        
        print(f"\n{'=' * 60}")
        print(f"Result: {passed}/{total} checks passed")
        
        if passed == total:
            print("🚀 Ready to deploy!")
        else:
            print("⚠️  Fix issues before deploying")


def main():
    parser = argparse.ArgumentParser(description="EcoNexo Deploy Preflight")
    parser.add_argument("--check", action="append", 
                        help="Run only specific check(s)")
    parser.add_argument("--skip", action="append",
                        help="Skip specific check(s)")
    
    args = parser.parse_args()
    
    # Find project root
    project_root = Path.cwd()
    if not (project_root / "package.json").exists():
        print("❌ Run from project root (where package.json is)")
        sys.exit(2)
    
    print("🚀 EcoNexo Deploy Preflight\n")
    
    checker = PreflightChecker(project_root)
    
    skip = args.skip or []
    if args.check:
        # If specific checks requested, skip everything else
        all_checks = ["typescript", "eslint", "env_frontend", "env_backend", "build", "mcp"]
        skip = [c for c in all_checks if c not in args.check]
    
    success = checker.run_all(skip=skip)
    checker.print_report()
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
