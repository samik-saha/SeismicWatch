export const USGS_API_BASE = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary";
export const WORLD_ATLAS_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const MAGNITUDE_COLORS = {
  low: "#10b981",    // Emerald 500 (Mag < 3)
  medium: "#f59e0b", // Amber 500 (3 <= Mag < 5)
  high: "#f97316",   // Orange 500 (5 <= Mag < 7)
  severe: "#ef4444", // Red 500 (Mag >= 7)
};

export const getMagnitudeColor = (mag: number): string => {
  if (mag < 3) return MAGNITUDE_COLORS.low;
  if (mag < 5) return MAGNITUDE_COLORS.medium;
  if (mag < 7) return MAGNITUDE_COLORS.high;
  return MAGNITUDE_COLORS.severe;
};
