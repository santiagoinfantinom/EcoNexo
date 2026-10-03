import * as fs from "fs";
import * as path from "path";

function runEcoGrowth() {
  console.log("🌱 [EcoGrowth Local] Analizando páginas y metadatos (filtrando infraestructura)...\n");

  const possibleDirs = ["app", "src/app", "pages", "src/pages"];
  let targetDir = "";

  for (const dir of possibleDirs) {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      targetDir = fullPath;
      break;
    }
  }

  if (!targetDir) {
    console.log("⚠️ No se encontró ninguna carpeta de rutas ('app' o 'pages').");
    process.exit(1);
  }

  function getFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getFiles(filePath, fileList);
      } else if (file.endsWith(".tsx") || file.endsWith(".jsx")) {
        fileList.push(filePath);
      }
    }
    return fileList;
  }

  const files = getFiles(targetDir);
  let pagesWithMetadata = 0;
  let pagesWithoutMetadata = 0;

  for (const file of files) {
    const relativePath = path.relative(process.cwd(), file);

    const isIgnored = 
      relativePath.includes("layout.") || 
      relativePath.includes("loading.") || 
      relativePath.includes("not-found.") || 
      relativePath.includes("error.") ||
      relativePath.includes("robots.") ||
      relativePath.includes("sitemap.") ||
      path.basename(file).startsWith("_");

    if (isIgnored) continue;

    const content = fs.readFileSync(file, "utf8");
    const hasMetadata = content.includes("metadata") || content.includes("generateMetadata") || content.includes("Head");

    if (hasMetadata) {
      console.log(`✅ [OK] ${relativePath}`);
      pagesWithMetadata++;
    } else {
      console.log(`⚠️ [FALTA SEO] ${relativePath}`);
      pagesWithoutMetadata++;
    }
  }

  console.log("\n==================================================");
  console.log("📊 RESUMEN DE AUDITORÍA SEO (PÁGINAS FINALES):");
  console.log("==================================================");
  console.log(`- Páginas con SEO configurado: ${pagesWithMetadata}`);
  console.log(`- Páginas que requieren metadatos: ${pagesWithoutMetadata}`);
  console.log("==================================================\n");

  process.exit(0);
}

runEcoGrowth();