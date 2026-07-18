# Voice-over audio

Drop timed WAV files here for the **0718 / ~39.3s** cut. Captions in `src/data/captions.json` are the source of truth. End card covers CTA from **34.0s**.

| File | Timing (s) | Speaker | Script line |
|------|------------|---------|-------------|
| `line-01.wav` | 0.15 – 3.2 | Outbite (R) | Same restaurant. Same Big Mac. |
| `line-02.wav` | 3.2 – 6.27 | Outbite (R) | The side you pick changes everything. |
| `line-03.wav` | 6.27 – 10.04 | Impulse (L) | But the fries look so good… how do I even compare? |
| `line-04.wav` | 10.04 – 13.0 | Outbite (R) | Fries can add hundreds of extra calories. |
| `line-05.wav` | 13.0 – 16.06 | Outbite (R) | I scan the menu with Outbite first. |
| `line-06.wav` | 16.06 – 19.1 | Impulse (L) | How do I know what's better for my goals? |
| `line-07.wav` | 19.1 – 22.01 | Impulse (L) | Every option looks the same to me. |
| `line-08.wav` | 22.01 – 25.6 | Outbite (R) | Outbite recommends the best fit for you. |
| `line-09.wav` | 25.6 – 28.6 | Outbite (R) | Big Mac + baked potato — smarter pick. |
| `line-10.wav` | 28.6 – 30.21 | Outbite (R) | Same craving. Better choice. |
| `line-11.wav` | 30.21 – 33.2 | Impulse (L) | Okay… show me the smarter order. |
| `line-12.wav` | 33.2 – 34.0 | Impulse (L) | I'm listening. |

CTA (end card, no VO required): *Same restaurant. Smarter choice. Try Outbite.* — 34.0 – 39.27s

## Recommended recording path

1. Record dry VO (no music) at **48 kHz**, mono or stereo, WAV.
2. Trim each line to match caption windows in `src/data/captions.json`.
3. Normalize to about **-14 LUFS** with peaks under **-1 dBTP**.
4. Place files using the names above.
5. In `src/data/campaign.json`, set `"enabled": true` on each `audio.lines` entry you recorded.

Until VO exists, the composition **mutes source audio** and relies on English captions.
