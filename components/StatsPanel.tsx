import React from 'react';
import { EarthquakeFeature } from '../types';
import { Activity, BarChart2, Globe } from 'lucide-react';

interface Props {
  quakes: EarthquakeFeature[];
}

const StatsPanel: React.FC<Props> = ({ quakes }) => {
  const total = quakes.length;
  const maxMag = quakes.length > 0 ? Math.max(...quakes.map(q => q.properties.mag)) : 0;
  const significant = quakes.filter(q => q.properties.mag >= 4.5).length;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-lg flex items-center gap-4">
        <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
          <Globe size={24} />
        </div>
        <div>
          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Events</p>
          <p className="text-2xl font-bold text-white">{total}</p>
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-lg flex items-center gap-4">
        <div className="p-3 bg-red-500/20 rounded-full text-red-400">
          <Activity size={24} />
        </div>
        <div>
          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Max Magnitude</p>
          <p className="text-2xl font-bold text-white">{maxMag.toFixed(1)}</p>
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-lg flex items-center gap-4">
        <div className="p-3 bg-amber-500/20 rounded-full text-amber-400">
          <BarChart2 size={24} />
        </div>
        <div>
          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Significant (4.5+)</p>
          <p className="text-2xl font-bold text-white">{significant}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;