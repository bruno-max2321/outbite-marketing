import React from "react";
import { AbsoluteFill } from "remotion";
import { AppDemo } from "../components/AppDemo";
import { Disclaimer } from "../components/Disclaimer";
import { EndCard } from "../components/EndCard";
import { EnglishCaptions } from "../components/EnglishCaptions";
import { FontLoader } from "../components/FontLoader";
import { FoodComparison } from "../components/FoodComparison";
import { SourceVideo } from "../components/SourceVideo";
import { SpeakerLabel } from "../components/SpeakerLabel";
import { SubtitleCover } from "../components/SubtitleCover";
import { VoiceOver } from "../components/VoiceOver";
import { theme } from "../styles/theme";
import type { OutbiteComparisonProps } from "../types";

/**
 * Layer stack (bottom → top) — clean-plate 0718 (~39.27s @ 60fps):
 * 1. Source video (near-silent AAC; muted by default)
 * 2. Compact glass food header in open headroom
 * 3. Soft caption backdrop (only while a caption is active)
 * 4. English captions (speaker-aligned + Impulse/Outbite chip)
 * 5. Dual speaker labels
 * 6. Optional app demo (~23–30s, Outbite side)
 * 7. End card CTA (last ~5s)
 * 8. Disclaimer
 * + VoiceOver sequences when WAV files exist
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
        <EnglishCaptions campaign={campaign} captions={captions} />
        <SpeakerLabel campaign={campaign} captions={captions} />
        {showAppDemo ? <AppDemo campaign={campaign} /> : null}
        {showEndCard ? <EndCard campaign={campaign} /> : null}
        {showDisclaimer ? <Disclaimer campaign={campaign} /> : null}
        <VoiceOver campaign={campaign} />
      </AbsoluteFill>
    </FontLoader>
  );
};
