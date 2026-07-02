const fs = require('fs');
const path = require('path');

const srcPath = path.resolve(__dirname, '../src/data/projects.ts');
const outDir = path.resolve(__dirname, '../project_templates');

if (!fs.existsSync(srcPath)) {
  console.error('src/data/projects.ts not found');
  process.exit(1);
}

const src = fs.readFileSync(srcPath, 'utf8');
const m = src.match(/export const PROJECTS[\s\S]*?\];/m);
if (!m) {
  console.error('Could not find PROJECTS array in projects.ts');
  process.exit(1);
}
let arrText = m[0];
// Remove the "export const PROJECTS" part and any TS type annotation
arrText = arrText.replace(/export const PROJECTS\s*(:\s*[^=]+)?\s*=\s*/m, 'module.exports = ');

const tmpFile = path.resolve(__dirname, 'tmp_projects.js');
fs.writeFileSync(tmpFile, arrText, 'utf8');

let projects;
try {
  projects = require(tmpFile);
} catch (err) {
  console.error('Failed to require generated tmp_projects.js:', err);
  process.exit(1);
}

if (!Array.isArray(projects)) {
  console.error('Parsed PROJECTS is not an array');
  process.exit(1);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

projects.forEach(p => {
  const id = p.id || (p.name && p.name.replace(/[^a-z0-9]+/gi, '_').toLowerCase());
  const fileName = `${id}.md`;
  const lines = [];
  lines.push(`# ${p.name}`);
  if (p.name_en) lines.push(`**Nombre (EN):** ${p.name_en}`);
  if (p.name_de) lines.push(`**Nombre (DE):** ${p.name_de}`);
  lines.push('');
  lines.push(`- **ID:** ${p.id || ''}`);
  lines.push(`- **Categoría:** ${p.category || ''}`);
  lines.push(`- **Ubicación:** ${p.city || ''}, ${p.country || ''}`);
  if (p.address) lines.push(`- **Dirección:** ${p.address}`);
  if (p.created_at) lines.push(`- **Creado:** ${p.created_at}`);
  if (typeof p.participants !== 'undefined') lines.push(`- **Participantes (actual):** ${p.participants}`);
  if (typeof p.spots !== 'undefined') lines.push(`- **Cupos / Spots:** ${p.spots}`);
  if (p.isPermanent) lines.push(`- **Permanente:** ${p.isPermanent}`);
  if (p.tags && p.tags.length) lines.push(`- **Tags:** ${p.tags.join(', ')}`);
  if (p.image_url) lines.push(`- **Imagen:** ${p.image_url}`);
  lines.push('');
  lines.push('## Descripción');
  lines.push(p.description || '');
  if (p.description_en) {
    lines.push('\n**Descripción (EN):**');
    lines.push(p.description_en);
  }
  if (p.description_de) {
    lines.push('\n**Descripción (DE):**');
    lines.push(p.description_de);
  }
  lines.push('');
  lines.push('## Links');
  if (p.links) {
    Object.entries(p.links).forEach(([k,v]) => { if (v) lines.push(`- **${k}:** ${v}`); });
  }
  lines.push('');
  lines.push('## KPIs sugeridos');
  lines.push('- Participantes actuales: ' + (p.participants || 'TODO'));
  lines.push('- Objetivo de participantes: TODO');
  lines.push('- Eventos realizados: TODO');
  lines.push('- Horas de voluntariado: TODO');
  lines.push('- Impacto (p. ej. kg de residuos recogidos / árboles plantados): TODO');
  lines.push('');
  lines.push('---');
  lines.push('*Fuente: `src/data/projects.ts`. Completar KPIs desde datos operativos.*');

  fs.writeFileSync(path.join(outDir, fileName), lines.join('\n'), 'utf8');
});

console.log('Generated', projects.length, 'templates in', outDir);
