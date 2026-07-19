# Outbite Video Machine

Remotion + TypeScript project that turns a clean split-screen comparison performance into an English **Outbite** promo.

**Project path:** `outbite-video-machine/`

**Active source (composition):** `public/source/0718-1080.mp4` — 1080×1920 proxy of `0718.mp4` for reliable Remotion renders.  
**Master:** `public/source/0718.mp4` (2160×3840). Left = **Impulse Choice**, right = **Outbite Choice**. No generative body transformation. Do not stigmatize body size in copy.

---

## Quick start

Windows requirements:

- Node.js 20+
- Python 3 (`python` available in PowerShell)
- FFmpeg available in `PATH`

```powershell
git clone https://github.com/bruno-max2321/outbite-marketing.git
cd outbite-marketing\outbite-video-machine
npm install
python -m pip install edge-tts
```

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
npm run render:batch        # all 5 variants → out/batch/
npm run render:batch -- --only wendys-baconator  # one variant only
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
| Caption backdrop | Off by default (`subtitleCover: false`) — viral karaoke needs no glass panel |
| English captions | CapCut-style karaoke 2–3 words, Montserrat Black + yellow highlight (`captions.json` Version C) |
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
| Captions Version C | 0.12–34.0 | Karaoke chunks; left=fat, right=fit |
| App demo | 23.2–29.8 | Outbite It UI lines on fit side |
| End card | 34.0–39.27 | Search OUTBITE CTA |

Speaker windows (you — left fat / right fit):

| Seconds | Side | Role |
|---------|------|------|
| 0.00 – 6.27 | Right (fit) | Outbite |
| 6.27 – 10.04 | Left (fat) | Impulse |
| 10.04 – 16.06 | Right (fit) | Outbite |
| 16.06 – 22.01 | Left (fat) | Impulse |
| 22.01 – 30.21 | Right (fit) | Outbite |
| 30.21 – 34.0 | Left (fat) | Impulse concedes |
| 34.0 – 39.27 | — | End card CTA |

Meal demo aligned to app `guiltyIntents`: Big Mac Meal **1280** → Big Mac · Med Fries · Diet Coke **870** (−410).

---

## Execution order

1. `npm run inspect` — confirm duration/fps against `campaign.json`
2. `npm run studio` — QC overlays (silent by default)
3. Optional neural VO preview: `npm run studio:vo -- --variant mcdonalds-big-mac` then refresh Studio
4. Mass-produce 5 unique videos: `npm run render:batch` (VO generated → rendered → deleted)
5. Clear preview VO: `npm run studio:vo -- --clear`

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

## Voice-over (mass production)

Source audio is muted. **Do not bake WAVs into the repo** — that saturates disk at scale.

- Neural VO via `edge-tts` on demand → `public/audio/.generated/` (gitignored, ephemeral)
- Each line is fitted into its caption window so karaoke stays locked
- 5 unique variants in `scripts/lib/intents.mjs` (different chains, scripts, voices)
- `npm run render:batch` generates → renders → **deletes** VO after each video

See `public/audio/README.md`.

---

## Assets

| Asset | Location | Status |
|-------|----------|--------|
| Source 0718 master | `public/source/0718.mp4` | Kept (2160×3840) |
| Source 0718 proxy | `public/source/0718-1080.mp4` | **Active in composition** |
| Archive | `public/source/original.mp4` | Kept |
| Official Outbite logo | `public/branding/outbite-logo.png` | Active |
| Food photos | `public/food/` | Meal-specific assets for all 5 variants |
| Voice-over | `public/audio/.generated/` | Ephemeral (never commit) |

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
