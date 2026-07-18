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
import { FoodPlaceholder, OutbiteMark } from "./FoodPlaceholders";

type Props = {
  campaign: Campaign;
};

/**
 * Compact top food strip — source has no burned-in Chinese food labels,
 * so we keep a slim brand + meal comparison without a heavy opaque header.
 */
export const FoodComparison: React.FC<Props> = ({ campaign }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const region = campaign.regions.foodHeader;
  const regionHeight = height * (region.bottom - region.top);
  const enter = spring({
    frame,
    fps,
    config: theme.motion.spring,
  });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [-18, 0]);

  const left = campaign.meals.left;
  const right = campaign.meals.right;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: height * region.top,
          left: 0,
          width,
          height: regionHeight,
          opacity,
          transform: `translateY(${y}px)`,
          background:
            "linear-gradient(180deg, rgba(242,247,243,0.94) 0%, rgba(242,247,243,0.82) 70%, rgba(242,247,243,0) 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 14,
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <OutbiteMark style={{ width: 30, height: 30 }} />
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: -0.4,
              color: theme.brand.forest,
            }}
          >
            {campaign.brand.name}
          </div>
        </div>

        <div
          style={{
            width: width - 36,
            display: "flex",
            alignItems: "stretch",
            gap: 10,
          }}
        >
          <MealChip
            meal={left}
            side="left"
            label={campaign.characters.left.shortLabel}
          />
          <div
            style={{
              width: 2,
              marginBlock: 8,
              background:
                "linear-gradient(180deg, transparent, rgba(20,32,24,0.28), transparent)",
            }}
          />
          <MealChip
            meal={right}
            side="right"
            label={campaign.characters.right.shortLabel}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MealChip: React.FC<{
  meal: Campaign["meals"]["left"];
  side: "left" | "right";
  label: string;
}> = ({ meal, side, label }) => {
  const isOutbite = side === "right";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 12,
        background: isOutbite
          ? "rgba(31,166,74,0.14)"
          : "rgba(27,36,32,0.08)",
        border: isOutbite
          ? "1.5px solid rgba(31,166,74,0.45)"
          : "1px solid rgba(27,36,32,0.1)",
      }}
    >
      <div
        style={{
          width: 52,
          height: 40,
          borderRadius: 8,
          overflow: "hidden",
          flexShrink: 0,
          background: isOutbite ? "#C8F06C" : "#D9D2C4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FoodPlaceholder side={side} style={{ width: "90%", height: "90%" }} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            color: isOutbite ? theme.brand.greenDeep : theme.brand.ink,
            opacity: 0.75,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 15,
            fontWeight: 700,
            color: theme.brand.ink,
            lineHeight: 1.15,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {meal.name}
        </div>
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 14,
            fontWeight: 800,
            color: isOutbite ? theme.brand.greenDeep : theme.brand.ink,
          }}
        >
          {meal.calories} cal
          <span
            style={{
              marginLeft: 6,
              fontWeight: 600,
              fontSize: 12,
              opacity: 0.7,
            }}
          >
            {meal.badge}
          </span>
        </div>
      </div>
    </div>
  );
};
