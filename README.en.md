# EcoNexo

[![Español](https://img.shields.io/badge/README-Español-green)](./README.md) [![Deutsch](https://img.shields.io/badge/README-Deutsch-red)](./README.de.md)

Interactive map of sustainable projects and events across Europe.

## Development

Requirements: Node 18+

```bash
npm install
npm run dev
# open http://localhost:3003 (Turbopack may move the port if 3000 is busy)
```

## Features
- Leaflet map with search (Nominatim) and GPS.
- Filters by category.
- Project detail with metrics and images.
- Events page: creation and listing.
- i18n (es/en/de) with flag selector.

## Backend (optional)
Supabase for `projects`, `events`, `volunteers`. SQL in `supabase/schema.sql`.
