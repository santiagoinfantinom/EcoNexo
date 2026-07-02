const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.resolve(__dirname, '../project_templates');
const INDEX_FILE = path.join(TEMPLATES_DIR, 'index.md');

const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.md') && f !== 'index.md').sort();

const lines = [];
lines.push('# Índice de Proyectos');
lines.push('');
lines.push('Catálogo centralizado de todos los proyectos en EcoNexo. Cada proyecto tiene una ficha con información de contacto, descripción, ubicación y KPIs.');
lines.push('');
lines.push(`**Total de proyectos:** ${files.length}`);
lines.push('');
lines.push('---');
lines.push('');

// Group by city
const byCity = {};
const projectData = [];

files.forEach(f => {
  const p = path.join(TEMPLATES_DIR, f);
  const content = fs.readFileSync(p, 'utf8');
  const titleMatch = content.split('\n')[0] || '';
  const title = titleMatch.replace(/^#\s*/, '').trim();
  
  // Extract city from content
  const cityMatch = content.match(/\*\*Ubicación:\*\*\s*([^,]+),/);
  const city = cityMatch ? cityMatch[1].trim() : 'Desconocida';
  
  const categoryMatch = content.match(/\*\*Categoría:\*\*\s*([^\n]+)/);
  const category = categoryMatch ? categoryMatch[1].trim() : 'Otros';

  projectData.push({ file: f, title, city, category });

  if (!byCity[city]) byCity[city] = [];
  byCity[city].push({ file: f, title, category });
});

// Sort by city
Object.keys(byCity).sort().forEach(city => {
  lines.push(`## ${city}`);
  lines.push('');
  
  byCity[city].sort((a, b) => a.title.localeCompare(b.title)).forEach(proj => {
    lines.push(`- [${proj.title}](./${proj.file}) — *${proj.category}*`);
  });
  
  lines.push('');
});

lines.push('---');
lines.push('');
lines.push('## Estadísticas');
lines.push('');

// Count by category
const byCategory = {};
projectData.forEach(p => {
  if (!byCategory[p.category]) byCategory[p.category] = 0;
  byCategory[p.category]++;
});

lines.push('**Por categoría:**');
Object.keys(byCategory).sort().forEach(cat => {
  lines.push(`- ${cat}: ${byCategory[cat]}`);
});

lines.push('');
lines.push('**Por ciudad:**');
Object.keys(byCity).sort().forEach(city => {
  lines.push(`- ${city}: ${byCity[city].length}`);
});

lines.push('');
lines.push('---');
lines.push('');
lines.push('*Generado automáticamente por `scripts/generate_project_index.js`*');
lines.push(`*Última actualización: ${new Date().toISOString()}`);

fs.writeFileSync(INDEX_FILE, lines.join('\n'), 'utf8');
console.log(`✓ Generated ${INDEX_FILE} with ${files.length} projects`);
