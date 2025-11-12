# 🔐 Solucionar Error de Verificación de Google OAuth

## ❌ Error Actual
```
Access blocked: econexo.app has not completed the Google verification process
Error 403: access_denied
```

## 🔍 Causa del Problema
Google requiere que todas las aplicaciones OAuth completen un proceso de verificación antes de permitir que usuarios externos inicien sesión. Tu aplicación está en modo "Testing" y solo permite usuarios de prueba.

## ✅ Solución: Configurar Pantalla de Consentimiento OAuth

### Paso 1: Ir a Google Cloud Console
1. Ve a: https://console.cloud.google.com/
2. Selecciona el proyecto **"EcoNexo"**

### Paso 2: Configurar OAuth Consent Screen
1. En el menú lateral izquierdo, busca **"APIs & Services"**
2. Haz clic en **"OAuth consent screen"** (Pantalla de consentimiento OAuth)

### Paso 3: Completar la Información Básica

#### 3.1 Tipo de Usuario
- Selecciona **"External"** (Externo) - para permitir que cualquier usuario de Google inicie sesión
- Haz clic en **"CREATE"**

#### 3.2 Información de la App
Completa los siguientes campos:

**App information:**
- **App name:** `EcoNexo`
- **User support email:** Tu email (ej: `santiago.infantino.moreno@gmail.com`)
- **App logo:** (Opcional) Puedes subir el logo de EcoNexo

**App domain:**
- **Application home page:** `https://econexo.app`
- **Authorized domains:** Agrega `econexo.app` y `vercel.app`

**Developer contact information:**
- **Email addresses:** Tu email (ej: `santiago.infantino.moreno@gmail.com`)

#### 3.3 Scopes (Permisos)
1. Haz clic en **"ADD OR REMOVE SCOPES"**
2. Selecciona estos scopes:
   - ✅ `.../auth/userinfo.email`
   - ✅ `.../auth/userinfo.profile`
   - ✅ `openid`
   - ✅ `.../auth/user.birthday.read`
   - ✅ `.../auth/user.gender.read`
   - ✅ `.../auth/user.emails.read`
3. Haz clic en **"UPDATE"**

#### 3.4 Test Users (Usuarios de Prueba)
**IMPORTANTE:** Mientras la app esté en modo "Testing", solo estos usuarios pueden iniciar sesión.

1. En la sección **"Test users"**, haz clic en **"+ ADD USERS"**
2. Agrega tu email: `santiago.infantino.moreno@gmail.com`
3. Agrega cualquier otro email que quieras permitir durante las pruebas
4. Haz clic en **"ADD"**

### Paso 4: Guardar y Publicar
1. Haz clic en **"SAVE AND CONTINUE"** en cada paso
2. Al final, verás un resumen
3. Haz clic en **"BACK TO DASHBOARD"**

## 🚀 Opción 1: Modo Testing (Rápido - Para Desarrollo)

Si quieres probar inmediatamente sin esperar la verificación completa:

1. La app quedará en modo **"Testing"**
2. Solo los usuarios agregados en "Test users" podrán iniciar sesión
3. Esto funciona inmediatamente, sin esperar aprobación de Google

**Ventajas:**
- ✅ Funciona inmediatamente
- ✅ No requiere verificación de Google
- ✅ Perfecto para desarrollo y pruebas

**Desventajas:**
- ❌ Solo usuarios de prueba pueden iniciar sesión
- ❌ Aparece una advertencia de "app no verificada"

## 🌐 Opción 2: Publicar la App (Para Producción)

Si quieres que cualquier usuario pueda iniciar sesión:

### Paso 1: Completar Verificación
1. Ve a **"OAuth consent screen"**
2. Completa TODA la información requerida
3. Asegúrate de tener:
   - Logo de la app
   - Política de privacidad (Privacy Policy)
   - Términos de servicio (Terms of Service)
   - Descripción clara de qué hace la app

### Paso 2: Enviar para Verificación
1. Haz clic en **"PUBLISH APP"** o **"SUBMIT FOR VERIFICATION"**
2. Google revisará tu aplicación (puede tomar varios días)
3. Una vez aprobada, cualquier usuario podrá iniciar sesión

**Ventajas:**
- ✅ Cualquier usuario puede iniciar sesión
- ✅ Sin advertencias de "app no verificada"
- ✅ Más profesional

**Desventajas:**
- ❌ Requiere tiempo de revisión (varios días)
- ❌ Requiere documentación adicional (Privacy Policy, Terms of Service)

## 🎯 Recomendación Inmediata

**Para que funcione AHORA:**
1. Configura la pantalla de consentimiento OAuth (Paso 1-3)
2. Agrega tu email como "Test user" (Paso 3.4)
3. Guarda los cambios
4. Espera 1-2 minutos
5. Intenta iniciar sesión de nuevo

**Debería funcionar inmediatamente** con tu cuenta de Google.

## 📝 Checklist Rápido

- [ ] Ir a Google Cloud Console → Proyecto "EcoNexo"
- [ ] APIs & Services → OAuth consent screen
- [ ] Seleccionar "External"
- [ ] Completar App name: "EcoNexo"
- [ ] Completar User support email
- [ ] Agregar Application home page: `https://econexo.app`
- [ ] Agregar Authorized domains: `econexo.app`, `vercel.app`
- [ ] Agregar scopes necesarios
- [ ] Agregar tu email en "Test users"
- [ ] Guardar cambios
- [ ] Probar login con Google

## 🔧 Paso 5: Configurar Authorized Redirect URIs

**IMPORTANTE:** Google necesita saber a qué URL redirigir después del login. Debes agregar el redirect URI en Google Cloud Console.

### 5.1 Ir a Credentials
1. En Google Cloud Console, ve a **"APIs & Services"** → **"Credentials"**
2. Busca tu OAuth 2.0 Client ID (debería llamarse algo como "EcoNexo" o "Web client")
3. Haz clic en el nombre del cliente para editarlo

### 5.2 Agregar Redirect URIs
En la sección **"Authorized redirect URIs"**, agrega:

**Si `econexo.app` está funcionando:**
```
https://econexo.app/auth/google/callback
```

**Si `econexo.app` NO está funcionando aún (usa el dominio de Vercel):**
```
https://econexo-o8mqoe9ye-santiagoinfantinoms-projects.vercel.app/auth/google/callback
```

**Para desarrollo local:**
```
http://localhost:3000/auth/google/callback
```

**Nota:** Puedes agregar múltiples redirect URIs. Agrega todos los que necesites.

### 5.3 Guardar Cambios
1. Haz clic en **"SAVE"** al final de la página
2. Espera 1-2 minutos para que los cambios se apliquen

## 🌐 Solución Temporal: Usar Dominio de Vercel

Si `econexo.app` aún no está configurado en DNS:

1. **El código ya está actualizado** para usar automáticamente el dominio actual del navegador
2. **Solo necesitas agregar el redirect URI de Vercel** en Google Cloud Console (Paso 5.2)
3. Una vez que `econexo.app` esté funcionando, agrega también ese redirect URI

## ⚠️ Nota Importante

Si después de configurar todo sigue sin funcionar:
1. **Verifica los Redirect URIs:** Asegúrate de que el redirect URI en Google Cloud Console coincida exactamente con la URL donde está desplegada tu app
2. Espera 5-10 minutos (Google puede tardar en aplicar cambios)
3. Limpia la caché del navegador
4. Intenta en modo incógnito
5. Verifica que el email en "Test users" sea exactamente el mismo que usas para iniciar sesión
6. **Verifica la consola del navegador:** Abre las herramientas de desarrollador (F12) y revisa si hay errores relacionados con OAuth

