const fs = require('fs');
const content = fs.readFileSync('src/data/events-2026-real.ts', 'utf8');
const urls = [...content.matchAll(/image_url:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const localUrls = Object.keys(urls.reduce((acc, u) => { if(u.startsWith('/')) acc[u]=true; return acc; }, {}));
const missingLocal = localUrls.filter(u => !fs.existsSync('public' + u));
console.log('Missing local images (' + missingLocal.length + '):', missingLocal);
