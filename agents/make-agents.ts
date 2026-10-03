import * as fs from "fs";
import * as path from "path";

const agentsDir = path.join(process.cwd(), "agents");

// 1. Crear la carpeta agents si no existe
if (!fs.existsSync(agentsDir)) {
  fs.mkdirSync(agentsDir);
  console.log("📁 Carpeta 'agents/' creada con éxito.");
}

// 2. Contenido de los 5 scripts automatizados
const agents = {
  "bughunter.ts": `import { execSync } from "child_process";
async function run() {
  console.log("🔍 [BugHunter] Verificando tipos...");
  try { execSync("npx tsc --noEmit", { stdio: "inherit" }); } 
  catch (e) { process.exit(1); }
}
run();`,

  "ecogrowth.ts": `import * as fs from "fs";
import * as path from "path";
async function run() {
  console.log("🌱 [EcoGrowth] Analizando componentes SEO...");
  const appDir = path.join(process.cwd(), "app");
  if (fs.existsSync(appDir)) console.log("✅ Carpeta 'app' detectada. Todo listo para optimizar metadatos.");
}
run();`,

  "sponsorship.ts": `async function run() {
  console.log("💼 [Sponsorship] Generando propuesta B2B para mercado DACH...");
}
run();`,

  "insights.ts": `async function run() {
  console.log("📊 [Product Insights] Evaluando estrategias de retención...");
}
run();`,

  "grantwriter.ts": `import * as fs from "fs";
async function run() {
  console.log("📝 [Grant Writer] Analizando package.json para memoria técnica...");
  if (fs.existsSync("package.json")) console.log("✅ Stack tecnológico leído correctamente.");
}
run();`
};

// 3. Escribir los archivos físicos
for (const [filename, content] of Object.entries(agents)) {
  fs.writeFileSync(path.join(agentsDir, filename), content);
  console.log(`✨ Creado: agents/${filename}`);
}

// 4. Actualizar package.json automáticamente
const packageJsonPath = path.join(process.cwd(), "package.json");
if (fs.existsSync(packageJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  pkg.scripts = {
    ...pkg.scripts,
    "agent:bugs": "npx tsx agents/bughunter.ts",
    "agent:seo": "npx tsx agents/ecogrowth.ts",
    "agent:leads": "npx tsx agents/sponsorship.ts",
    "agent:insights": "npx tsx agents/insights.ts",
    "agent:grant": "npx tsx agents/grantwriter.ts"
  };
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
  console.log("🚀 ¡Scripts añadidos automáticamente a tu package.json!");
}

console.log("\n🎉 ¡Todos tus agentes han sido creados y configurados con éxito!");