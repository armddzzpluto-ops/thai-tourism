import fs from "node:fs";
import { execFileSync } from "node:child_process";

const [phase, ...summaryParts] = process.argv.slice(2);
const summary = summaryParts.join(" ").trim();

if (!phase || !summary) {
  console.error('Usage: npm run memory:update -- "Phase name" "Completed summary"');
  process.exit(1);
}

if (phase.length > 120 || summary.length > 500 || /[\r\n\0]/.test(`${phase}${summary}`)) {
  console.error("Phase and summary must be single-line text within the supported length limits");
  process.exit(1);
}

const sha = execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
const date = new Date().toISOString().slice(0, 10);
const path = "docs/AI_MEMORY.md";
const current = fs.readFileSync(path, "utf8").replace(/^\uFEFF/, "");
const marker = "## Automated Phase Log";
const entry = `- ${date} · ${phase} · ${summary} · commit \`${sha}\`\n`;

const next = current.includes(marker)
  ? current.replace(marker, `${marker}\n${entry}`)
  : `${current.trim()}\n\n${marker}\n${entry}`;

fs.writeFileSync(path, next, "utf8");
console.log(`Updated ${path}`);
