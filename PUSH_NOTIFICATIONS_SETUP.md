# 🔔 Configuración de Notificaciones Push - EcoNexo

## 📋 Resumen

Sistema completo de notificaciones push para eventos próximos que funciona incluso cuando la app no está abierta.

## ✅ Funcionalidades Implementadas

1. **Suscripción Push Real**: Usa VAPID keys para suscripciones seguras
2. **Base de Datos**: Guarda suscripciones en Supabase
3. **Notificaciones Automáticas**: Envía notificaciones 24h y 1h antes de eventos
4. **Service Worker**: Maneja notificaciones en segundo plano
5. **Limpieza Automática**: Elimina suscripciones expiradas

## 🚀 Configuración

### 1. Generar VAPID Keys

```bash
npx web-push generate-vapid-keys
```

Esto generará dos claves:
- **Public Key**: Úsala como `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- **Private Key**: Úsala como `VAPID_PRIVATE_KEY` (NUNCA la expongas en el cliente)

### 2. Configurar Variables de Entorno

Agrega estas variables a tu `.env.local` y a Vercel:

```env
# VAPID Keys para Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=tu_public_key_aqui
VAPID_PRIVATE_KEY=tu_private_key_aqui
```

**⚠️ IMPORTANTE**: 
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` es pública y puede estar en el cliente
- `VAPID_PRIVATE_KEY` es SECRETA y solo debe estar en el servidor

### 3. Aplicar Migración de Base de Datos

Ejecuta la migración en Supabase:

```bash
# Opción 1: Usando Supabase CLI
supabase db push

# Opción 2: Manualmente en Supabase Dashboard
# Ve a SQL Editor y ejecuta el contenido de:
# supabase/migrations/20251111_push_subscriptions.sql
```

La migración crea:
- `push_subscriptions`: Almacena suscripciones de usuarios
- `event_notifications`: Rastrea qué notificaciones se han enviado

### 4. Configurar Cron Job (Opcional pero Recomendado)

Para enviar notificaciones automáticamente, configura un cron job que llame al endpoint:

**Opción A: Vercel Cron Jobs** (Recomendado)

Crea `vercel.json` con:

```json
{
  "crons": [{
    "path": "/api/push/check-events",
    "schedule": "*/15 * * * *"
  }]
}
```

Esto ejecutará el check cada 15 minutos.

**Opción B: Servicio Externo**

Usa un servicio como:
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [GitHub Actions](https://github.com/features/actions)

Configura una llamada POST a:
```
https://tu-dominio.vercel.app/api/push/check-events
```

Cada 15-30 minutos.

## 🧪 Pruebas

### 1. Probar Suscripción

1. Abre la app en el navegador
2. Ve a `/calendario` o `/eventos`
3. Haz clic en "Activar notificaciones"
4. Permite las notificaciones cuando el navegador lo solicite
5. Deberías ver un mensaje de confirmación

### 2. Probar Notificaciones Manualmente

Puedes llamar al endpoint manualmente:

```bash
curl -X POST https://tu-dominio.vercel.app/api/push/check-events
```

Esto verificará eventos próximos y enviará notificaciones.

### 3. Crear Evento de Prueba

1. Crea un evento con fecha/hora dentro de las próximas 24 horas
2. El sistema enviará notificaciones automáticamente:
   - **24 horas antes**: Recordatorio
   - **1 hora antes**: Aviso de inicio

## 📊 Estructura de Base de Datos

### `push_subscriptions`
- `id`: UUID único
- `user_id`: ID del usuario (opcional, puede ser null)
- `endpoint`: URL única del endpoint de push
- `p256dh`: Clave pública del cliente
- `auth`: Token de autenticación
- `user_agent`: Información del navegador
- `created_at`, `updated_at`: Timestamps

### `event_notifications`
- `id`: UUID único
- `event_id`: ID del evento
- `subscription_id`: ID de la suscripción
- `notification_type`: '24h_before' o '1h_before'
- `sent_at`: Cuándo se envió
- `created_at`: Timestamp de creación

## 🔧 Endpoints API

### `POST /api/push/subscribe`
Registra una nueva suscripción push.

**Body:**
```json
{
  "endpoint": "https://...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  }
}
```

### `DELETE /api/push/subscribe`
Elimina una suscripción.

**Body:**
```json
{
  "endpoint": "https://..."
}
```

### `POST /api/push/send`
Envía una notificación push manualmente.

**Body:**
```json
{
  "subscription": { ... },
  "title": "Título",
  "body": "Mensaje",
  "url": "/eventos/123"
}
```

### `POST /api/push/check-events`
Verifica eventos próximos y envía notificaciones automáticamente.

**No requiere body** - se ejecuta automáticamente o por cron.

## 🐛 Troubleshooting

### Las notificaciones no se envían

1. **Verifica VAPID keys**:
   - Asegúrate de que ambas estén configuradas
   - La clave pública debe empezar con `B` (base64 URL-safe)

2. **Verifica Service Worker**:
   - Abre DevTools → Application → Service Workers
   - Debe estar registrado y activo

3. **Verifica Permisos**:
   - El navegador debe tener permisos de notificación
   - Verifica en Configuración del sitio

4. **Verifica Base de Datos**:
   - Las suscripciones deben estar guardadas en `push_subscriptions`
   - Los eventos deben tener `date` y `start_time` válidos

### Las suscripciones se eliminan

- Las suscripciones expiradas se eliminan automáticamente
- Si el navegador revoca permisos, la suscripción se marca como inválida
- El usuario debe volver a suscribirse

### El cron job no funciona

- Verifica que el endpoint `/api/push/check-events` sea accesible
- Revisa los logs de Vercel para errores
- Asegúrate de que las variables de entorno estén configuradas

## 📝 Notas Importantes

1. **HTTPS Requerido**: Las notificaciones push solo funcionan en HTTPS (o localhost)
2. **Navegadores Soportados**: Chrome, Firefox, Edge, Safari (iOS requiere configuración adicional)
3. **Límites**: Algunos navegadores limitan el número de notificaciones
4. **Privacidad**: Las suscripciones se guardan de forma segura y solo se usan para notificaciones

## 🎯 Próximos Pasos

- [ ] Configurar cron job en producción
- [ ] Agregar preferencias de usuario (horarios de notificación)
- [ ] Implementar notificaciones en iOS (requiere configuración adicional)
- [ ] Agregar analytics de notificaciones enviadas/abiertas
- [ ] Implementar notificaciones para nuevos eventos (no solo próximos)

---

**¡Listo!** Tu sistema de notificaciones push está configurado. 🎉

