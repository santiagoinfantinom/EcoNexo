# EcoNexo Project Guide

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State/Logic**: React 19, Context API (`SmartContext`, `I18nContext`)
- **Icons**: Lucide React
- **Maps**: Leaflet / React Leaflet
- **Animations**: Framer Motion
- **Mobile**: Capacitor (iOS/Android)
- **Backend/Data**: Supabase (configured but currently heavily using local mock data for dev)

## 🚀 Common Commands

### Development
```bash
npm run dev          # Start dev server (uses Turbopack)
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Mobile (Capacitor)
```bash
npm run mobile:build    # Build web assets for mobile
npm run mobile:sync     # Sync assets to native projects
npm run mobile:run:android # Build, sync, and run on Android
npm run mobile:run:ios     # Build, sync, and run on iOS
```

## 📂 Project Structure
- `src/app` - Next.js App Router pages
- `src/components` - Reusable UI components
- `src/data` - Static data files (projects, events, jobs) used for mocking
- `src/lib` - Utilities and core logic
  - `i18n.ts` - **Critical**: Central translation file. Contains `DICTS` (en, de, es, etc.) and `useI18n` hook.
  - `utils.ts` - Helper functions

## 🌍 Internationalization (i18n)
- **System**: Custom lightweight generic implementation in `src/lib/i18n.ts`.
- **Usage**:
  ```tsx
  const { t } = useI18n();
  <p>{t('myKey')}</p>
  ```
- **Adding Keys**: Add new keys to ALL dictionaries in `src/lib/i18n.ts` (en, es, de, etc.) to avoid missing translations.

## 🎨 Design Guidelines
- **Theme**: Nature-inspired (Emerald/Teal/Green).
- **Dark Mode**: Fully supported (`dark:` classes).
- **Glassmorphism**: Use `backdrop-blur-md` and semi-transparent backgrounds for modern UI cards.

## 📝 Conventions
- **Components**: Functional components with hooks.
- **Data Fetching**: Currently primarily using static data imports from `src/data/` aimed at eventual Supabase integration.
- **Imports**: Use absolute imports `@/` where possible.

## 🔑 Environment Variables
(List of required environment variables - keep values in .env only)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MAPBOX_TOKEN` (if used)

## 🧪 Testing Strategy
- **Unit Tests**: Not currently set up.
- **E2E**: Manual verification via `npm run build` and `npm run start`.
- **Linting**: Run `npm run lint` before commits.

## 🧠 Recommended Skills (Agent Capabilities)
These are candidate skills to Automate repetitive tasks:
1. **i18n Helper**: Automatically find missing keys and add them to `src/lib/i18n.ts`.
2. **Component Scaffolding**: Generate headers, clean cards, and layouts using project design tokens.
3. **Data Seeder**: Scripts to populate `src/data` with more realistic mock data for demos.


# Agent Instructions

> This file is mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md so the same instructions load in any AI environment.

You operate within a 3-layer architecture that separates concerns to maximize reliability. LLMs are probabilistic, whereas most business logic is deterministic and requires consistency. This system fixes that mismatch.

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**  
- Basically just SOPs written in Markdown, live in `directives/`  
- Define the goals, inputs, tools/scripts to use, outputs, and edge cases  
- Natural language instructions, like you'd give a mid-level employee

**Layer 2: Orchestration (Decision making)**  
- This is you. Your job: intelligent routing.  
- Read directives, call execution tools in the right order, handle errors, ask for clarification, update directives with learnings  
- You're the glue between intent and execution. E.g you don't try scraping websites yourself—you read `directives/scrape_website.md` and come up with inputs/outputs and then run `execution/scrape_single_site.py`

**Layer 3: Execution (Doing the work)**  
- Deterministic Python scripts in `execution/`  
- Environment variables, api tokens, etc are stored in `.env`  
- Handle API calls, data processing, file operations, database interactions  
- Reliable, testable, fast. Use scripts instead of manual work. Commented well.

**Why this works:** if you do everything yourself, errors compound. 90% accuracy per step = 59% success over 5 steps. The solution is push complexity into deterministic code. That way you just focus on decision-making.

## Operating Principles

**1. Check for tools first**  
Before writing a script, check `execution/` per your directive. Only create new scripts if none exist.

**2. Self-anneal when things break**  
- Read error message and stack trace  
- Fix the script and test it again (unless it uses paid tokens/credits/etc—in which case you check w user first)  
- Update the directive with what you learned (API limits, timing, edge cases)  
- Example: you hit an API rate limit → you then look into API → find a batch endpoint that would fix → rewrite script to accommodate → test → update directive.

**3. Update directives as you learn**  
Directives are living documents. When you discover API constraints, better approaches, common errors, or timing expectations—update the directive. But don't create or overwrite directives without asking unless explicitly told to. Directives are your instruction set and must be preserved (and improved upon over time, not extemporaneously used and then discarded).

## Self-annealing loop

Errors are learning opportunities. When something breaks:  
1. Fix it  
2. Update the tool  
3. Test tool, make sure it works  
4. Update directive to include new flow  
5. System is now stronger

## File Organization

**Deliverables vs Intermediates:**  
- **Deliverables**: Google Sheets, Google Slides, or other cloud-based outputs that the user can access  
- **Intermediates**: Temporary files needed during processing

**Directory structure:**  
- `.tmp/` - All intermediate files (dossiers, scraped data, temp exports). Never commit, always regenerated.  
- `execution/` - Python scripts (the deterministic tools)  
- `directives/` - SOPs in Markdown (the instruction set)  
- `.env` - Environment variables and API keys  
- `credentials.json`, `token.json` - Google OAuth credentials (required files, in `.gitignore`)

**Key principle:** Local files are only for processing. Deliverables live in cloud services (Google Sheets, Slides, etc.) where the user can access them. Everything in `.tmp/` can be deleted and regenerated.

## Summary

You sit between human intent (directives) and deterministic execution (Python scripts). Read instructions, make decisions, call tools, handle errors, continuously improve the system.

Be pragmatic. Be reliable. Self-anneal.
