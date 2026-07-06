# 📧 Configuración de SMTP para EcoNexo

## 🎯 Objetivo

Configurar Gmail para que tu aplicación pueda enviar emails reales de bienvenida y verificación.

---

## 📋 Paso a Paso

### PASO 1: Habilitar Autenticación de 2 Factores en Gmail

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Click en **"Seguridad"**
3. Busca **"Verificación en dos pasos"**
4. Actívala si no está activada
   - Te pedirá tu teléfono
   - Te enviará un código
   - Completa el proceso

**⚠️ IMPORTANTE:** Necesitas activar 2FA para poder crear App Passwords

---

### PASO 2: Generar App Password (Contraseña de Aplicación)

1. Ve a: https://myaccount.google.com/apppasswords
2. Si te pide tu contraseña, ingrésala
3. En **"Seleccionar app"** elige: `Correo`
4. En **"Seleccionar dispositivo"** elige: `Otra (nombre personalizado)`
5. Escribe: `EcoNexo App`
6. Click en **"Generar"**
7. **COPIA LA CONTRASEÑA** que aparece (formato: `xxxx xxxx xxxx xxxx`)
   - Ejemplo: `abcd efgh ijkl mnop`
   - Este es el valor que usarás en `SMTP_PASS`

**⚠️ IMPORTANTE:** Copia la contraseña ahora, no la podrás ver después

---

### PASO 3: Agregar Variables al Archivo .env.local

Ahora voy a agregar las variables SMTP a tu archivo `.env.local`:

```bash
# Agregar al final del archivo
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=TU_EMAIL@gmail.com
SMTP_PASS=LA_CONTRASEÑA_COPIADA
```

**Reemplaza:**
- `TU_EMAIL@gmail.com` → Tu email de Gmail real
- `LA_CONTRASEÑA_COPIADA` → La contraseña del Paso 2 (sin espacios)

---

### PASO 4: Verificar que Funciona

```bash
# Reiniciar el servidor
npm run dev
```

Luego prueba registrando un usuario con email.

---

## ✅ Ejemplo Completo del .env.local

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1059183045627-qjmnmcghdbl5duk25vgvd5olomqgs8vb.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Email Verification
NEXT_PUBLIC_EMAIL_VERIFICATION_ENABLED=true
NEXT_PUBLIC_EMAIL_FROM=noreply@econexo.app

# SMTP Configuration (NUEVO)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=econexo@gmail.com
SMTP_PASS=abcd efgh ijkl mnop

# Captcha (opcional)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

---

## 🆘 Problemas Comunes

### Error: "Authentication failed"
- Verifica que copiaste bien la App Password
- Debe ser exactamente la que Google te dio, sin modificar

### Error: "Less secure app access"
- Con App Passwords esto ya no es necesario
- Asegúrate de usar una App Password, no tu contraseña normal

### Error: "Connection refused"
- Verifica que `SMTP_HOST` sea `smtp.gmail.com`
- Verifica que `SMTP_PORT` sea `587`

---

## 🚀 Próximo Paso

Una vez configurado, podrás enviar emails reales a los usuarios que se registren.

¿Necesitas ayuda con otro paso? Dime qué quieres configurar:
- ✅ Gmail (estás aquí)
- ⬜ Supabase
- ⬜ Google OAuth
- ⬜ Otras variables

