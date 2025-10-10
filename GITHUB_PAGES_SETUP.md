# GitHub Pages Configuration for EcoNexo

## Overview
This configuration enables automatic deployment of EcoNexo to GitHub Pages using GitHub Actions.

## Files Created/Modified

### 1. next.config.ts
- Added `output: 'export'` for static site generation
- Configured `basePath` and `assetPrefix` for GitHub Pages
- Enabled `trailingSlash: true` for better routing
- Set `images: { unoptimized: true }` for static export

### 2. .github/workflows/deploy.yml
- Automated deployment workflow
- Builds the site on every push to main branch
- Deploys to GitHub Pages using peaceiris/actions-gh-pages
- Uses GitHub token for authentication

### 3. public/CNAME
- Custom domain configuration (econexo.org)
- Enables custom domain for GitHub Pages

### 4. package.json
- Added export script for manual builds

## Deployment Process

### Automatic Deployment
1. Push changes to main branch
2. GitHub Actions automatically:
   - Installs dependencies
   - Builds the static site
   - Deploys to GitHub Pages

### Manual Deployment
```bash
npm run build
# The out/ directory will contain the static files
```

## GitHub Pages Settings

To enable GitHub Pages:

1. Go to repository Settings
2. Navigate to Pages section
3. Select "GitHub Actions" as source
4. The workflow will automatically deploy

## Custom Domain Setup

1. Add DNS records for econexo.org:
   - A record: 185.199.108.153
   - A record: 185.199.109.153
   - A record: 185.199.110.153
   - A record: 185.199.111.153
   - CNAME record: www -> santiagoinfantinom.github.io

2. Enable "Enforce HTTPS" in GitHub Pages settings

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all dependencies are properly installed
2. **Routing Issues**: Ensure trailingSlash is enabled
3. **Asset Loading**: Verify basePath and assetPrefix configuration
4. **Custom Domain**: Check DNS propagation (can take up to 24 hours)

### Local Testing

To test the static export locally:
```bash
npm run build
npx serve out
```

## URLs

- **GitHub Pages**: https://santiagoinfantinom.github.io/EcoNexo/
- **Custom Domain**: https://econexo.org (when DNS is configured)
