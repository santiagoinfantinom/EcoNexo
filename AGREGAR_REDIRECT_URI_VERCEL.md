# 🔧 Agregar Redirect URI de Vercel en Google Cloud Console

## 📋 Pasos Rápidos

### 1️⃣ Ve a Google Cloud Console
1. Abre: https://console.cloud.google.com/
2. Asegúrate de que el proyecto seleccionado sea **"EcoNexo"** (arriba a la izquierda)
3. En el menú lateral izquierdo, haz clic en **"APIs & Services"**
4. Luego haz clic en **"Credentials"**

### 2️⃣ Abre tu OAuth Client
1. En la lista de credenciales, busca tu **OAuth 2.0 Client ID**
   - Busca el que tenga el Client ID: `1059183045627-qjmnmcghdbl5duk25vgvd5olomqgs8vb.apps.googleusercontent.com`
2. **Haz clic en el nombre del cliente** (no en el ícono de copiar, sino en el nombre mismo)

### 3️⃣ Agrega el Redirect URI de Vercel
1. Desplázate hacia abajo hasta la sección **"Authorized redirect URIs"**
2. Haz clic en **"+ ADD URI"** (botón azul)
3. En el campo que aparece, pega **EXACTAMENTE** esto:
   ```
   https://econexo-o8mqoe9ye-santiagoinfantinoms-projects.vercel.app/auth/google/callback
   ```
   **⚠️ IMPORTANTE:**
   - ✅ Debe empezar con `https://`
   - ✅ Debe terminar con `/auth/google/callback`
   - ✅ No debe tener espacios al inicio o al final
   - ✅ Copia y pega exactamente como está arriba

### 4️⃣ (Opcional) Elimina el Redirect URI de econexo.app
Si ves `https://econexo.app/auth/google/callback` en la lista:
- Haz clic en el ícono de **papelera** 🗑️ junto a él para eliminarlo
- Esto evita confusión y errores

### 5️⃣ Guardar Cambios
1. Haz clic en **"SAVE"** al final de la página (botón azul abajo)
2. Espera a ver el mensaje de confirmación: "Client saved successfully" o similar
3. **Espera 1-2 minutos** para que Google aplique los cambios

### 6️⃣ Probar
1. Abre tu app en modo privado: `https://econexo-o8mqoe9ye-santiagoinfantinoms-projects.vercel.app`
2. Haz clic en **"Iniciar sesión"** o **"Login"**
3. Selecciona **"Continuar con Google"**
4. Completa el login en Google
5. **Ahora debería redirigirte correctamente** a tu app de Vercel (no a econexo.app)

## 🔍 Verificación

Si quieres verificar qué redirect URI está usando tu código:

1. Abre tu app en el navegador: `https://econexo-o8mqoe9ye-santiagoinfantinoms-projects.vercel.app`
2. Abre las **Herramientas de Desarrollador** (F12 o Cmd+Option+I)
3. Ve a la pestaña **"Console"**
4. Haz clic en "Iniciar sesión" → "Continuar con Google"
5. En la consola deberías ver algo como:
   ```
   ✅ OAuth Config loaded from API
   📍 Redirect URI: https://econexo-o8mqoe9ye-santiagoinfantinoms-projects.vercel.app/auth/google/callback
   ```
6. Verifica que el redirect URI mostrado sea el de Vercel (no econexo.app)

## ⚠️ Si Sigue Sin Funcionar

1. **Verifica que guardaste los cambios:**
   - Debe aparecer un mensaje de confirmación en Google Cloud Console
   - Si no guardaste, haz clic en "SAVE" de nuevo

2. **Espera más tiempo:**
   - A veces Google tarda hasta 5 minutos en aplicar cambios
   - Intenta de nuevo después de esperar

3. **Limpia la caché del navegador:**
   - Ctrl+Shift+Delete (Windows/Linux) o Cmd+Shift+Delete (Mac)
   - O prueba en modo incógnito

4. **Verifica que el redirect URI sea exacto:**
   - Debe coincidir exactamente con: `https://econexo-o8mqoe9ye-santiagoinfantinoms-projects.vercel.app/auth/google/callback`
   - Sin espacios, sin caracteres extra
   - Debe terminar con `/auth/google/callback`

5. **Verifica que tu email esté en "Test users":**
   - Ve a "OAuth consent screen" → "Test users"
   - Asegúrate de que tu email (`santiago.infantino.moreno@gmail.com`) esté agregado

## 📝 Resumen

**Redirect URI a agregar:**
```
https://econexo-o8mqoe9ye-santiagoinfantinoms-projects.vercel.app/auth/google/callback
```

**Pasos:**
1. ✅ Google Cloud Console → APIs & Services → Credentials
2. ✅ Abre tu OAuth Client ID
3. ✅ Agrega el redirect URI de arriba
4. ✅ Guarda los cambios
5. ✅ Espera 1-2 minutos
6. ✅ Prueba el login

