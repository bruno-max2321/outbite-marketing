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
 * Compact Outbite It chip — anchored bottom-right above captions so faces stay clear.
 */
export const AppDemo: React.FC<Props> = ({ campaign }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const demo = campaign.appDemo;
  const enabled = demo.enabled;

  const start = Math.round(demo.startSeconds * fps);
  const end = Math.round(demo.endSeconds * fps);
  const inWindow = enabled && frame >= start && frame < end;
  const local = frame - start;

  const enter = spring({
    frame: inWindow ? local : 0,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.8 },
  });
  const exitLen = 12;
  const exitOpacity = interpolate(frame, [end - exitLen, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (!inWindow) {
    return null;
  }

  const opacity = Math.min(enter, exitOpacity);
  const y = interpolate(enter, [0, 1], [36, 0]);
  const cardW = Math.min(340, width * 0.42);
  const cardH = 168;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          // Sit above caption band, far right — never over faces
          top: height * 0.52,
          right: width * 0.03,
          width: cardW,
          height: cardH,
          opacity,
          transform: `translateY(${y}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
          borderRadius: 16,
          background: "rgba(242,247,243,0.96)",
          padding: 12,
          border: "1.5px solid rgba(31,166,74,0.45)",
          boxShadow: "0 10px 28px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          gap: 7,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 16,
            fontWeight: 800,
            color: theme.brand.forest,
            lineHeight: 1,
          }}
        >
          {campaign.brand.name}
          <span
            style={{
              marginLeft: 8,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.8,
              color: theme.brand.greenDeep,
            }}
          >
            {demo.headline}
          </span>
        </div>

        {demo.lines.map((line, i) => {
          const stepIn = spring({
            frame: local - 6 - i * 10,
            fps,
            config: theme.motion.spring,
          });
          const isCta = i === demo.lines.length - 1;
          return (
            <div
              key={line}
              style={{
                opacity: stepIn,
                transform: `translateX(${interpolate(stepIn, [0, 1], [10, 0])}px)`,
                padding: isCta ? "8px 10px" : "5px 8px",
                borderRadius: 8,
                background: isCta ? theme.brand.green : "rgba(20,32,24,0.07)",
                color: isCta ? theme.brand.white : theme.brand.ink,
                fontFamily: theme.fonts.body,
                fontSize: isCta ? 12 : 13,
                fontWeight: 700,
                textAlign: isCta ? "center" : "left",
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
