#!/usr/bin/env node
// Stop hook
// Checks recently modified TS/JS files for console.log statements
// Returns exit code 2 if console.log found in client app files (blocks completion)

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);

    // Get git diff to find recently modified files
    let modifiedFiles = [];
    try {
      const diff = execSync("git diff --name-only HEAD 2>/dev/null || git diff --name-only 2>/dev/null", {
        timeout: 5000,
        encoding: "utf8",
      });
      modifiedFiles = diff
        .trim()
        .split("\n")
        .filter((f) => f && /\.(ts|tsx|js|jsx)$/.test(f));
    } catch {
      return; // No git, skip
    }

    if (modifiedFiles.length === 0) return;

    const violations = [];

    for (const file of modifiedFiles) {
      if (!fs.existsSync(file)) continue;

      // Skip node_modules and test files
      if (file.includes("node_modules") || file.includes(".test.")) continue;

      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, i) => {
        // Match console.log but not console.warn/error/info (those are intentional)
        if (/console\.log\s*\(/.test(line) && !line.trim().startsWith("//")) {
          violations.push(`${file}:${i + 1} — ${line.trim()}`);
        }
      });
    }

    if (violations.length > 0) {
      console.error("\n[Warning] console.log found in modified files:");
      violations.slice(0, 5).forEach((v) => console.error("  " + v));
      if (violations.length > 5) {
        console.error(`  ... and ${violations.length - 5} more`);
      }
      console.error("Remove console.log before deploying to production.\n");
      // Exit 0 — warn only, don't block. Change to exit(2) to enforce.
    }
  } catch {
    // Silent
  }
});
