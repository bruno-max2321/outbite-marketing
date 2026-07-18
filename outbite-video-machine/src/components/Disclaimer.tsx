import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { theme } from "../styles/theme";
import type { Campaign } from "../types";

type Props = {
  campaign: Campaign;
};

export const Disclaimer: React.FC<Props> = ({ campaign }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: width * 0.06,
          right: width * 0.06,
          bottom: height * 0.015,
          fontFamily: theme.fonts.body,
          fontSize: 15,
          fontWeight: 500,
          lineHeight: 1.3,
          color: "rgba(255,255,255,0.72)",
          textAlign: "center",
          textShadow: "0 1px 2px rgba(0,0,0,0.55)",
        }}
      >
        {campaign.disclaimer}
      </div>
    </AbsoluteFill>
  );
};
