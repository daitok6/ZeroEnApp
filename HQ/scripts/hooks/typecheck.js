#!/usr/bin/env node
// PostToolUse — Edit (async)
// Runs TypeScript type check on the project after editing .ts/.tsx files

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

    // Only typecheck TS/TSX files
    const ext = path.extname(filePath).toLowerCase();
    if (![".ts", ".tsx"].includes(ext)) return;

    // Find tsconfig.json
    let projectRoot = null;
    let current = path.dirname(filePath);
    for (let i = 0; i < 6; i++) {
      if (
        fs.existsSync(path.join(current, "tsconfig.json")) &&
        fs.existsSync(path.join(current, "package.json"))
      ) {
        projectRoot = current;
        break;
      }
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }

    if (!projectRoot) return;

    const tscBin = path.join(projectRoot, "node_modules", ".bin", "tsc");
    if (!fs.existsSync(tscBin)) return;

    try {
      execSync(`"${tscBin}" --noEmit --pretty false`, {
        cwd: projectRoot,
        timeout: 30000,
        stdio: "pipe",
      });
    } catch (err) {
      // TypeScript errors — print to stderr as a warning (non-blocking)
      const output = err.stdout?.toString() || err.stderr?.toString() || "";
      if (output.trim()) {
        console.error("\n[TypeCheck] TypeScript errors detected:");
        // Show first 10 lines only
        const lines = output.trim().split("\n").slice(0, 10);
        lines.forEach((line) => console.error(line));
        if (output.trim().split("\n").length > 10) {
          console.error("... (run `npx tsc --noEmit` for full output)");
        }
      }
    }
  } catch {
    // Silent
  }
});
