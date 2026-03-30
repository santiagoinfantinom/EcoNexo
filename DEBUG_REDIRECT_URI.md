# 🔍 Cómo Verificar el Redirect URI que se Está Enviando

## Método 1: Ver la URL de Google Antes de Hacer Clic

1. **Abre tu app en modo privado:**
   ```
   https://econexo-europe.vercel.app
   ```

2. **Abre las herramientas de desarrollador:**
   - Presiona `F12` o `Cmd+Option+I`
   - Ve a la pestaña **"Network"** (Red)

3. **Haz clic en "Iniciar sesión" → "Continuar con Google"**

4. **En la pestaña "Network", busca la solicitud a Google:**
   - Busca una solicitud que vaya a `accounts.google.com`
   - Haz clic en esa solicitud
   - Ve a la pestaña **"Headers"** o **"Parámetros"**
   - Busca el parámetro `redirect_uri` en la URL o en los parámetros de la solicitud

5. **Copia el `redirect_uri` completo que veas ahí**

## Método 2: Ver la URL Completa en la Barra de Direcciones

1. **Abre tu app y haz clic en "Continuar con Google"**

2. **Cuando Google te redirija, ANTES de que aparezca el error, mira la URL en la barra de direcciones**

3. **La URL debería verse algo así:**
   ```
   https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...
   ```

4. **Copia la URL completa y busca el parámetro `redirect_uri`**

## Método 3: Usar la Consola del Navegador

1. **Abre tu app en modo privado**

2. **Abre la consola (F12) y ejecuta esto ANTES de hacer clic:**
   ```javascript
   console.log('Current origin:', window.location.origin);
   console.log('Expected redirect URI:', window.location.origin + '/auth/google/callback');
   ```

3. **Luego haz clic en "Continuar con Google"**

4. **Después del error, ejecuta esto en la consola:**
   ```javascript
   // Ver la URL actual
   console.log('Current URL:', window.location.href);
   
   // Si hay parámetros en la URL, verlos
   const urlParams = new URLSearchParams(window.location.search);
   console.log('URL Parameters:', Object.fromEntries(urlParams));
   ```

## Método 4: Verificar en Google Cloud Console

1. **Ve a Google Cloud Console:**
   - https://console.cloud.google.com/
   - APIs & Services → Credentials → Tu OAuth Client

2. **En "Authorized redirect URIs", verifica que esté EXACTAMENTE:**
   ```
   https://econexo-europe.vercel.app/auth/google/callback`
   ```

3. **Verifica que:**
   - ✅ Empiece con `https://` (no `http://`)
   - ✅ No tenga espacios al inicio o al final
   - ✅ Termine con `/auth/google/callback`
   - ✅ El dominio sea exactamente `econexo-europe.vercel.app`

## ⚠️ Problemas Comunes

1. **Espacios invisibles:** Copia y pega el redirect URI directamente desde aquí
2. **http vs https:** Debe ser `https://`, no `http://`
3. **Dominio incorrecto:** Verifica que sea el dominio oficial de Vercel (econexo-europe.vercel.app)
4. **Cambios no aplicados:** Espera 2-3 minutos después de guardar en Google Cloud Console

## 📝 Qué Hacer con la Información

Una vez que tengas el `redirect_uri` que se está enviando:

1. **Compáralo con el que está en Google Cloud Console**
2. **Deben ser EXACTAMENTE iguales** (carácter por carácter)
3. **Si son diferentes, copia el que se está enviando y agrégalo también en Google Cloud Console**


