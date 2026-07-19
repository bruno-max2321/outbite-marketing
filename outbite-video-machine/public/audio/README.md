# Voice-over (ephemeral — do not store permanently)

**Studio default:** silent. Karaoke captions carry the dialogue.

**Mass production:** neural VO is generated on demand with Microsoft Edge TTS (`edge-tts`), fitted to caption windows, rendered, then **deleted** so your Mac disk doesn’t fill up with dozens of WAVs.

```bash
# Preview one variant with neural VO (temp files only)
npm run vo:generate -- --variant mcdonalds-big-mac
# …QC in Studio with props, then:
npm run vo:clean -- --variant mcdonalds-big-mac

# Produce all 5 unique videos (generate → render → wipe VO each time)
npm run render:batch
```

## Variants (each unique)

| id | Chain | Hook |
|----|-------|------|
| `mcdonalds-big-mac` | McDonald's | Fries + Diet Coke swaps (−410) |
| `chickfila-spicy-deluxe` | Chick-fil-A | Nuggets + salad (−980) |
| `wendys-baconator` | Wendy's | Keep burger, trim sides (−330) |
| `chipotle-chicken-burrito` | Chipotle | Bowl + half rice (−330) |
| `burgerking-whopper` | Burger King | Med fries + unsweet tea (−390) |

Scripts + voices live in `scripts/lib/intents.mjs` — edit there for new uniqueness, not by hoarding WAVs.

## Voices

- Outbite / fit: `en-US-AndrewMultilingualNeural` (warm, confident conversation)
- Impulse / fat: `en-US-BrianMultilingualNeural` (casual, approachable conversation)

The previous news/narration voices sounded robotic in dialogue. These
conversation-trained voices are generated once per complete speaker turn, with
consistent loudness and sentence timing metadata.

## Background music

Calm bed: `public/audio/music/chill-guy-theme.mp3`
(trimmed to the 0718 plate length ≈ 39.27s from the full 2:53 source).

Configured in `campaign.audio.musicBed` at low volume (~0.11) so dialogue stays
clear. Disable with `"enabled": false`.

## Rules

1. Never commit `public/audio/.generated/`
2. Never leave batch VO on disk — `render:batch` cleans automatically
3. Caption text === VO script (built from the same intent)
4. Each visual turn is one utterance; never fragment it into tiny TTS files
5. Neural sentence timing + estimated word timing keeps karaoke locked
6. Speed-up is capped at 1.06×; shorten copy instead of forcing cadence
