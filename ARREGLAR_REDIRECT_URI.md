# 🔧 Arreglar Redirect URI de Google OAuth

## ❌ Problema Actual

Google está redirigiendo a `econexo.app/auth/google/callback`, pero ese dominio no existe porque no lo has comprado. Por eso ves el error "We can't connect to the server at econexo.app".

## ✅ Solución: Agregar Redirect URI de Vercel

### Paso 1: Encuentra tu Dominio de Vercel

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto **"EcoNexo"**
3. Ve a la pestaña **"Deployments"**
4. El dominio más reciente (el primero de la lista) es tu dominio de producción
5. **Copia ese dominio completo** (ejemplo: `econexo-o8mqoe9ye-santiagoinfantinoms-projects.vercel.app`)

### Paso 2: Ve a Google Cloud Console

1. Abre: https://console.cloud.google.com/
2. Asegúrate de que el proyecto seleccionado sea **"EcoNexo"** (arriba a la izquierda)
3. En el menú lateral izquierdo, haz clic en **"APIs & Services"**
4. Luego haz clic en **"Credentials"**

### Paso 3: Abre tu OAuth Client

1. En la lista de credenciales, busca tu **OAuth 2.0 Client ID**
   - Debería tener un nombre como "EcoNexo" o "Web client"
   - O simplemente busca el que tenga tu Client ID: `1059183045627-qjmnmcghdbl5duk25vgvd5olomqgs8vb.apps.googleusercontent.com`
2. **Haz clic en el nombre del cliente** (no en el ícono de copiar, sino en el nombre mismo)

### Paso 4: Agrega el Redirect URI de Vercel

1. Desplázate hacia abajo hasta la sección **"Authorized redirect URIs"**
2. Haz clic en **"+ ADD URI"** (botón azul)
3. En el campo que aparece, pega exactamente esto (reemplaza con tu dominio de Vercel si es diferente):
   ```
   https://econexo-o8mqoe9ye-santiagoinfantinoms-projects.vercel.app/auth/google/callback
   ```
   **IMPORTANTE:** 
   - Debe empezar con `https://`
   - Debe terminar con `/auth/google/callback`
   - No debe tener espacios al inicio o al final
   - Usa el dominio exacto que copiaste en el Paso 1

### Paso 5: (Opcional) Elimina o Mantén el Redirect URI de econexo.app

Tienes dos opciones:

**Opción A: Eliminar el redirect URI de econexo.app (Recomendado)**
- Si ves `https://econexo.app/auth/google/callback` en la lista, haz clic en el ícono de **papelera** 🗑️ junto a él para eliminarlo
- Esto evita confusión y errores

**Opción B: Mantener ambos**
- Puedes tener múltiples redirect URIs
- Cuando compres el dominio `econexo.app`, funcionará automáticamente

### Paso 6: Guardar Cambios

1. Haz clic en **"SAVE"** al final de la página (botón azul abajo)
2. Espera a ver el mensaje de confirmación: "Client saved successfully" o similar
3. **Espera 1-2 minutos** para que Google aplique los cambios

### Paso 7: Probar

1. Abre tu app en el dominio de Vercel (el que copiaste en el Paso 1)
2. Haz clic en **"Iniciar sesión"** o **"Login"**
3. Selecciona **"Continuar con Google"**
4. Completa el login en Google
5. **Ahora debería redirigirte correctamente** a tu app de Vercel (no a econexo.app)

## 🔍 Verificación

Si quieres verificar qué redirect URI está usando tu código:

1. Abre tu app en el navegador
2. Abre las **Herramientas de Desarrollador** (F12 o Cmd+Option+I)
3. Ve a la pestaña **"Console"**
4. Haz clic en "Iniciar sesión" → "Continuar con Google"
5. En la consola deberías ver algo como:
   ```
   ✅ OAuth Config loaded from API
   📍 Redirect URI: https://TU-DOMINIO-VERCEL/auth/google/callback
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
   - Debe coincidir exactamente con el dominio de Vercel
   - Sin espacios, sin caracteres extra
   - Debe terminar con `/auth/google/callback`

5. **Verifica que tu email esté en "Test users":**
   - Ve a "OAuth consent screen" → "Test users"
   - Asegúrate de que tu email esté agregado

## 📝 Resumen Rápido

1. ✅ Copia tu dominio de Vercel desde Vercel Dashboard
2. ✅ Ve a Google Cloud Console → Credentials → Tu OAuth Client
3. ✅ Agrega el redirect URI: `https://TU-DOMINIO-VERCEL/auth/google/callback`
4. ✅ Guarda los cambios
5. ✅ Espera 1-2 minutos
6. ✅ Prueba el login

---

**¿Necesitas ayuda?** Comparte:
- El dominio exacto de Vercel que ves en tu dashboard
- Si ves algún error específico en la consola del navegador (F12)

