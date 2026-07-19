#!/usr/bin/env node
/**
 * Mass-produce unique Outbite TikTok variants.
 * For each intent: build props → generate ephemeral neural VO → render → delete VO.
 *
 * Usage:
 *   npm run render:batch
 *   npm run render:batch -- --only mcdonalds-big-mac,wendys-baconator
 *   npm run render:batch -- --skip-vo          # captions-only (silent)
 *   npm run render:batch -- --keep-vo          # keep last variant VO for QC
 */
import { execFileSync, execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INTENTS } from "./lib/intents.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "out", "batch");
const propsDir = path.join(root, ".cache", "props");
const generatedRoot = path.join(root, "public", "audio", ".generated");

const args = process.argv.slice(2);
const skipVo = args.includes("--skip-vo");
const keepVo = args.includes("--keep-vo");
const onlyArg = args[args.indexOf("--only") + 1];
const only = onlyArg && !onlyArg.startsWith("-")
  ? new Set(onlyArg.split(",").map((s) => s.trim()))
  : null;

mkdirSync(outDir, { recursive: true });
mkdirSync(propsDir, { recursive: true });

const variants = INTENTS.filter((i) => !only || only.has(i.id));
if (!variants.length) {
  console.error("No variants selected.");
  process.exit(1);
}

console.log(`Batch rendering ${variants.length} unique videos…\n`);

for (const intent of variants) {
  console.log(`\n======= ${intent.id} (${intent.chain}) =======`);

  execSync(`node scripts/build-variant.mjs --variant ${intent.id}`, {
    cwd: root,
    stdio: "inherit",
  });

  const campaignPath = path.join(
    root,
    "src/data/variants",
    `${intent.id}.campaign.json`,
  );
  const captionsPath = path.join(
    root,
    "src/data/variants",
    `${intent.id}.captions.json`,
  );
  const campaign = JSON.parse(readFileSync(campaignPath, "utf8"));
  const captions = JSON.parse(readFileSync(captionsPath, "utf8"));

  if (!skipVo) {
    execSync(`node scripts/generate-vo.mjs --variant ${intent.id}`, {
      cwd: root,
      stdio: "inherit",
    });
    const manifestPath = path.join(
      generatedRoot,
      intent.id,
      "manifest.json",
    );
    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
      campaign.audio.lines = manifest.lines;
      if (Array.isArray(manifest.captions) && manifest.captions.length > 0) {
        captions.captions = manifest.captions;
      }
    }
  }

  const props = {
    campaign,
    captions,
    showAppDemo: true,
    showEndCard: true,
    showDisclaimer: true,
  };
  const propsFile = path.join(propsDir, `${intent.id}.json`);
  writeFileSync(propsFile, JSON.stringify(props));

  const mp4 = path.join(outDir, `${intent.id}.mp4`);
  console.log(`Rendering → ${mp4}`);
  execSync(
    `npx remotion render OutbiteComparison "${mp4}" --codec=h264 --pixel-format=yuv420p --props="${propsFile}"`,
    { cwd: root, stdio: "inherit", shell: true },
  );

  if (!skipVo && !keepVo) {
    execSync(`node scripts/generate-vo.mjs --variant ${intent.id} --clean`, {
      cwd: root,
      stdio: "inherit",
    });
  }
}

if (!keepVo && existsSync(generatedRoot)) {
  // Leave directory, wipe leftovers
  execSync(`node scripts/generate-vo.mjs --clean-all`, {
    cwd: root,
    stdio: "inherit",
  });
}

console.log(`\nAll done. Outputs in ${outDir}`);
console.log("Each video used unique script + neural voices; VO cache cleared.");
