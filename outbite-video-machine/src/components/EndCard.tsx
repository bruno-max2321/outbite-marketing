import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../styles/theme";
import type { Campaign } from "../types";

type Props = {
  campaign: Campaign;
};

export const EndCard: React.FC<Props> = ({ campaign }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const start = Math.round(campaign.cta.startSeconds * fps);

  if (frame < start) {
    return null;
  }

  const local = frame - start;
  const enter = spring({
    frame: local,
    fps,
    config: { damping: 16, stiffness: 100, mass: 0.85 },
  });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const scale = interpolate(enter, [0, 1], [1.03, 1]);
  const titleY = interpolate(enter, [0, 1], [32, 0]);
  const ctaPop = spring({
    frame: local - 8,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.55 },
  });
  const pulse = interpolate(
    Math.sin(((frame - start) / fps) * Math.PI * 2.2),
    [-1, 1],
    [0.98, 1.02],
  );
  const holdGlow = interpolate(
    frame,
    [durationInFrames - Math.round(fps * 1.2), durationInFrames],
    [0, 0.12],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: theme.gradients.endCard,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.2 + holdGlow,
          backgroundImage:
            "radial-gradient(circle at 30% 40%, #C8F06C 0 1.5px, transparent 2px), radial-gradient(circle at 70% 70%, #ffffff 0 1px, transparent 2px)",
          backgroundSize: "42px 42px, 28px 28px",
        }}
      />

      <Img
        src={staticFile("branding/outbite-logo.png")}
        style={{
          width: 172,
          height: 172,
          objectFit: "contain",
          opacity: enter,
          transform: `translateY(${titleY}px)`,
          filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.24))",
        }}
      />

      <div
        style={{
          fontFamily: theme.fonts.display,
          fontSize: 96,
          fontWeight: 800,
          color: theme.brand.white,
          letterSpacing: -1.5,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {campaign.brand.name}
      </div>

      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 40,
          fontWeight: 700,
          color: theme.brand.lime,
          textAlign: "center",
          maxWidth: 860,
          lineHeight: 1.2,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {campaign.cta.headline}
      </div>

      <div
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 28,
          fontWeight: 500,
          color: "rgba(255,255,255,0.9)",
          transform: `translateY(${titleY}px)`,
        }}
      >
        {campaign.cta.subhead}
      </div>

      <div
        style={{
          marginTop: 22,
          opacity: ctaPop,
          transform: `scale(${interpolate(ctaPop, [0, 1], [0.9, 1]) * pulse})`,
          padding: "20px 48px",
          borderRadius: 14,
          background: theme.brand.lime,
          color: theme.brand.forest,
          fontFamily: theme.fonts.display,
          fontSize: 36,
          fontWeight: 800,
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        }}
      >
        {campaign.cta.button}
      </div>
    </AbsoluteFill>
  );
};
