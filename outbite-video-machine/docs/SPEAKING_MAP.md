# 0718 Speaking Map (source of truth)

Plate: `public/source/0718-1080.mp4` (1080×1920 @ 60fps, 39.27s).
Original audio is silent (−91 dB). Timing is from **visual** analysis.

## Roles

| Side | Body | Look |
|------|------|------|
| `left` | Fat / Impulse | No cap, larger midsection |
| `right` | Fit / Outbite | Backward cap + glasses |

## Speaker turns (verified on frames)

| Turn | Speaker | Start → End | Visual cue |
|------|---------|-------------|------------|
| 1 | right | 0.18 → 6.45 | Fit gesturing from open |
| 2 | left | 6.90 → 9.90 | Fat hand up / mouth open (~7.5–8.5) |
| 3 | right | 10.20 → 15.90 | Fit explains |
| 4 | left | 16.20 → 21.60 | Fat doubts (~16.5–19) |
| 5 | right | 22.00 → 29.90 | Fit delivers upgrade |
| 6 | left | 30.10 → 33.85 | Fat concedes |
| CTA | — | 34.00+ | End card |

## Hard rules (retention)

1. Karaoke + VO only inside the active speaker turn.
2. Line start ≥ turn start + 0.12s (never highlight before mouth/gesture).
3. Line end ≤ turn end − 0.10s (never cut mid-sentence into the other body).
4. Max VO speed-up **1.06×**. If copy still overflows → **shorten script**, don’t steal the next turn.
5. Edit timings only in `scripts/lib/speakingMap.mjs`.
6. Generate one continuous utterance per visual turn. Never split a speaker's
   thought into tiny TTS files; each file resets cadence and sounds robotic.
7. Neural sentence boundaries drive captions; estimated word timing drives the
   karaoke highlight.
8. Any spoken calorie delta must equal the badge on screen. All three visual
   chapters use the complete baseline → optimized delta; never pair a partial
   swap badge (for example, −210) with the full spoken result (−410).
9. Burned-in Chinese on 0718 sits at ~0.762–0.799 height in two clusters
   (`x≈0.25–0.40` and `x≈0.65–0.75`). Use two compact blur patches, and place
   English karaoke on the same band (`captionSafe` ≈ blur Y) so the text
   itself helps hide the glyphs.

## Conversational windows

| Turn | Speaker | VO window | Purpose |
|------|---------|-----------|---------|
| 01 | right | 0.30–6.35 | result-first hook: craving + exact full delta |
| 02 | left | 7.05–9.75 | mention Outbite + craving objection |
| 03 | right | 10.35–15.75 | exact order + before/after calorie proof |
| 04 | left | 16.40–21.45 | repeat result + ask what Outbite does |
| 05 | right | 22.15–29.75 | official data + smarter swaps + exact order |
| 06 | left | 30.25–33.80 | explicit download CTA |

## Old map bugs (fixed)

- `6.27–10.04` was labeled left while fit was still talking → mid-sentence cut.
- `16.06` left start was early vs gesture at ~16.5.
- Long VO lines were atempo’d into wrong windows → highlight before speech.
- Thirteen isolated TTS snippets reset prosody on every phrase → replaced by
  six complete conversational turns.
- Blur was mounted only while captions were active → now continuous until CTA.
