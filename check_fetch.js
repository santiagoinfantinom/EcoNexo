const fs = require('fs');

async function run() {
  const content = fs.readFileSync('src/data/events-2026-real.ts', 'utf8');
  const urls = [...content.matchAll(/image_url:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const externalUrls = urls.filter(u => u.startsWith('http'));
  
  // adding default from eventImages.ts just to be sure
  externalUrls.push('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop');

  console.log(`Checking ${externalUrls.length} URLs...`);
  
  for (let i = 0; i < externalUrls.length; i += 5) {
    const batch = externalUrls.slice(i, i + 5);
    await Promise.all(batch.map(async (url) => {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (!res.ok) {
          console.log(`BROKEN (${res.status}): ${url}`);
        }
      } catch (e) {
        console.log(`ERROR (${e.message}): ${url}`);
      }
    }));
  }
  console.log('Finished checking URLs.');
}
run();
