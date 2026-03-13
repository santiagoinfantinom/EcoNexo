# 🔐 Guía Completa: Configurar Google OAuth en Vercel

## ✅ Lo que ya tienes configurado:
- ✅ OAuth Client ID creado en Google Cloud Console
- ✅ Redirect URIs agregados
- ✅ Nombre del proyecto: EcoNexo

## 📋 Paso 1: Obtener el Client Secret

### 1.1 Ve a Google Cloud Console
1. Abre: https://console.cloud.google.com/
2. Asegúrate de estar en el proyecto **"EcoNexo"**

### 1.2 Ve a tu OAuth Client
1. Menú lateral izquierdo (☰) → **"APIs & Services"**
2. Haz clic en **"Credentials"**
3. Busca tu OAuth Client llamado **"EcoNexo"**
4. Haz clic en el **nombre** (no en el Client ID)

### 1.3 Crear o ver el Client Secret
1. En la página del OAuth Client, desplázate hasta la sección **"Client secrets"**
2. Si **NO hay ningún secret**:
   - Haz clic en **"+ Add secret"** o **"CREATE SECRET"**
   - Se generará un nuevo secret
   - **⚠️ IMPORTANTE:** Copia el secret **INMEDIATAMENTE** porque solo se muestra una vez
3. Si **YA hay un secret** pero no lo recuerdas:
   - Haz clic en **"Reset secret"** o **"Regenerate"**
   - Se creará uno nuevo
   - **⚠️ IMPORTANTE:** Copia el nuevo secret inmediatamente

### 1.4 Copiar el Client ID también
En la misma página, en el panel derecho, copia:
- **Client ID:** `1059183045627-qjmnmcghdbl5duk25vgvd5olomqgs8vb.apps.googleusercontent.com`

---

## 📋 Paso 2: Configurar Variables en Vercel

### 2.1 Acceder a Vercel Dashboard
1. Ve a: https://vercel.com/dashboard
2. Inicia sesión si es necesario
3. Busca y haz clic en tu proyecto **"econexo"**

### 2.2 Ir a Environment Variables
1. En el menú superior, haz clic en **"Settings"**
2. En el menú lateral izquierdo, haz clic en **"Environment Variables"**

### 2.3 Agregar NEXT_PUBLIC_GOOGLE_CLIENT_ID
1. Haz clic en **"+ Add New"**
2. **Key:** `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
3. **Value:** Pega tu Client ID:
   ```
   1059183045627-qjmnmcghdbl5duk25vgvd5olomqgs8vb.apps.googleusercontent.com
   ```
4. **Environments:** Marca todas las casillas:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Haz clic en **"Save"**

### 2.4 Agregar GOOGLE_CLIENT_SECRET
1. Haz clic en **"+ Add New"** de nuevo
2. **Key:** `GOOGLE_CLIENT_SECRET`
3. **Value:** Pega el Client Secret que copiaste en el Paso 1.3
4. **Environments:** Marca todas las casillas:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Haz clic en **"Save"**

---

## 📋 Paso 3: Verificar y Redesplegar

### 3.1 Verificar que las variables estén guardadas
1. Deberías ver ambas variables en la lista:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### 3.2 Redesplegar la aplicación
1. Ve a la pestaña **"Deployments"** en Vercel
2. Haz clic en el menú de tres puntos (⋯) del último deployment
3. Selecciona **"Redeploy"**
4. O simplemente haz un push a tu repositorio para que se redesplegue automáticamente

---

## 📋 Paso 4: Probar Google OAuth

### 4.1 Probar en producción
1. Ve a tu sitio: https://econexo.app (o tu URL de Vercel)
2. Haz clic en **"Iniciar sesión"** o **"Registro"**
3. Haz clic en el botón **"Google"**
4. Deberías ser redirigido a la página de inicio de sesión de Google
5. Después de iniciar sesión, deberías volver a tu sitio autenticado

### 4.2 Si hay errores
- **Error 404:** Verifica que los Redirect URIs estén correctamente configurados en Google Cloud Console
- **Error "redirect_uri_mismatch":** Asegúrate de que la URL en Google Cloud Console coincida exactamente con la URL de tu sitio
- **Error "invalid_client":** Verifica que el Client ID y Client Secret estén correctos en Vercel

---

## ✅ Checklist Final

- [ ] Client Secret obtenido de Google Cloud Console
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` agregado en Vercel
- [ ] `GOOGLE_CLIENT_SECRET` agregado en Vercel
- [ ] Aplicación redesplegada en Vercel
- [ ] Google OAuth probado y funcionando

---

## 📞 ¿Necesitas ayuda?

Si tienes problemas:
1. Verifica que los Redirect URIs en Google Cloud Console incluyan:
   - `https://econexo.app/auth/google/callback`
   - `https://econexo-2hukbb5j4-santiagoinfantinoms-projects.vercel.app/auth/google/callback`
   - `http://localhost:3000/auth/google/callback` (para desarrollo local)

2. Verifica que las variables de entorno en Vercel estén sin espacios al inicio o final

3. Espera 1-2 minutos después de agregar las variables antes de probar (Vercel necesita tiempo para aplicarlas)

