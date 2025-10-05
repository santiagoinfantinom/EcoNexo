# EcoNexo

Mapa interactivo de proyectos y eventos sostenibles en Europa.

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

