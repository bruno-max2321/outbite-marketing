# Outbite Video Machine

Remotion + TypeScript project that turns a clean split-screen comparison performance into an English **Outbite** promo.

**Project path:** `outbite-video-machine/`

**Active source (composition):** `public/source/0718-1080.mp4` — 1080×1920 proxy of `0718.mp4` for reliable Remotion renders.  
**Master:** `public/source/0718.mp4` (2160×3840). Left = **Impulse Choice**, right = **Outbite Choice**. No generative body transformation. Do not stigmatize body size in copy.

---

## Quick start

```bash
cd "c:\Users\PC\Desktop\outbite marketing\outbite-video-machine"
npm install
npm run studio
```

Studio opens `OutbiteComparison` — **1080×1920 @ 60fps**, **2356 frames / 39.266667s**.

### Render

```bash
npm run render              # full H.264 → out/outbite-comparison.mp4
npm run render:preview      # half-scale preview
npm run render:campaign     # variant script (scripts/render-variants.mjs)
```

Output codec: **H.264**, **yuv420p**, AAC audio.

---

## Source footage (0718 clean plate)

Replaced the old SaveTik download (~19s with burned-in Chinese food labels/cutouts/subtitles) with **`0718.mp4`**.

| Property | Value |
|----------|--------|
| Master | `public/source/0718.mp4` (2160×3840) |
| Composition source | `public/source/0718-1080.mp4` (1080×1920 proxy) |
| Native FPS / frames | 60 fps / 2356 |
| Duration | 39.266667s stream (39.288005s container) |
| Audio | AAC present but effectively silent |
| Plate | Clean top headroom; dialogue Chinese may appear lower — covered while English captions are active |

---

## What’s implemented

| Layer | Behavior |
|-------|----------|
| Source video | `public/source/0718-1080.mp4` (muted; near-silent AAC on master) |
| Food header | Compact glass strip (~0–14.5%) — brand + meal chips |
| Caption backdrop | Soft panel **only while a caption is active** (not a permanent Chinese cover) |
| English captions | Speaker-aligned + Impulse/Outbite chip (`captions.json` Version B) |
| Speaker labels | Dual chips; active side highlights |
| App demo | Compact phone UI ~23.2–29.8s on Outbite side |
| End card | Brand CTA **34.0–39.27s** (~5s) |
| Disclaimer | Bottom safe-area legal line |

Compositions in `src/Root.tsx`:

- `OutbiteComparison` — full stack
- `OutbiteComparison-NoDemo` — without app demo overlay

---

## Timing map (~39s)

| Beat | Seconds | Notes |
|------|---------|--------|
| Captions 01–10 | 0.15–30.21 | Dialogue beats (Impulse / Outbite) |
| Captions 11–12 | 30.21–34.0 | Impulse concedes |
| App demo | 23.2–29.8 | Overlaps Outbite pitch |
| End card | 34.0–39.27 | Strong CTA |

Speaker windows (approx):

| Seconds | Speaker |
|---------|---------|
| 0.00 – 6.27 | Outbite (right) |
| 6.27 – 10.04 | Impulse (left) |
| 10.04 – 16.06 | Outbite |
| 16.06 – 22.01 | Impulse |
| 22.01 – 30.21 | Outbite |
| 30.21 – 34.0 | Impulse |
| 34.0 – 39.27 | End card CTA |

---

## Execution order

1. `npm run inspect` — confirm duration/fps against `campaign.json`
2. `npm run studio` — QC overlay alignment
3. Swap placeholders (logo, food photos) when ready
4. Record VO → `npm run prepare-audio` → enable lines in `campaign.json`
5. `npm run render`

---

## Swap campaign data

- `src/data/campaign.json` — meals, labels, CTA, regions, overlays, audio map
- `src/data/captions.json` — timed English lines + emphasis

```json
"foodHeader": { "top": 0, "bottom": 0.145 }
"overlays.subtitleCover": true   // soft caption backdrop only (not a hard Chinese cover)
"overlays.foodHeaderStyle": "glass"
```

Set `"subtitleCover": false` to remove the backdrop entirely (captions stay readable via text shadow).

---

## Voice-over

Source audio is muted (and near-silent on 0718). Captions carry the story until VO lands.

See `public/audio/README.md` for the 12-line timing table matching Version B captions.

---

## Assets

| Asset | Location | Status |
|-------|----------|--------|
| Source 0718 master | `public/source/0718.mp4` | Kept (2160×3840) |
| Source 0718 proxy | `public/source/0718-1080.mp4` | **Active in composition** |
| Archive | `public/source/original.mp4` | Kept |
| Official Outbite logo | `public/branding/outbite-mark.svg` | Placeholder |
| Food photos | `public/food/` | Placeholder SVGs |
| Voice-over WAVs | `public/audio/line-0N.wav` | Missing |

> `ChatGPT Image 18 jul 2026, 05_33_03 p.m..png` is a **wall texture**, not food art — not wired into `public/food/`.

---

## Design notes

- Slim food comparison in headroom — no giant opaque 31% cover
- Captions lean left/right with accent + speaker chip
- Dual Impulse/Outbite labels; active side pops
- Theme: greens (`#1FA64A`, `#C8F06C`) + cool mint; Syne + Figtree
- Avoided: purple gradients, cream+terracotta, glow clutter

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run studio` | Remotion Studio |
| `npm run render` | Full campaign render |
| `npm run render:preview` | Faster half-scale preview |
| `npm run inspect` | ffprobe → composition numbers |
| `npm run prepare-audio` | Normalize VO to 48 kHz WAV |
| `npm run typecheck` | TypeScript check |

---

## QC checklist

- [ ] Compact food strip sits in headroom without crushing faces
- [ ] No permanent opaque “Chinese cover” panel on clean plate
- [ ] English captions readable; accent matches active speaker
- [ ] Impulse / Outbite chips highlight correctly
- [ ] App demo readable ~23–30s
- [ ] End card clear in last ~5s
- [ ] Source audio muted (or VO present and clean)
- [ ] Export 1080×1920, H.264, yuv420p, 60fps
- [ ] Nutrition disclaimer accurate for estimates

---

## Source probe (baked in)

From `ffprobe` on `0718.mp4`:

- **39.266667 s** video stream (**39.288005 s** container)
- Native **2160×3840**, **60 fps**, **2356 frames**
- Composition: **1080×1920 @ 60fps**, **2356 frames**
- H.264 + AAC 44.1 kHz (effectively silent)

Re-verify anytime with `npm run inspect`.
