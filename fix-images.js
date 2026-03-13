const fs = require('fs');
const https = require('https');

async function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url.startsWith('http')) return resolve(true);
    https.get(url, (res) => {
      resolve(res.statusCode < 400);
    }).on('error', () => {
      resolve(false);
    });
  });
}

const categoryToImage = {
  "Medio ambiente": "/projects/environmental_protection_1768475255707.png",
  "Educación": "/projects/robotics_workshop.png",
  "Salud": "/projects/mobile_clinic_1768475118956.png",
  "Comunidad": "/projects/community_center.png",
  "Océanos": "/projects/beach_recovery_1768475147176.png",
  "Alimentación": "/projects/urban_gardens_1768475164073.png",
  "Tecnología": "/projects/sustainable_mobility_1768475272363.png"
};

async function run() {
  let content = fs.readFileSync('src/data/projects.ts', 'utf8');
  let newContent = content;
  
  const urlRegex = /image_url:\s*['"](http.*?)['"]/g;
  const urls = [...new Set([...content.matchAll(urlRegex)].map(m => m[1]))];
  const brokenUrls = new Set();
  
  console.log(`Checking ${urls.length} URLs...`);
  // Process in chunks to avoid slamming network
  for (let i = 0; i < urls.length; i += 10) {
    const chunk = urls.slice(i, i + 10);
    await Promise.all(chunk.map(async url => {
      const ok = await checkUrl(url);
      if (!ok) brokenUrls.add(url);
    }));
  }
  
  console.log(`Found ${brokenUrls.size} broken URLs.`);
  
  const blockRegex = /\{[^{}]*id:\s*['"][^'"]*['"][^{}]*\}/g;
  newContent = newContent.replace(blockRegex, (block) => {
      const imgMatch = block.match(/image_url:\s*['"](.*?)['"]/);
      if (imgMatch && brokenUrls.has(imgMatch[1])) {
          const catMatch = block.match(/category:\s*['"](.*?)['"]/);
          const cat = catMatch ? catMatch[1] : "Comunidad";
          const fallback = categoryToImage[cat] || "/projects/community_center.png";
          return block.replace(imgMatch[0], `image_url: "${fallback}"`);
      }
      return block;
  });
  
  fs.writeFileSync('src/data/projects.ts', newContent);
  console.log('Fixed projects.ts');
}
run();
