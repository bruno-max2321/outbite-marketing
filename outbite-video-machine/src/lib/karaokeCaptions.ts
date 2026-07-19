import type { Caption } from "../types";

/** One karaoke page: 2–3 words shown together. */
export type KaraokePage = {
  text: string;
  startMs: number;
  endMs: number;
  tokens: Array<{
    text: string;
    fromMs: number;
    toMs: number;
    emphasize: boolean;
  }>;
};

const EMPHASIS_WORDS = new Set(
  [
    "wrong",
    "mcdonald's",
    "mcdonalds",
    "big",
    "mac",
    "fries",
    "hundreds",
    "calories",
    "outbite",
    "goals",
    "diet",
    "coke",
    "410",
    "−410",
    "-410",
    "smarter",
    "craving",
    "order",
    "counter",
    "search",
  ].map((w) => w.toLowerCase()),
);

function tokenize(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function shouldEmphasize(word: string, emphasis: string[] = []): boolean {
  const clean = word.replace(/[^\w'−-]/g, "").toLowerCase();
  if (emphasis.some((e) => clean.includes(e.toLowerCase()) || e.toLowerCase().includes(clean))) {
    return true;
  }
  return EMPHASIS_WORDS.has(clean);
}

/**
 * Build TikTok-style pages from sentence-level captions.
 * Generated VO supplies sentence-anchored word timings; static captions fall
 * back to even timing so the composition remains usable without generated VO.
 */
export function buildKaraokePages(
  captions: Caption[],
  wordsPerPage = 3,
): KaraokePage[] {
  const pages: KaraokePage[] = [];

  for (const caption of captions) {
    const words = tokenize(caption.text);
    if (!words.length) continue;

    const startMs = caption.startSeconds * 1000;
    const endMs = caption.endSeconds * 1000;
    const span = Math.max(endMs - startMs, words.length * 80);
    const wordMs = span / words.length;
    const suppliedTimings =
      caption.wordTimings?.length === words.length
        ? caption.wordTimings
        : null;

    for (let i = 0; i < words.length; i += wordsPerPage) {
      const chunk = words.slice(i, i + wordsPerPage);
      const pageStart = suppliedTimings
        ? suppliedTimings[i].startSeconds * 1000
        : startMs + i * wordMs;
      const finalWordIndex = i + chunk.length - 1;
      const pageEnd = suppliedTimings
        ? suppliedTimings[finalWordIndex].endSeconds * 1000
        : startMs + Math.min(i + chunk.length, words.length) * wordMs;

      pages.push({
        text: chunk.join(" "),
        startMs: pageStart,
        endMs: Math.min(pageEnd, endMs),
        tokens: chunk.map((word, j) => {
          const wordIndex = i + j;
          const fromMs = suppliedTimings
            ? suppliedTimings[wordIndex].startSeconds * 1000
            : startMs + wordIndex * wordMs;
          const toMs = suppliedTimings
            ? suppliedTimings[wordIndex].endSeconds * 1000
            : startMs + (wordIndex + 1) * wordMs;
          return {
            // Leading spaces collapse inside scaled inline-block spans.
            // EnglishCaptions spaces words with flex gap instead.
            text: word,
            fromMs,
            toMs: Math.min(toMs, endMs),
            emphasize: shouldEmphasize(word, caption.emphasis),
          };
        }),
      });
    }
  }

  return pages;
}

export function findActivePage(
  pages: KaraokePage[],
  timeMs: number,
): KaraokePage | null {
  return (
    pages.find((p) => timeMs >= p.startMs && timeMs < p.endMs) ?? null
  );
}
