---
name: Update EcoNexo Logo
description: Automates the process of changing the EcoNexo logo from an image
---

# Update EcoNexo Logo

This skill automates the complete process of updating the EcoNexo logo.

## Prerequisites

The user must provide:
- **New logo image** (PNG, JPG, or SVG) - can be a local path or a generated image

## Process Steps

### 1. Validate input image

- Confirm that the image exists and is valid
- Supported formats: `.png`, `.jpg`, `.jpeg`, `.svg`

### 2. Copy and rename the main image

```bash
# Copy the new image to /public
cp <image_path> /Users/santiago/Documents/Projects/EcoNexo/public/logo-econexo.png
```

### 3. Create backup of previous logo

```bash
# Backup the previous logo (if it exists)
cp public/logo-econexo.png public/logo-econexo-backup.png
```

### 4. Update the EcoNexoLogo.tsx component

Replace the content of `src/components/EcoNexoLogo.tsx` with:

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
    <Image
      src="/logo-econexo.png"
      alt="EcoNexo Logo"
      width={size}
      height={size}
      className={`drop-shadow-md transition-transform hover:scale-110 duration-300 ${className}`}
      priority
    />
  );
}
```

### 5. Remove white background (make transparent)

If the logo has a white background that needs to be transparent:

```bash
python3 -c "
from PIL import Image
import numpy as np

# Load the image
img = Image.open('public/logo-econexo.png').convert('RGBA')
data = np.array(img)

# Define white threshold (pixels close to white will become transparent)
threshold = 240

# Create mask for white/near-white pixels
white_mask = (data[:,:,0] > threshold) & (data[:,:,1] > threshold) & (data[:,:,2] > threshold)

# Set alpha to 0 for white pixels
data[white_mask, 3] = 0

# Save the result
result = Image.fromarray(data)
result.save('public/logo-econexo.png')
print('Logo background removed successfully!')
"
```

### 6. Generate favicon (optional)

If the user requests it, generate a favicon using a tool like `sharp` or an online service:

```bash
# Install sharp if not already installed
npm install sharp --save-dev

# Create script to generate favicon
node -e "
const sharp = require('sharp');
sharp('public/logo-econexo.png')
  .resize(32, 32)
  .toFile('public/favicon.ico');
"
```

### 7. Update manifest.json

Verify that `public/manifest.json` has the correct references:

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

### 8. Clean up old files (optional)

Remove temporary logos or old versions if the user requests:

```bash
# Files that can be cleaned up (ask the user first)
rm public/logo_original.png
rm public/logo_recolored.png
rm public/logo_recolored_clean.png
rm public/logo_rot_*.png
rm public/logo_final_*.png
```

### 9. Verification

1. Restart the development server if it's running:
   ```bash
   # Ctrl+C and then
   npm run dev
   ```

2. Visually verify in:
   - Application header
   - Login/auth page
   - User profile

## Final Checklist

- [ ] New image copied to `public/logo-econexo.png`
- [ ] Backup created from previous logo
- [ ] `EcoNexoLogo.tsx` updated to use `Image` from Next.js
- [ ] White background removed (if applicable)
- [ ] Favicon updated (if applicable)
- [ ] `manifest.json` updated
- [ ] Temporary files cleaned up (if applicable)
- [ ] Visual verification completed

## Notes

- The component uses `next/image` for automatic optimization
- The `priority` prop ensures immediate loading of the logo
- Hover effects and drop-shadow are maintained for visual consistency
- Transparent backgrounds allow the logo to blend seamlessly with the header gradient
