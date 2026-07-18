import React from "react";
import { Composition } from "remotion";
import { OutbiteComparison } from "./compositions/OutbiteComparison";
import campaign from "./data/campaign.json";
import captions from "./data/captions.json";
import type { Campaign, CaptionsFile, OutbiteComparisonProps } from "./types";

const campaignData = campaign as Campaign;
const captionsData = captions as CaptionsFile;

const defaultProps: OutbiteComparisonProps = {
  campaign: campaignData,
  captions: captionsData,
  showAppDemo: true,
  showEndCard: true,
  showDisclaimer: true,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OutbiteComparison"
        component={OutbiteComparison}
        durationInFrames={campaignData.video.durationInFrames}
        fps={campaignData.video.fps}
        width={campaignData.video.width}
        height={campaignData.video.height}
        defaultProps={defaultProps}
      />
      <Composition
        id="OutbiteComparison-NoDemo"
        component={OutbiteComparison}
        durationInFrames={campaignData.video.durationInFrames}
        fps={campaignData.video.fps}
        width={campaignData.video.width}
        height={campaignData.video.height}
        defaultProps={{
          ...defaultProps,
          showAppDemo: false,
        }}
      />
    </>
  );
};
