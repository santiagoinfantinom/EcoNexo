# GitHub Pages Configuration for EcoNexo

## Setup Instructions

1. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch
   - Select "/ (root)" folder

2. **Configure Custom Domain (Optional):**
   - Add your domain to the "Custom domain" field
   - Add a CNAME file to your repository root with your domain

3. **Environment Variables:**
   - Set `NEXT_PUBLIC_SITE_URL` to your GitHub Pages URL
   - Configure other environment variables as needed

## Build Configuration

The project is configured to build for static export:

```json
{
  "output": "export",
  "trailingSlash": true,
  "images": {
    "unoptimized": true
  }
}
```

## Deployment Commands

```bash
# Build for static export
npm run build

# Export static files
npm run export

# Deploy to GitHub Pages (using gh-pages package)
npx gh-pages -d out
```

## File Structure After Export

```
out/
├── index.html
├── eventos/
│   ├── e1/
│   │   └── index.html
│   └── e2/
│       └── index.html
├── projects/
│   ├── p1/
│   │   └── index.html
│   └── p2/
│       └── index.html
├── sitemap.xml
├── robots.txt
├── sw.js
└── manifest.json
```

## Notes

- GitHub Pages supports static sites only
- API routes will not work (use external services)
- Service Worker will work for PWA features
- Analytics and other client-side features will work normally
