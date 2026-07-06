const fs = require('fs');
const path = require('path');

// Mapping of project IDs to generated image filenames
const imageMapping = {
    // First 6 basic projects
    'p1': 'urban_reforestation_1768475105152.png',
    'p2': 'robotics_workshop_1768475055742.png',
    'p3': 'mobile_clinic_1768475118956.png',
    'p4': 'beach_recovery_1768475147176.png',
    'p5': 'urban_gardens_1768475164073.png',
    'p6': 'community_center_1768475071603.png',

    // Berlin projects
    'b1': 'citylab_berlin_1768475085958.png',
    'b2': 'textile_recycling_1768475179166.png',
    'b3': 'art_center_1768475192712.png',
    'b4': 'community_garden_berlin_1768475207171.png',
    'b5': 'repair_cafe_1768475240398.png',
    'b6': 'environmental_protection_1768475255707.png',
    'b7': 'sustainable_mobility_1768475272363.png',
    'b8': 'ethical_banking_1768475289153.png',

    // Paris projects - use circular economy for multiple
    'par1': 'repair_cafe_1768475240398.png',
    'par2': 'circular_economy_1768475303349.png',
    'par3': 'community_center_1768475071603.png',
    'par4': 'urban_gardens_1768475164073.png',
    'par5': 'circular_economy_1768475303349.png',
};

const artifactDir = '/Users/santiago/.gemini/antigravity/brain/56f12204-effa-4fa1-a2d9-6c7a5aa6edf4';
const projectsFilePath = '/Users/santiago/Documents/Projects/EcoNexo/src/data/projects.ts';

// Read the projects file
let content = fs.readFileSync(projectsFilePath, 'utf8');

// Update each project's image_url
Object.entries(imageMapping).forEach(([projectId, imageFilename]) => {
    const imagePath = path.join(artifactDir, imageFilename);

    // Create a regex to find the project and its image_url
    // Match: id: "projectId", ... image_url: "any_url"
    const regex = new RegExp(
        `(id:\\s*"${projectId}"[\\s\\S]*?image_url:\\s*")([^"]+)(")`,
        'g'
    );

    content = content.replace(regex, `$1${imagePath}$3`);
});

// Write the updated content back
fs.writeFileSync(projectsFilePath, content, 'utf8');

console.log('✅ Successfully updated project images!');
console.log(`Updated ${Object.keys(imageMapping).length} projects with custom images.`);
