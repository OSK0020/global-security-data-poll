"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState, useRef, useMemo } from 'react';
import { fetchIntelligenceData } from '@/lib/rss';
import { getCoordinates } from '@/lib/geocoding';
import { NewsItem } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe as GlobeIcon, Moon, Sun, Monitor, Shield, Layers, Wind, Zap, Info } from 'lucide-react';

interface NewsPoint extends NewsItem {
  lat: number;
  lng: number;
  size: number;
  color: string;
}

interface HexData {
  lat: number;
  lng: number;
  value: number;
}

type MapType = 'DARK' | 'BLUE_MARBLE' | 'NIGHT' | 'SATELLITE';

const MAP_CONFIGS = {
  DARK: {
    label: 'Orbital Dark',
    image: '//unpkg.com/three-globe/example/img/earth-dark.jpg',
    atmosphere: '#0ea5e9',
    icon: Monitor
  },
  BLUE_MARBLE: {
    label: 'Blue Marble 8K',
    image: '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    atmosphere: '#42a5f5',
    icon: GlobeIcon
  },
  NIGHT: {
    label: 'City Lights Vision',
    image: '//unpkg.com/three-globe/example/img/earth-night.jpg',
    atmosphere: '#fcd34d',
    icon: Moon
  },
  SATELLITE: {
    label: 'High Detail Satellite',
    image: '//unpkg.com/three-globe/example/img/earth-day.jpg',
    atmosphere: '#0ea5e9',
    icon: Sun
  }
};

// Tactical Labels Data (Hotspots) - Enhanced for better geographic spread
const LABELS_DATA = [
  { lat: 38.9072, lng: -77.0369, text: 'WASHINGTON DC', size: 1.2, color: '#ffffff', status: 'STABLE' },
  { lat: 55.7558, lng: 37.6173, text: 'MOSCOW', size: 1.2, color: '#ef4444', status: 'CONFLICT' },
  { lat: 39.9042, lng: 116.4074, text: 'BEIJING', size: 1.2, color: '#f59e0b', status: 'TENSION' },
  { lat: 31.7683, lng: 35.2137, text: 'JERUSALEM', size: 1.2, color: '#ef4444', status: 'CONFLICT' },
  { lat: 32.0853, lng: 34.7818, text: 'TEL AVIV', size: 1.0, color: '#0ea5e9', status: 'TARGET' },
  { lat: 50.4501, lng: 30.5234, text: 'KYIV', size: 1.2, color: '#ef4444', status: 'CONFLICT' },
  { lat: 35.6892, lng: 51.3890, text: 'TEHRAN', size: 1.2, color: '#f59e0b', status: 'TENSION' },
  { lat: 50.8503, lng: 4.3517, text: 'BRUSSELS / NATO', size: 1.0, color: '#0ea5e9', status: 'STABLE' },
  { lat: 25.0330, lng: 121.5654, text: 'TAIPEI', size: 1.2, color: '#f59e0b', status: 'TENSION' },
  { lat: 31.5, lng: 34.4667, text: 'GAZA SECTOR', size: 1.4, color: '#ef4444', status: 'ACTIVE_ZONE' },
  { lat: 33.8938, lng: 35.5018, text: 'BEIRUT', size: 1.0, color: '#f59e0b', status: 'TENSION' },
];

// Dynamically import Globe to avoid SSR issues with Three.js
const Globe = dynamic(() => import('react-globe.gl'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900/20 backdrop-blur-sm rounded-3xl border border-white/5">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
        <p className="text-sky-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Initializing Tactical Globe...</p>
      </div>
    </div>
  )
});

// Arcs - Connectivity between major hubs
const ARC_DATA = [
  { startLat: 38.9072, startLng: -77.0369, endLat: 50.8503, endLng: 4.3517, color: '#0ea5e9' }, // DC -> Brussels
  { startLat: 50.8503, startLng: 4.3517, endLat: 32.0853, endLng: 34.7818, color: '#0ea5e9' }, // Brussels -> Tel Aviv
  { startLat: 31.0461, startLng: 34.8516, endLat: 35.6892, endLng: 51.3890, color: '#ef4444' }, // Israel -> Tehran
  { startLat: 39.9042, startLng: 116.4074, endLat: 38.9072, endLng: -77.0369, color: '#f59e0b' }, // Beijing -> DC
  { startLat: 55.7558, startLng: 37.6173, endLat: 50.4501, endLng: 30.5234, color: '#ef4444' }, // Moscow -> Kyiv
];

export default function GlobeMap() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<NewsItem | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<NewsItem | null>(null);
  const [currentMap, setCurrentMap] = useState<MapType>('BLUE_MARBLE');
  const [showClouds, setShowClouds] = useState(true);

  // Fetch data
  useEffect(() => {
    async function loadData() {
      const data = await fetchIntelligenceData();
      setNews(data);
    }
    loadData();
    const interval = setInterval(loadData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Set initial camera position
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 20, lng: 15, altitude: 2.2 }, 0);
    }
  }, []);

  // Process news points with coordinates
  const pointsData = useMemo<NewsPoint[]>(() => {
    return news
      .map(item => {
        const coords = getCoordinates(item.location || '');
        if (!coords) return null;
        return {
          ...item,
          lat: coords.lat,
          lng: coords.lng,
          size: item.threatLevel === 'CRITICAL' ? 0.8 : item.threatLevel === 'HIGH' ? 0.5 : 0.3,
          color: item.threatLevel === 'CRITICAL' ? '#ef4444' : item.threatLevel === 'HIGH' ? '#f97316' : '#0ea5e9'
        };
      })
      .filter((item): item is NewsPoint => item !== null);
  }, [news]);

  // Hexagon data (simulating threat density)
  const hexData = useMemo<HexData[]>(() => {
    return pointsData.map(p => ({
        lat: p.lat,
        lng: p.lng,
        value: p.severity || (p.threatLevel === 'CRITICAL' ? 5 : p.threatLevel === 'HIGH' ? 3 : 1)
    }));
  }, [pointsData]);

  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden border border-slate-300 dark:border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(14,165,233,0.1)] transition-colors duration-500 bg-black group">
      <Globe
        ref={globeRef}
        globeImageUrl={MAP_CONFIGS[currentMap].image}
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // Atmosphere (Point 2: Atmosphere Glow)
        showAtmosphere={true}
        atmosphereColor={MAP_CONFIGS[currentMap].atmosphere}
        atmosphereAltitude={0.15}

        // Modern HTML tactical markers (Solves cramping, looks premium)
        htmlElementsData={LABELS_DATA}
        htmlAltitude={0.02}
        htmlElement={(d: any) => {
          const el = document.createElement('div');
          el.className = 'tactical-marker-group';
          el.style.pointerEvents = 'auto';
          el.style.cursor = 'crosshair';
          
          el.innerHTML = `
            <div class="tactical-marker" style="--marker-color: ${d.color};">
              <div class="marker-core"></div>
              <div class="marker-ring"></div>
              <div class="marker-label">
                <div class="label-content">
                  <span class="label-text">${d.text}</span>
                  <span class="label-status">${d.status}</span>
                </div>
              </div>
            </div>
          `;
          return el;
        }}

        // Points
        pointsData={pointsData}
        pointColor="color"
        pointAltitude={0.01}
        pointRadius="size"
        pointsMerge={false}
        onPointHover={(point) => setHoveredPoint(point as NewsItem | null)}
        onPointClick={(point) => setSelectedPoint(point as NewsItem | null)}

        // Arcs (Point 3: Arc Connections)
        arcsData={ARC_DATA}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={4}
        arcDashInitialGap={() => Math.random() * 5}
        arcDashAnimateTime={2000}
        arcStroke={0.5}

        // Hexagons (Point 3: Hexbin Height/Density)
        hexBinPointsData={hexData}
        hexBinPointWeight="value"
        hexBinResolution={4}
        hexMargin={0.1}
        hexTopColor={() => 'rgba(14, 165, 233, 0.7)'}
        hexSideColor={() => 'rgba(14, 165, 233, 0.3)'}
        hexBinMerge={false}
        hexLabel={(d: any) => `Activity Density: ${d.value}`}
        
        // Interaction Settings
        enablePointerInteraction={true}
      />

      {/* CLOUDS LAYER (Point 2) */}
      <AnimatePresence>
        {showClouds && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none mix-blend-screen"
          >
            {/* We simulate clouds with a slow-moving overlay image if needed, for now using opacity blend */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAP TEXTURE SELECTOR */}
      <div className="absolute top-1/2 -translate-y-1/2 left-6 z-[400] flex flex-col gap-3">
        {(Object.keys(MAP_CONFIGS) as MapType[]).map((type) => {
          const Config = MAP_CONFIGS[type];
          const Icon = Config.icon;
          const isActive = currentMap === type;

          return (
            <button
              key={type}
              onClick={() => setCurrentMap(type)}
              className={`group flex items-center gap-3 p-2 rounded-xl transition-all duration-300 relative ${
                isActive 
                ? 'bg-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] translate-x-2' 
                : 'bg-[#09090b]/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:rotate-12'}`} />
              
              <AnimatePresence mode="wait">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`absolute left-full ml-4 whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#09090b]/90 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest uppercase pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl`}
                >
                  {Config.label}
                </motion.span>
              </AnimatePresence>

              {isActive && (
                <motion.div 
                  layoutId="activeMap"
                  className="absolute -left-1 w-1 h-3 bg-white rounded-full"
                />
              )}
            </button>
          );
        })}

        {/* CLOUD TOGGLE */}
        <button 
          onClick={() => setShowClouds(!showClouds)}
          className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-300 ${
            showClouds ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-400/30' : 'bg-[#09090b]/80 text-slate-500'
          }`}
        >
          <Wind className="w-5 h-5" />
        </button>
      </div>

      {/* TACTICAL HUD OVERLAYS */}
      <div className="absolute top-6 left-6 z-[400] bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 px-5 py-3 rounded-2xl pointer-events-none transition-all duration-500 group-hover:translate-x-1">
        <h3 className="text-sky-600 dark:text-sky-400 font-mono text-sm uppercase tracking-[0.2em] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          Orbital Eye • Advanced Scan
        </h3>
        <p className="text-slate-500 font-mono text-[10px] mt-1.5 uppercase tracking-widest">Synthesis Mode: 3D Visualization</p>
        <div className="w-full h-[1px] bg-gradient-to-r from-sky-400/50 to-transparent my-3" />
        <div className="flex gap-6">
          <div>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-tighter">News Nodes</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-mono">{news.length}</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-tighter">Status</p>
            <p className="text-sm text-sky-600 dark:text-sky-400 font-mono">SUPREME_DETAIL</p>
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 z-[400] flex flex-col gap-2 items-end pointer-events-none">
        <div className="bg-red-50 dark:bg-red-500/10 backdrop-blur-md border border-red-200 dark:border-red-500/30 px-4 py-2 rounded-xl flex items-center gap-3 transition-all duration-500 group-hover:-translate-x-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-[pulse_1s_ease-in-out_infinite] shadow-[0_0_12px_rgba(239,68,68,1)]" />
          <span className="text-red-600 dark:text-red-400 font-mono text-xs uppercase tracking-widest">
            {news.filter(n => n.threatLevel === 'CRITICAL').length} Critical Alerts
          </span>
        </div>
      </div>

      {/* POPUP / TOOLTIP FOR HOVER */}
      <AnimatePresence>
        {(hoveredPoint || selectedPoint) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[500] w-[400px] max-w-[90vw] pointer-events-none"
          >
            <div className="bg-[#09090b]/90 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-sky-500/50 animate-[scan_2s_linear_infinite]" />
              
              <div className="flex justify-between items-start mb-4">
                 <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest ${
                    (hoveredPoint || selectedPoint)?.threatLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 
                    (hoveredPoint || selectedPoint)?.threatLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 
                    'bg-sky-500/20 text-sky-500 border border-sky-500/30'
                 }`}>
                    {(hoveredPoint || selectedPoint)?.threatLevel}
                 </span>
                 <span className="text-[10px] text-slate-500 font-mono">{(hoveredPoint || selectedPoint)?.timestamp}</span>
              </div>

              <h4 className="text-white font-semibold text-lg leading-tight mb-3">{(hoveredPoint || selectedPoint)?.title}</h4>
              <p className="text-slate-400 text-xs font-mono mb-4 leading-relaxed">
                {(hoveredPoint || selectedPoint)?.brief.point1}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                 <span className="text-[10px] text-sky-500 font-mono uppercase tracking-widest leading-none">
                    LOCATION: {(hoveredPoint || selectedPoint)?.location}
                 </span>
                 <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-none">
                    SOURCE: {(hoveredPoint || selectedPoint)?.source}
                 </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAP OPERATING MANUAL (TUTORIAL) */}
      <div className="absolute bottom-6 right-6 z-[400] group">
        <div className="flex flex-col items-end gap-2">
          {/* Detailed Panel (hidden by default, shows on hover or click) */}
          <div className="bg-[#09090b]/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl w-64 opacity-0 scale-95 translate-y-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 transform origin-bottom-right">
             <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <Info className="w-4 h-4 text-sky-400" />
                <h4 className="text-white font-mono text-[11px] uppercase tracking-widest leading-none">Operator Manual</h4>
             </div>
             
             <ul className="space-y-4">
               <li className="flex items-start gap-3">
                 <div className="mt-0.5 w-5 h-5 rounded bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                   <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></div>
                 </div>
                 <div>
                   <p className="text-sky-400 font-mono text-[9px] uppercase tracking-wider mb-0.5">Hover / Click Target</p>
                   <p className="text-slate-400 text-[10px] leading-relaxed">Reveal classified intel & precise location data</p>
                 </div>
               </li>

               <li className="flex items-start gap-3">
                 <div className="mt-0.5 w-5 h-5 rounded bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                   <GlobeIcon className="w-3 h-3 text-slate-300" />
                 </div>
                 <div>
                   <p className="text-sky-400 font-mono text-[9px] uppercase tracking-wider mb-0.5">Drag & Rotate</p>
                   <p className="text-slate-400 text-[10px] leading-relaxed">Free movement to scan all global quadrants</p>
                 </div>
               </li>

               <li className="flex items-start gap-3">
                 <div className="mt-0.5 w-5 h-5 rounded bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                   <div className="w-3 h-3 border-t-2 border-slate-300 rounded-full"></div>
                 </div>
                 <div>
                   <p className="text-sky-400 font-mono text-[9px] uppercase tracking-wider mb-0.5">Scroll Zoom</p>
                   <p className="text-slate-400 text-[10px] leading-relaxed">Adjust your orbital altitude seamlessly</p>
                 </div>
               </li>
               
               <li className="flex items-start gap-3">
                 <div className="mt-0.5 w-5 h-5 rounded bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                   <Layers className="w-3 h-3 text-slate-300" />
                 </div>
                 <div>
                   <p className="text-sky-400 font-mono text-[9px] uppercase tracking-wider mb-0.5">Tactical Layers (Left)</p>
                   <p className="text-slate-400 text-[10px] leading-relaxed">Toggle between thermal, satellite & night visual arrays</p>
                 </div>
               </li>
             </ul>
          </div>
          
          {/* Button trigger */}
          <button className="flex items-center gap-2 bg-[#09090b]/80 backdrop-blur-md border border-white/10 hover:border-sky-500/50 hover:bg-slate-800 transition-all px-4 py-2.5 rounded-xl text-slate-400 hover:text-white group-hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]">
            <Info className="w-4 h-4" />
            <span className="font-mono text-[10px] uppercase tracking-widest">Help / Controls</span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(200px); opacity: 0; }
        }
        
        /* Tactical Marker CSS for Map Clusters */
        .tactical-marker-group {
          pointer-events: auto;
          position: absolute; /* Using relative to globe pins */
          transform: translate(-50%, -50%);
          z-index: 10;
        }
        .tactical-marker {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marker-core {
          width: 6px;
          height: 6px;
          background: var(--marker-color);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--marker-color);
          z-index: 2;
          transition: all 0.3s ease;
        }
        .marker-ring {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 1px solid var(--marker-color);
          border-radius: 50%;
          opacity: 0;
          animation: ping-ring 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .marker-label {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translate(-50%, -8px) scale(0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
          opacity: 0;
          visibility: hidden;
        }
        .label-content {
          background: rgba(9, 9, 11, 0.6);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.05); /* Subtle */
          padding: 2px 6px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s ease;
        }
        .label-text {
          color: rgba(255, 255, 255, 0.7);
          font-family: monospace;
          font-size: 8px; /* Small default text to avoid visually cramming the screen */
          letter-spacing: 0.5px;
          white-space: nowrap;
          transition: all 0.3s ease;
        }
        .label-status {
          display: none;
          color: var(--marker-color);
          font-family: monospace;
          font-size: 8px;
          text-transform: uppercase;
          margin-top: 2px;
        }
        
        /* Hover States for Tactical Marker */
        .tactical-marker-group:hover {
          z-index: 100;
        }
        .tactical-marker-group:hover .marker-ring {
          animation: none;
          opacity: 1;
          background: color-mix(in srgb, var(--marker-color) 20%, transparent);
          transform: scale(1.5);
        }
        .tactical-marker-group:hover .marker-core {
          transform: scale(1.5);
        }
        .tactical-marker-group:hover .marker-label {
          transform: translate(-50%, -15px) scale(1);
          opacity: 1;
          visibility: visible;
        }
        .tactical-marker-group:hover .label-content {
          background: rgba(9, 9, 11, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
          border-bottom: 2px solid var(--marker-color);
          padding: 6px 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px color-mix(in srgb, var(--marker-color) 20%, transparent);
        }
        .tactical-marker-group:hover .label-text {
          color: white;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .tactical-marker-group:hover .label-status {
          display: block;
        }
        
        @keyframes ping-ring {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
