# 🔧 Fix de Deployment - EcoNexo

## Problemas Identificados

1. **Vercel (econexo.io)**: Muestra una página diferente (EcoNexo Sustainable Strategies)
2. **econexo.ai**: No está configurado, da error de conexión
3. **GitHub Pages**: Da 404 porque no hay deployment configurado

## Soluciones Implementadas

### ✅ 1. GitHub Pages - Configurado

**Workflow creado**: `.github/workflows/deploy-pages.yml`

**Pasos para activar:**
1. Ve a tu repositorio en GitHub: https://github.com/santiagoinfantinom/EcoNexo
2. Ve a **Settings** → **Pages**
3. En **Source**, selecciona **"GitHub Actions"**
4. El workflow se ejecutará automáticamente en cada push a `main` o `2025-11-03-ol3k-5a7de`

**URL después del deployment:**
- https://santiagoinfantinom.github.io/EcoNexo/

### ✅ 2. Vercel - Configuración Actualizada

**Cambios realizados:**
- `vercel.json` actualizado para incluir `econexo.ai` en la lista de dominios
- `next.config.ts` configurado para funcionar tanto en Vercel (SSR) como en GitHub Pages (static)

**Pasos para corregir el problema en Vercel:**

1. **Verificar el proyecto correcto:**
   - Ve a https://vercel.com/dashboard
   - Busca el proyecto "EcoNexo"
   - Verifica que esté conectado al repositorio correcto: `santiagoinfantinom/EcoNexo`

2. **Verificar el branch desplegado:**
   - En la configuración del proyecto en Vercel
   - Ve a **Settings** → **Git**
   - Asegúrate de que el **Production Branch** sea `main` o el branch que quieras
   - Verifica que el branch `2025-11-03-ol3k-5a7de` esté configurado para deployment

3. **Configurar dominios:**
   - Ve a **Settings** → **Domains**
   - Agrega `econexo.io` si no está
   - Agrega `econexo.ai` si no está
   - Verifica que ambos dominios apunten al proyecto correcto

4. **Verificar variables de entorno:**
   - Ve a **Settings** → **Environment Variables**
   - Asegúrate de tener:
     ```
     NEXT_PUBLIC_SITE_URL=https://econexo.io
     NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_key
     ```

5. **Forzar nuevo deployment:**
   - Ve a **Deployments**
   - Haz clic en los tres puntos del último deployment
   - Selecciona **Redeploy**
   - O haz un push nuevo al branch

### ✅ 3. econexo.ai - Configuración

**En Vercel:**
1. Ve a **Settings** → **Domains**
2. Agrega `econexo.ai`
3. Vercel te dará instrucciones de DNS:
   - Agrega un registro A o CNAME según indique Vercel
   - Normalmente es un CNAME apuntando a `cname.vercel-dns.com`

**En tu proveedor de DNS:**
1. Agrega un registro CNAME:
   - **Name**: `@` o `econexo.ai`
   - **Value**: `cname.vercel-dns.com`
   - O sigue las instrucciones específicas que Vercel te proporcione

## Verificación

### GitHub Pages
```bash
# Después del push, verifica:
# https://santiagoinfantinom.github.io/EcoNexo/
```

### Vercel
```bash
# Verifica ambos dominios:
# https://econexo.io
# https://econexo.ai
```

## Notas Importantes

- **Vercel**: Usa SSR (Server-Side Rendering) - mejor para funcionalidades dinámicas
- **GitHub Pages**: Usa static export - limitado a contenido estático
- El proyecto está configurado para funcionar en ambos entornos automáticamente
- Los cambios se pushearon al branch `2025-11-03-ol3k-5a7de`

## Próximos Pasos

1. ✅ Push de los cambios (ya hecho)
2. ⏳ Activar GitHub Pages en Settings
3. ⏳ Verificar/Corregir configuración en Vercel
4. ⏳ Configurar DNS para econexo.ai
5. ⏳ Verificar que ambos dominios muestren el contenido correcto

