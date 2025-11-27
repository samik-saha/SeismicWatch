import { USGS_API_BASE } from '../constants';
import { EarthquakeFeatureCollection, TimeRange } from '../types';

export const fetchEarthquakes = async (range: TimeRange = TimeRange.DAY): Promise<EarthquakeFeatureCollection> => {
  const response = await fetch(`${USGS_API_BASE}/${range}.geojson`);
  if (!response.ok) {
    throw new Error(`Failed to fetch earthquake data: ${response.statusText}`);
  }
  return response.json();
};

export const fetchWorldTopology = async (): Promise<any> => {
  const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
  if (!response.ok) {
    throw new Error(`Failed to fetch world map data`);
  }
  return response.json();
};