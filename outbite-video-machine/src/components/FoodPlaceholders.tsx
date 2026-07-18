import React from "react";

type Props = {
  side: "left" | "right";
  style?: React.CSSProperties;
};

/** Inline SVG placeholders — reliable in Remotion (no Img decode issues). */
export const FoodPlaceholder: React.FC<Props> = ({ side, style }) => {
  if (side === "left") {
    return (
      <svg viewBox="0 0 320 240" style={style} aria-label="Impulse meal placeholder">
        <rect width="320" height="240" rx="16" fill="#D9D2C4" />
        <ellipse cx="120" cy="90" rx="58" ry="22" fill="#D4A574" />
        <rect x="66" y="90" width="108" height="18" rx="6" fill="#8B4513" />
        <rect x="70" y="108" width="100" height="14" rx="5" fill="#F2C14E" />
        <ellipse cx="120" cy="128" rx="54" ry="16" fill="#C4894A" />
        <rect x="200" y="70" width="14" height="70" rx="4" fill="#F0C14A" />
        <rect x="218" y="62" width="14" height="78" rx="4" fill="#E8B03A" />
        <rect x="236" y="74" width="14" height="66" rx="4" fill="#F5CB5C" />
        <rect x="194" y="130" width="64" height="28" rx="6" fill="#C0392B" />
        <text
          x="160"
          y="200"
          textAnchor="middle"
          fontFamily="Figtree, sans-serif"
          fontSize="18"
          fontWeight="700"
          fill="#1B2420"
        >
          PLACEHOLDER · Fries
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 240" style={style} aria-label="Outbite meal placeholder">
      <rect width="320" height="240" rx="16" fill="#BFE8C8" />
      <ellipse cx="120" cy="90" rx="58" ry="22" fill="#D4A574" />
      <rect x="66" y="90" width="108" height="18" rx="6" fill="#8B4513" />
      <rect x="70" y="108" width="100" height="14" rx="5" fill="#F2C14E" />
      <ellipse cx="120" cy="128" rx="54" ry="16" fill="#C4894A" />
      <ellipse cx="230" cy="112" rx="42" ry="28" fill="#E8C27A" />
      <ellipse cx="230" cy="108" rx="28" ry="12" fill="#F5E6C8" />
      <path
        d="M210 100c8-10 32-10 40 0"
        stroke="#1FA64A"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <text
        x="160"
        y="200"
        textAnchor="middle"
        fontFamily="Figtree, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="#0E6B2E"
      >
        PLACEHOLDER · Potato
      </text>
    </svg>
  );
};

export const OutbiteMark: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => (
  <svg viewBox="0 0 120 120" style={style} aria-label="Outbite mark">
    <rect width="120" height="120" rx="28" fill="#1FA64A" />
    <path
      d="M28 74c10-28 22-42 32-42s22 14 32 42"
      stroke="#C8F06C"
      strokeWidth="10"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="60" cy="42" r="10" fill="#F2F7F3" />
  </svg>
);
