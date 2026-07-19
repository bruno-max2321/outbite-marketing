import React from "react";
import { Composition } from "remotion";
import { OutbiteComparison } from "./compositions/OutbiteComparison";
import campaign from "./data/campaign.json";
import captions from "./data/captions.json";
import studioOverride from "./data/studio-override.json";
import type { Campaign, CaptionsFile, OutbiteComparisonProps } from "./types";

const campaignData = campaign as Campaign;
const captionsData = captions as CaptionsFile;

type StudioOverrideFile =
  | { active: false }
  | ({ active: true } & OutbiteComparisonProps);

const override = studioOverride as StudioOverrideFile;

const defaultProps: OutbiteComparisonProps =
  override.active === true
    ? {
        campaign: override.campaign,
        captions: override.captions,
        showAppDemo: override.showAppDemo,
        showEndCard: override.showEndCard,
        showDisclaimer: override.showDisclaimer,
      }
    : {
        campaign: campaignData,
        captions: captionsData,
        showAppDemo: true,
        showEndCard: true,
        showDisclaimer: true,
      };

export const RemotionRoot: React.FC = () => {
  const { durationInFrames, fps, width, height } = defaultProps.campaign.video;

  return (
    <>
      <Composition
        id="OutbiteComparison"
        component={OutbiteComparison}
        durationInFrames={durationInFrames}
        fps={fps}
        width={width}
        height={height}
        defaultProps={defaultProps}
      />
      <Composition
        id="OutbiteComparison-NoDemo"
        component={OutbiteComparison}
        durationInFrames={durationInFrames}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          ...defaultProps,
          showAppDemo: false,
        }}
      />
    </>
  );
};
