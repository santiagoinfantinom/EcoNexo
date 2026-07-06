---
name: Update EcoNexo Logo
description: Automatiza el proceso de cambiar el logo de EcoNexo a partir de una imagen
---

# Update EcoNexo Logo

Este skill automatiza el proceso completo de actualizar el logo de EcoNexo.

## Requisitos Previos

El usuario debe proporcionar:
- **Nueva imagen de logo** (PNG, JPG, o SVG) - puede ser una ruta local o una imagen generada

## Pasos del Proceso

### 1. Validar la imagen de entrada

- Confirmar que la imagen existe y es válida
- Formatos soportados: `.png`, `.jpg`, `.jpeg`, `.svg`

### 2. Copiar y renombrar la imagen principal

```bash
# Copiar la nueva imagen a /public
cp <ruta_imagen> /Users/santiago/Documents/Projects/EcoNexo/public/logo-econexo.png
```

### 3. Crear backup del logo anterior

```bash
# Backup del logo anterior (si existe)
cp public/logo-econexo.png public/logo-econexo-backup.png
```

### 4. Actualizar el componente EcoNexoLogo.tsx

Reemplazar el contenido de `src/components/EcoNexoLogo.tsx` con:

```tsx
"use client";
import React from 'react';
import Image from 'next/image';

interface EcoNexoLogoProps {
  className?: string;
  size?: number;
}

export default function EcoNexoLogo({ className = "", size = 60 }: EcoNexoLogoProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Image
        src="/logo-econexo.png"
        alt="EcoNexo Logo"
        width={size}
        height={size}
        className="drop-shadow-md transition-transform hover:scale-110 duration-300"
        priority
      />
      {/* Vertical Separator Pipe */}
      <div className="h-10 w-px bg-white/30 hidden sm:block mx-1"></div>
    </div>
  );
}
```

### 5. Generar favicon (opcional)

Si el usuario lo solicita, generar favicon usando una herramienta como `sharp` o un servicio online:

```bash
# Instalar sharp si no está instalado
npm install sharp --save-dev

# Crear script para generar favicon
node -e "
const sharp = require('sharp');
sharp('public/logo-econexo.png')
  .resize(32, 32)
  .toFile('public/favicon.ico');
"
```

### 6. Actualizar manifest.json

Verificar que `public/manifest.json` tenga las referencias correctas:

```json
{
  "icons": [
    {
      "src": "/logo-econexo.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 7. Limpiar archivos antiguos (opcional)

Eliminar logos temporales o versiones antiguas si el usuario lo solicita:

```bash
# Archivos que pueden limpiarse (preguntar al usuario primero)
rm public/logo_original.png
rm public/logo_recolored.png
rm public/logo_recolored_clean.png
rm public/logo_rot_*.png
rm public/logo_final_*.png
```

### 8. Verificación

1. Reiniciar el servidor de desarrollo si está corriendo:
   ```bash
   # Ctrl+C y luego
   npm run dev
   ```

2. Verificar visualmente en:
   - Header de la aplicación
   - Página de login/auth
   - Perfil de usuario

## Checklist Final

- [ ] Nueva imagen copiada a `public/logo-econexo.png`
- [ ] Backup creado del logo anterior
- [ ] `EcoNexoLogo.tsx` actualizado para usar `Image` de Next.js
- [ ] Favicon actualizado (si aplica)
- [ ] `manifest.json` actualizado
- [ ] Archivos temporales limpiados (si aplica)
- [ ] Verificación visual completada

## Notas

- El componente usa `next/image` para optimización automática
- La prop `priority` asegura carga inmediata del logo
- El hover effect y shadow se mantienen para consistencia visual
