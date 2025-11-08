# 🚀 Guía Paso a Paso: Conectar EcoNexo en Vercel

## 📋 Checklist Pre-Deployment

Antes de empezar, verifica que tienes:
- ✅ Acceso a tu cuenta de Vercel: https://vercel.com
- ✅ Acceso a tu repositorio de GitHub: https://github.com/santiagoinfantinom/EcoNexo
- ✅ El branch `2025-11-03-ol3k-5a7de` existe en GitHub
- ✅ Tus credenciales de Supabase (si las necesitas)

---

## 🎯 Paso 1: Ir al Proyecto Actual en Vercel

1. Abre tu navegador y ve a: **https://vercel.com/santiagoinfantinoms-projects/econexo**
2. Inicia sesión si es necesario
3. Deberías ver el dashboard del proyecto

**¿Qué ves en la pantalla?** (Dime cuando estés aquí y te guío al siguiente paso)

---

## 🔌 Paso 2: Desconectar el Repositorio Incorrecto

1. En el dashboard del proyecto, haz clic en **"Settings"** (en la barra superior)
2. En el menú lateral izquierdo, haz clic en **"Git"**
3. Verás la sección "Connected Git Repository"
4. Haz clic en el botón **"Disconnect"** (o "Disconnect Repository")
5. Confirma la desconexión cuando te lo pida
6. ⚠️ **Nota**: Esto NO eliminará tus deployments, solo desconectará el repositorio

**¿Ya desconectaste el repositorio?** (Dime cuando estés listo)

---

## 🔗 Paso 3: Conectar el Repositorio Correcto

1. Después de desconectar, verás un botón **"Connect Git Repository"** o **"Connect Repository"**
2. Haz clic en ese botón
3. Se abrirá un modal o página para seleccionar el repositorio
4. Busca en la lista: **`santiagoinfantinom/EcoNexo`**
   - Si no lo ves, puede que necesites autorizar el acceso a GitHub
   - Haz clic en "Authorize" o "Grant Access" si aparece
5. Haz clic en **`santiagoinfantinom/EcoNexo`** para seleccionarlo

**¿Ya seleccionaste el repositorio?** (Dime cuando estés aquí)

---

## 🌿 Paso 4: Seleccionar el Branch

1. Después de seleccionar el repositorio, verás una pantalla de configuración
2. Busca el campo **"Branch"** o **"Production Branch"**
3. Haz clic en el dropdown del branch
4. Verás una lista de branches disponibles:
   - `main`
   - `2025-11-03-ol3k-5a7de`
   - Y otros branches si los tienes
5. **Selecciona**: `2025-11-03-ol3k-5a7de`
   - O si prefieres usar `main`, selecciona ese (pero asegúrate de que tenga el código correcto)

**¿Ya seleccionaste el branch?** (Dime cuál seleccionaste)

---

## ⚙️ Paso 5: Configurar el Proyecto

Vercel debería detectar automáticamente que es un proyecto Next.js, pero verifica:

1. **Framework Preset**: Debería decir "Next.js" (si no, selecciónalo)
2. **Root Directory**: Debería ser `./` (raíz del proyecto)
3. **Build Command**: Debería ser `npm run build` (o `next build`)
4. **Output Directory**: Debería ser `.next` (para Next.js)
5. **Install Command**: Debería ser `npm install`

**¿Todo está configurado correctamente?** (Dime si algo está mal)

---

## 🔐 Paso 6: Configurar Variables de Entorno

**IMPORTANTE**: Haz esto ANTES de hacer el primer deploy, o después en Settings.

1. En la misma pantalla de configuración, busca **"Environment Variables"**
   - O ve a **Settings → Environment Variables** después del deploy
2. Haz clic en **"Add"** o **"Add Variable"** para cada una:

   **Variable 1:**
   - **Name**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: `https://econexo.io`
   - **Environment**: Selecciona todas (Production, Preview, Development)

   **Variable 2:**
   - **Name**: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
   - **Value**: `econexo.io`
   - **Environment**: Selecciona todas

   **Variable 3 (si tienes Supabase):**
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `tu_url_de_supabase`
   - **Environment**: Selecciona todas

   **Variable 4 (si tienes Supabase):**
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `tu_key_de_supabase`
   - **Environment**: Selecciona todas

3. Haz clic en **"Save"** o **"Add"** para cada variable

**¿Ya configuraste las variables?** (Dime si necesitas ayuda con alguna)

---

## 🚀 Paso 7: Hacer el Deploy

1. Revisa toda la configuración una vez más
2. Haz clic en el botón **"Deploy"** (generalmente grande y verde/azul)
3. Vercel comenzará a hacer el build del proyecto
4. Verás un progreso en tiempo real
5. El proceso puede tardar 2-5 minutos

**¿Ya hiciste clic en Deploy?** (Dime cuando veas el progreso)

---

## ✅ Paso 8: Verificar el Deploy

1. Una vez completado, verás un mensaje de éxito
2. Haz clic en **"Visit"** o en el link del deployment
3. Deberías ver tu sitio funcionando
4. Verifica que sea el proyecto correcto (colorido, con mapa de Europa)

**¿El deploy fue exitoso?** (Dime qué ves cuando abres el link)

---

## 🌐 Paso 9: Configurar Dominios

1. Ve a **Settings → Domains**
2. Verás una lista de dominios configurados
3. **Para `econexo.io`:**
   - Si ya está agregado, verifica que apunte a este proyecto
   - Si no está, haz clic en **"Add"** o **"Add Domain"**
   - Escribe: `econexo.io`
   - Haz clic en **"Add"**

4. **Para `econexo.ai`:**
   - Haz clic en **"Add"** o **"Add Domain"**
   - Escribe: `econexo.ai`
   - Haz clic en **"Add"**
   - Vercel te dará instrucciones de DNS si es necesario

**¿Ya configuraste los dominios?** (Dime si necesitas ayuda)

---

## 🔍 Paso 10: Verificar que Todo Funcione

1. Espera unos minutos para que los cambios se propaguen
2. Abre en tu navegador:
   - **https://econexo.io** - Debería mostrar el proyecto colorido
   - **https://econexo.ai** - Debería funcionar (después de configurar DNS)

3. Verifica que veas:
   - ✅ El título: "Connect with sustainable projects in Europe"
   - ✅ El mapa de Europa interactivo
   - ✅ Los botones: "Hide Map", "Explore Events", "Find Jobs"
   - ✅ Las estadísticas con colores (verde, azul, morado)

**¿Todo funciona correctamente?** (Dime si ves el proyecto colorido)

---

## 🆘 Troubleshooting

### Si el deploy falla:
- Revisa los logs en la pestaña "Deployments"
- Verifica que todas las variables de entorno estén configuradas
- Verifica que el branch exista en GitHub

### Si los dominios no funcionan:
- Verifica que los dominios estén agregados al proyecto correcto
- Espera unos minutos para la propagación DNS
- Verifica los registros DNS en tu proveedor de dominios

### Si ves la página incorrecta:
- Verifica que el branch correcto esté seleccionado
- Haz un "Redeploy" desde la pestaña Deployments
- Verifica que el repositorio conectado sea `santiagoinfantinom/EcoNexo`

---

## ✅ Checklist Final

- [ ] Repositorio desconectado del proyecto incorrecto
- [ ] Repositorio `santiagoinfantinom/EcoNexo` conectado
- [ ] Branch `2025-11-03-ol3k-5a7de` seleccionado
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] Dominio `econexo.io` configurado y funcionando
- [ ] Dominio `econexo.ai` configurado (si aplica)
- [ ] Sitio muestra el contenido correcto (proyecto colorido)

---

**¡Listo!** Si sigues estos pasos, deberías tener tu proyecto desplegado correctamente en Vercel. 🎉

