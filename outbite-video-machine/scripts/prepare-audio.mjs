#!/usr/bin/env node
/**
 * Stub: normalize VO files to 48 kHz WAV when present.
 * Usage: npm run prepare-audio
 *
 * Expects raw recordings in public/audio/raw/turn-0N.* and writes
 * public/audio/turn-0N.wav via ffmpeg.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const rawDir = path.join(root, "public", "audio", "raw");
const outDir = path.join(root, "public", "audio");

if (!existsSync(rawDir)) {
  mkdirSync(rawDir, { recursive: true });
  console.log(`Created ${rawDir}`);
  console.log(
    "Drop raw VO takes as turn-01.* … turn-06.*, then re-run npm run prepare-audio",
  );
  process.exit(0);
}

const files = readdirSync(rawDir).filter((f) => /^turn-\d{2}\./i.test(f));
if (files.length === 0) {
  console.log("No turn-01..turn-06 files in public/audio/raw/ yet.");
  console.log("Record VO (see public/audio/README.md), then re-run.");
  process.exit(0);
}

for (const file of files) {
  const id = file.match(/^(turn-\d{2})/i)?.[1].toLowerCase();
  if (!id) continue;
  const input = path.join(rawDir, file);
  const output = path.join(outDir, `${id}.wav`);
  console.log(`Converting ${file} → ${id}.wav (48 kHz)`);
  try {
    execFileSync(
      "ffmpeg",
      ["-y", "-i", input, "-ar", "48000", "-ac", "1", output],
      { stdio: "inherit" },
    );
  } catch {
    console.error(`ffmpeg failed for ${file}`);
    process.exit(1);
  }
}

console.log(
  'Done. Set "enabled": true on matching audio.lines in src/data/campaign.json',
);
