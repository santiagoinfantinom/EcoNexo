# 🔐 Guía Completa: Configurar Google OAuth en Vercel

## ✅ Lo que ya tienes configurado:
- ✅ OAuth Client ID creado en Google Cloud Console
- ✅ Client ID configurado en Vercel
- ✅ Redirección dinámica funcionando en el código

## 📋 Paso 1: Configurar Redirect URIs en Google Cloud Console

### 1.1 Ve a Google Cloud Console
1. Abre: [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Asegúrate de estar en el proyecto **"EcoNexo"**

### 1.2 Actualizar Redirect URIs
1. Busca tu **OAuth 2.0 Client ID** llamado **"EcoNexo"**
2. Haz clic en el nombre para editarlo.
3. En la sección **"Authorized redirect URIs"**, asegúrate de que aparezca EXACTAMENTE la siguiente URL:
   `https://econexo-europe.vercel.app/auth/google/callback`
4. Si falta, haz clic en **"ADD URI"** y pégala.
5. Haz clic en **"SAVE"** (Guardar).

---

## 📋 Paso 2: Configurar Variables en Vercel

### 2.1 Verificar variables
1. Ve a tu proyecto en **Vercel** -> **Settings** -> **Environment Variables**.
2. Asegúrate de tener estas dos variables configuradas para **Production**:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

---

## 📋 Paso 3: Probar Google OAuth

### 3.1 Probar en producción
1. Ve a tu sitio oficial: **https://econexo-europe.vercel.app**
2. Haz clic en el botón de **Google** para iniciar sesión.
3. Si recibes un error de Google, espera 2 minutos y vuelve a intentarlo (Google tarda un poco en propagar los cambios de redirección).

---

## ✅ Checklist Final

- [ ] URL `https://econexo-europe.vercel.app/auth/google/callback` agregada en Google Console.
- [ ] Botón "SAVE" presionado en la consola de Google.
- [ ] Variables de entorno correctas en Vercel.
- [ ] Sesión iniciada con éxito.

