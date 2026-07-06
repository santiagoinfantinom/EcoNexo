
const fs = require('fs');
const path = require('path');

const projectsFilePath = path.join(__dirname, 'src/data/projects.ts');

const natureIds = [
    'photo-1501785888041-af3ef285b470', 'photo-1470071459604-3b5ec3a7fe05', 'photo-1441974231531-c6227db76b6e',
    'photo-1500622764614-b3dbd69e85c7', 'photo-1472214103451-9374bd1c798e', 'photo-1506744038136-46273834b3fb',
    'photo-1464822759023-fed622ff2c3b', 'photo-1475924156734-496f6cac6ec1', 'photo-1433086966358-54859d0ed716',
    'photo-1501862700950-18382cd41497', 'photo-1469474968028-56623f02e42e', 'photo-1447752875215-b2761acb3c5d',
    'photo-1470770841072-f978cf4d019e', 'photo-1426604966149-7e15a5a7900d', 'photo-1419242902214-272b3f66ee7a'
];

const educationIds = [
    'photo-1503676260728-1c00da094a0b', 'photo-1497633762265-9d179a990aa6', 'photo-1524995997946-a1c2e315a42f',
    'photo-1509062522246-3755977927d7', 'photo-1523240715632-d9847f920f0a', 'photo-1513258496099-48168024aec0',
    'photo-1427504494785-3a9ca7044f45', 'photo-1454165833741-3984d74bb35c', 'photo-1522202176988-66273c2fd55f'
];

const communityIds = [
    'photo-1531482615713-2afd69097998', 'photo-1517048676732-d65bc937f952', 'photo-1582213708301-f256af223700',
    'photo-1552664730-d307ca884978', 'photo-1516062423079-7ca13cdc7f52', 'photo-1491438590914-bc09fcaaf77a',
    'photo-1543269865-cbf427effbad', 'photo-1529156069898-43d552228a4a'
];

const healthIds = [
    'photo-1505751172107-59c3f8a455a1', 'photo-1532938911079-1b06ac7ceec7', 'photo-1551076805-e1869033e561',
    'photo-1535914254981-b5012eebbd15', 'photo-1571019613454-1cb2f99b2d8b', 'photo-1506126613408-eca07ce68773'
];

const oceanIds = [
    'photo-1507525428034-b723cf961d3e', 'photo-1439405326854-01518d27a59e', 'photo-1518837695005-20c312ad1ad5',
    'photo-1505118380757-91f5f45d8de0', 'photo-1520116468419-3554602c77a4', 'photo-1544551763-46a013bb70d5',
    'photo-1546069901-ba06dfc2da07'
];

const foodIds = [
    'photo-1472145246862-b24cf25c4a36', 'photo-1466692476868-aef1dfb1e735', 'photo-1500651230702-0e2d8a493270',
    'photo-1523348837708-15d4a09cfac2', 'photo-1529236183275-4fdcf2bc987e', 'photo-1505236858219-8359eb29e329'
];

const getAllIds = () => {
    return [...natureIds, ...educationIds, ...communityIds, ...healthIds, ...oceanIds, ...foodIds];
};

try {
    let content = fs.readFileSync(projectsFilePath, 'utf8');

    // Get all unique IDs available
    const allAvailableIds = getAllIds();
    let idIndex = 0;

    const seenUrls = new Set();
    const replacedCount = 0;

    // Use a regex that captures the whole project object to identify category and image_url
    // This is tricky because the project object spans multiple lines.
    const projects = content.split(/\},\s*\{/);

    const newProjects = projects.map((p, index) => {
        let projectText = p;
        // Add missing braces if needed
        if (index === 0) projectText = projectText + '}';
        else if (index === projects.length - 1) projectText = '{' + projectText;
        else projectText = '{' + projectText + '}';

        const urlMatch = projectText.match(/image_url:\s*["']([^"']+)["']/);
        const categoryMatch = projectText.match(/category:\s*["']([^"']+)["']/);

        if (urlMatch) {
            const url = urlMatch[1];
            if (seenUrls.has(url)) {
                // Replace with a new unique URL
                const category = categoryMatch ? categoryMatch[1] : "Nature";
                let pool = natureIds;
                if (category.includes("Edu")) pool = educationIds;
                else if (category.includes("Comu")) pool = communityIds;
                else if (category.includes("Salud")) pool = healthIds;
                else if (category.includes("Océanos")) pool = oceanIds;
                else if (category.includes("Aliment")) pool = foodIds;

                // Randomly pick one but with a unique sig to make it definitely unique URL
                const randomId = pool[Math.floor(Math.random() * pool.length)];
                const newUrl = `https://images.unsplash.com/${randomId}?q=80&w=1280&auto=format&fit=crop&sig=${Math.floor(Math.random() * 1000000)}`;

                projectText = projectText.replace(`image_url: "${url}"`, `image_url: "${newUrl}"`);
                projectText = projectText.replace(`image_url: '${url}'`, `image_url: "${newUrl}"`);
            } else {
                seenUrls.add(url);
            }
        }

        // Cleanup braces for joining
        if (index === 0) return projectText.slice(0, -1);
        if (index === projects.length - 1) return projectText.slice(1);
        return projectText.slice(1, -1);
    });

    const newContent = newProjects.join('}, {');
    fs.writeFileSync(projectsFilePath, newContent);
    console.log("Successfully replaced duplicate image URLs with unique ones.");

} catch (err) {
    console.error(err);
}
