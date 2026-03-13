
const fs = require('fs');
const path = require('path');

const eventsFilePath = path.join(__dirname, 'src/data/events-2026.ts');

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

const getRandomImage = (category, seed) => {
    let pool = natureIds;
    if (category?.includes("Edu")) pool = educationIds;
    else if (category?.includes("Comu")) pool = communityIds;
    else if (category?.includes("Salud")) pool = healthIds;
    else if (category?.includes("Océan")) pool = oceanIds;
    else if (category?.includes("Alimen")) pool = foodIds;
    else if (category?.includes("Tecnol")) pool = educationIds;

    const randomId = pool[Math.floor(Math.random() * pool.length)];
    // Add unique sig based on title/seed to make it persistent but unique
    return `https://images.unsplash.com/${randomId}?q=80&w=1280&auto=format&fit=crop&sig=${seed}`;
};

try {
    let content = fs.readFileSync(eventsFilePath, 'utf8');

    // Regex to find events. 
    // Structure is roughly: { ... category: "...", ... }
    // We need to insert image_url if missing.

    const eventRegex = /\{([\s\S]*?)\}/g;

    // We'll process the file by matching objects inside the array.
    // Note: This simple regex might be fragile if objects are nested, but events are flat in the array.

    let newContent = content.replace(eventRegex, (match, body) => {
        // Check if it's an event object (has title or description)
        if (!body.includes('title:') && !body.includes('description:')) return match;

        if (body.includes('image_url:')) return match; // Already has image

        // Extract category
        const catMatch = body.match(/category:\s*["']([^"']+)["']/);
        const category = catMatch ? catMatch[1] : "Medio ambiente";

        // Extract title for uniqueness seed
        const titleMatch = body.match(/title:\s*["']([^"']+)["']/);
        const seed = titleMatch ? titleMatch[1].replace(/\s/g, '').length : Math.floor(Math.random() * 1000);

        const imageUrl = getRandomImage(category, seed);

        // Insert image_url before the closing brace (which is not part of body in this regex group usually, 
        // but here match includes braces. Wait, my regex is `\{([\s\S]*?)\}`.
        // match is `{...}`.

        // Let's insert it before the last comma or property
        const insertion = `\n        image_url: "${imageUrl}",`;

        // Find keys to insert after
        if (body.includes('capacity:')) {
            return match.replace(/(capacity:\s*\d+,?)/, `$1${insertion}`);
        } else if (body.includes('category:')) {
            // Insert after category line
            return match.replace(/(category:.*?,)/, `$1${insertion}`);
        } else {
            // Just append to end
            return match.replace(/\}$/, `${insertion}\n    }`);
        }
    });

    fs.writeFileSync(eventsFilePath, newContent);
    console.log("Updated events-2026.ts with missing images.");

} catch (err) {
    console.error(err);
}
