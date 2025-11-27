import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { EarthquakeFeature, WorldAtlas } from '../types';
import { getMagnitudeColor } from '../constants';

interface Props {
  data: EarthquakeFeature[];
  worldData: WorldAtlas | null;
  onSelectQuake: (quake: EarthquakeFeature) => void;
  selectedQuakeId: string | null;
}

const EarthquakeMap: React.FC<Props> = ({ data, worldData, onSelectQuake, selectedQuakeId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  // Handle Resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // D3 Render Logic
  useEffect(() => {
    if (!worldData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const { width, height } = dimensions;

    // Helper to safely get magnitude
    const getMag = (d: EarthquakeFeature) => {
      const val = Number(d.properties.mag);
      return isNaN(val) ? 0 : Math.max(0, val);
    };

    // Map Projection
    const projection = d3.geoMercator()
      .scale(width / 6.5)
      .translate([width / 2, height / 1.6]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Zoom Behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const g = svg.append("g");

    // Draw Countries
    const countries = (topojson.feature(worldData, worldData.objects.countries) as any).features;

    g.selectAll("path")
      .data(countries)
      .enter()
      .append("path")
      .attr("d", pathGenerator)
      .attr("fill", "#1e293b") // Slate 800
      .attr("stroke", "#334155") // Slate 700
      .attr("stroke-width", 0.5);

    // Draw Earthquakes
    // Sort by magnitude so larger ones are on top? No, smaller on top usually better for visibility, or opacity.
    // Let's sort large to small so large are background, small are foreground (easier to click precision)
    // Or render big semi-transparent ones.
    const sortedData = [...data].sort((a, b) => getMag(b) - getMag(a));

    g.selectAll("circle")
      .data(sortedData)
      .enter()
      .append("circle")
      .attr("cx", d => projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])?.[0] || 0)
      .attr("cy", d => projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])?.[1] || 0)
      .attr("r", d => Math.max(2, Math.pow(getMag(d), 1.5)))
      .attr("fill", d => getMagnitudeColor(getMag(d)))
      .attr("fill-opacity", 0.6)
      .attr("stroke", d => d.id === selectedQuakeId ? "#ffffff" : "none")
      .attr("stroke-width", 2)
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        onSelectQuake(d);
      })
      .append("title") // Simple browser tooltip
      .text(d => `${d.properties.title}\nDepth: ${d.geometry.coordinates[2]}km`);

    // Add pulsing effect for the selected quake if any
    if (selectedQuakeId) {
      const selected = sortedData.find(d => d.id === selectedQuakeId);
      if (selected) {
        const [cx, cy] = projection([selected.geometry.coordinates[0], selected.geometry.coordinates[1]]) || [0, 0];
        const r = Math.max(2, Math.pow(getMag(selected), 1.5));

        g.append("circle")
          .attr("cx", cx)
          .attr("cy", cy)
          .attr("r", r)
          .attr("fill", "none")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 2)
          .style("pointer-events", "none")
          .transition()
          .duration(1500)
          .ease(d3.easeLinear)
          .attr("r", r * 3)
          .attr("stroke-opacity", 0)
          .on("end", function repeat() {
            d3.select(this)
              .attr("r", r)
              .attr("stroke-opacity", 1)
              .transition()
              .duration(1500)
              .attr("r", r * 3)
              .attr("stroke-opacity", 0)
              .on("end", repeat);
          });
      }
    }

  }, [data, worldData, dimensions, selectedQuakeId, onSelectQuake]);

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-900 overflow-hidden relative">
      {!worldData && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
          Loading Map Topology...
        </div>
      )}
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="block" />
      <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur p-2 rounded text-xs text-slate-300 pointer-events-none">
        <div className="font-bold mb-1">Magnitude</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> &lt; 3.0</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-amber-500"></span> 3.0 - 4.9</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-orange-500"></span> 5.0 - 6.9</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> &ge; 7.0</div>
      </div>
    </div>
  );
};

export default EarthquakeMap;