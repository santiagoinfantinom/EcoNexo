# 🔧 Configuración de Supabase para EcoNexo

## ⚠️ Error Actual: "Supabase not configured"

Para que la funcionalidad de autenticación OAuth funcione correctamente, necesitas configurar Supabase.

## 📋 Pasos para Configurar Supabase

### 1. **Crear un proyecto en Supabase**
1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Crea una cuenta o inicia sesión
4. Crea un nuevo proyecto

### 2. **Obtener las credenciales**
1. En tu proyecto de Supabase, ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 3. **Configurar las variables de entorno**
Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-aqui

# Otras configuraciones opcionales
NEXT_PUBLIC_SITE_URL=http://localhost:3002
NODE_ENV=development
```

### 4. **Configurar autenticación OAuth**
En tu proyecto de Supabase:
1. Ve a **Authentication** → **Providers**
2. Habilita **Google** y configura:
   - Client ID de Google
   - Client Secret de Google
3. Habilita **Microsoft** y configura:
   - Client ID de Azure
   - Client Secret de Azure

### 5. **Crear la tabla de perfiles**
Ejecuta este SQL en el editor SQL de Supabase:

```sql
-- Crear tabla de perfiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  birthdate DATE,
  birth_place TEXT,
  gender TEXT,
  city TEXT,
  country TEXT,
  about_me TEXT,
  avatar_url TEXT,
  passions TEXT,
  hobbies TEXT,
  interests TEXT,
  skills TEXT,
  areas_of_expertise TEXT,
  languages TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  website_url TEXT,
  github_url TEXT,
  preferred_language TEXT DEFAULT 'es',
  newsletter_subscribed BOOLEAN DEFAULT false,
  notifications_enabled BOOLEAN DEFAULT true,
  profile_visibility TEXT DEFAULT 'public',
  oauth_provider TEXT,
  oauth_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Crear políticas
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## 🚀 Alternativa Rápida: Modo Demo

Si quieres probar la funcionalidad sin configurar Supabase, puedes:

1. **Usar el modo demo** - Los datos se guardarán en localStorage
2. **Ver la interfaz** - La funcionalidad visual funcionará sin autenticación real

## 🔗 Links Útiles

- **Supabase Dashboard**: https://app.supabase.com
- **Documentación de Supabase**: https://supabase.com/docs
- **Guía de autenticación**: https://supabase.com/docs/guides/auth

## ✅ Verificación

Una vez configurado, deberías poder:
- Hacer clic en "Continuar con Google" sin errores
- Hacer clic en "Continuar con Microsoft" sin errores
- Ver los datos extraídos automáticamente en tu perfil

¿Necesitas ayuda con algún paso específico?
