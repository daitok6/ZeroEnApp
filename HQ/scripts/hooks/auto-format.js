#!/usr/bin/env node
// PostToolUse — Edit | Write
// Auto-formats TypeScript/JavaScript files after edits using Prettier

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    const filePath = data?.tool_input?.file_path || data?.tool_input?.path;

    if (!filePath) return;

    // Only format TS/JS/TSX/JSX files
    const ext = path.extname(filePath).toLowerCase();
    if (![".ts", ".tsx", ".js", ".jsx", ".json", ".css"].includes(ext)) return;

    // Check if file exists
    if (!fs.existsSync(filePath)) return;

    // Find prettier in the project
    const dir = path.dirname(filePath);
    let projectRoot = dir;

    // Walk up to find package.json
    let current = dir;
    for (let i = 0; i < 6; i++) {
      if (fs.existsSync(path.join(current, "package.json"))) {
        projectRoot = current;
        break;
      }
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }

    const prettierBin = path.join(projectRoot, "node_modules", ".bin", "prettier");

    if (!fs.existsSync(prettierBin)) return;

    execSync(`"${prettierBin}" --write "${filePath}" --log-level silent`, {
      cwd: projectRoot,
      timeout: 10000,
    });
  } catch {
    // Silent — don't block on format errors
  }
});
