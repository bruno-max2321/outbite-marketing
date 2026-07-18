import React from "react";
import { loadFont as loadSyne } from "@remotion/google-fonts/Syne";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";

const { fontFamily: syne } = loadSyne("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});

const { fontFamily: figtree } = loadFigtree("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

export const fontFamilies = {
  display: syne,
  body: figtree,
  caption: figtree,
};

/** Ensures Google fonts are loaded for the composition tree. */
export const FontLoader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};
