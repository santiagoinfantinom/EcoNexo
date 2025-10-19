# Configuración de Supabase para EcoNexo

## Pasos para configurar Supabase:

### 1. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL del proyecto y la clave anónima

### 2. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui

# Otras configuraciones existentes...
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=econexo.org
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BHNlanVqzifD8JkkYn-Bqcp0uZsQvKYh6vT_Bw4pvWAv9SdvidhdagZBTAFDCGUIS3hnUErOrkMOdbO8iylLSqQ
VAPID_PRIVATE_KEY=ndJfz8BTKa-6d4Qokh5o6-akDE6eeizc6spz9w1lPho
NEXT_PUBLIC_SITE_URL=https://econexo.org
NODE_ENV=development
```

### 3. Ejecutar migraciones
Ejecuta el siguiente SQL en el editor SQL de Supabase:

```sql
-- Ejecutar el contenido del archivo supabase/migrations/20250115000001_user_profiles.sql
```

### 4. Configurar autenticación
En el dashboard de Supabase:
1. Ve a Authentication > Settings
2. Configura los proveedores OAuth que quieras usar:
   - Google OAuth
   - GitHub OAuth
   - Microsoft/Azure OAuth
3. Configura las URLs de redirección:
   - `http://localhost:3000/auth/callback` (desarrollo)
   - `https://tu-dominio.com/auth/callback` (producción)

### 5. Configurar políticas RLS
Las políticas ya están incluidas en la migración, pero puedes revisarlas en:
- Authentication > Policies
- Asegúrate de que las políticas estén habilitadas

### 6. Probar la configuración
1. Ejecuta `npm run dev`
2. Ve a `/perfil`
3. Intenta registrarte o iniciar sesión
4. Verifica que los datos se guarden en la tabla `profiles`

## Características implementadas:

### ✅ Sistema de Autenticación Completo
- **Magic Link**: Login por email sin contraseña
- **OAuth**: Google, GitHub, Microsoft/Azure
- **Perfiles de usuario**: Información completa con pronombres, fecha de nacimiento, etc.
- **Protección de rutas**: Middleware y componentes de protección
- **Fallback a localStorage**: Funciona sin Supabase configurado

### ✅ Campos de Perfil Incluidos
- **Información básica**: Nombre, apellido, email, teléfono
- **Detalles personales**: Fecha de nacimiento, lugar de nacimiento, pronombres, género
- **Ubicación**: Ciudad, país, zona horaria
- **Contenido**: Sobre mí, biografía, avatar
- **Intereses**: Pasiones, hobbies, intereses, habilidades, áreas de expertise, idiomas
- **Redes sociales**: LinkedIn, Twitter, Instagram, sitio web, GitHub
- **Preferencias**: Idioma preferido, newsletter, notificaciones, visibilidad del perfil

### ✅ Componentes Creados
- `AuthModal`: Modal de login/registro con múltiples opciones
- `AuthButton`: Botón inteligente que cambia según el estado de autenticación
- `AuthGuard`: Componente para proteger rutas
- `ProfileComponent`: Formulario completo de perfil actualizado
- `useAuthGuard`: Hook para manejar protección de rutas

### ✅ Internacionalización
- Todas las nuevas funcionalidades están traducidas en ES/EN/DE
- Mensajes de error y éxito localizados
- Opciones de pronombres y género en múltiples idiomas

## Próximos pasos recomendados:

1. **Configurar Supabase** con las instrucciones de arriba
2. **Probar el sistema** de autenticación completo
3. **Personalizar** los campos según tus necesidades
4. **Configurar OAuth** con tus propias credenciales
5. **Implementar** notificaciones push (ya configurado)
6. **Agregar** más validaciones y mejoras de UX

## Notas importantes:

- El sistema funciona **sin Supabase** usando localStorage como fallback
- Los datos se **sincronizan automáticamente** cuando Supabase está configurado
- El sistema es **completamente responsive** y funciona en móvil
- **Todas las traducciones** están incluidas para ES/EN/DE
- **Row Level Security** está configurado para proteger los datos de usuario
