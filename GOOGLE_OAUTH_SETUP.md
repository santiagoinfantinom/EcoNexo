# ⚙️ CONFIGURACIÓN DE GOOGLE OAUTH - SOLUCIÓN AL ERROR 404

## 🚨 Problema Actual
El error 404 de Google OAuth indica que el **redirect_uri** no está registrado en Google Cloud Console.

**URL que Google está rechazando:**
- Client ID: `957241665704-2611m9cpj7h4060hj6or1d6raadqkt3r`
- Redirect URI: `http://localhost:3000/auth/google/callback`

---

## 📋 SOLUCIÓN PASO A PASO (COPIA Y PEGA)

### 1️⃣ Abre Google Cloud Console
```
https://console.cloud.google.com/
```
**Nota:** Asegúrate de estar en el proyecto correcto

### 2️⃣ Ve a Credentials
1. Clic en el menú lateral izquierdo ☰
2. Clic en **"APIs & Services"**
3. Clic en **"Credentials"**

### 3️⃣ Encuentra tu OAuth Client
En la tabla, busca el cliente con:
- **Client ID:** `957241665704-2611m9cpj7h4060hj6or1d6raadqkt3r...`
- **Type:** OAuth 2.0 Client ID
- **Application type:** Web application

**⚠️ IMPORTANTE:** Haz clic en el **NOMBRE** del cliente (columna "Name"), NO en el Client ID

### 4️⃣ Agrega el Redirect URI
1. En la sección **"Authorized redirect URIs"**
2. Haz clic en **"+ ADD URI"** o el botón **"ADD"**
3. **Copia y pega EXACTAMENTE esto:**
   ```
   http://localhost:3000/auth/google/callback
   ```
4. **⚠️ CRÍTICO:**
   - ✅ Debe empezar con `http://` (NO `https://`)
   - ✅ Debe terminar en `/auth/google/callback`
   - ✅ No agregar espacios antes o después
   - ✅ No debe haber errores de tipeo

### 5️⃣ Guarda los Cambios
1. Haz clic en el botón **"SAVE"** (Guardar) en la parte inferior de la página
2. **Espera 1-2 minutos** para que Google aplique los cambios

### 6️⃣ Verifica que Funcionó
1. Vuelve a la página de Credentials
2. Abre tu OAuth Client de nuevo
3. Verifica que `http://localhost:3000/auth/google/callback` esté en la lista de Redirect URIs

### Paso 5: Guardar y Reiniciar
1. Haz clic en **"SAVE"** (Guardar)
2. Espera 1-2 minutos para que los cambios se apliquen
3. Reinicia el servidor de EcoNexo:
   ```bash
   pkill -9 -f "next dev" && sleep 2 && cd /Users/santiago/Documents/Projects/EcoNexo && npm run dev
   ```

### Paso 6: Probar
1. Ve a http://localhost:3000
2. Haz clic en "Sign In" o "Sign Up"
3. Haz clic en el botón "Google"
4. Deberías ser redirigido a la página de inicio de sesión de Google

## Si aún no funciona

### Opción A: Verificar que el Redirect URI esté guardado
1. Vuelve a Google Cloud Console → Credentials
2. Verifica que el redirect URI esté en la lista
3. Si no está, agrégala de nuevo y espera 2 minutos antes de probar

### Opción B: Crear un nuevo OAuth Client
1. En Google Cloud Console → Credentials
2. Haz clic en **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Application type: **"Web application"**
4. Name: **"EcoNexo Localhost"**
5. Authorized JavaScript origins: `http://localhost:3000`
6. Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
7. Haz clic en **"CREATE"**
8. **IMPORTANTE**: Copia el nuevo Client ID y Client Secret
9. Actualiza tu archivo `.env.local` con los nuevos valores

## Configuración Actual

**Tu configuración actual:**
- Client ID: `your_google_client_id_here`
- Client Secret: `your_google_client_secret_here`
- Redirect URI: `http://localhost:3000/auth/google/callback`

**Lo que debes hacer:**
- Agregar el Redirect URI en Google Cloud Console (Paso 4)
- Guardar los cambios
- Reiniciar el servidor

