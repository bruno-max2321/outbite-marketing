import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../styles/theme";
import type { Campaign } from "../types";

type Props = {
  campaign: Campaign;
};

/**
 * Compact phone UI moment on the Outbite side — keeps faces readable.
 */
export const AppDemo: React.FC<Props> = ({ campaign }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const demo = campaign.appDemo;

  if (!demo.enabled) {
    return null;
  }

  const start = Math.round(demo.startSeconds * fps);
  const end = Math.round(demo.endSeconds * fps);
  if (frame < start || frame >= end) {
    return null;
  }

  const local = frame - start;
  const enter = spring({
    frame: local,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.8 },
  });
  const exitLen = 12;
  const exitOpacity = interpolate(frame, [end - exitLen, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(enter, exitOpacity);
  const y = interpolate(enter, [0, 1], [28, 0]);

  const phoneW = 210;
  const phoneH = 340;
  const rightBias = demo.side === "right";

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: height * 0.4,
          left: rightBias ? width * 0.6 : width * 0.1,
          width: phoneW,
          height: phoneH,
          opacity,
          transform: `translateY(${y}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
          borderRadius: 22,
          background: theme.brand.forest,
          padding: 8,
          border: "1.5px solid rgba(200,240,108,0.35)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 16,
            background: theme.gradients.atmosphere,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            padding: 14,
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 20,
              fontWeight: 800,
              color: theme.brand.forest,
            }}
          >
            {campaign.brand.name}
          </div>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 14,
              fontWeight: 700,
              color: theme.brand.greenDeep,
            }}
          >
            {demo.headline}
          </div>

          {demo.lines.map((line, i) => {
            const stepIn = spring({
              frame: local - 8 - i * 12,
              fps,
              config: theme.motion.spring,
            });
            return (
              <div
                key={line}
                style={{
                  opacity: stepIn,
                  transform: `translateX(${interpolate(stepIn, [0, 1], [12, 0])}px)`,
                  padding: "9px 11px",
                  borderRadius: 9,
                  background:
                    i === demo.lines.length - 1
                      ? theme.brand.green
                      : "rgba(20,32,24,0.08)",
                  color:
                    i === demo.lines.length - 1
                      ? theme.brand.white
                      : theme.brand.ink,
                  fontFamily: theme.fonts.body,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
