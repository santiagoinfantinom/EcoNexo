# Guía: Configurar Inicio de Sesión con GitHub

Pasar a GitHub es la mejor decisión: es súper sencillo para desarrolladores, 100% gratis y **no requiere tarjeta de crédito jamás**. Además, he actualizado el código de la aplicación para cambiar el botón de Google por uno de GitHub en el Auth Modal.

Sigue estos pasos rápidos:

## 1. Crear la aplicación en GitHub
1. Abre [GitHub.com](https://github.com/) e inicia sesión con tu cuenta.
2. Ve a la esquina superior derecha, haz clic en tu foto de perfil y selecciona **Settings** (Configuración).
3. En el menú de la izquierda, baja del todo y haz clic en **Developer settings** (Configuraciones de desarrollador).
4. En el submenú izquierdo selecciona **OAuth Apps** y luego haz clic en el botón **New OAuth App**.
5. Rellena los siguientes datos:
   - **Application name**: EcoNexo (o el nombre que quieras que vean los usuarios al loguear)
   - **Homepage URL**: `http://localhost:3000` (o la URL de tu app en Vercel si la tienes)
   - **Authorization callback URL**: **¡ESTE PASO ES CLAVE!** Tienes que pegar la URL de callback de tu base de datos de Supabase.
     1. Ve a tu archivo `.env.local`
     2. Copia el valor exacto de `NEXT_PUBLIC_SUPABASE_URL` (ej. `https://inxwrvmdspmajqqjenlr.supabase.co`)
     3. Añádele exactamente al final la ruta `/auth/v1/callback`
     4. Resultado (ejemplo): `https://inxwrvmdspmajqqjenlr.supabase.co/auth/v1/callback`
6. Haz clic en **Register application**.
7. En la siguiente pantalla, verás el **Client ID** (Cópialo, lo necesitaremos en un momento).
8. Haz clic en el botón gris que dice **Generate a new client secret** para que te revele el Secret (Cópialo también, porque cuando recargues la página no se volverá a ver completo).

## 2. Poner las claves en Supabase
1. Ve al [Dashboard de Supabase](https://supabase.com/dashboard/) y entra a tu proyecto (`econexo`).
2. Ve a **Authentication** (el icono de los dos monitos en la barra negra de la izquierda) > **Providers**.
3. Busca **GitHub** en la lista y ábrelo.
4. Enciende el interruptor a verde (**Enable Sign in with GitHub**).
5. Pega el **Client ID** y el **Client Secret** que acabas de copiar de GitHub en los campos correspondientes.
6. Haz clic en **Save** (Guardar).

## 3. Configurar redirecciones locales en Supabase (URL Configuration)
1. En el mismo menú de Authentication de Supabase, en la columna secundaria, ve ahora a **URL Configuration**.
2. En la sección **Site URL** pon tu base del proyecto local: `http://localhost:3000`
3. Un poco más abajo en **Redirect URLs** asegúrate de tener añadido `http://localhost:3000/**` (pulsa Add URL si no lo ves en la lista). 
   *Nota: Si luego alojas el sitio en Vercel o en un dominio, agregarás también la URL de producción allí (ej: `https://econexo.vercel.app/**`).*

---

**¡Todo completamente listo!** 🚀
Acabo de borrar la guía vieja de Google para evitar confusiones. Ya puedes abrir tu aplicación en `http://localhost:3000`, hacer clic en el nuevo botón de **GitHub**, y entrará directo a tu página.
