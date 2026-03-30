# 🔐 Guía para Configurar OAuth de Outlook/Microsoft

## 📋 Paso a Paso para Registro en Azure Portal

### 1️⃣ Crear una Aplicación en Azure AD

1. Ve a: https://portal.azure.com/
2. Inicia sesión con tu cuenta de Microsoft/Azure
3. Busca "Azure Active Directory" en la barra de búsqueda
4. En el menú lateral, selecciona **"App registrations"**
5. Haz clic en **"New registration"**

### 2️⃣ Configurar la Aplicación

En el formulario de registro:

**Name:**
```
EcoNexo Web App
```

**Supported account types:**
```
Accounts in any organizational directory and personal Microsoft accounts
(Opción que permite login con cuentas personales y corporativas)
```

**Redirect URI:**
```
Platform: Web
URI: http://localhost:3000/auth/outlook/callback
```

Haz clic en **"Register"**

### 3️⃣ Obtener el Client ID

Después de crear la aplicación:

1. En la página de **"Overview"**, copia el **"Application (client) ID"**
2. Este es tu `NEXT_PUBLIC_OUTLOOK_CLIENT_ID`

### 4️⃣ Configurar Redirect URIs Adicionales

1. Ve a **"Authentication"** en el menú lateral
2. Haz clic en **"Add a platform"**
3. Selecciona **"Web"**
4. Agrega las siguientes URIs:

```
http://localhost:3000/auth/outlook/callback
https://econexo-europe.vercel.app/auth/outlook/callback
```

5. Marca estas opciones:
   - ✅ **ID tokens**
   - ✅ **Access tokens**
   
6. Haz clic en **"Configure"**

### 5️⃣ Configurar API Permissions (Opcional)

Para leer datos de Outlook:

1. Ve a **"API permissions"**
2. Haz clic en **"Add a permission"**
3. Selecciona **"Microsoft Graph"**
4. Selecciona **"Delegated permissions"**
5. Agrega estos permisos:
   - `User.Read` - Para leer perfil del usuario
   - `Mail.Read` - Para leer emails (opcional)
   - `Calendars.Read` - Para leer calendario (opcional)
6. Haz clic en **"Add permissions"**

### 6️⃣ Actualizar Variables de Entorno

Edita tu archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_OUTLOOK_CLIENT_ID=tu_client_id_copiado_aqui

# Las otras variables ya deberían estar configuradas
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 7️⃣ Reiniciar el Servidor de Desarrollo

```bash
# Detén el servidor (Ctrl+C) y ejecuta:
npm run dev
```

### 8️⃣ Probar el Login

1. Ve a: http://localhost:3000
2. Haz clic en "Sign In" o "Registrarse"
3. Haz clic en el botón de "Microsoft Outlook"
4. Serás redirigido a Microsoft para autenticarte
5. Después de autenticarte, serás redirigido de vuelta a EcoNexo

## 🚀 Para Producción

Cuando estés listo para deployar:

1. Agrega la URI de producción en Azure:
   ```
   https://econexo-europe.vercel.app/auth/outlook/callback
   ```

2. Actualiza las variables de entorno en tu plataforma de deployment (Vercel, etc.)

## ⚠️ Notas Importantes

- El Client Secret NO es necesario para PKCE flow (el que usamos)
- Las URLs de redirect DEBEN coincidir exactamente
- No compartas tu Client ID públicamente si planeas usarlo en producción
- El modo demo seguirá funcionando si no configuras las variables

## 🎯 Verificación

Después de configurar todo:

1. El botón de Outlook debería iniciar el flujo real de OAuth
2. Verás la página de login de Microsoft
3. Después de autenticarte, serás redirigido al callback
4. Tu perfil se llenará con datos reales de Microsoft

