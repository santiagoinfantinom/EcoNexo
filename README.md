# EcoNexo

[![English](https://img.shields.io/badge/README-English-blue)](./README.en.md) [![Deutsch](https://img.shields.io/badge/README-Deutsch-red)](./README.de.md)

Mapa interactivo de proyectos y eventos sostenibles en Europa.

## Funciones sociales (beta)

- Perfil de usuario: `/perfil` (edición local + API con fallback)
- Chats: `/chats` (mensajes mock + API con fallback)
- Botón flotante “Crear evento” disponible en todas las páginas

API relacionadas (con Supabase opcional):

- `GET/POST /api/profiles` → perfiles de usuario
- `GET/POST /api/messages` → mensajes de chat

Más detalles en [`docs/SOCIAL_FEATURES.md`](./docs/SOCIAL_FEATURES.md)

## Desarrollo

Requisitos: Node 18+

```bash
npm install
npm run dev
# abre http://localhost:3003 (Turbopack puede mover el puerto si 3000 está ocupado)
```

## Funcionalidades
- Mapa Leaflet con búsqueda (Nominatim) y GPS.
- Filtros por categoría.
- Detalle de proyecto con métricas e imágenes.
- Página de eventos: creación y listado.
- i18n (es/en/de) con selector de bandera.

## Backend (opcional)
Supabase para `projects`, `events`, `volunteers`. SQL en `supabase/schema.sql`.

