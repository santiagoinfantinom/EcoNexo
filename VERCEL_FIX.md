# 🔧 Fix de Vercel - Conectar Repositorio Correcto

## Problema Identificado

El proyecto en Vercel está conectado a un repositorio incorrecto:
- **Actual (incorrecto)**: `santiagoinfantinoms-projects/econexo`
- **Correcto**: `santiagoinfantinom/EcoNexo`

Esto explica por qué `econexo.io` muestra una página diferente.

## Solución: Conectar el Repositorio Correcto

### Opción 1: Re-conectar el Repositorio (Recomendado)

1. **Ve al proyecto en Vercel:**
   - https://vercel.com/santiagoinfantinoms-projects/econexo

2. **Ve a Settings → Git:**
   - Haz clic en "Disconnect" para desconectar el repositorio actual
   - Confirma la desconexión

3. **Conectar el repositorio correcto:**
   - Haz clic en "Connect Git Repository"
   - Busca o selecciona: `santiagoinfantinom/EcoNexo`
   - Autoriza el acceso si es necesario
   - Selecciona el branch: `2025-11-03-ol3k-5a7de` o `main`

4. **Configurar el proyecto:**
   - Framework: Next.js (debería detectarse automáticamente)
   - Root Directory: `./` (raíz del proyecto)
   - Build Command: `npm run build` (por defecto)
   - Output Directory: `.next` (por defecto)
   - Install Command: `npm install` (por defecto)

5. **Configurar variables de entorno:**
   - Ve a Settings → Environment Variables
   - Agrega las siguientes variables:
     ```
     NEXT_PUBLIC_SITE_URL=https://econexo.io
     NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
     NEXT_PUBLIC_PLAUSIBLE_DOMAIN=econexo.io
     ```

6. **Configurar dominios:**
   - Ve a Settings → Domains
   - Agrega `econexo.io` si no está
   - Agrega `econexo.ai` si no está
   - Verifica que ambos apunten a este proyecto

7. **Deploy:**
   - Vercel debería hacer un deploy automático después de conectar
   - O ve a Deployments y haz clic en "Redeploy"

### Opción 2: Crear un Nuevo Proyecto (Si prefieres empezar limpio)

1. **Ve a Vercel Dashboard:**
   - https://vercel.com/dashboard

2. **Crear nuevo proyecto:**
   - Haz clic en "Add New..." → "Project"
   - Importa el repositorio: `santiagoinfantinom/EcoNexo`
   - Selecciona el branch: `2025-11-03-ol3k-5a7de` o `main`

3. **Configurar el proyecto:**
   - Framework: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Configurar variables de entorno:**
   - Agrega las variables de entorno necesarias (ver arriba)

5. **Configurar dominios:**
   - Agrega `econexo.io` y `econexo.ai`
   - Si los dominios ya están en uso en el otro proyecto, primero:
     - Ve al proyecto antiguo
     - Settings → Domains
     - Elimina los dominios
     - Luego agrégalos al nuevo proyecto

6. **Deploy:**
   - Vercel hará el deploy automáticamente

## Verificación

Después de conectar el repositorio correcto:

1. **Verifica el deployment:**
   - Debería mostrar el código correcto de EcoNexo
   - El deployment debería estar basado en el commit correcto

2. **Verifica los dominios:**
   - https://econexo.io debería mostrar la página correcta
   - https://econexo.ai debería funcionar (después de configurar DNS)

3. **Verifica el contenido:**
   - Deberías ver la página principal con el mapa de Europa
   - Deberías ver "Connect with sustainable projects in Europe"
   - Deberías ver los botones: "Hide Map", "Explore Events", "Find Jobs"

## Notas Importantes

- **No elimines el proyecto antiguo** hasta que el nuevo esté funcionando correctamente
- **Los dominios** pueden tardar unos minutos en propagarse
- **El deploy** puede tardar 2-5 minutos en completarse
- **Verifica** que el branch correcto esté configurado en Production Branch

## Si los Dominios Están en Uso

Si `econexo.io` o `econexo.ai` ya están asignados al proyecto incorrecto:

1. Ve al proyecto antiguo en Vercel
2. Settings → Domains
3. Haz clic en los tres puntos junto al dominio
4. Selecciona "Remove"
5. Luego agrégalo al proyecto correcto

## Troubleshooting

### Si el deploy falla:
- Verifica que todas las variables de entorno estén configuradas
- Verifica que el branch exista en GitHub
- Revisa los logs del deployment en Vercel

### Si los dominios no funcionan:
- Verifica que los dominios estén agregados al proyecto correcto
- Espera unos minutos para la propagación DNS
- Verifica los registros DNS en tu proveedor de dominios

