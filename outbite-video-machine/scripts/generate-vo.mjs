#!/usr/bin/env node
/**
 * On-demand neural VO — locked to speakingMap.mjs turn windows.
 * Never steals time from the other body. Prefer shorter copy over robotic speed.
 *
 *   npm run vo:generate -- --variant mcdonalds-big-mac
 *   npm run vo:clean-all
 */
import { execFileSync, spawnSync } from "node:child_process";
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
import { LINE_WINDOWS, MAX_ATEMPO } from "./lib/speakingMap.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const generatedRoot = path.join(root, "public", "audio", ".generated");

const args = process.argv.slice(2);
const vIdx = args.indexOf("--variant");
const variantId =
  vIdx >= 0 && args[vIdx + 1] && !args[vIdx + 1].startsWith("-")
    ? args[vIdx + 1]
    : "mcdonalds-big-mac";
const cleanOnly = args.includes("--clean");
const cleanAll = args.includes("--clean-all");

if (cleanAll) {
  if (existsSync(generatedRoot)) {
    rmSync(generatedRoot, { recursive: true, force: true });
    console.log(`Cleaned all ephemeral VO under ${generatedRoot}`);
  }
  process.exit(0);
}

const intent = INTENTS.find((i) => i.id === variantId);
if (!intent) {
  console.error(
    `Unknown variant "${variantId}". Options:\n${INTENTS.map((i) => `  - ${i.id}`).join("\n")}`,
  );
  process.exit(1);
}

const outDir = path.join(generatedRoot, intent.id);

if (cleanOnly) {
  if (existsSync(outDir)) {
    rmSync(outDir, { recursive: true, force: true });
    console.log(`Cleaned ${outDir}`);
  }
  process.exit(0);
}

if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

function durationOf(file) {
  return Number(
    execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        file,
      ],
      { encoding: "utf8" },
    ).trim(),
  );
}

function fitToWindow(input, output, windowSec) {
  const dur = durationOf(input);
  if (!Number.isFinite(dur) || dur <= 0.05) {
    throw new Error(`Bad duration for ${input}`);
  }

  const target = Math.max(0.35, windowSec - 0.05);
  const polish =
    "aformat=sample_rates=48000:channel_layouts=mono,loudnorm=I=-16:TP=-1.5:LRA=7";
  let filter = polish;
  let note = "natural";

  if (dur > target) {
    const needed = dur / target;
    if (needed > MAX_ATEMPO) {
      // Hard rule: do NOT robotic-speed past MAX_ATEMPO — trim end instead
      // and warn so script can be shortened in intents.mjs
      const ratio = MAX_ATEMPO;
      filter = `atempo=${ratio.toFixed(4)},${polish},atrim=0:${target.toFixed(3)},asetpts=PTS-STARTPTS`;
      note = `WARN trim (needed ${needed.toFixed(2)}x > max ${MAX_ATEMPO}) — shorten script`;
    } else {
      filter = `atempo=${needed.toFixed(4)},${polish}`;
      note = `pace ${needed.toFixed(2)}x`;
    }
  }

  execFileSync(
    "ffmpeg",
    ["-y", "-i", input, "-af", filter, "-ar", "48000", "-ac", "1", output],
    { stdio: "pipe" },
  );
  return { raw: dur, fitted: durationOf(output), note };
}

function synthesize(text, voice, outMp3, outVtt) {
  const r = spawnSync(
    process.platform === "win32" ? "python" : "python3",
    [
      "-m",
      "edge_tts",
      "--voice",
      voice,
      "--text",
      text,
      "--write-media",
      outMp3,
      "--write-subtitles",
      outVtt,
    ],
    { encoding: "utf8" },
  );
  if (r.status !== 0) {
    throw new Error(r.stderr || r.stdout || `edge-tts failed for: ${text}`);
  }
}

function parseVttTimestamp(value) {
  const match = value.match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);
  if (!match) return 0;
  return (
    Number(match[1]) * 3600 +
    Number(match[2]) * 60 +
    Number(match[3]) +
    Number(match[4]) / 1000
  );
}

function parseSentenceTimings(vtt) {
  const timings = [];
  const pattern =
    /(\d{2}:\d{2}:\d{2}[,.]\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2}[,.]\d{3})\s*\n([\s\S]*?)(?=\n\s*\n|$)/g;
  for (const match of vtt.matchAll(pattern)) {
    const text = match[3].replace(/\s+/g, " ").trim();
    if (!text) continue;
    timings.push({
      start: parseVttTimestamp(match[1]),
      end: parseVttTimestamp(match[2]),
      text,
    });
  }
  return timings;
}

function emphasisFor(text) {
  return text
    .split(/\s+/)
    .filter(
      (word) =>
        /outbite|official|calor|download|fries|coke|mac|whopper|baconator|chipotle|bowl|nuggets|salad|swaps|order/i.test(
          word,
        ),
    )
    .slice(0, 2)
    .map((word) => word.replace(/[^\w'−-]/g, ""));
}

function estimateWordTimings(text, startSeconds, endSeconds) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  // Sentence boundaries come directly from Edge TTS. Inside each sentence,
  // character-weighted allocation tracks spoken cadence more closely than
  // assigning identical time to "I" and "McDonald's".
  const weights = words.map((word) => {
    const cleanLength = Math.max(1, word.replace(/[^\w']/g, "").length);
    const punctuationPause = /[.!?]$/.test(word)
      ? 0.45
      : /[,;:]$/.test(word)
        ? 0.2
        : 0;
    return Math.pow(cleanLength, 0.45) + punctuationPause;
  });
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const span = Math.max(0.08, endSeconds - startSeconds);
  let cursor = startSeconds;

  return words.map((word, index) => {
    const next =
      index === words.length - 1
        ? endSeconds
        : cursor + span * (weights[index] / totalWeight);
    const timing = { text: word, startSeconds: cursor, endSeconds: next };
    cursor = next;
    return timing;
  });
}

const lines = [];
const captions = [];
let captionIndex = 0;
console.log(`Generating neural VO for ${intent.id}`);
console.log("Locked to speakingMap.mjs (0718 visual turns)\n");

for (let i = 0; i < LINE_WINDOWS.length; i++) {
  const win = LINE_WINDOWS[i];
  const text = intent.script[i]?.text ?? win.text;
  const speaker = win.speaker;
  if (intent.script[i] && intent.script[i].speaker !== speaker) {
    throw new Error(
      `Speaker mismatch at ${win.id}: map=${speaker} script=${intent.script[i].speaker}`,
    );
  }

  const window = win.end - win.start;
  const voice =
    speaker === "left" ? intent.voices.impulse : intent.voices.outbite;
  const tmpMp3 = path.join(outDir, `${win.id}.raw.mp3`);
  const tmpVtt = path.join(outDir, `${win.id}.raw.vtt`);
  const wav = path.join(outDir, `${win.id}.wav`);

  process.stdout.write(`  ${win.id} [${speaker}] ${win.start.toFixed(2)}-${win.end.toFixed(2)}… `);
  synthesize(text, voice, tmpMp3, tmpVtt);
  const sentenceTimings = parseSentenceTimings(readFileSync(tmpVtt, "utf8"));
  const { raw, fitted, note } = fitToWindow(tmpMp3, wav, window);
  const timingScale = fitted / raw;
  rmSync(tmpMp3, { force: true });
  rmSync(tmpVtt, { force: true });

  // Karaoke/VO end = start + fitted, never past turn window end
  const voEndSeconds = Math.min(win.end, win.start + fitted + 0.02);

  lines.push({
    id: win.id,
    file: `audio/.generated/${intent.id}/${win.id}.wav`,
    startSeconds: win.start,
    endSeconds: voEndSeconds,
    windowEndSeconds: win.end,
    enabled: true,
    speaker,
    text,
    voice,
    fitNote: note,
  });

  const timedSentences =
    sentenceTimings.length > 0
      ? sentenceTimings
      : [{ start: 0, end: raw, text }];
  for (const sentence of timedSentences) {
    const startSeconds = Math.max(
      win.start,
      win.start + sentence.start * timingScale,
    );
    const sentenceEndSeconds = Math.min(
      voEndSeconds,
      win.start + sentence.end * timingScale,
    );
    if (sentenceEndSeconds <= startSeconds) continue;
    captionIndex += 1;
    captions.push({
      id: `cap-${String(captionIndex).padStart(2, "0")}`,
      speaker,
      startSeconds,
      endSeconds: sentenceEndSeconds,
      text: sentence.text,
      emphasis: emphasisFor(sentence.text),
      wordTimings: estimateWordTimings(
        sentence.text,
        startSeconds,
        sentenceEndSeconds,
      ),
    });
  }
  console.log(`${fitted.toFixed(2)}s ${note}`);
}

writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify(
    {
      variantId: intent.id,
      generatedAt: new Date().toISOString(),
      ephemeral: true,
      speakingMap: "scripts/lib/speakingMap.mjs",
      lines,
      captions,
    },
    null,
    2,
  ),
);
writeFileSync(path.join(generatedRoot, "ACTIVE"), intent.id, "utf8");

console.log(`\nOK — ${lines.length} lines locked to visual turns`);
