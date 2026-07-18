import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../styles/theme";
import type { Campaign, CaptionsFile } from "../types";

type Props = {
  campaign: Campaign;
  captions?: CaptionsFile;
};

/**
 * Soft caption backdrop — only while a caption is active.
 * Not a permanent Chinese-text cover (0718 is a clean plate).
 * Set campaign.overlays.subtitleCover = false to disable entirely.
 */
export const SubtitleCover: React.FC<Props> = ({ campaign, captions }) => {
  if (campaign.overlays?.subtitleCover === false) {
    return null;
  }

  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const seconds = frame / fps;
  const r = campaign.regions.subtitlePanel;
  const padY = 8;

  const active = useMemo(
    () =>
      captions?.captions.find(
        (c) => seconds >= c.startSeconds && seconds < c.endSeconds,
      ),
    [captions?.captions, seconds],
  );

  if (!active) {
    return null;
  }

  const speaker = active.speaker;
  const shift = interpolate(
    speaker === "left" ? 0 : speaker === "right" ? 1 : 0.5,
    [0, 1],
    [-14, 14],
  );

  const accent =
    speaker === "left"
      ? "rgba(217,119,6,0.85)"
      : speaker === "right"
        ? "rgba(31,166,74,0.9)"
        : "rgba(200,240,108,0.75)";

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: width * r.left - 6,
          top: height * r.top - padY,
          width: width * (r.right - r.left) + 12,
          height: height * (r.bottom - r.top) + padY * 2,
          borderRadius: 16,
          background: theme.gradients.captionPanel,
          border: "1px solid rgba(242,247,243,0.08)",
          transform: `translateX(${shift}px)`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 5,
            left: speaker === "right" ? undefined : 0,
            right: speaker === "right" ? 0 : undefined,
            background: accent,
            ...(speaker === "cta"
              ? { left: 0, right: 0, width: "100%", height: 3, bottom: "auto" }
              : {}),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
