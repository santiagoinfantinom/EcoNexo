
const fs = require('fs');
const path = require('path');

const projectsFilePath = path.join(__dirname, 'src/data/projects.ts');

try {
    const content = fs.readFileSync(projectsFilePath, 'utf8');

    // Extract all projects and their image_urls
    const projectRegex = /\{\s*id:\s*["']([^"']+)["'],\s*name:\s*["']([^"']+)["'],[\s\S]*?image_url:\s*["']([^"']+)["']/g;
    const projects = [];
    let match;

    while ((match = projectRegex.exec(content)) !== null) {
        projects.push({ id: match[1], name: match[2], url: match[3] });
    }

    const urlToProjects = {};
    projects.forEach(p => {
        if (!urlToProjects[p.url]) urlToProjects[p.url] = [];
        urlToProjects[p.url].push(p);
    });

    console.log("Projects with duplicate images:");
    Object.keys(urlToProjects).forEach(url => {
        if (urlToProjects[url].length > 1) {
            console.log(`\nURL: ${url}`);
            urlToProjects[url].forEach(p => {
                console.log(`  - Project: ${p.name} (ID: ${p.id})`);
            });
        }
    });
} catch (err) {
    console.error(err);
}
