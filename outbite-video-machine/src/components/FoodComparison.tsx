import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamilies } from "./FontLoader";
import { theme } from "../styles/theme";
import type { Campaign, MealBeat, MealSide } from "../types";

type Props = {
  campaign: Campaign;
};

function fallbackBeat(campaign: Campaign): MealBeat {
  return {
    id: "default",
    startSeconds: 0,
    endSeconds: campaign.cta.startSeconds,
    hook: "UPGRADE",
    deltaLabel: campaign.meals.right.badge,
    left: campaign.meals.left,
    right: campaign.meals.right,
    beforeImages: ["food/combo_meal_burger.png"],
    afterImages: [
      "food/burger_beef.png",
      "food/side_fries.png",
      "food/beverage.png",
    ],
  };
}

/**
 * Multi-beat food hook (Outbite It morph timings).
 * Cycles fries → drink → full upgrade so the message reads clearly.
 * Floating cutouts — no solid card boxes over faces/wall.
 */
export const FoodComparison: React.FC<Props> = ({ campaign }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const region = campaign.regions.foodHeader;
  const regionHeight = height * (region.bottom - region.top);
  const seconds = frame / fps;
  const visible = seconds < campaign.cta.startSeconds;

  const beats = useMemo(
    () =>
      campaign.mealBeats?.length
        ? campaign.mealBeats
        : [fallbackBeat(campaign)],
    [campaign],
  );

  const beatIndex = useMemo(() => {
    const i = beats.findIndex(
      (b) => seconds >= b.startSeconds && seconds < b.endSeconds,
    );
    return i >= 0 ? i : Math.max(0, beats.length - 1);
  }, [beats, seconds]);

  const beat = beats[beatIndex] ?? beats[0];
  const beatStartFrame = Math.round(beat.startSeconds * fps);

  const local = frame - beatStartFrame;
  const introDur = Math.round((420 / 1000) * fps);
  const revealDelay = Math.round((280 / 1000) * fps);

  const leftSpring = spring({
    frame: visible ? local : 0,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.65 },
    durationInFrames: introDur,
  });
  const rightSpring = spring({
    frame: visible ? local - revealDelay : 0,
    fps,
    config: { damping: 13, stiffness: 120, mass: 0.65 },
  });
  const badgeSpring = spring({
    frame: visible ? local - revealDelay - Math.round((220 / 1000) * fps) : 0,
    fps,
    config: { damping: 10, stiffness: 170, mass: 0.5 },
  });
  const foodBob = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.4),
    [-1, 1],
    [-4, 4],
  );

  if (!visible) {
    return null;
  }

  const saved = beat.left.calories - beat.right.calories;
  const colPad = 12;
  const arrowW = 52;
  const colWidth = (width - colPad * 2 - arrowW) / 2;

  const leftOpacity = interpolate(leftSpring, [0, 1], [0, 1]);
  const leftX = interpolate(leftSpring, [0, 1], [-28, 0]);
  const rightOpacity = interpolate(rightSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });
  const rightX = interpolate(rightSpring, [0, 1], [28, 0], {
    extrapolateLeft: "clamp",
  });
  const rightScale = interpolate(rightSpring, [0, 1], [0.9, 1], {
    extrapolateLeft: "clamp",
  });

  const sweep = interpolate(
    local,
    [0, Math.round((900 / 1000) * fps)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const beamX = interpolate(sweep, [0, 1], [-60, 60]);
  const beamOpacity = interpolate(sweep, [0, 0.12, 0.85, 1], [0, 1, 1, 0]);
  const arrowScale = interpolate(sweep, [0, 1], [0.55, 1]);
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.8, 1], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: height * region.top,
          left: 0,
          width,
          height: regionHeight,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 8,
          gap: 8,
          background:
            "linear-gradient(180deg, rgba(20,24,22,0.16) 0%, rgba(20,24,22,0.04) 65%, rgba(20,24,22,0) 100%)",
        }}
      >
        <div
          style={{
            opacity: leftOpacity,
            transform: `translateY(${interpolate(leftSpring, [0, 1], [-10, 0])}px)`,
            background: "#E8602C",
            padding: "8px 18px",
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              color: "#fff",
              fontFamily: fontFamilies.body,
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: 1.2,
            }}
          >
            {beat.hook}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.85)",
              fontFamily: fontFamilies.body,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {beatIndex + 1}/{beats.length}
          </span>
        </div>

        <div
          style={{
            width: width - colPad * 2,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 0,
            minHeight: regionHeight * 0.7,
          }}
        >
          <div
            style={{
              width: colWidth,
              opacity: leftOpacity,
              transform: `translateX(${leftX}px) translateY(${foodBob}px)`,
            }}
          >
            <MealSide
              variant="before"
              label="YOU PICKED"
              meal={beat.left}
              width={colWidth}
              images={beat.beforeImages}
            />
          </div>

          <div
            style={{
              width: arrowW,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "stretch",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 16,
                top: 40,
                bottom: 40,
                borderRadius: 10,
                background: "rgba(232,96,44,0.3)",
                opacity: beamOpacity,
                transform: `translateX(${beamX}px) rotate(6deg)`,
              }}
            />
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                background: "#E8602C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: Math.max(sweep, 0.35),
                transform: `scale(${arrowScale})`,
                boxShadow: "0 4px 12px rgba(232,96,44,0.5)",
                color: "#fff",
                fontSize: 24,
                fontWeight: 900,
                fontFamily: theme.fonts.body,
              }}
            >
              →
            </div>
          </div>

          <div
            style={{
              width: colWidth,
              opacity: rightOpacity,
              transform: `translateX(${rightX}px) scale(${rightScale}) translateY(${-foodBob}px)`,
            }}
          >
            <MealSide
              variant="after"
              label="IMPROVED"
              meal={beat.right}
              width={colWidth}
              images={beat.afterImages}
            />
          </div>
        </div>

        <div
          style={{
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#1A6B3C",
            padding: "11px 24px",
            borderRadius: 999,
            boxShadow: "0 6px 14px rgba(26,107,60,0.4)",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontFamily: fontFamilies.body,
              fontSize: 25,
              fontWeight: 900,
              letterSpacing: -0.3,
            }}
          >
            {beat.deltaLabel || (saved > 0 ? `−${saved} cal` : "")}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.82)",
              fontFamily: fontFamilies.body,
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: 1,
            }}
          >
            TOTAL SAVED
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MealSide: React.FC<{
  variant: "before" | "after";
  label: string;
  meal: MealSide;
  width: number;
  images: string[];
}> = ({ variant, label, meal, width, images }) => {
  const isAfter = variant === "after";
  const eyebrow = isAfter ? "#E8602C" : "#FF6B6B";

  return (
    <div
      style={{
        width,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: 4,
        }}
      >
        <div
          style={{
            fontFamily: fontFamilies.body,
            fontSize: 16,
            fontWeight: 900,
            letterSpacing: 1.1,
            color: eyebrow,
            WebkitTextStroke: "3px rgba(0,0,0,0.55)",
            paintOrder: "stroke fill",
          }}
        >
          {label}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 3,
            background: isAfter ? "#1A6B3C" : "rgba(0,0,0,0.55)",
            borderRadius: 8,
            padding: "4px 9px",
            transform: "rotate(-2deg)",
          }}
        >
          <span
            style={{
              fontFamily: fontFamilies.caption,
              fontSize: 28,
              fontWeight: 900,
              color: theme.brand.white,
              letterSpacing: -0.5,
            }}
          >
            {meal.calories.toLocaleString("en-US")}
          </span>
          <span
            style={{
              fontFamily: fontFamilies.body,
              fontSize: 14,
              fontWeight: 800,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            cal
          </span>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: 210,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {images.map((src, i) => {
          const solo = images.length === 1;
          const main = i === 0 && images.length > 1;
          return (
            <Img
              key={`${src}-${i}`}
              src={staticFile(src)}
              style={{
                width: solo ? "92%" : main ? "44%" : `${48 / (images.length - 1)}%`,
                height: solo ? "100%" : main ? "96%" : "78%",
                objectFit: "contain",
                filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.4))",
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          fontFamily: fontFamilies.body,
          fontSize: 18,
          fontWeight: 800,
          color: theme.brand.white,
          textAlign: "center",
          lineHeight: 1.15,
          textShadow: "0 2px 4px rgba(0,0,0,0.65)",
          maxWidth: "96%",
        }}
      >
        {meal.name}
      </div>
      <div
        style={{
          fontFamily: fontFamilies.body,
          fontSize: 15,
          fontWeight: 700,
          fontStyle: "italic",
          color: theme.brand.white,
          WebkitTextStroke: "3px #000",
          paintOrder: "stroke fill",
        }}
      >
        {meal.protein}g Protein
      </div>
    </div>
  );
};
