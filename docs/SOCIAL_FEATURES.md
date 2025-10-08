# Social Features (Beta)

## Rutas
- `/perfil`: editor de perfil (nombre, email, bio, intereses e idioma). Guarda vía `/api/profiles` y cambia el idioma de la app.
- `/chats`: chat básico con envío inmediato. Carga desde `/api/messages` y envía con `POST /api/messages`.

## APIs
- `GET /api/profiles?id={id}` → devuelve el perfil (Supabase si está configurado; sino, mock).
- `POST /api/profiles` → upsert del perfil.
- `GET /api/messages?user={id}` → lista de mensajes del usuario.
- `POST /api/messages` → inserta mensaje.

## Supabase (opcional)
Variables de entorno:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Tablas sugeridas:
```sql
create table if not exists profiles (
  id text primary key,
  name text,
  email text,
  bio text,
  interests text,
  language text
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  "from" text not null,
  "to" text not null,
  text text not null,
  ts timestamptz not null default now()
);
```

Nota: si las variables no están definidas, las APIs funcionan en modo mock.
