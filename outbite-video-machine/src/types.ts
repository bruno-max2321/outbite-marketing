export type Speaker = "left" | "right" | "cta";

export type Caption = {
  id: string;
  speaker: Speaker;
  startSeconds: number;
  endSeconds: number;
  text: string;
  emphasis?: string[];
};

export type CaptionsFile = {
  version: string;
  captions: Caption[];
};

export type MealSide = {
  name: string;
  items: string[];
  calories: number;
  protein: number;
  highlight: boolean;
  badge: string;
};

export type Campaign = {
  id: string;
  version: string;
  title: string;
  brand: {
    name: string;
    tagline: string;
    primaryColor: string;
    accentColor: string;
    darkColor: string;
    lightColor: string;
  };
  video: {
    source: string;
    width: number;
    height: number;
    fps: number;
    durationSeconds: number;
    durationInFrames: number;
    muteOriginalAudio: boolean;
    originalAudioVolume: number;
    sourceNative?: {
      width: number;
      height: number;
      fps: number;
      durationSeconds: number;
      frames: number;
      notes?: string;
    };
  };
  overlays?: {
    /** Opaque Chinese-subtitle cover — keep false on clean-plate footage */
    subtitleCover?: boolean;
    foodHeaderStyle?: "opaque" | "glass";
  };
  characters: {
    left: { id: string; label: string; shortLabel: string };
    right: { id: string; label: string; shortLabel: string };
  };
  meals: {
    left: MealSide;
    right: MealSide;
  };
  nutritionNote: string;
  disclaimer: string;
  cta: {
    headline: string;
    subhead: string;
    button: string;
    startSeconds: number;
    endSeconds: number;
  };
  regions: {
    foodHeader: { top: number; bottom: number; left: number; right: number };
    subtitlePanel: { top: number; bottom: number; left: number; right: number };
    captionSafe: { left: number; right: number; top: number; bottom: number };
    speakerLabels: { leftX: number; rightX: number; y: number };
  };
  appDemo: {
    enabled: boolean;
    startSeconds: number;
    endSeconds: number;
    side: "left" | "right";
    headline: string;
    lines: string[];
  };
  audio: {
    voiceDir: string;
    lines: Array<{
      id: string;
      file: string;
      startSeconds: number;
      endSeconds: number;
      enabled: boolean;
    }>;
    useVoiceOverWhenPresent: boolean;
  };
};

export type OutbiteComparisonProps = {
  campaign: Campaign;
  captions: CaptionsFile;
  showAppDemo: boolean;
  showEndCard: boolean;
  showDisclaimer: boolean;
};
