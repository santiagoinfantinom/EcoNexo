# Configuración de OAuth para EcoNexo

## URLs de Redirección Requeridas

Para que los enlaces de login funcionen correctamente, necesitas configurar las siguientes URLs de redirección en cada proveedor OAuth:

### URLs de Desarrollo
- `http://localhost:3000/auth/callback`

### URLs de Producción
- `https://econexo.org/auth/callback`

## Configuración de Proveedores OAuth

### 1. Google OAuth

#### En Google Cloud Console:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto o crea uno nuevo
3. Ve a "APIs & Services" > "Credentials"
4. Crea una credencial OAuth 2.0 Client ID
5. Configura las URLs de redirección autorizadas:
   - `http://localhost:3000/auth/callback` (desarrollo)
   - `https://econexo.org/auth/callback` (producción)

#### En Supabase Dashboard:
1. Ve a Authentication > Settings > Auth Providers
2. Habilita Google
3. Ingresa tu Client ID y Client Secret de Google
4. Configura las URLs de redirección:
   - `http://localhost:3000/auth/callback`
   - `https://econexo.org/auth/callback`

### 2. GitHub OAuth

#### En GitHub:
1. Ve a Settings > Developer settings > OAuth Apps
2. Crea una nueva OAuth App
3. Configura las URLs:
   - **Homepage URL**: `https://econexo.org`
   - **Authorization callback URL**: `https://econexo.org/auth/callback`

#### En Supabase Dashboard:
1. Ve a Authentication > Settings > Auth Providers
2. Habilita GitHub
3. Ingresa tu Client ID y Client Secret de GitHub
4. Configura las URLs de redirección:
   - `http://localhost:3000/auth/callback`
   - `https://econexo.org/auth/callback`

### 3. Microsoft/Azure OAuth

#### En Azure Portal:
1. Ve a Azure Portal > App registrations
2. Crea una nueva aplicación
3. Configura las URLs de redirección:
   - `http://localhost:3000/auth/callback`
   - `https://econexo.org/auth/callback`

#### En Supabase Dashboard:
1. Ve a Authentication > Settings > Auth Providers
2. Habilita Azure
3. Ingresa tu Client ID y Client Secret de Azure
4. Configura las URLs de redirección:
   - `http://localhost:3000/auth/callback`
   - `https://econexo.org/auth/callback`

## Verificación de Configuración

### 1. Verificar URLs en Supabase
En tu dashboard de Supabase, ve a:
- Authentication > Settings > Auth Providers
- Para cada proveedor habilitado, verifica que las URLs de redirección incluyan:
  - `http://localhost:3000/auth/callback`
  - `https://econexo.org/auth/callback`

### 2. Verificar Variables de Entorno
Asegúrate de que tu archivo `.env.local` contenga:
```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

### 3. Probar los Flujos de Autenticación
1. Inicia el servidor de desarrollo: `npm run dev`
2. Ve a cualquier página que requiera autenticación
3. Haz clic en los botones de login (Google, GitHub, Microsoft)
4. Verifica que te redirija correctamente al proveedor OAuth
5. Después de autenticarte, verifica que regreses a la aplicación

## Solución de Problemas

### Error: "Invalid redirect URI"
- Verifica que las URLs de redirección en el proveedor OAuth coincidan exactamente con las configuradas en Supabase
- Asegúrate de incluir tanto la URL de desarrollo como la de producción

### Error: "Client ID not found"
- Verifica que el Client ID esté correctamente configurado en Supabase
- Asegúrate de que el proveedor OAuth esté habilitado en Supabase

### Error: "Authentication failed"
- Verifica que el Client Secret esté correctamente configurado
- Revisa los logs de Supabase para más detalles del error

## Notas Importantes

1. **URLs Exactas**: Las URLs de redirección deben coincidir exactamente entre el proveedor OAuth y Supabase
2. **HTTPS en Producción**: Asegúrate de usar HTTPS en producción
3. **Dominio Verificado**: Para Google OAuth, el dominio debe estar verificado en Google Search Console
4. **Permisos**: Asegúrate de que los permisos solicitados sean apropiados para tu aplicación

## Archivos Modificados

Los siguientes archivos han sido actualizados para mejorar el manejo de OAuth:

1. **`src/app/auth/callback/route.ts`** - Nueva ruta para manejar callbacks OAuth
2. **`src/lib/auth.tsx`** - Actualizado para usar URLs de callback correctas
3. **`src/components/AuthModal.tsx`** - Modal de autenticación con botones OAuth
4. **`src/components/AuthButton.tsx`** - Botones de login/registro

Con estos cambios, los enlaces de login deberían llevarte correctamente a las páginas de autenticación correspondientes.
