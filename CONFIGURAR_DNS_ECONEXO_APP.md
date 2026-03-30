# 🌐 Configuración DNS para econexo-europe.vercel.app

Esta guía te ayudará a configurar el DNS de `econexo-europe.vercel.app` para que funcione con Vercel.

## 📋 Paso 1: Agregar el Dominio en Vercel

1. **Ve a tu proyecto en Vercel:**
   - Abre https://vercel.com/dashboard
   - Selecciona tu proyecto "EcoNexo"

2. **Ve a Settings → Domains:**
   - En el menú lateral izquierdo, haz clic en **"Settings"**
   - Luego haz clic en **"Domains"**

3. **Agregar el dominio:**
   - Haz clic en el botón **"Add"** o **"Add Domain"**
   - Escribe: `econexo-europe.vercel.app`
   - Haz clic en **"Add"** o **"Continue"**

4. **Vercel te mostrará los registros DNS necesarios:**
   - Vercel te dará instrucciones específicas con los valores exactos que necesitas
   - **IMPORTANTE:** Anota estos valores, los necesitarás en el siguiente paso

---

## 📋 Paso 2: Configurar DNS en tu Proveedor de Dominio

Necesitas saber dónde compraste el dominio `econexo-europe.vercel.app`. Los proveedores más comunes son:
- **Namecheap**
- **GoDaddy**
- **Google Domains**
- **Cloudflare**
- **Porkbun**
- **Name.com**

### Opción A: Si Vercel te dio registros A (IPv4)

1. **Ve al panel de DNS de tu proveedor de dominio**
2. **Agrega un registro A:**
   - **Tipo:** `A`
   - **Nombre/Host:** `@` o `econexo-europe.vercel.app` (depende del proveedor)
   - **Valor/IP:** El valor que Vercel te dio (ejemplo: `76.76.21.21`)
   - **TTL:** `3600` o "Automático"

3. **Agrega un registro CNAME para www (opcional pero recomendado):**
   - **Tipo:** `CNAME`
   - **Nombre/Host:** `www`
   - **Valor:** `cname.vercel-dns.com`
   - **TTL:** `3600` o "Automático"

### Opción B: Si Vercel te dio un registro CNAME

1. **Ve al panel de DNS de tu proveedor de dominio**
2. **Agrega un registro CNAME:**
   - **Tipo:** `CNAME`
   - **Nombre/Host:** `@` o `econexo-europe.vercel.app`
   - **Valor:** El valor que Vercel te dio (ejemplo: `cname.vercel-dns.com`)
   - **TTL:** `3600` o "Automático"

### Opción C: Si Vercel te dio registros AAAA (IPv6)

1. **Agrega los registros AAAA que Vercel te proporcionó**
2. **También agrega los registros A (IPv4) si están disponibles**

---

## 📋 Paso 3: Ejemplos por Proveedor

### Namecheap

1. Ve a **Domain List** → Haz clic en **"Manage"** junto a `econexo-europe.vercel.app`
2. Ve a la pestaña **"Advanced DNS"**
3. En **"Host Records"**, agrega:
   - **Type:** `A Record`
   - **Host:** `@`
   - **Value:** `76.76.21.21` (o el valor que Vercel te dio)
   - **TTL:** `Automatic`
4. Haz clic en el checkmark para guardar
5. Agrega también:
   - **Type:** `CNAME Record`
   - **Host:** `www`
   - **Value:** `cname.vercel-dns.com`
   - **TTL:** `Automatic`

### GoDaddy

1. Ve a **My Products** → Haz clic en **"DNS"** junto a `econexo-europe.vercel.app`
2. En la sección **"Records"**, haz clic en **"Add"**
3. Agrega:
   - **Type:** `A`
   - **Name:** `@`
   - **Value:** `76.76.21.21` (o el valor que Vercel te dio)
   - **TTL:** `600 seconds`
4. Haz clic en **"Save"**
5. Agrega también un CNAME para `www`

### Cloudflare

1. Ve a tu dominio `econexo-europe.vercel.app` en Cloudflare
2. Ve a la pestaña **"DNS"**
3. Haz clic en **"Add record"**
4. Agrega:
   - **Type:** `A`
   - **Name:** `@` o `econexo-europe.vercel.app`
   - **IPv4 address:** `76.76.21.21` (o el valor que Vercel te dio)
   - **Proxy status:** Puedes activar el proxy (nube naranja) o desactivarlo (nube gris)
   - **TTL:** `Auto`
5. Haz clic en **"Save"**

### Google Domains

1. Ve a **My domains** → Haz clic en `econexo-europe.vercel.app`
2. Ve a **DNS** → **Custom name servers** o **Synthetic records**
3. Agrega los registros que Vercel te proporcionó

---

## ⏱️ Paso 4: Esperar la Propagación DNS

Después de agregar los registros DNS:

1. **La propagación puede tardar:**
   - Mínimo: 5-10 minutos
   - Normal: 1-2 horas
   - Máximo: 24-48 horas

2. **Puedes verificar el estado en Vercel:**
   - Ve a **Settings → Domains** en Vercel
   - Verás el estado del dominio:
     - 🟡 **Pending** = Esperando propagación DNS
     - 🟢 **Valid** = Configurado correctamente
     - 🔴 **Invalid** = Hay un problema con la configuración

3. **Verificar manualmente:**
   ```bash
   # En tu terminal, ejecuta:
   nslookup econexo-europe.vercel.app
   # O
   dig econexo-europe.vercel.app
   ```

---

## ✅ Paso 5: Verificar que Funcione

1. **Espera al menos 10-15 minutos** después de agregar los registros DNS

2. **Verifica en Vercel:**
   - Ve a **Settings → Domains**
   - El dominio debería mostrar estado **"Valid"** con un checkmark verde

3. **Abre en tu navegador:**
   - Ve a: `https://econexo-europe.vercel.app`
   - Deberías ver tu aplicación funcionando

4. **Verifica el SSL:**
   - Vercel configura automáticamente el certificado SSL
   - El sitio debería cargar con `https://` (no `http://`)

---

## 🔧 Paso 6: Verificar Variables de Entorno en Vercel

Asegúrate de que las variables de entorno estén configuradas:

1. Ve a **Settings → Environment Variables**
2. Verifica que tengas:
   ```
   NEXT_PUBLIC_SITE_URL=https://econexo-europe.vercel.app
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=econexo-europe.vercel.app
   ```
3. Si no están, agrégalas y marca todas las opciones (Production, Preview, Development)
4. Haz clic en **"Save"**
5. Haz un **Redeploy** del proyecto

---

## 🆘 Troubleshooting

### El dominio sigue sin funcionar después de 2 horas

1. **Verifica los registros DNS:**
   - Usa https://dnschecker.org
   - Busca `econexo-europe.vercel.app`
   - Verifica que los registros A apunten al IP correcto

2. **Verifica en Vercel:**
   - Ve a **Settings → Domains**
   - Lee los mensajes de error si los hay
   - Vercel te dirá qué está mal

3. **Verifica que no haya conflictos:**
   - Asegúrate de que no tengas otros registros DNS que puedan interferir
   - Elimina registros antiguos o duplicados

### Vercel dice "Invalid Configuration"

1. **Verifica que los registros DNS sean correctos:**
   - El registro A debe apuntar al IP que Vercel te dio
   - No debe haber espacios extra o caracteres incorrectos

2. **Espera más tiempo:**
   - A veces Vercel tarda en detectar los cambios
   - Espera 30 minutos y verifica de nuevo

### El dominio carga pero muestra error 404

1. **Verifica que el dominio esté asignado al proyecto correcto:**
   - Ve a **Settings → Domains** en Vercel
   - Verifica que `econexo-europe.vercel.app` esté asignado a tu proyecto "EcoNexo"

2. **Haz un redeploy:**
   - Ve a **Deployments**
   - Haz clic en los tres puntos del último deployment
   - Selecciona **"Redeploy"**

---

## 📞 ¿Necesitas Ayuda?

Si después de seguir estos pasos el dominio sigue sin funcionar:

1. **Comparte conmigo:**
   - ¿Qué proveedor de dominio usas?
   - ¿Qué registros DNS agregaste exactamente?
   - ¿Qué mensaje de error ves en Vercel?

2. **Puedo ayudarte a:**
   - Verificar la configuración DNS
   - Revisar los logs de Vercel
   - Configurar los registros correctos

---

**Estado:** 🟡 En Progreso  
**Próximo paso:** Agregar el dominio en Vercel y configurar los registros DNS en tu proveedor

