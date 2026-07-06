# 🔧 SOLUCIÓN DEFINITIVA PARA GOOGLE OAUTH

## 🚨 Error Actual: "invalid_client"

El Client ID que estás usando (`957241665704-2611m9cpj7h4060hj6or1d6raadqkt3r`) **NO existe** o fue eliminado de Google Cloud Console.

---

## 📋 SOLUCIÓN: Crear un NUEVO OAuth Client

### 1️⃣ Abre Google Cloud Console
```
https://console.cloud.google.com/
```

### 2️⃣ Selecciona o Crea un Proyecto
1. Clic en el selector de proyecto (parte superior)
2. Si ya tienes un proyecto, selecciónalo
3. Si NO tienes proyecto, clic en **"NEW PROJECT"**
   - **Nombre:** `EcoNexo OAuth`
   - **Organization:** (deja por defecto)
   - Clic en **"CREATE"**
   - **Espera** 1-2 minutos a que se cree

### 3️⃣ Habilita la API de Google+
1. Ve a: https://console.cloud.google.com/apis/library
2. Busca: **"Google+ API"**
3. Clic en **"Google+ API"**
4. Clic en **"ENABLE"**

### 4️⃣ Crea el OAuth Client ID
1. Ve a: https://console.cloud.google.com/apis/credentials
2. Clic en **"+ CREATE CREDENTIALS"** (botón azul en la parte superior)
3. Selecciona **"OAuth client ID"**
4. Si te pide **"CONFIGURE CONSENT SCREEN"** primero:
   - **User Type:** External
   - Clic en **"CREATE"**
   - **App name:** `EcoNexo`
   - **User support email:** (tu email)
   - **Developer contact email:** (tu email)
   - Clic en **"SAVE AND CONTINUE"**
   - En "Scopes", clic en **"SAVE AND CONTINUE"**
   - En "Test users", clic en **"ADD USERS"**, escribe tu email, clic en **"ADD"** y luego **"SAVE AND CONTINUE"**
   - En "Summary", clic en **"BACK TO DASHBOARD"**

5. Ahora crea el OAuth Client:
   - **Application type:** Web application
   - **Name:** `EcoNexo Web Client`
   - **Authorized redirect URIs:**
     - Copia y pega esto: `http://localhost:3000/auth/google/callback`
     - ⚠️ NO agregar `https://localhost`
     - ⚠️ Debe terminar en `/auth/google/callback`
   
6. Clic en **"CREATE"**

### 5️⃣ Copia el Client ID
1. Google mostrará un popup con el Client ID
2. **Copia el Client ID completo** (debe verse algo como: `123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`)
3. **NO cierres el popup todavía**

### 6️⃣ Actualiza el `.env.local`
1. Abre el archivo `.env.local` en tu editor
2. Busca la línea: `NEXT_PUBLIC_GOOGLE_CLIENT_ID=...`
3. **Reemplaza** todo lo que está después del `=` con el nuevo Client ID
4. Debe quedar así:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=TU_NUEVO_CLIENT_ID_AQUI
   ```
5. **Guarda** el archivo

### 7️⃣ Reinicia el servidor
```bash
# Mata el proceso actual
pkill -9 -f "next dev"

# Inicia de nuevo
cd /Users/santiago/Documents/Projects/EcoNexo
npm run dev
```

### 8️⃣ Prueba de nuevo
1. Ve a http://localhost:3000
2. Clic en "Iniciar sesión"
3. Clic en el botón "Google"
4. Deberías ver la pantalla de login de Google

---

## ❌ Si SIGUES TENIENDO PROBLEMAS

### Opción A: Usar Demo Mode (Rápido)
Si necesitas probar la app rápidamente sin configurar Google:

1. Abre `.env.local`
2. Cambia la línea a:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=demo-client-id
   ```
3. Guarda y reinicia el servidor
4. El login con Google funcionará en modo demo

### Opción B: Verifica que el Client ID sea correcto
```bash
# Verifica el Client ID actual
cat /Users/santiago/Documents/Projects/EcoNexo/.env.local | grep GOOGLE_CLIENT_ID

# Debe mostrar algo como:
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefg...apps.googleusercontent.com
```

---

## ✅ Resultado Esperado

Después de seguir estos pasos:
- ✅ Login con Google debería funcionar
- ✅ No deberías ver más el error 404
- ✅ No deberías ver más "invalid_client"
- ✅ Serás redirigido a Google para autenticarte
- ✅ Después de autenticarte, volverás a EcoNexo

