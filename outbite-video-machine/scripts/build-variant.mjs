#!/usr/bin/env node
/**
 * Build campaign + captions for one variant — timings from speakingMap.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INTENTS } from "./lib/intents.mjs";
import { BEAT_WINDOWS, LINE_WINDOWS } from "./lib/speakingMap.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const baseCampaign = JSON.parse(
  readFileSync(path.join(root, "src/data/campaign.json"), "utf8"),
);

const args = process.argv.slice(2);
const vIdx = args.indexOf("--variant");
const variantId =
  vIdx >= 0 && args[vIdx + 1] && !args[vIdx + 1].startsWith("-")
    ? args[vIdx + 1]
    : "mcdonalds-big-mac";
const intent = INTENTS.find((i) => i.id === variantId);
if (!intent) {
  console.error(`Unknown variant ${variantId}`);
  process.exit(1);
}

// Guardrail: every mass-produced concept must have its own visual meal set.
// This prevents chicken, bowls, pizza, etc. from silently falling back to the
// generic burger/fries/soda graphics.
const visualOwners = new Map();
for (const candidate of INTENTS) {
  const signature = JSON.stringify([
    ...candidate.visual.before,
    "→",
    ...candidate.visual.after,
  ]);
  const existing = visualOwners.get(signature);
  if (existing) {
    throw new Error(
      `Duplicate visual set: ${existing} and ${candidate.id}. Each variant must use meal-specific assets.`,
    );
  }
  visualOwners.set(signature, candidate.id);
}

for (const asset of [...intent.visual.before, ...intent.visual.after]) {
  if (!existsSync(path.join(root, "public", asset))) {
    throw new Error(`Missing visual asset for ${intent.id}: public/${asset}`);
  }
}

const captions = {
  version: `variant-${intent.id}`,
  notes:
    "Timings locked to scripts/lib/speakingMap.mjs (0718 visual mouth/gesture analysis). left=fat, right=fit.",
  captions: LINE_WINDOWS.map((win, i) => {
    const text = intent.script[i].text;
    const words = text.split(/\s+/).filter(Boolean);
    const emphasis = words
      .filter(
        (w) =>
          w.length > 4 ||
          /mac|coke|fries|wrong|outbite|calories|whopper|baconator|bowl|nuggets|better|same/i.test(
            w,
          ),
      )
      .slice(0, 2)
      .map((w) => w.replace(/[^\w'−-]/g, ""));
    return {
      id: `cap-${String(i + 1).padStart(2, "0")}`,
      speaker: win.speaker,
      startSeconds: win.start,
      endSeconds: win.end,
      text,
      emphasis,
    };
  }),
};

const storyHooks = [
  "KEEP THE CRAVING",
  "ORDER THIS INSTEAD",
  "OUTBITE FOUND IT",
];

// Result-first creative: every spoken calorie claim refers to the complete
// before/after delta. Incremental −210/−200 badges while VO says −410 create
// distrust, so all three visual chapters now reinforce the same exact result.
const mealBeats = BEAT_WINDOWS.map(([start, end], i) => {
  return {
    id: `beat-${i + 1}`,
    startSeconds: start,
    endSeconds: end,
    hook: storyHooks[i],
    deltaLabel: `−${intent.saved} cal`,
    left: {
      name: intent.baseline.name,
      items: intent.baseline.items,
      calories: intent.baseline.calories,
      protein: intent.baseline.protein,
      highlight: false,
      badge: "Impulse",
    },
    right: {
      name: intent.optimized.name,
      items: intent.optimized.items,
      calories: intent.optimized.calories,
      protein: intent.optimized.protein,
      highlight: true,
      badge: `−${intent.saved} cal`,
    },
    beforeImages: intent.visual.before,
    afterImages: intent.visual.after,
  };
});

const campaign = {
  ...baseCampaign,
  id: intent.id,
  title: `${intent.baseline.name} vs ${intent.optimized.name}`,
  meals: {
    left: {
      name: intent.baseline.name,
      items: intent.baseline.items,
      calories: intent.baseline.calories,
      protein: intent.baseline.protein,
      highlight: false,
      badge: "Impulse",
    },
    right: {
      name: intent.optimized.name,
      items: intent.optimized.items,
      calories: intent.optimized.calories,
      protein: intent.optimized.protein,
      highlight: true,
      badge: `−${intent.saved} cal`,
    },
  },
  mealBeats,
  appDemo: {
    ...baseCampaign.appDemo,
    startSeconds: 25.2,
    endSeconds: 29.5,
    lines: [
      "YOU PICKED → IMPROVED",
      intent.optimized.name,
      "SAY THIS AT THE COUNTER",
    ],
  },
  audio: {
    voiceDir: `audio/.generated/${intent.id}/`,
    useVoiceOverWhenPresent: true,
    musicBed: baseCampaign.audio?.musicBed,
    lines: LINE_WINDOWS.map((win, i) => ({
      id: win.id,
      file: `audio/.generated/${intent.id}/${win.id}.wav`,
      startSeconds: win.start,
      endSeconds: win.end,
      enabled: false,
      text: intent.script[i].text,
      speaker: win.speaker,
    })),
  },
  disclaimer: `Nutrition figures from official chain guides for marketing demo. Always verify with the restaurant and your own goals. Outbite is not affiliated with ${intent.chain}.`,
};

const outDir = path.join(root, "src/data/variants");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

writeFileSync(
  path.join(outDir, `${intent.id}.campaign.json`),
  JSON.stringify(campaign, null, 2),
);
writeFileSync(
  path.join(outDir, `${intent.id}.captions.json`),
  JSON.stringify(captions, null, 2),
);

console.log(`Wrote variant ${intent.id} (speakingMap-locked timings)`);
