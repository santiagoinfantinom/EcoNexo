# Prueba de Extracción de Datos OAuth

## Funcionalidad Implementada

### ✅ Extracción de Datos de Google
- **Nombre completo**: Se extrae de `full_name`, `name`, `display_name` o combinando `given_name` + `family_name`
- **Nombres separados**: `first_name` y `last_name` extraídos por separado
- **Fecha de nacimiento**: De múltiples campos (`birthdate`, `dob`, `date_of_birth`, `birth_date`)
- **Edad calculada**: Automáticamente calculada a partir de la fecha de nacimiento
- **Foto de perfil**: URL del avatar (`avatar_url`, `picture`, `photo`, `profile_image`)
- **Lugar de nacimiento**: De varios campos de ubicación
- **Género**: Extraído del campo `gender` o `sex`
- **Teléfono**: Del campo `phone_number` o `phone`
- **Idioma preferido**: Del campo `locale` o `language`
- **Email verificado**: Estado de verificación del email
- **Dominio Google Workspace**: Campo `hd` para cuentas empresariales
- **Metadatos adicionales**: ID de usuario, issuer, audience, timestamps

### ✅ Extracción de Datos de Outlook/Microsoft
- **Nombre completo**: Similar a Google con campos específicos de Microsoft
- **Nombres separados**: `given_name` y `family_name`
- **Fecha de nacimiento**: De múltiples formatos
- **Edad calculada**: Automáticamente calculada
- **Foto de perfil**: URL del avatar
- **Lugar de nacimiento**: De campos de ubicación
- **Género**: Extraído del campo `gender`
- **Teléfono**: Del campo `phone_number`
- **Idioma preferido**: Del campo `locale`
- **Tenant ID**: ID del tenant de Azure AD
- **Usuario preferido**: `preferred_username`
- **User Principal Name**: Campo `upn`
- **Object ID**: Campo `oid` de Azure
- **Metadatos adicionales**: Timestamps, refresh token hash, etc.

### ✅ Interfaz de Usuario Mejorada
- **Indicador visual**: Badge en el header mostrando el proveedor OAuth usado
- **Sección dedicada**: Información específica del proveedor OAuth
- **Datos calculados**: Muestra edad calculada automáticamente
- **Estado de verificación**: Indica si el email está verificado
- **Información contextual**: Explica que los datos fueron extraídos automáticamente

## Cómo Probar

1. **Iniciar sesión con Google**:
   - Ir a `/perfil`
   - Hacer clic en "Continuar con Google"
   - Completar el proceso de autenticación
   - Verificar que los datos se extraen y muestran correctamente

2. **Iniciar sesión con Microsoft**:
   - Ir a `/perfil`
   - Hacer clic en "Continuar con Microsoft"
   - Completar el proceso de autenticación
   - Verificar que los datos se extraen y muestran correctamente

3. **Verificar datos extraídos**:
   - Revisar la sección "Información de Google/Microsoft"
   - Verificar que la edad se calcula correctamente
   - Confirmar que la foto de perfil se muestra
   - Verificar que el badge del proveedor aparece en el header

## Archivos Modificados

- `src/components/AuthModal.tsx`: Corregidos los botones OAuth para usar Supabase
- `src/lib/auth.tsx`: Mejorada la extracción de datos OAuth
- `src/components/ProfileComponent.tsx`: Agregada visualización de datos OAuth

## Notas Técnicas

- Los datos se extraen automáticamente al hacer login
- Se almacenan en la tabla `profiles` de Supabase
- Se incluyen metadatos completos del proveedor OAuth
- La edad se calcula automáticamente si hay fecha de nacimiento
- El sistema es compatible con múltiples proveedores OAuth
