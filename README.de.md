# EcoNexo

[![Español](https://img.shields.io/badge/README-Español-green)](./README.md) [![English](https://img.shields.io/badge/README-English-blue)](./README.en.md)

Interaktive Karte nachhaltiger Projekte und Veranstaltungen in Europa.

## Entwicklung

Voraussetzungen: Node 18+

```bash
npm install
npm run dev
# öffne http://localhost:3003 (Turbopack kann den Port ändern, wenn 3000 belegt ist)
```

## Funktionen
- Leaflet‑Karte mit Suche (Nominatim) und GPS.
- Filter nach Kategorie.
- Projektdetail mit Kennzahlen und Bildern.
- Veranstaltungsseite: Erstellen und Auflisten.
- i18n (es/en/de) mit Flaggen‑Auswahl.

## Backend (optional)
Supabase für `projects`, `events`, `volunteers`. SQL in `supabase/schema.sql`.
