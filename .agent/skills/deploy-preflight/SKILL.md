---
name: deploy-preflight
description: Pre-deployment checklist that verifies linting, environment variables, build status, and MCP server health. Use before deploying to production or staging to catch common issues.
---

# Deploy Preflight

Automated pre-deployment verification for EcoNexo.

## When to Use

- Before deploying to production
- Before creating a release PR
- After major changes to verify nothing is broken
- As part of CI/CD pipeline

## Checklist

The preflight check verifies:

1. **Code Quality**
   - [ ] TypeScript compiles without errors
   - [ ] ESLint passes
   - [ ] No console.log in production code

2. **Environment**
   - [ ] Required `.env` variables are set
   - [ ] MCP server `.env` is configured
   - [ ] No secrets in committed files

3. **Build**
   - [ ] `npm run build` succeeds
   - [ ] No build warnings for key files

4. **Backend**
   - [ ] MCP server starts successfully
   - [ ] Health endpoint responds

5. **Data Integrity**
   - [ ] Event dates are valid (not expired)
   - [ ] All image URLs are accessible

## Usage

```bash
# Run full preflight check
python scripts/preflight.py

# Run specific checks
python scripts/preflight.py --check build
python scripts/preflight.py --check env
python scripts/preflight.py --skip mcp
```

## Required Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_KEY` (optional)

### Backend (mcp-server/.env)
- `GOOGLE_API_KEY`
- `MCP_SERVER_PORT`

## Exit Codes

- `0` - All checks passed
- `1` - One or more checks failed
- `2` - Configuration error
