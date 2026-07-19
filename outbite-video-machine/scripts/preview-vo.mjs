#!/usr/bin/env node
/**
 * Prepare Studio preview with neural VO for ONE variant (ephemeral).
 * Writes src/data/studio-override.json (gitignored via .cache pattern — also listed).
 *
 *   npm run studio:vo -- --variant mcdonalds-big-mac
 *   # then refresh Remotion Studio
 *   npm run vo:clean -- --variant mcdonalds-big-mac   # when done
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const vIdx = args.indexOf("--variant");
const variantId =
  vIdx >= 0 && args[vIdx + 1] && !args[vIdx + 1].startsWith("-")
    ? args[vIdx + 1]
    : "mcdonalds-big-mac";
const clear = args.includes("--clear");
const overridePath = path.join(root, "src/data/studio-override.json");

if (clear) {
  writeFileSync(overridePath, JSON.stringify({ active: false }, null, 2));
  execSync(`node scripts/generate-vo.mjs --clean-all`, {
    cwd: root,
    stdio: "inherit",
  });
  console.log("Studio override cleared. Studio is silent again.");
  process.exit(0);
}

execSync(`node scripts/build-variant.mjs --variant ${variantId}`, {
  cwd: root,
  stdio: "inherit",
});
execSync(`node scripts/generate-vo.mjs --variant ${variantId}`, {
  cwd: root,
  stdio: "inherit",
});

const campaign = JSON.parse(
  readFileSync(
    path.join(root, "src/data/variants", `${variantId}.campaign.json`),
    "utf8",
  ),
);
const captions = JSON.parse(
  readFileSync(
    path.join(root, "src/data/variants", `${variantId}.captions.json`),
    "utf8",
  ),
);
const manifest = JSON.parse(
  readFileSync(
    path.join(
      root,
      "public/audio/.generated",
      variantId,
      "manifest.json",
    ),
    "utf8",
  ),
);

campaign.audio.lines = manifest.lines;
if (Array.isArray(manifest.captions) && manifest.captions.length > 0) {
  captions.captions = manifest.captions;
}

writeFileSync(
  overridePath,
  JSON.stringify(
    {
      active: true,
      campaign,
      captions,
      showAppDemo: true,
      showEndCard: true,
      showDisclaimer: true,
      _meta: {
        variantId,
        ephemeral: true,
        note: "Auto-generated for Studio QC. Run npm run studio:vo -- --clear when done.",
      },
    },
    null,
    2,
  ),
);

console.log(`\nStudio override ready for ${variantId}`);
console.log("Refresh Remotion Studio to hear neural VO synced to captions.");
console.log("When finished: npm run studio:vo -- --clear");
