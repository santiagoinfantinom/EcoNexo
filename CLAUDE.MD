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
