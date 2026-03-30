# 🔐 Configuración de OAuth para EcoNexo

## ⚠️ **Problema Actual**
Los botones de Google y Outlook OAuth están mostrando errores porque no están configurados los Client IDs.

## 🛠️ **Solución: Configurar OAuth**

### 1. **Configurar Google OAuth**

1. **Ir a Google Cloud Console:**
   - Ve a: https://console.cloud.google.com/
   - Selecciona o crea un proyecto

2. **Crear credenciales OAuth:**
   - Ve a "APIs & Services" > "Credentials"
   - Haz clic en "CREATE CREDENTIALS" > "OAuth client ID"
   - Selecciona "Web application"

3. **Configurar la aplicación:**
   - **Nombre:** EcoNexo Web App
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (desarrollo)
     - `https://econexo-europe.vercel.app` (producción)
   - **Authorized redirect URIs:**
     - `http://localhost:3000/auth/google/callback`
     - `https://econexo-europe.vercel.app/auth/google/callback`

4. **Copiar el Client ID** que te proporciona Google

### 2. **Configurar Outlook OAuth**

1. **Ir a Azure Portal:**
   - Ve a: https://portal.azure.com/
   - Ve a "Azure Active Directory" > "App registrations"

2. **Registrar nueva aplicación:**
   - Haz clic en "New registration"
   - **Nombre:** EcoNexo
   - **Supported account types:** Accounts in any organizational directory and personal Microsoft accounts
   - **Redirect URI:** Web > `http://localhost:3000/auth/outlook/callback`

3. **Configurar autenticación:**
   - Ve a "Authentication"
   - Agrega redirect URI: `https://econexo-europe.vercel.app/auth/outlook/callback`
   - Habilita "ID tokens" y "Access tokens"

4. **Copiar el Application (client) ID**

### 3. **Actualizar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=TU_GOOGLE_CLIENT_ID_AQUI
NEXT_PUBLIC_OUTLOOK_CLIENT_ID=TU_OUTLOOK_CLIENT_ID_AQUI

# Email Verification
NEXT_PUBLIC_EMAIL_VERIFICATION_ENABLED=true
NEXT_PUBLIC_EMAIL_FROM=noreply@econexo-europe.vercel.app

# Captcha Configuration (Opcional)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_recaptcha_site_key_aqui
RECAPTCHA_SECRET_KEY=tu_recaptcha_secret_key_aqui
```

### 4. **Reiniciar el servidor**

```bash
# Detener el servidor actual
Ctrl+C

# Reiniciar con las nuevas variables
npm run dev
```

## ✅ **Verificación**

Después de configurar:
1. Los botones de Google/Outlook deberían funcionar correctamente
2. No deberías ver más errores de "client_id missing"
3. La autenticación debería redirigir correctamente

## 🚨 **Nota Importante**

- **NUNCA** subas el archivo `.env.local` a Git
- **NUNCA** compartas tus Client IDs públicamente
- Para producción, configura las URLs correctas en Google/Azure

## 📞 **Soporte**

Si tienes problemas:
1. Verifica que las URLs de redirect sean exactas
2. Asegúrate de que el dominio esté autorizado
3. Revisa los logs del navegador para errores específicos
