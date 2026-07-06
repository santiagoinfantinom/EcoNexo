const fs = require('fs');
const path = require('path');

async function translateText(text, targetLang = 'fr') {
    try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();
        return data[0].map(item => item[0]).join('');
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Fallback to original
    }
}

async function processEvents() {
    const filePath = path.join(__dirname, 'src/data/events-2026-real.ts');
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex to find title_de and description_de to insert _fr after them
    const titleRegex = /(title_de:\s*"(?:[^"\\]|\\.)*"),/g;
    const descRegex = /(description_de:\s*"(?:[^"\\]|\\.)*"),/g;

    // Let's do this more safely by parsing the logic or just using string replacement
    const lines = content.split('\n');
    const newLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        newLines.push(line);

        if (line.includes('title_en:')) {
            const match = line.match(/title_en:\s*"([^"]+)"/);
            if (match) {
                const textToTranslate = match[1];
                const frTitle = await translateText(textToTranslate);
                // We will insert title_fr after title_de, but since we are processing line by line,
                // let's look for title_de line to insert after.
                // Wait, title_de is usually the next line. Let's just store the translation.
                lines.frTitlePending = frTitle;
            }
        } else if (line.includes('title_de:')) {
            if (lines.frTitlePending) {
                // Create the title_fr line with same indentation
                const indentMatch = line.match(/^(\s*)/);
                const indent = indentMatch ? indentMatch[1] : '        ';
                newLines.push(`${indent}title_fr: "${lines.frTitlePending.replace(/"/g, '\\"')}",`);
                lines.frTitlePending = null;
            }
        }

        if (line.includes('description_en:')) {
            const match = line.match(/description_en:\s*"([^"]+)"/);
            if (match) {
                const textToTranslate = match[1];
                const frDesc = await translateText(textToTranslate);
                lines.frDescPending = frDesc;
            }
        } else if (line.includes('description_de:')) {
            if (lines.frDescPending) {
                const indentMatch = line.match(/^(\s*)/);
                const indent = indentMatch ? indentMatch[1] : '        ';
                newLines.push(`${indent}description_fr: "${lines.frDescPending.replace(/"/g, '\\"')}",`);
                lines.frDescPending = null;
            }
        }
    }

    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log('Successfully added French translations to events-2026-real.ts');
}

processEvents();
