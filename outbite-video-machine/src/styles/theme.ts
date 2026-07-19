/**
 * Outbite brand theme — fresh food-tech.
 * Energetic greens + cool neutrals. Avoids purple, cream/terracotta, dark-mode default.
 */
export const theme = {
  brand: {
    name: "Outbite",
    green: "#1FA64A",
    greenDeep: "#0E6B2E",
    lime: "#C8F06C",
    mint: "#E8F6EC",
    forest: "#142018",
    ink: "#1B2420",
    chalk: "#F2F7F3",
    sand: "#E6E0D4",
    caution: "#D97706",
    /** LeanBites-style impulse / high-cal plaque */
    impulseRed: "#E11D2E",
    white: "#FFFFFF",
    /** CapCut / LeanBites active word — yellow punches on TikTok */
    captionHighlight: "#FFE600",
    panel: "rgba(20, 32, 24, 0.92)",
    panelSoft: "rgba(20, 32, 24, 0.78)",
  },
  fonts: {
    display: '"Syne", "Segoe UI", sans-serif',
    body: '"Figtree", "Segoe UI", sans-serif',
    /** Viral karaoke — Montserrat Black via FontLoader */
    caption: '"Montserrat", "Arial Black", Impact, sans-serif',
  },
  gradients: {
    atmosphere:
      "linear-gradient(165deg, #E8F6EC 0%, #F2F7F3 42%, #DCEFE2 100%)",
    headerWash:
      "linear-gradient(180deg, rgba(232,246,236,0.98) 0%, rgba(242,247,243,0.96) 70%, rgba(242,247,243,0.88) 100%)",
    /** Soft float over clean dark-wall headroom — fades out before faces */
    headerGlass:
      "linear-gradient(180deg, rgba(242,247,243,0.94) 0%, rgba(232,246,236,0.9) 52%, rgba(232,246,236,0.55) 78%, rgba(232,246,236,0) 100%)",
    endCard:
      "radial-gradient(ellipse at 50% 20%, #C8F06C 0%, #1FA64A 38%, #0E6B2E 78%, #142018 100%)",
    captionPanel:
      "linear-gradient(180deg, rgba(20,32,24,0.82) 0%, rgba(20,32,24,0.9) 100%)",
  },
  motion: {
    fadeIn: 8,
    spring: { damping: 18, stiffness: 120, mass: 0.7 },
  },
  cssVars: {
    "--ob-green": "#1FA64A",
    "--ob-green-deep": "#0E6B2E",
    "--ob-lime": "#C8F06C",
    "--ob-mint": "#E8F6EC",
    "--ob-forest": "#142018",
    "--ob-ink": "#1B2420",
    "--ob-chalk": "#F2F7F3",
    "--ob-panel": "rgba(20, 32, 24, 0.92)",
    "--ob-font-display": '"Syne", "Segoe UI", sans-serif',
    "--ob-font-body": '"Figtree", "Segoe UI", sans-serif',
  } as Record<string, string>,
} as const;

export type Theme = typeof theme;
