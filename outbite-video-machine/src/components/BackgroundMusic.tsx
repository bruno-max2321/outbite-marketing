import React from "react";
import {
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import type { Campaign } from "../types";

type Props = {
  campaign: Campaign;
};

/**
 * Soft chill bed under dialogue. File is already trimmed to plate length;
 * Remotion Sequence also clips to composition duration as a safety net.
 */
export const BackgroundMusic: React.FC<Props> = ({ campaign }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const bed = campaign.audio.musicBed;

  if (!bed?.enabled || !bed.file) {
    return null;
  }

  const volume = Math.min(Math.max(bed.volume ?? 0.12, 0), 1);
  const fadeInFrames = Math.round((bed.fadeInSeconds ?? 0.6) * fps);
  const fadeOutFrames = Math.round((bed.fadeOutSeconds ?? 1.4) * fps);

  return (
    <Sequence from={0} durationInFrames={durationInFrames} name="music-bed">
      <Audio
        src={staticFile(bed.file)}
        volume={(frame) => {
          const fadeIn = interpolate(frame, [0, fadeInFrames], [0, volume], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const fadeOut = interpolate(
            frame,
            [durationInFrames - fadeOutFrames, durationInFrames - 1],
            [volume, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );
          return Math.min(fadeIn, fadeOut);
        }}
      />
    </Sequence>
  );
};
