#!/usr/bin/env node
/**
 * Probe the active source video and print Remotion-ready composition numbers.
 * Usage: npm run inspect
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

let sourceRel = "source/0718.mp4";
try {
  const campaign = JSON.parse(
    fs.readFileSync(path.join(root, "src", "data", "campaign.json"), "utf8"),
  );
  if (campaign?.video?.source) {
    sourceRel = campaign.video.source;
  }
} catch {
  // fall back to default
}

const source = path.join(root, "public", sourceRel);

let json;
try {
  const out = execFileSync(
    "ffprobe",
    [
      "-v",
      "quiet",
      "-print_format",
      "json",
      "-show_format",
      "-show_streams",
      source,
    ],
    { encoding: "utf8" },
  );
  json = JSON.parse(out);
} catch (err) {
  console.error("ffprobe failed. Is ffmpeg/ffprobe on PATH?");
  console.error(err.message);
  process.exit(1);
}

const video = json.streams.find((s) => s.codec_type === "video");
const audio = json.streams.find((s) => s.codec_type === "audio");
const duration = Number(video.duration || json.format.duration);
const fpsParts = (video.r_frame_rate || video.avg_frame_rate || "30/1").split(
  "/",
);
const fps = Number(fpsParts[0]) / Number(fpsParts[1] || 1);
const nbFrames = Number(video.nb_frames);
const durationInFrames = Number.isFinite(nbFrames)
  ? nbFrames
  : Math.round(duration * fps);

console.log("Source:", source);
console.log("---");
console.log(`Resolution: ${video.width}×${video.height}`);
console.log(`FPS: ${fps}`);
console.log(`Duration (stream): ${duration.toFixed(6)}s`);
console.log(`Format duration: ${Number(json.format.duration).toFixed(6)}s`);
console.log(`nb_frames: ${video.nb_frames}`);
console.log(`durationInFrames (bake): ${durationInFrames}`);
console.log(`Suggested social composition: 1080×1920 @ ${fps}fps`);
console.log(`Video codec: ${video.codec_name} / ${video.pix_fmt}`);
if (audio) {
  console.log(
    `Audio: ${audio.codec_name} ${audio.sample_rate}Hz ${audio.channels}ch`,
  );
}
console.log("---");
console.log("Bake these into src/data/campaign.json → video.*");
