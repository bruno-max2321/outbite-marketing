import React from "react";
import { AbsoluteFill } from "remotion";
import { AppDemo } from "../components/AppDemo";
import { ChineseBlur } from "../components/ChineseBlur";
import { Disclaimer } from "../components/Disclaimer";
import { EndCard } from "../components/EndCard";
import { EnglishCaptions } from "../components/EnglishCaptions";
import { FontLoader } from "../components/FontLoader";
import { FoodComparison } from "../components/FoodComparison";
import { SourceVideo } from "../components/SourceVideo";
import { SpeakerLabel } from "../components/SpeakerLabel";
import { SubtitleCover } from "../components/SubtitleCover";
import { BackgroundMusic } from "../components/BackgroundMusic";
import { VoiceOver } from "../components/VoiceOver";
import { theme } from "../styles/theme";
import type { OutbiteComparisonProps } from "../types";

/**
 * Layer stack (bottom → top) — clean-plate 0718 (~39.27s @ 60fps):
 * left = fat/Impulse · right = fit/Outbite
 * 1. Source video (muted by default)
 * 2. Outbite It food hook (RevealHero/Morph timings + transparent PNGs)
 * 3. Optional soft caption backdrop (off in Version C)
 * 4. Chinese dialogue blur band (burned-in glyphs)
 * 5. Karaoke English captions (2–3 words, CapCut style) — same position
 * 6. Dual speaker labels (Impulse / Outbite)
 * 7. Optional Outbite It app demo (~23–30s, fit side)
 * 8. End card CTA (last ~5s)
 * 9. Disclaimer
 * + Soft music bed + VoiceOver sequences when WAV files exist
 */
export const OutbiteComparison: React.FC<OutbiteComparisonProps> = ({
  campaign,
  captions,
  showAppDemo,
  showEndCard,
  showDisclaimer,
}) => {
  return (
    <FontLoader>
      <AbsoluteFill
        style={
          {
            ...theme.cssVars,
            backgroundColor: theme.brand.forest,
          } as React.CSSProperties
        }
      >
        <SourceVideo campaign={campaign} />
        <FoodComparison campaign={campaign} />
        <SubtitleCover campaign={campaign} captions={captions} />
        <ChineseBlur campaign={campaign} />
        <EnglishCaptions campaign={campaign} captions={captions} />
        <SpeakerLabel campaign={campaign} captions={captions} />
        {showAppDemo ? <AppDemo campaign={campaign} /> : null}
        {showEndCard ? <EndCard campaign={campaign} /> : null}
        {showDisclaimer ? <Disclaimer campaign={campaign} /> : null}
        <BackgroundMusic campaign={campaign} />
        <VoiceOver campaign={campaign} />
      </AbsoluteFill>
    </FontLoader>
  );
};
