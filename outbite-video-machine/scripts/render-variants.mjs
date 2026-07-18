#!/usr/bin/env node
/**
 * Render campaign composition(s) to out/.
 * Usage: npm run render:campaign
 */
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const variants = [
  {
    id: "OutbiteComparison",
    out: "out/outbite-comparison.mp4",
  },
];

for (const v of variants) {
  const outPath = path.join(root, v.out);
  console.log(`Rendering ${v.id} → ${v.out}`);
  execSync(
    `npx remotion render ${v.id} "${outPath}" --codec=h264 --pixel-format=yuv420p`,
    { cwd: root, stdio: "inherit", shell: true },
  );
}

console.log("All variants rendered.");
