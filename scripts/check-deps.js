#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const nextPkg = path.join(process.cwd(), "node_modules", "next", "package.json");

if (!fs.existsSync(nextPkg)) {
  console.error("\n❌ Dependencias no instaladas. Ejecuta primero:\n\n   npm install\n\n");
  process.exit(1);
}
