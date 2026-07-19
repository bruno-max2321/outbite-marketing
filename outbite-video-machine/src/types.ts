export type Speaker = "left" | "right" | "cta";

export type Caption = {
  id: string;
  speaker: Speaker;
  startSeconds: number;
  endSeconds: number;
  text: string;
  emphasis?: string[];
  /** Word-level timing derived from neural TTS sentence boundaries. */
  wordTimings?: Array<{
    text: string;
    startSeconds: number;
    endSeconds: number;
  }>;
};

export type CaptionsFile = {
  version: string;
  notes?: string;
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

/** Timed upgrade beats — swap story across the cut (fries → drink → full). */
export type MealBeat = {
  id: string;
  startSeconds: number;
  endSeconds: number;
  hook: string;
  deltaLabel: string;
  left: MealSide;
  right: MealSide;
  beforeImages: string[];
  afterImages: string[];
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
    /** Soft glass caption backdrop behind English karaoke */
    subtitleCover?: boolean;
    /** Blur band over burned-in Chinese dialogue glyphs */
    chineseBlur?: boolean;
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
  /** Optional multi-swap storyboard for FoodComparison */
  mealBeats?: MealBeat[];
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
    /** Thin band covering burned-in Chinese dialogue under English captions */
    chineseBlur?: { top: number; bottom: number; left: number; right: number };
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
    /** Soft instrumental bed under VO — keep volume low vs dialogue. */
    musicBed?: {
      enabled: boolean;
      file: string;
      /** 0–1 Remotion volume. Dialogue-safe bed ≈ 0.10–0.14. */
      volume?: number;
      fadeInSeconds?: number;
      fadeOutSeconds?: number;
    };
  };
};

export type OutbiteComparisonProps = {
  campaign: Campaign;
  captions: CaptionsFile;
  showAppDemo: boolean;
  showEndCard: boolean;
  showDisclaimer: boolean;
};
