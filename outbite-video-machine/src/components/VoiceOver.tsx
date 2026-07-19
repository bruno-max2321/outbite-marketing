import React from "react";
import {
  Audio,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import type { Campaign } from "../types";

type Props = {
  campaign: Campaign;
};

type VoLine = Campaign["audio"]["lines"][number];

/**
 * Plays VO only when lines are enabled AND files exist in the ephemeral
 * `.generated/` cache (created by `npm run vo:generate`, wiped after batch).
 * Studio stays silent by default — no robotic WAVs baked into the repo.
 */
export const VoiceOver: React.FC<Props> = ({ campaign }) => {
  const { fps } = useVideoConfig();

  if (!campaign.audio.useVoiceOverWhenPresent) {
    return null;
  }

  const active = campaign.audio.lines.filter((line) => line.enabled);
  if (active.length === 0) {
    return null;
  }

  return (
    <>
      {active.map((line) => (
        <VoSequence key={line.id} line={line} fps={fps} />
      ))}
    </>
  );
};

const VoSequence: React.FC<{ line: VoLine; fps: number }> = ({
  line,
  fps,
}) => {
  const from = Math.round(line.startSeconds * fps);
  const durationInFrames = Math.max(
    1,
    Math.round((line.endSeconds - line.startSeconds) * fps),
  );

  return (
    <Sequence from={from} durationInFrames={durationInFrames} name={line.id}>
      {/* Sequence clips playback to caption/VO window for sync */}
      <Audio src={staticFile(line.file)} />
    </Sequence>
  );
};
