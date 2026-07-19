import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamilies } from "./FontLoader";
import { findActivePage, buildKaraokePages } from "../lib/karaokeCaptions";
import { theme } from "../styles/theme";
import type { Campaign, CaptionsFile } from "../types";

type Props = {
  campaign: Campaign;
  captions: CaptionsFile;
};

/**
 * CapCut / TikTok karaoke captions — 2 words per page, centered, wrap-safe.
 * Active word highlight. No glass panel, no IMPULSE/OUTBITE chips on text.
 */
export const EnglishCaptions: React.FC<Props> = ({ campaign, captions }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const timeMs = (frame / fps) * 1000;
  const afterCta = timeMs >= campaign.cta.startSeconds * 1000;

  const pages = useMemo(
    () => buildKaraokePages(captions.captions, 2),
    [captions.captions],
  );

  const page = afterCta ? null : findActivePage(pages, timeMs);

  const pageStartFrame = page ? Math.round((page.startMs / 1000) * fps) : 0;
  const enter = spring({
    frame: page ? frame - pageStartFrame : 0,
    fps,
    config: { damping: 14, stiffness: 220, mass: 0.45 },
  });
  const opacity = page ? interpolate(enter, [0, 1], [0, 1]) : 0;
  const scale = page ? interpolate(enter, [0, 1], [0.92, 1]) : 1;

  if (!page) {
    return null;
  }

  const safe = campaign.regions.captionSafe;
  const padX = width * 0.04;
  const top = height * safe.top;
  const boxHeight = height * (safe.bottom - safe.top);
  const boxWidth = width * (safe.right - safe.left);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: width * safe.left,
          width: boxWidth,
          top,
          height: boxHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: padX,
          paddingRight: padX,
          boxSizing: "border-box",
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            columnGap: "0.28em",
            rowGap: "0.08em",
            textAlign: "center",
            fontFamily: fontFamilies.caption,
            fontSize: 54,
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: -0.6,
            textTransform: "uppercase",
            color: theme.brand.white,
            WebkitTextStroke: "5px #000000",
            paintOrder: "stroke fill",
            textShadow: "0 4px 0 rgba(0,0,0,0.65)",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {page.tokens.map((token) => {
            const isActive =
              timeMs >= token.fromMs && timeMs < token.toMs;
            const tokenFrame = Math.round((token.fromMs / 1000) * fps);
            const pop = spring({
              frame: isActive ? frame - tokenFrame : 0,
              fps,
              config: { damping: 11, stiffness: 280, mass: 0.35 },
            });
            const wordScale = isActive
              ? interpolate(pop, [0, 1], [1, 1.08])
              : 1;

            const color = isActive
              ? theme.brand.captionHighlight
              : token.emphasize
                ? theme.brand.lime
                : theme.brand.white;

            return (
              <span
                key={`${token.fromMs}-${token.text}`}
                style={{
                  display: "inline-block",
                  color,
                  transform: `scale(${wordScale})`,
                  WebkitTextStroke: "5px #000000",
                  paintOrder: "stroke fill",
                  maxWidth: "100%",
                }}
              >
                {token.text.trim()}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
