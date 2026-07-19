import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../styles/theme";
import type { Campaign, CaptionsFile } from "../types";

type Props = {
  campaign: Campaign;
  captions: CaptionsFile;
};

/**
 * Persistent Impulse / Outbite chips — active speaker lights up; inactive dims.
 * Anchored above the caption panel so faces stay clear.
 */
export const SpeakerLabel: React.FC<Props> = ({ campaign, captions }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const seconds = frame / fps;
  const pos = campaign.regions.speakerLabels;

  const active = useMemo(
    () =>
      captions.captions.find(
        (c) =>
          (c.speaker === "left" || c.speaker === "right") &&
          seconds >= c.startSeconds &&
          seconds < c.endSeconds,
      ),
    [captions.captions, seconds],
  );

  const activeSide =
    active?.speaker === "left" || active?.speaker === "right"
      ? active.speaker
      : null;

  const intro = spring({
    frame,
    fps,
    config: theme.motion.spring,
  });
  const baseOpacity = interpolate(intro, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <SideChip
        label={campaign.characters.left.shortLabel}
        side="left"
        active={activeSide === "left"}
        style={{
          top: height * pos.y,
          left: width * pos.leftX,
          opacity: baseOpacity * (activeSide === "left" ? 1 : 0.42),
          transform: `scale(${activeSide === "left" ? 1.05 : 0.97})`,
        }}
      />
      <SideChip
        label={campaign.characters.right.shortLabel}
        side="right"
        active={activeSide === "right"}
        style={{
          top: height * pos.y,
          right: width * (1 - pos.rightX),
          opacity: baseOpacity * (activeSide === "right" ? 1 : 0.42),
          transform: `scale(${activeSide === "right" ? 1.05 : 0.97})`,
        }}
      />
    </AbsoluteFill>
  );
};

const SideChip: React.FC<{
  label: string;
  side: "left" | "right";
  active: boolean;
  style: React.CSSProperties;
}> = ({ label, side, active, style }) => {
  const isLeft = side === "left";
  const activeBg = isLeft
    ? "rgba(217,119,6,0.92)"
    : "rgba(31,166,74,0.95)";
  const idleBg = "rgba(20,32,24,0.42)";

  return (
    <div
      style={{
        position: "absolute",
        padding: "5px 10px",
        borderRadius: 6,
        background: active ? activeBg : idleBg,
        color: theme.brand.white,
        fontFamily: theme.fonts.body,
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: 0.6,
        textTransform: "uppercase",
        border: active
          ? `1px solid ${isLeft ? "rgba(255,220,160,0.45)" : "rgba(200,240,108,0.45)"}`
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: active ? "0 2px 10px rgba(0,0,0,0.18)" : "none",
        ...style,
      }}
    >
      {label}
    </div>
  );
};
