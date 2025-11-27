import React, { useEffect, useState } from 'react';
import EarthquakeMap from './components/EarthquakeMap';
import Sidebar from './components/Sidebar';
import DetailPanel from './components/DetailPanel';
import StatsPanel from './components/StatsPanel';
import { fetchEarthquakes, fetchWorldTopology } from './services/earthquakeService';
import { EarthquakeFeature, TimeRange, WorldAtlas } from './types';
import { RefreshCw, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
  const [worldData, setWorldData] = useState<WorldAtlas | null>(null);
  const [selectedQuake, setSelectedQuake] = useState<EarthquakeFeature | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.DAY);


  // Initial Data Load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [quakeData, topoData] = await Promise.all([
          fetchEarthquakes(timeRange),
          fetchWorldTopology()
        ]);
        setEarthquakes(quakeData.features);
        setWorldData(topoData);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [timeRange]);

  // Handle Refresh
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const quakeData = await fetchEarthquakes(timeRange);
      setEarthquakes(quakeData.features);
    } catch (error) {
      console.error("Refresh failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-200">

      {/* Sidebar - List */}
      <div className="w-80 hidden md:flex flex-col border-r border-slate-800 bg-slate-900 z-10 shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Zap size={20} className="text-blue-400" /> SeismicWatch
          </h1>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-full hover:bg-slate-800 transition-colors ${loading ? 'animate-spin text-blue-400' : 'text-slate-400'}`}
            title="Refresh Data"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Filters */}
        <div className="p-2 border-b border-slate-800 flex gap-1 bg-slate-900">
          {(Object.values(TimeRange) as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-colors ${timeRange === range
                ? 'bg-slate-700 text-white'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
            >
              {range.replace('all_', '').toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden relative">
          {loading && !earthquakes.length ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">Loading seismic data...</div>
          ) : (
            <Sidebar
              quakes={earthquakes}
              onSelect={setSelectedQuake}
              selectedId={selectedQuake?.id || null}
            />
          )}
        </div>
      </div>

      {/* Main Content - Map & Overlay */}
      <div className="flex-1 relative overflow-hidden flex flex-col">

        {/* Top Overlay Stats */}
        <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none md:left-8 md:right-auto md:w-[600px]">
          <div className="pointer-events-auto">
            <StatsPanel quakes={earthquakes} />
          </div>
        </div>

        {/* Map Visualization */}
        <div className="flex-1 bg-slate-950 relative">
          <EarthquakeMap
            data={earthquakes}
            worldData={worldData}
            onSelectQuake={setSelectedQuake}
            selectedQuakeId={selectedQuake?.id || null}
          />
        </div>
      </div>

      {/* Detail Slide-over */}
      {selectedQuake && (
        <DetailPanel
          quake={selectedQuake}
          onClose={() => setSelectedQuake(null)}
        />
      )}
    </div>
  );
};

export default App;