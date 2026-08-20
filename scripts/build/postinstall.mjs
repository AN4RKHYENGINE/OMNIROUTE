#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("[postinstall] Running postinstall checks...");

// Check for better-sqlite3 - warn but don't fail
const bsqlite3Path = path.resolve(__dirname, "../../node_modules/better-sqlite3");
if (!fs.existsSync(bsqlite3Path)) {
  console.warn(
    "[postinstall] WARNING: 'better-sqlite3' is missing from node_modules/. This is expected if --ignore-scripts was used. Skipping native build check."
  );
} else {
  console.log("[postinstall] 'better-sqlite3' found in node_modules/");
}

console.log("[postinstall] Postinstall checks passed");
