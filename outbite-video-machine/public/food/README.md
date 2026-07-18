# Food assets

Placeholder SVGs live here for reference. The composition currently draws **inline** placeholders via `src/components/FoodPlaceholders.tsx` (reliable in Remotion renders).

To use real photos:

1. Add PNGs with transparency, e.g. `impulse-meal.png`, `outbite-meal.png`
2. Swap `FoodPlaceholder` usage in `FoodComparison.tsx` for Remotion `<Img src={staticFile("food/...")} />`

Workspace note: `ChatGPT Image 18 jul 2026, 05_33_03 p.m..png` is a **wall texture plate**, not meal comparison art — leave it out of this folder.
