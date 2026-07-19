import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Campaign } from "../types";

type Props = {
  campaign: Campaign;
};

/**
 * Two compact blur patches over the burned-in Chinese dialogue.
 * Source analysis: glyphs sit at y≈0.762–0.799, around x≈0.25–0.40
 * and x≈0.65–0.75. Keep the rest of the plate completely untouched.
 */
export const ChineseBlur: React.FC<Props> = ({ campaign }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const seconds = frame / fps;
  const enabled = campaign.overlays?.chineseBlur !== false;

  // Keep one uninterrupted cover over the dialogue section so silence
  // between speakers never causes a visible off/on flash.
  const duringDialogue = seconds < campaign.cta.startSeconds;

  if (!enabled || !duringDialogue) {
    return null;
  }

  const r = campaign.regions.chineseBlur ?? {
    left: 0.2,
    right: 0.8,
    top: 0.755,
    bottom: 0.805,
  };

  const patches = [
    { left: r.left, right: Math.min(r.left + 0.24, r.right) },
    { left: Math.max(r.right - 0.19, r.left), right: r.right },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {patches.map((patch, index) => {
        const left = width * patch.left;
        const top = height * r.top;
        const patchWidth = width * (patch.right - patch.left);
        const patchHeight = height * (r.bottom - r.top);

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left,
              top,
              width: patchWidth,
              height: patchHeight,
              overflow: "hidden",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, #000 52%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse at center, #000 52%, transparent 100%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -left,
                top: -top,
                width,
                height,
                filter: "blur(20px)",
                transform: "scale(1.08)",
                transformOrigin: `${left + patchWidth / 2}px ${top + patchHeight / 2}px`,
              }}
            >
              <OffthreadVideo
                src={staticFile(campaign.video.source)}
                volume={0}
                style={{ width, height, objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(74, 76, 78, 0.18)",
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
