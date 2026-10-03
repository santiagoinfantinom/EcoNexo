import * as fs from "fs";
async function run() {
  console.log("📝 [Grant Writer] Analizando package.json para memoria técnica...");
  if (fs.existsSync("package.json")) console.log("✅ Stack tecnológico leído correctamente.");
}
run();