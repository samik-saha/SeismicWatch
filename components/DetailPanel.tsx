import React from 'react';
import { EarthquakeFeature } from '../types';
import { getMagnitudeColor } from '../constants';
import { X, ExternalLink, MapPin, Clock, ArrowDown, AlertTriangle } from 'lucide-react';

interface Props {
  quake: EarthquakeFeature | null;
  onClose: () => void;
}

const DetailPanel: React.FC<Props> = ({ quake, onClose }) => {
  if (!quake) return null;

  const date = new Date(quake.properties.time);

  return (
    <div className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col overflow-hidden transition-transform duration-300">
      {/* Header */}
      <div className="p-6 border-b border-slate-700 flex justify-between items-start bg-slate-800/50 backdrop-blur">
        <div>
          <h2 className="text-xl font-bold text-white leading-snug">{quake.properties.title}</h2>
          <span className="text-xs text-slate-400 font-mono mt-1 block">{quake.id}</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="text-slate-400 text-xs mb-1 flex items-center gap-2"><Activity size={14} /> Magnitude</div>
            <div
              className="text-3xl font-bold"
              style={{ color: getMagnitudeColor(quake.properties.mag) }}
            >
              {quake.properties.mag.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1 uppercase">{quake.properties.magType}</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="text-slate-400 text-xs mb-1 flex items-center gap-2"><ArrowDown size={14} /> Depth</div>
            <div className="text-3xl font-bold text-slate-200">
              {quake.geometry.coordinates[2].toFixed(2)} <span className="text-sm font-normal text-slate-500">km</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">Below Surface</div>
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-3 text-sm text-slate-300">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-slate-500 mt-0.5" />
            <div>
              <div className="font-medium text-slate-200">Time</div>
              <div>{date.toLocaleDateString()} at {date.toLocaleTimeString()}</div>
              <div className="text-xs text-slate-500">({date.toUTCString()})</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-slate-500 mt-0.5" />
            <div>
              <div className="font-medium text-slate-200">Coordinates</div>
              <div className="font-mono text-xs text-slate-400">
                {quake.geometry.coordinates[1].toFixed(4)}° N, {quake.geometry.coordinates[0].toFixed(4)}° E
              </div>
            </div>
          </div>
          {quake.properties.tsunami === 1 && (
            <div className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-900/50 rounded text-red-200">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <div className="font-bold text-red-400">Tsunami Warning</div>
                <div className="text-xs opacity-80">This event has been flagged for potential tsunami generation. Check local alerts.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
        <a
          href={quake.properties.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2"
        >
          View on USGS <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

// Simple Activity icon placeholder for the component
const Activity: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
);

export default DetailPanel;