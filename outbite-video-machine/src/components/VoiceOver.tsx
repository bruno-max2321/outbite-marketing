import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Campaign } from "../types";

type Props = {
  campaign: Campaign;
};

/**
 * Plays enabled VO lines from campaign.json audio.lines (line-01..line-13 for 0718).
 * Until VO files exist, leave enabled=false (source already muted via SourceVideo).
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
      {active.map((line) => {
        const from = Math.round(line.startSeconds * fps);
        return (
          <Sequence
            key={line.id}
            from={from}
            durationInFrames={Math.max(
              1,
              Math.round((line.endSeconds - line.startSeconds) * fps),
            )}
            name={line.id}
          >
            <Audio src={staticFile(line.file)} />
          </Sequence>
        );
      })}
    </>
  );
};
