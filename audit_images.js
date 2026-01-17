
const fs = require('fs');
const path = require('path');

const projectsFilePath = path.join(__dirname, 'src/data/projects.ts');

try {
    const content = fs.readFileSync(projectsFilePath, 'utf8');

    // Extract all image_url values
    const imageUrlRegex = /image_url:\s*["']([^"']+)["']/g;
    const urls = [];
    let match;

    while ((match = imageUrlRegex.exec(content)) !== null) {
        urls.push(match[1]);
    }

    console.log(`Total images found: ${urls.length}`);

    const uniqueUrls = new Set(urls);
    console.log(`Unique images count: ${uniqueUrls.size}`);

    if (urls.length !== uniqueUrls.size) {
        console.log("Duplicate image URLs found!");
        const counts = {};
        urls.forEach(url => {
            counts[url] = (counts[url] || 0) + 1;
        });

        Object.keys(counts).forEach(url => {
            if (counts[url] > 1) {
                console.log(`Duplicate URL: ${url} (${counts[url]} times)`);
            }
        });
        process.exit(1);
    } else {
        console.log("All image URLs are unique.");
        process.exit(0);
    }
} catch (err) {
    console.error("Error reading projects.ts:", err);
    process.exit(1);
}
