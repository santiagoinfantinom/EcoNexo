# 🔑 Guía Completa de Variables de Entorno - EcoNexo

## 📋 ¿Qué son las Variables de Entorno?

Las **variables de entorno** son valores secretos o configurables que tu aplicación necesita para funcionar. Como si fueran "contraseñas" o "configuraciones" que tu app lee al iniciar.

**Ejemplo simple:** Imagina que tu app necesita conectarse a Gmail para enviar emails. La variable de entorno almacena tu usuario y contraseña de forma segura, sin que estén en el código.

---

## 📧 Variables para EMAILS (Verificación y Bienvenida)

### `SMTP_HOST`
- **Qué es:** El servidor que enviará los emails
- **Ejemplo:** `smtp.gmail.com`
- **Opciones:**
  - Gmail: `smtp.gmail.com`
  - Outlook: `smtp.office365.com`
  - Yahoo: `smtp.mail.yahoo.com`
- **¿Dónde obtenerlo?** En la página de ayuda de tu proveedor de email

### `SMTP_PORT`
- **Qué es:** El puerto donde se conecta el servidor
- **Ejemplo:** `587`
- **Opciones comunes:**
  - Puerto 587: Seguro pero no encriptado (TLS)
  - Puerto 465: Seguro y encriptado (SSL)
- **Recomendado:** `587` para Gmail

### `SMTP_USER`
- **Qué es:** Tu dirección de email que enviará los correos
- **Ejemplo:** `econexo@gmail.com`
- **⚠️ Importante:** Debe ser el mismo email configurado en el proveedor

### `SMTP_PASS`
- **Qué es:** La contraseña ESPECIAL para enviar emails
- **Ejemplo:** `abcd efgh ijkl mnop`
- **⚠️ NO es tu contraseña normal de Gmail**
- **Cómo obtenerla:**
  1. Ve a: https://myaccount.google.com/apppasswords
  2. Genera una contraseña de aplicación
  3. Cópiala aquí

**No la compartas con nadie, es tu "llave" para enviar emails**

---

## 🔐 Variables para OAUTH (Login con Google)

### `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- **Qué es:** Tu ID de aplicación de Google
- **Ejemplo:** `123456789-abcdefghijklmnop.apps.googleusercontent.com`
- **Dónde obtener:**
  1. Ve a: https://console.cloud.google.com/
  2. Crea un proyecto o selecciona uno
  3. Ve a "APIs & Services" → "Credentials"
  4. Crea "OAuth Client ID"
  5. Copia el Client ID
- **⭐ Incluye "NEXT_PUBLIC_" porque se expone al navegador**

---

## 🌐 Variables Generales

### `NEXT_PUBLIC_SITE_URL`
- **Qué es:** La URL de tu sitio web
- **Ejemplo desarrollo:** `http://localhost:3000`
- **Ejemplo producción:** `https://econexo-europe.vercel.app`
- **¿Para qué?** Para generar links de verificación correctos

### `NEXT_PUBLIC_EMAIL_FROM`
- **Qué es:** El email "de quién" envía los emails
- **Ejemplo:** `noreply@econexo.app`
- **⚠️ Debe ser una dirección válida**

### `NEXT_PUBLIC_EMAIL_VERIFICATION_ENABLED`
- **Qué es:** Activa/desactiva la verificación por email
- **Valores:** `true` o `false`
- **Recomendado:** `true` en producción

---

## 📊 Variables de Base de Datos (Supabase)

### `NEXT_PUBLIC_SUPABASE_URL`
- **Qué es:** La URL de tu proyecto en Supabase
- **Ejemplo:** `https://xyzabc.supabase.co`
- **Dónde obtener:** En tu dashboard de Supabase

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Qué es:** La llave pública de Supabase
- **Ejemplo:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Dónde obtener:** En tu dashboard de Supabase (Settings → API)

---

## ⚠️ Variables SEGURAS (NUNCA las compartas)

### Variables que empiezan con `NEXT_PUBLIC_`
- **Son públicas:** Se envían al navegador
- **Riesgo:** Medio - cualquiera puede verlas en el código del sitio
- **Ejemplo:** `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

### Variables SIN `NEXT_PUBLIC_`
- **Son privadas:** Solo el servidor las ve
- **Riesgo:** ALTO - NUNCA las compartas
- **Ejemplo:** `SMTP_PASS`

---

## 🚀 Cómo Configurarlas

### Para Desarrollo Local:

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_client_id

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_EMAIL_FROM=noreply@econexo.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_supabase
```

### Para Producción (Vercel):

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega cada variable una por una
4. Marca "Production", "Preview", "Development" según necesites
5. Redeploy

---

## ✅ Checklist de Configuración

Antes de poner en producción, verifica:

- [ ] `SMTP_PASS` configurado (Gmail App Password)
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` configurado
- [ ] `NEXT_PUBLIC_SITE_URL` apunta a producción
- [ ] `.env.local` creado localmente
- [ ] Variables agregadas en Vercel
- [ ] Emails de prueba enviados correctamente

---

## 🧪 Cómo Probar

### 1. Probar Emails:
```bash
# Registra un usuario con email
# Revisa la consola del servidor para ver el link de verificación
npm run dev
```

### 2. Probar OAuth de Google:
```bash
# Intenta login con Google
# Debe redirigirte a Google y luego de vuelta
```

---

## 🆘 Problemas Comunes

### Error: "Connection refused"
- **Solución:** Verifica `SMTP_HOST` y `SMTP_PORT`

### Error: "Authentication failed"
- **Solución:** Usa App Password de Gmail, no tu contraseña normal

### Error: "Google OAuth error"
- **Solución:** Verifica que el redirect URI esté configurado en Google Console

### Error: "Email not sent"
- **Solución:** Revisa la consola del servidor, los emails se loguean en desarrollo

---

## 📚 Recursos Adicionales

- **Gmail App Passwords:** https://myaccount.google.com/apppasswords
- **Google OAuth Setup:** https://console.cloud.google.com/
- **Supabase:** https://supabase.com/
- **Vercel Env Vars:** https://vercel.com/docs/environment-variables

---

**⭐ Consejo Final:** Nunca subas tu archivo `.env.local` a GitHub. Está en `.gitignore` por seguridad.

