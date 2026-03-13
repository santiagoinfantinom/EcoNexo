const fs = require('fs');
const path = require('path');

async function translateText(text, targetLang = 'fr') {
    if (!text) return text;
    try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();
        return data[0].map(item => item[0]).join('');
    } catch (error) {
        console.error('Translation error:', error);
        return text;
    }
}

async function processFile(filename, fields) {
    const filePath = path.join(__dirname, 'src/data', filename);
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const newLines = [];

    const pendingTranslations = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        newLines.push(line);

        for (const field of fields) {
            const enField = `${field}_en`;
            const deField = `${field}_de`;
            const frField = `${field}_fr`;

            // Check if this line is the English version
            if (line.includes(`${enField}:`)) {
                if (line.includes('[')) {
                    // Array field
                    const arrayRegex = new RegExp(`${enField}:\\s*\\[(.*)\\]`);
                    const match = line.match(arrayRegex);
                    if (match) {
                        try {
                            const items = JSON.parse('[' + match[1] + ']');
                            const translatedItems = [];
                            for (const item of items) {
                                translatedItems.push(await translateText(item));
                            }
                            const stringified = translatedItems.map(item => `"${item.replace(/"/g, '\\"')}"`).join(', ');
                            pendingTranslations[frField] = `[${stringified}]`;
                        } catch (e) {
                            console.error(`Failed to parse array in ${filename}:`, match[1]);
                        }
                    }
                } else {
                    // String field
                    const stringRegex = new RegExp(`${enField}:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
                    const match = line.match(stringRegex);
                    if (match) {
                        const translated = await translateText(match[1]);
                        pendingTranslations[frField] = `"${translated.replace(/"/g, '\\"')}"`;
                    }
                }
            }
            // Insert the French version after the German version
            else if (line.includes(`${deField}:`)) {
                if (pendingTranslations[frField]) {
                    const indentMatch = line.match(/^(\s*)/);
                    const indent = indentMatch ? indentMatch[1] : '    ';
                    newLines.push(`${indent}${frField}: ${pendingTranslations[frField]},`);
                    pendingTranslations[frField] = null;
                }
            }
        }
    }

    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log(`Successfully added French translations to ${filename}`);
}

async function run() {
    await processFile('eventDetails.ts', ['title', 'description', 'location', 'organizer', 'requirements', 'benefits']);
    await processFile('workshops.ts', ['title', 'description', 'location']);
}

run();
