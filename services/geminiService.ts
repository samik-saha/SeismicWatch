import { EarthquakeFeature } from "../types";

// AI features disabled.
export const analyzeEarthquake = async (quake: EarthquakeFeature): Promise<{ title: string; content: string }> => {
  return {
    title: "Feature Disabled",
    content: "AI analysis is not available in this version."
  };
};