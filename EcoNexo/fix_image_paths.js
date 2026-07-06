const fs = require('fs');
const path = require('path');

const projectsFile = path.join(__dirname, 'src/data/projects.ts');

// Read the file
let content = fs.readFileSync(projectsFile, 'utf8');

// Replace all old image paths with new ones
const oldPath = '/Users/santiago/.gemini/antigravity/brain/56f12204-effa-4fa1-a2d9-6c7a5aa6edf4/';
const newPath = '/projects/';

// Count replacements
const matches = content.match(new RegExp(oldPath.replace(/\//g, '\\/'), 'g'));
const count = matches ? matches.length : 0;

console.log(`Found ${count} old image paths to replace`);

// Replace all occurrences
content = content.replace(new RegExp(oldPath.replace(/\//g, '\\/'), 'g'), newPath);

// Write back
fs.writeFileSync(projectsFile, content, 'utf8');

console.log(`✅ Updated ${count} image paths in projects.ts`);
