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

const EarthquakeGlobe: React.FC<Props> = ({ data, worldData, onSelectQuake, selectedQuakeId }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
    const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

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
        const size = Math.min(width, height);

        // Helper to safely get magnitude
        const getMag = (d: EarthquakeFeature) => {
            const val = Number(d.properties.mag);
            return isNaN(val) ? 0 : Math.max(0, val);
        };

        // Globe Projection
        const projection = d3.geoOrthographic()
            .scale(size / 2.2)
            .translate([width / 2, height / 2])
            .rotate(rotation)
            .clipAngle(90);

        const pathGenerator = d3.geoPath().projection(projection);

        // Drag Behavior
        const drag = d3.drag<SVGSVGElement, unknown>()
            .on("drag", (event) => {
                const rotate = projection.rotate();
                const k = 75 / projection.scale();
                projection.rotate([
                    rotate[0] + event.dx * k,
                    rotate[1] - event.dy * k
                ]);
                setRotation(projection.rotate());
            });

        svg.call(drag);

        const g = svg.append("g");

        // Draw Ocean/Background Circle
        g.append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", projection.scale())
            .attr("fill", "#0f172a") // Slate 900
            .attr("stroke", "#334155")
            .attr("stroke-width", 1);

        // Draw Countries
        const countries = (topojson.feature(worldData, worldData.objects.countries) as any).features;

        g.selectAll("path.country")
            .data(countries)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("d", pathGenerator)
            .attr("fill", "#1e293b") // Slate 800
            .attr("stroke", "#334155") // Slate 700
            .attr("stroke-width", 0.5);

        // Draw Earthquakes using geoPath for correct clipping
        const sortedData = [...data].sort((a, b) => getMag(b) - getMag(a));

        // Configure path generator to use a dynamic radius based on magnitude
        pathGenerator.pointRadius((d: any) => {
            const feature = d as EarthquakeFeature;
            return Math.max(2, Math.pow(getMag(feature), 1.5));
        });

        g.selectAll("path.quake")
            .data(sortedData)
            .enter()
            .append("path")
            .attr("class", "quake")
            .attr("d", (d) => pathGenerator(d as any))
            .attr("fill", d => getMagnitudeColor(getMag(d)))
            .attr("fill-opacity", 0.8)
            .attr("stroke", d => d.id === selectedQuakeId ? "#ffffff" : "none")
            .attr("stroke-width", 2)
            .attr("cursor", "pointer")
            .on("click", (event, d) => {
                event.stopPropagation();
                onSelectQuake(d);
            })
            .append("title")
            .text(d => `${d.properties.title}\nDepth: ${d.geometry.coordinates[2].toFixed(2)}km`);

        // Add pulsing effect for selected quake
        if (selectedQuakeId) {
            const selected = sortedData.find(d => d.id === selectedQuakeId);
            if (selected) {
                // Check visibility using pathGenerator
                const pathData = pathGenerator(selected as any);

                if (pathData) {
                    // If visible, we can get the centroid or project the point to get coordinates for the pulse circle
                    // Or we can just render another path on top.
                    // But for the expanding ring effect, it's easier with a circle element if we know the center.
                    const coords = projection([selected.geometry.coordinates[0], selected.geometry.coordinates[1]]);

                    if (coords) {
                        const r = Math.max(2, Math.pow(getMag(selected), 1.5));
                        g.append("circle")
                            .attr("cx", coords[0])
                            .attr("cy", coords[1])
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
            }
        }

    }, [data, worldData, dimensions, rotation, selectedQuakeId, onSelectQuake]);

    return (
        <div ref={containerRef} className="w-full h-full bg-slate-950 overflow-hidden relative cursor-move">
            {!worldData && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                    Loading Globe Topology...
                </div>
            )}
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="block" />

            <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur p-2 rounded text-xs text-slate-300 pointer-events-none select-none">
                <div className="font-bold mb-1">Magnitude</div>
                <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> &lt; 3.0</div>
                <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-amber-500"></span> 3.0 - 4.9</div>
                <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-orange-500"></span> 5.0 - 6.9</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> &ge; 7.0</div>
            </div>

            <div className="absolute top-4 right-4 text-slate-500 text-xs pointer-events-none select-none">
                Drag to rotate
            </div>
        </div>
    );
};

export default EarthquakeGlobe;
