# Configuración de Vercel para Deployment Automático

## Pasos para conectar GitHub a Vercel

### 1. Crear cuenta en Vercel
- Visita [vercel.com](https://vercel.com/)
- Regístrate usando tu cuenta de GitHub (recomendado para integración directa)

### 2. Importar el proyecto
1. En el dashboard de Vercel, haz clic en **"New Project"**
2. Autoriza a Vercel para acceder a tus repositorios de GitHub si es necesario
3. Selecciona el repositorio: `santiagoinfantinom/EcoNexo`
4. Haz clic en **"Import"**

### 3. Configuración del proyecto
- **Framework Preset**: Vercel detectará automáticamente Next.js
- **Root Directory**: `./` (raíz del proyecto)
- **Build Command**: `npm run build` (automático)
- **Output Directory**: `.next` (automático)
- **Install Command**: `npm install` (automático)

### 4. Variables de Entorno
Asegúrate de configurar todas las variables de entorno necesarias en Vercel:
- Ve a **Settings > Environment Variables**
- Agrega todas las variables de `.env.local` o `.env.example`

### 5. Deployment
- Haz clic en **"Deploy"**
- Vercel construirá y desplegará tu proyecto automáticamente
- Obtendrás una URL de producción (ej: `econexo.vercel.app`)

## Deployment Automático

Una vez configurado:
- ✅ Cada `push` a la rama principal (`main`) → Deployment de producción
- ✅ Cada `push` a otras ramas → Preview deployment (URL única por rama)
- ✅ Cada Pull Request → Preview deployment automático

## Configuración de Ramas

Para configurar qué rama se despliega en producción:
1. Ve a **Settings > Git**
2. Selecciona la rama de producción (por defecto: `main`)
3. Puedes cambiar la rama de producción en cualquier momento

## Links Útiles

- **Dashboard de Vercel**: https://vercel.com/dashboard
- **Documentación**: https://vercel.com/docs
- **Repositorio**: https://github.com/santiagoinfantinom/EcoNexo

## Notas

- Los deployments de preview son perfectos para probar cambios antes de mergear
- Vercel detecta automáticamente cambios en el código y redeploya
- Puedes ver logs de build y runtime en el dashboard de Vercel
- Los deployments son instantáneos y se pueden revertir fácilmente

