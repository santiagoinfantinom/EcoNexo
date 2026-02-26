const fs = require('fs');
const https = require('https');
const http = require('http');

const content = fs.readFileSync('src/data/events-2026-real.ts', 'utf8');
const urls = [...content.matchAll(/image_url:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const externalUrls = urls.filter(u => u.startsWith('http'));

async function checkUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      resolve({ url, status: res.statusCode });
    });
    req.on('error', (e) => resolve({ url, status: 'ERROR', error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 'TIMEOUT' }); });
    req.end();
  });
}

async function run() {
  console.log(`Checking ${externalUrls.length} external URLs...`);
  // Process in small batches to avoid too many concurrent connections
  for (let i = 0; i < externalUrls.length; i += 5) {
    const batch = externalUrls.slice(i, i + 5);
    const results = await Promise.all(batch.map(checkUrl));
    results.forEach(r => {
      if (r.status !== 200 && r.status !== 301 && r.status !== 302 && r.status !== 308) {
        console.log(`BROKEN: ${r.status} = ${r.url}`);
      }
    });
  }
  console.log('Done.');
}
run();
