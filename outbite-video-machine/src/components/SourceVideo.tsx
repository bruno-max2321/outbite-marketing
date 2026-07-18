import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import type { Campaign } from "../types";

type Props = {
  campaign: Campaign;
};

export const SourceVideo: React.FC<Props> = ({ campaign }) => {
  const volume = campaign.video.muteOriginalAudio
    ? 0
    : campaign.video.originalAudioVolume;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile(campaign.video.source)}
        volume={volume}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </AbsoluteFill>
  );
};
