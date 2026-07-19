/**
 * CANONICAL speaking map for source plate 0718-1080.mp4
 * -------------------------------------------------------
 * From frame analysis (5fps + 10fps): mouth/hands + burned-in Chinese cues.
 * Plate audio is silent (−91 dB) — visual only.
 *
 * RULES (TikTok retention — do not break):
 * 1. VO + karaoke ONLY inside the active speaker turn.
 * 2. Line start >= turn.start + LEAD_IN (never highlight before mouth/gesture).
 * 3. Line end <= turn.end - TRAIL (never cut mid-sentence into the other body).
 * 4. Max atempo MAX_ATEMPO. If TTS still overflows → SHORTEN copy (never steal
 *    the next speaker's window).
 * 5. left = fat / Impulse (no cap). right = fit / Outbite (backward cap).
 * 6. One generated utterance per visual turn. Fragmenting a turn into tiny
 *    files creates robotic resets in pitch, cadence, and room tone.
 */

export const LEAD_IN = 0.12;
export const TRAIL = 0.1;
export const MAX_ATEMPO = 1.06;

/** High-level speaker turns on the 0718 plate (pre-CTA). */
export const SPEAKER_TURNS = [
  { speaker: "right", start: 0.18, end: 6.45, note: "Fit opens" },
  { speaker: "left", start: 6.9, end: 9.9, note: "Fat replies (~7.5–8.5 mouth/hand)" },
  { speaker: "right", start: 10.2, end: 15.9, note: "Fit explains" },
  { speaker: "left", start: 16.2, end: 21.6, note: "Fat doubts (~16.5–19)" },
  { speaker: "right", start: 22.0, end: 29.9, note: "Fit upgrade" },
  { speaker: "left", start: 30.1, end: 33.85, note: "Fat concedes" },
];

/**
 * One conversational utterance per visual turn, sized for neural TTS at
 * ≤1.06× inside each window.
 * default `text` = mcdonalds-big-mac baseline (variants override in intents).
 */
export const LINE_WINDOWS = [
  // HOOK: result first; chain/core item + exact full calorie delta by 3s.
  {
    id: "turn-01",
    speaker: "right",
    start: 0.3,
    end: 6.35,
    text: "Cut four hundred ten calories at McDonald's and keep the Big Mac. Here's the order.",
  },
  // OBJECTION: short craving-preservation question.
  {
    id: "turn-02",
    speaker: "left",
    start: 7.05,
    end: 9.75,
    text: "I still get the Big Mac?",
  },
  // PROOF: exact order and before → after calorie totals.
  {
    id: "turn-03",
    speaker: "right",
    start: 10.35,
    end: 15.75,
    text: "Big Mac, medium fries, Diet Coke. Twelve eighty down to eight seventy.",
  },
  // A-HA: restate exact delta and ask how.
  {
    id: "turn-04",
    speaker: "left",
    start: 16.4,
    end: 21.45,
    text: "Same burger, four hundred ten less? Bro, how?",
  },
  // PRODUCT: stable across variants; explain data, swaps, and order script.
  {
    id: "turn-05",
    speaker: "right",
    start: 22.15,
    end: 29.75,
    text: "I use Outbite. It finds the lowest calorie swaps that still taste good, then gives you the exact order.",
  },
  // CTA: explicit conversion action before the visual end card.
  {
    id: "turn-06",
    speaker: "left",
    start: 30.25,
    end: 33.8,
    text: "I'm downloading Outbite before lunch.",
  },
];

export const CTA_START = 34.0;

export const BEAT_WINDOWS = [
  [0.0, 10.2],
  [10.2, 22.0],
  [22.0, 34.0],
];

export function assertLinesInsideTurns(lines = LINE_WINDOWS, turns = SPEAKER_TURNS) {
  for (const line of lines) {
    const turn = turns.find(
      (t) =>
        t.speaker === line.speaker &&
        line.start >= t.start - 0.001 &&
        line.end <= t.end + 0.001,
    );
    if (!turn) {
      throw new Error(
        `Line ${line.id} (${line.speaker} ${line.start}-${line.end}) escapes its speaker turn`,
      );
    }
  }
}

assertLinesInsideTurns();
