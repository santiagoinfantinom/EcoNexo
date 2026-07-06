# ⚡ Solución Rápida: Google OAuth con Dominio de Vercel

## ✅ Cambios Realizados en el Código

El código ya está actualizado para usar automáticamente el dominio actual del navegador. Esto significa que funcionará con cualquier dominio de Vercel sin necesidad de configurar DNS.

## 🔧 Paso Único: Agregar Redirect URI en Google Cloud Console

### 1. Ve a Google Cloud Console
- Abre: https://console.cloud.google.com/
- Selecciona el proyecto **"EcoNexo"**

### 2. Ve a Credentials
- En el menú lateral izquierdo, haz clic en **"APIs & Services"**
- Luego haz clic en **"Credentials"**

### 3. Abre tu OAuth Client
- Busca tu **OAuth 2.0 Client ID** (debería llamarse algo como "EcoNexo" o "Web client")
- Haz clic en el **nombre del cliente** para editarlo

### 4. Agrega el Redirect URI
En la sección **"Authorized redirect URIs"**, haz clic en **"+ ADD URI"** y agrega:

```
https://econexo-o8mqoe9ye-santiagoinfantinoms-projects.vercel.app/auth/google/callback
```

**Nota:** Si tu dominio de Vercel es diferente (más reciente), reemplázalo con el dominio que ves en tu navegador cuando abres la app.

### 5. Guardar
- Haz clic en **"SAVE"** al final de la página
- Espera **1-2 minutos** para que Google aplique los cambios

### 6. Probar
1. Abre tu app en: `https://econexo-o8mqoe9ye-santiagoinfantinoms-projects.vercel.app`
2. Haz clic en **"Iniciar sesión"** o **"Login"**
3. Selecciona **"Continuar con Google"**
4. Debería funcionar correctamente ahora

## 🎯 ¿Cómo Saber Cuál es tu Dominio de Vercel?

Si no estás seguro de cuál es tu dominio actual:

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto "EcoNexo"
3. Ve a la pestaña **"Deployments"**
4. El dominio más reciente (el primero de la lista) es tu dominio de producción
5. Copia ese dominio y úsalo en el redirect URI

## ⚠️ Si el Dominio Cambia

Cada vez que Vercel hace un nuevo deployment, puede generar un nuevo dominio. Si esto pasa:

1. Simplemente agrega el nuevo redirect URI en Google Cloud Console
2. Puedes tener múltiples redirect URIs, así que no necesitas eliminar los antiguos
3. El código automáticamente usará el dominio correcto

## ✅ Verificación

Después de agregar el redirect URI y esperar 1-2 minutos:

1. Abre la consola del navegador (F12)
2. Intenta iniciar sesión con Google
3. Deberías ver en la consola: `✅ OAuth Config loaded from API` con `usingCurrentOrigin: true`
4. El login debería funcionar sin errores

## 🆘 Si Sigue Sin Funcionar

1. **Verifica que agregaste el redirect URI correcto:**
   - Debe ser exactamente: `https://TU-DOMINIO-VERCEL/auth/google/callback`
   - Sin espacios, sin caracteres extra

2. **Verifica que guardaste los cambios en Google Cloud Console:**
   - Debe aparecer un mensaje de confirmación

3. **Espera más tiempo:**
   - A veces Google tarda hasta 5 minutos en aplicar cambios

4. **Limpia la caché del navegador:**
   - Ctrl+Shift+Delete (Windows/Linux) o Cmd+Shift+Delete (Mac)
   - O prueba en modo incógnito

5. **Verifica que tu email esté en "Test users":**
   - Ve a "OAuth consent screen" → "Test users"
   - Asegúrate de que tu email esté agregado

---

**Estado:** ✅ Listo para probar  
**Tiempo estimado:** 2-3 minutos

