export interface EarthquakeProperties {
  mag: number;
  place: string;
  time: number;
  updated: number;
  tz: number | null;
  url: string;
  detail: string;
  felt: number | null;
  cdi: number | null;
  mmi: number | null;
  alert: string | null;
  status: string;
  tsunami: number;
  sig: number;
  net: string;
  code: string;
  ids: string;
  sources: string;
  types: string;
  nst: number | null;
  dmin: number | null;
  rms: number | null;
  gap: number | null;
  magType: string;
  type: string;
  title: string;
}

export interface EarthquakeGeometry {
  type: "Point";
  coordinates: [number, number, number]; // Longitude, Latitude, Depth
}

export interface EarthquakeFeature {
  type: "Feature";
  properties: EarthquakeProperties;
  geometry: EarthquakeGeometry;
  id: string;
}

export interface EarthquakeFeatureCollection {
  type: "FeatureCollection";
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: EarthquakeFeature[];
}

export interface WorldAtlas {
  type: "Topology";
  objects: {
    countries: {
      type: "GeometryCollection";
      geometries: any[];
    };
  };
  arcs: any[];
}

export enum TimeRange {
  HOUR = 'all_hour',
  DAY = 'all_day',
  WEEK = 'all_week',
  MONTH = 'all_month'
}

export interface AIAnalysisResult {
  summary: string;
  riskAssessment: string;
  historicalContext: string;
}