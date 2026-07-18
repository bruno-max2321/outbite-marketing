# Source footage

| File | Role |
|------|------|
| `0718.mp4` | Master plate — 2160×3840 @ 60fps, ~39.27s |
| `0718-1080.mp4` | **Active Remotion source** — 1080×1920 proxy (same timing/fps) |
| `original.mp4` | Archive of prior cut |

Composition reads `campaign.json` → `video.source` (currently `source/0718-1080.mp4`).

Regenerate the proxy after swapping masters:

```bash
ffmpeg -y -i public/source/0718.mp4 -vf scale=1080:1920 -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart public/source/0718-1080.mp4
```
