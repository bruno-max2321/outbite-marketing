import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../styles/theme";
import type { Campaign, CaptionsFile, Speaker } from "../types";

type Props = {
  campaign: Campaign;
  captions: CaptionsFile;
};

function renderEmphasized(text: string, emphasis: string[] = []) {
  if (!emphasis.length) {
    return text;
  }

  const pattern = new RegExp(
    `(${emphasis
      .map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})`,
    "gi",
  );
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    const hit = emphasis.some(
      (e) => e.toLowerCase() === part.toLowerCase(),
    );
    if (!hit) {
      return <React.Fragment key={i}>{part}</React.Fragment>;
    }
    return (
      <span
        key={i}
        style={{
          color: theme.brand.lime,
          fontWeight: 800,
        }}
      >
        {part}
      </span>
    );
  });
}

function accentFor(speaker: Speaker) {
  if (speaker === "left") {
    return "rgba(217,119,6,0.95)";
  }
  if (speaker === "right") {
    return theme.brand.green;
  }
  return theme.brand.lime;
}

function chipLabel(speaker: Speaker, campaign: Campaign) {
  if (speaker === "left") {
    return campaign.characters.left.shortLabel.toUpperCase();
  }
  if (speaker === "right") {
    return campaign.characters.right.shortLabel.toUpperCase();
  }
  return "OUTBITE";
}

export const EnglishCaptions: React.FC<Props> = ({ campaign, captions }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const seconds = frame / fps;
  const safe = campaign.regions.captionSafe;

  const active = useMemo(
    () =>
      captions.captions.find(
        (c) => seconds >= c.startSeconds && seconds < c.endSeconds,
      ),
    [captions.captions, seconds],
  );

  if (!active) {
    return null;
  }

  const localStart = Math.round(active.startSeconds * fps);
  const enter = spring({
    frame: frame - localStart,
    fps,
    config: { damping: 16, stiffness: 140, mass: 0.6 },
  });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [10, 0]);

  const isLeft = active.speaker === "left";
  const isRight = active.speaker === "right";
  const justify = isLeft ? "flex-start" : isRight ? "flex-end" : "center";
  const textAlign = isLeft ? "left" : isRight ? "right" : "center";
  const panelShift = isLeft ? -18 : isRight ? 18 : 0;
  const accent = accentFor(active.speaker);

  const panelLeft = width * safe.left;
  const panelWidth = width * (safe.right - safe.left);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: panelLeft,
          top: height * safe.top,
          width: panelWidth,
          height: height * (safe.bottom - safe.top),
          display: "flex",
          alignItems: "center",
          justifyContent: justify,
          paddingInline: 10,
          opacity,
          transform: `translate(${panelShift}px, ${y}px)`,
        }}
      >
        <div
          style={{
            maxWidth: "92%",
            display: "flex",
            flexDirection: "column",
            alignItems: isLeft
              ? "flex-start"
              : isRight
                ? "flex-end"
                : "center",
            gap: 6,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexDirection: isRight ? "row-reverse" : "row",
            }}
          >
            <div
              style={{
                width: 4,
                height: 16,
                borderRadius: 2,
                background: accent,
              }}
            />
            <span
              style={{
                fontFamily: theme.fonts.body,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1.2,
                color: accent,
              }}
            >
              {chipLabel(active.speaker, campaign)}
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: theme.fonts.caption,
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1.22,
              color: theme.brand.white,
              textAlign,
              textShadow: "0 1px 0 rgba(0,0,0,0.35)",
            }}
          >
            {renderEmphasized(active.text, active.emphasis)}
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
