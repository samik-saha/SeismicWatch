import React from 'react';
import { EarthquakeFeature } from '../types';
import { getMagnitudeColor } from '../constants';

interface Props {
  quakes: EarthquakeFeature[];
  onSelect: (quake: EarthquakeFeature) => void;
  selectedId: string | null;
}

const Sidebar: React.FC<Props> = ({ quakes, onSelect, selectedId }) => {
  // Sort by time, most recent first
  const sorted = [...quakes].sort((a, b) => b.properties.time - a.properties.time);

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border-r border-slate-700">
      <div className="p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
        <h2 className="text-slate-100 font-semibold">Recent Events</h2>
        <p className="text-xs text-slate-500">{quakes.length} earthquakes in view</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sorted.map(quake => {
          const isSelected = quake.id === selectedId;
          const magColor = getMagnitudeColor(quake.properties.mag);

          return (
            <button
              key={quake.id}
              onClick={() => onSelect(quake)}
              className={`w-full text-left p-4 border-b border-slate-800 transition-all hover:bg-slate-800 ${isSelected ? "bg-slate-800 border-l-4 border-l-blue-500" : "border-l-4 border-l-transparent"
                }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className="font-bold text-lg"
                  style={{ color: magColor }}
                >
                  {quake.properties.mag.toFixed(1)}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {new Date(quake.properties.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-sm text-slate-300 truncate w-full mb-1">
                {quake.properties.place}
              </div>
              <div className="flex gap-2 text-[10px] text-slate-500 uppercase tracking-wider">
                <span>{quake.geometry.coordinates[2].toFixed(2)}km Depth</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;