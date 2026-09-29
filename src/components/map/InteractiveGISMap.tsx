import React, { useState, useMemo } from 'react';
import {
  Layers,
  AlertTriangle,
  Hospital as HospitalIcon,
  Home,
  Shield,
  Truck,
  RotateCcw,
  CheckCircle,
  XCircle,
  CornerDownRight,
  Info,
  ZoomIn,
  ZoomOut,
  MapPin,
  Activity,
  Gauge,
  Droplets,
  Wind,
  Battery,
  Search,
  RefreshCw,
  Compass
} from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';
import { RoadSegment, SOSRequest, Hospital, Shelter, FleetVehicle, MonitoringStation } from '../../types';

export const InteractiveGISMap: React.FC<{ heightClass?: string }> = ({ heightClass = 'h-[720px]' }) => {
  const {
    activeCity,
    switchCity,
    floodZones,
    roads,
    hospitals,
    shelters,
    fleet,
    sosRequests,
    volunteers,
    toggleRoadStatus,
    states,
    districts,
    stations,
    selectedStation,
    selectStation,
    activeStateId,
    setActiveStateId,
    stationRiskFilter,
    setStationRiskFilter,
    isSimulatorRunning,
    simulateSensorTick,
    toggleSimulator,
    isBackendConnected
  } = useFloodPulse();

  // Multi-Scale GIS View Level: 'national' (All-India) | 'state' (Regional) | 'city' (Urban Basin)
  const [viewLevel, setViewLevel] = useState<'national' | 'state' | 'city'>('national');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');
  const [stationSearch, setStationSearch] = useState<string>('');

  // Layer Toggles
  const [showStations, setShowStations] = useState(true);
  const [showFloodZones, setShowFloodZones] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showSOS, setShowSOS] = useState(true);
  const [showRoutingDemo, setShowRoutingDemo] = useState(true);

  // Selection state for popup modal/inspector
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'road' | 'hospital' | 'shelter' | 'sos' | 'vehicle' | 'zone' | 'station';
    data: any;
  } | null>(null);

  // Manual Zoom
  const [zoomLevel, setZoomLevel] = useState(1);

  // Check if Road 1 (Velachery Main Rd) is closed to show rerouting animation
  const velacheryRoad = roads.find(r => r.id === 'rd-1');
  const isVelacheryClosed = velacheryRoad?.status === 'closed';

  // Filter stations based on state, risk level, and search term
  const filteredStations = useMemo(() => {
    return stations.filter(s => {
      // State filter
      if (selectedStateFilter !== 'all' && s.stateId !== selectedStateFilter) {
        return false;
      }
      // View level filtering
      if (viewLevel === 'city' && s.cityId !== activeCity.id && s.cityId !== 'chennai') {
        // In city mode, prioritize active city
        return false;
      }
      // Risk level filter
      if (stationRiskFilter !== 'ALL' && s.riskLevel.toUpperCase() !== stationRiskFilter) {
        return false;
      }
      // Search filter
      if (stationSearch.trim()) {
        const query = stationSearch.toLowerCase();
        return (
          s.id.toLowerCase().includes(query) ||
          s.name.toLowerCase().includes(query) ||
          (s.cityName && s.cityName.toLowerCase().includes(query)) ||
          (s.stateName && s.stateName.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [stations, selectedStateFilter, viewLevel, activeCity.id, stationRiskFilter, stationSearch]);

  // Color mapping according to strict guidelines:
  // GREEN = LOW, YELLOW = MODERATE, ORANGE = HIGH, RED = CRITICAL
  const getRiskColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL':
        return {
          fill: '#ef4444',
          stroke: '#dc2626',
          bg: 'bg-red-500',
          text: 'text-red-400',
          border: 'border-red-500/50',
          badge: 'bg-red-950/80 text-red-300 border-red-800'
        };
      case 'HIGH':
        return {
          fill: '#f97316',
          stroke: '#ea580c',
          bg: 'bg-orange-500',
          text: 'text-orange-400',
          border: 'border-orange-500/50',
          badge: 'bg-orange-950/80 text-orange-300 border-orange-800'
        };
      case 'MODERATE':
        return {
          fill: '#eab308',
          stroke: '#ca8a04',
          bg: 'bg-yellow-500',
          text: 'text-yellow-400',
          border: 'border-yellow-500/50',
          badge: 'bg-yellow-950/80 text-yellow-300 border-yellow-800'
        };
      case 'LOW':
      default:
        return {
          fill: '#10b981',
          stroke: '#059669',
          bg: 'bg-emerald-500',
          text: 'text-emerald-400',
          border: 'border-emerald-500/50',
          badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
        };
    }
  };

  // Convert real geographic coords (lat, lng) to SVG 0-100 viewport
  // India geographic bounding box: Approx lat 8°N to 34°N, lng 68°E to 96°E
  const projectCoords = (lat: number, lng: number): [number, number] => {
    if (viewLevel === 'national') {
      // National India projection
      const minLat = 7.5;
      const maxLat = 35.5;
      const minLng = 67.5;
      const maxLng = 96.5;

      const x = ((lng - minLng) / (maxLng - minLng)) * 88 + 6;
      // Invert Y because latitude goes from bottom to top
      const y = 92 - ((lat - minLat) / (maxLat - minLat)) * 84;
      return [Math.max(2, Math.min(98, x)), Math.max(2, Math.min(98, y))];
    } else if (viewLevel === 'state') {
      // Regional projection around Tamil Nadu / Southern India or selected state
      if (selectedStateFilter === 'maharashtra' || activeCity.id === 'mumbai') {
        const minLat = 15.5;
        const maxLat = 22.2;
        const minLng = 72.0;
        const maxLng = 81.0;
        const x = ((lng - minLng) / (maxLng - minLng)) * 82 + 9;
        const y = 90 - ((lat - minLat) / (maxLat - minLat)) * 80;
        return [Math.max(4, Math.min(96, x)), Math.max(4, Math.min(96, y))];
      } else if (selectedStateFilter === 'assam' || activeCity.id === 'assam') {
        const minLat = 24.0;
        const maxLat = 28.5;
        const minLng = 89.5;
        const maxLng = 96.0;
        const x = ((lng - minLng) / (maxLng - minLng)) * 82 + 9;
        const y = 90 - ((lat - minLat) / (maxLat - minLat)) * 80;
        return [Math.max(4, Math.min(96, x)), Math.max(4, Math.min(96, y))];
      } else {
        // Default: Tamil Nadu detailed regional viewport
        const minLat = 8.0;
        const maxLat = 14.0;
        const minLng = 76.0;
        const maxLng = 80.8;
        const x = ((lng - minLng) / (maxLng - minLng)) * 80 + 10;
        const y = 90 - ((lat - minLat) / (maxLat - minLat)) * 80;
        return [Math.max(5, Math.min(95, x)), Math.max(5, Math.min(95, y))];
      }
    } else {
      // Urban Basin / City scale (high precision around metro basin)
      // Focus on Chennai or active city center
      const centerLat = activeCity.lat || 13.0827;
      const centerLng = activeCity.lng || 80.2707;
      const span = 0.40; // Approx 40km view box

      const x = ((lng - (centerLng - span / 2)) / span) * 86 + 7;
      const y = 92 - ((lat - (centerLat - span / 2)) / span) * 84;
      return [Math.max(5, Math.min(95, x)), Math.max(5, Math.min(95, y))];
    }
  };

  const handleStationClick = (stn: MonitoringStation) => {
    setSelectedEntity({ type: 'station', data: stn });
    selectStation(stn);
  };

  return (
    <div className={`relative w-full ${heightClass} bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl`}>
      
      {/* ----------------- TOP GIS CONTROL & TELEMETRY BAR ----------------- */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: View Level Breadcrumbs & Hierarchy Navigator */}
        <div className="flex items-center gap-1.5 bg-slate-900/95 border border-slate-700/80 backdrop-blur-md p-1.5 rounded-xl shadow-xl pointer-events-auto">
          <div className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono font-bold text-white border-r border-slate-800">
            <Compass className="h-3.5 w-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
            <span>GIS GRID:</span>
          </div>

          <button
            onClick={() => { setViewLevel('national'); setSelectedStateFilter('all'); }}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all font-semibold flex items-center gap-1 ${
              viewLevel === 'national'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🇮🇳 India (National)</span>
          </button>

          <button
            onClick={() => { setViewLevel('state'); setSelectedStateFilter('tamil_nadu'); }}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all font-semibold flex items-center gap-1 ${
              viewLevel === 'state'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>State View</span>
            {selectedStateFilter !== 'all' && (
              <span className="text-[10px] px-1 py-0.2 rounded bg-slate-950/40 font-mono">
                {selectedStateFilter.replace('_', ' ').toUpperCase()}
              </span>
            )}
          </button>

          <button
            onClick={() => { setViewLevel('city'); }}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all font-semibold flex items-center gap-1 ${
              viewLevel === 'city'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>City Basin ({activeCity.name})</span>
          </button>
        </div>

        {/* Center: Live Data Source & Simulation Status Watermark */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg pointer-events-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono font-bold text-amber-300">
            DEMO / SIMULATED DATA
          </span>
          <span className="text-slate-500 text-xs">·</span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            IMD &amp; CWC Grid Ready
          </span>
          <button
            onClick={() => simulateSensorTick()}
            className="ml-1 p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
            title="Tick sensor simulation values"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>

        {/* Right: Layer Toggles Popover */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 backdrop-blur-md p-1 rounded-xl shadow-lg pointer-events-auto">
          <button
            onClick={() => setShowStations(!showStations)}
            className={`px-2 py-1 text-[11px] rounded-lg transition-colors font-medium flex items-center gap-1 ${
              showStations ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Activity className="h-3 w-3" />
            <span>Stations ({filteredStations.length})</span>
          </button>
          <button
            onClick={() => setShowFloodZones(!showFloodZones)}
            className={`px-2 py-1 text-[11px] rounded-lg transition-colors font-medium flex items-center gap-1 ${
              showFloodZones ? 'bg-rose-500/20 text-rose-300' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Inundation
          </button>
          <button
            onClick={() => setShowRoads(!showRoads)}
            className={`px-2 py-1 text-[11px] rounded-lg transition-colors font-medium flex items-center gap-1 ${
              showRoads ? 'bg-blue-500/20 text-blue-300' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Corridors
          </button>
          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`px-2 py-1 text-[11px] rounded-lg transition-colors font-medium hidden md:flex items-center gap-1 ${
              showHospitals ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Hospitals
          </button>
          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`px-2 py-1 text-[11px] rounded-lg transition-colors font-medium hidden md:flex items-center gap-1 ${
              showShelters ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Shelters
          </button>
          <button
            onClick={() => setShowSOS(!showSOS)}
            className={`px-2 py-1 text-[11px] rounded-lg transition-colors font-medium flex items-center gap-1 ${
              showSOS ? 'bg-red-500/20 text-red-300' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            SOS
          </button>
        </div>

      </div>

      {/* ----------------- SECONDARY RISK & STATE FILTER BAR ----------------- */}
      <div className="absolute top-16 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Risk Level Color-Coded Filter Chips */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-lg pointer-events-auto text-xs">
          <span className="text-slate-400 font-mono text-[10px] uppercase font-bold pr-1">Risk Filter:</span>
          
          <button
            onClick={() => setStationRiskFilter('ALL')}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
              stationRiskFilter === 'ALL' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setStationRiskFilter('CRITICAL')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors flex items-center gap-1 ${
              stationRiskFilter === 'CRITICAL' ? 'bg-red-600 text-white shadow' : 'text-red-400 hover:bg-red-950/40'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span>CRITICAL</span>
          </button>
          <button
            onClick={() => setStationRiskFilter('HIGH')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors flex items-center gap-1 ${
              stationRiskFilter === 'HIGH' ? 'bg-orange-600 text-white shadow' : 'text-orange-400 hover:bg-orange-950/40'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span>HIGH</span>
          </button>
          <button
            onClick={() => setStationRiskFilter('MODERATE')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors flex items-center gap-1 ${
              stationRiskFilter === 'MODERATE' ? 'bg-yellow-600 text-white shadow' : 'text-yellow-400 hover:bg-yellow-950/40'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            <span>MODERATE</span>
          </button>
          <button
            onClick={() => setStationRiskFilter('LOW')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors flex items-center gap-1 ${
              stationRiskFilter === 'LOW' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-400 hover:bg-emerald-950/40'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>LOW</span>
          </button>
        </div>

        {/* State Quick Selector & Search */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-2 py-1 rounded-xl shadow-lg pointer-events-auto">
          <select
            value={selectedStateFilter}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedStateFilter(val);
              if (val !== 'all') {
                setViewLevel('state');
              }
            }}
            className="bg-slate-950 text-slate-200 text-xs rounded-lg px-2 py-1 border border-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Monitored States (All India)</option>
            <option value="tamil_nadu">Tamil Nadu (Detailed - 22 Stations)</option>
            <option value="maharashtra">Maharashtra (6 Stations)</option>
            <option value="karnataka">Karnataka (5 Stations)</option>
            <option value="kerala">Kerala (4 Stations)</option>
            <option value="assam">Assam (4 Stations)</option>
            <option value="telangana">Telangana (3 Stations)</option>
            <option value="west_bengal">West Bengal (2 Stations)</option>
            <option value="odisha">Odisha (2 Stations)</option>
            <option value="gujarat">Gujarat (2 Stations)</option>
          </select>

          <div className="relative">
            <Search className="h-3 w-3 text-slate-400 absolute left-2 top-2" />
            <input
              type="text"
              placeholder="Search station or river..."
              value={stationSearch}
              onChange={(e) => setStationSearch(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs rounded-lg pl-7 pr-2 py-1 w-36 sm:w-48 border border-slate-700 focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
            />
          </div>
        </div>

      </div>

      {/* ----------------- MAIN VECTOR SVG GIS VIEWPORT ----------------- */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-[#050811] select-none cursor-crosshair">
        
        {/* Geographic Coordinate Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Vector SVG Canvas */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="critGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="highGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="nationalRiverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0369a1" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="coastalEdge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0c4a6e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* =========================================================================
              VIEW 1: NATIONAL OVERVIEW (PAN-INDIA GIS)
             ========================================================================= */}
          {viewLevel === 'national' && (
            <g className="transition-opacity duration-300">
              {/* National Geographic Outline of India */}
              <path
                d="M 28,14 L 38,10 L 48,15 L 56,12 L 68,18 L 84,20 L 92,26 L 86,34 L 75,32 L 68,38 L 65,48 L 62,64 L 52,86 L 50,94 L 46,84 L 38,62 L 32,50 L 26,45 L 20,38 L 22,25 Z"
                fill="#081426"
                stroke="#1e3a5f"
                strokeWidth="0.8"
                className="hover:fill-[#0c1f38] transition-colors"
              />

              {/* Major National River Corridors */}
              {/* Ganga-Brahmaputra Basin */}
              <path
                d="M 38,22 Q 52,26 66,28 T 88,27"
                fill="none"
                stroke="url(#nationalRiverGrad)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              {/* Godavari & Krishna Basins */}
              <path
                d="M 34,52 Q 46,55 58,58 T 64,62"
                fill="none"
                stroke="url(#nationalRiverGrad)"
                strokeWidth="1.0"
                strokeLinecap="round"
              />
              {/* Cauvery River Basin */}
              <path
                d="M 40,75 Q 48,78 54,80 T 58,82"
                fill="none"
                stroke="url(#nationalRiverGrad)"
                strokeWidth="1.0"
                strokeLinecap="round"
              />

              {/* State Interactive Badges */}
              {states.map(st => {
                const [sx, sy] = projectCoords(st.centerLat, st.centerLng);
                const isTN = st.id === 'tamil_nadu';
                const isCrit = st.activeRiskLevel === 'critical';

                return (
                  <g
                    key={st.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedStateFilter(st.id);
                      setViewLevel('state');
                    }}
                  >
                    {/* State Center Indicator */}
                    <circle
                      cx={sx}
                      cy={sy}
                      r={isTN ? 2.5 : 2.0}
                      fill={isCrit ? '#ef4444' : '#0284c7'}
                      fillOpacity="0.4"
                      stroke={isCrit ? '#ef4444' : '#38bdf8'}
                      strokeWidth="0.4"
                    />
                    <text
                      x={sx}
                      y={sy + 0.6}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="1.6"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {st.code}
                    </text>
                    <text
                      x={sx}
                      y={sy + 3.2}
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="1.4"
                      className="font-medium drop-shadow pointer-events-none group-hover:fill-cyan-300"
                    >
                      {st.name} ({st.totalStations} stn)
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* =========================================================================
              VIEW 2: REGIONAL / STATE LEVEL (e.g. Tamil Nadu or Maharashtra)
             ========================================================================= */}
          {viewLevel === 'state' && (
            <g className="transition-opacity duration-300">
              {/* State Territorial Region Polygon */}
              <path
                d="M 18,15 Q 35,12 60,18 L 82,30 L 78,55 L 72,75 L 55,90 L 35,85 L 22,60 L 15,35 Z"
                fill="#081426"
                stroke="#0369a1"
                strokeWidth="1.0"
              />

              {/* Coastal Edge Water */}
              <path
                d="M 82,30 L 98,30 L 98,95 L 72,95 L 72,75 L 78,55 Z"
                fill="#022c43"
                opacity="0.5"
              />

              {/* Regional Major Rivers: Adyar, Cooum, Palar, Cauvery */}
              <path
                d="M 25,25 Q 45,35 65,32 T 80,34"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.0"
                strokeLinecap="round"
              />
              <path
                d="M 20,45 Q 40,55 60,50 T 78,56"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M 30,70 Q 50,75 70,72 T 74,78"
                fill="none"
                stroke="#0284c7"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              {/* District Center Markers */}
              {districts.filter(d => selectedStateFilter === 'all' || d.stateId === selectedStateFilter).map(dist => {
                const [dx, dy] = projectCoords(dist.centerLat, dist.centerLng);
                return (
                  <g
                    key={dist.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      if (dist.name.toLowerCase().includes('chennai')) {
                        switchCity('chennai');
                        setViewLevel('city');
                      }
                    }}
                  >
                    <rect
                      x={dx - 1.2}
                      y={dy - 1.2}
                      width="2.4"
                      height="2.4"
                      rx="0.4"
                      fill="#0f172a"
                      stroke="#38bdf8"
                      strokeWidth="0.4"
                    />
                    <text
                      x={dx}
                      y={dy + 3.2}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="1.6"
                      fontFamily="sans-serif"
                      className="font-bold group-hover:fill-cyan-300"
                    >
                      {dist.name}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* =========================================================================
              VIEW 3: URBAN BASIN / CITY SCALE (High Resolution Micro-Network)
             ========================================================================= */}
          {viewLevel === 'city' && (
            <g className="transition-opacity duration-300">
              {/* Urban River Waterways: Adyar & Cooum River paths */}
              <path
                d="M 8,26 Q 35,40 50,38 T 92,44"
                fill="none"
                stroke="#0284c7"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <path
                d="M 5,62 Q 32,72 56,58 T 94,84"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.6"
                strokeLinecap="round"
              />

              {/* Bay Coastal Edge */}
              <path
                d="M 88,0 L 98,0 L 98,100 L 92,100 Q 86,60 88,0 Z"
                fill="#082f49"
                opacity="0.35"
              />

              {/* 1. Inundation Flood Polygons & Heatmap Zones */}
              {showFloodZones && floodZones.map(zone => {
                const [cx, cy] = zone.coordinates;
                const radius = zone.areaKm2 * 2.2;
                const isCrit = zone.riskLevel === 'critical';

                return (
                  <g
                    key={zone.id}
                    className="cursor-pointer transition-opacity hover:opacity-90"
                    onClick={() => setSelectedEntity({ type: 'zone', data: zone })}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill={isCrit ? "url(#critGlow)" : "url(#highGlow)"}
                      stroke={isCrit ? "#ef4444" : "#f59e0b"}
                      strokeWidth="0.4"
                      strokeDasharray="1.5,1"
                    />
                    <circle cx={cx} cy={cy} r="0.8" fill={isCrit ? "#ef4444" : "#f59e0b"} />
                    <text
                      x={cx + 1.2}
                      y={cy + 0.4}
                      fill="#ffffff"
                      fontSize="2"
                      fontFamily="monospace"
                      className="font-bold drop-shadow"
                    >
                      {zone.waterDepthM}m
                    </text>
                  </g>
                );
              })}

              {/* 2. Arterial Road Network */}
              {showRoads && roads.map(road => {
                const { start, end } = road.coordinates;
                const isClosed = road.status === 'closed';
                const isRisky = road.status === 'risky';

                const strokeColor = isClosed ? '#ef4444' : isRisky ? '#f59e0b' : '#38bdf8';
                const strokeDash = isClosed ? '2,1' : 'none';

                return (
                  <g
                    key={road.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedEntity({ type: 'road', data: road })}
                  >
                    <line
                      x1={start[0]}
                      y1={start[1]}
                      x2={end[0]}
                      y2={end[1]}
                      stroke="transparent"
                      strokeWidth="3.5"
                    />
                    <line
                      x1={start[0]}
                      y1={start[1]}
                      x2={end[0]}
                      y2={end[1]}
                      stroke={strokeColor}
                      strokeWidth={isClosed ? "1.8" : "1.2"}
                      strokeDasharray={strokeDash}
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}

              {/* 3. Emergency Detour Navigation Path */}
              {showRoutingDemo && isVelacheryClosed && (
                <g>
                  <path
                    d="M 38,44 Q 45,46 52,50 L 68,72"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeDasharray="2,1"
                    className="animate-pulse"
                  />
                  <circle cx="50" cy="48" r="1.4" fill="#10b981" />
                  <text x="52" y="47" fill="#34d399" fontSize="1.8" fontFamily="monospace" className="font-bold">
                    AMB-108 [SAFE DETOUR: 16 min]
                  </text>
                </g>
              )}

              {/* 4. Hospitals & Shelters */}
              {showHospitals && hospitals.map(hosp => {
                const [hx, hy] = hosp.coordinates;
                return (
                  <g
                    key={hosp.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedEntity({ type: 'hospital', data: hosp })}
                  >
                    <circle cx={hx} cy={hy} r="2.0" fill="#1e1b4b" stroke="#818cf8" strokeWidth="0.5" />
                    <text x={hx} y={hy + 0.8} textAnchor="middle" fill="#c7d2fe" fontSize="2.0" fontWeight="bold">
                      H
                    </text>
                  </g>
                );
              })}

              {showShelters && shelters.map(sh => {
                const [sx, sy] = sh.coordinates;
                return (
                  <g
                    key={sh.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedEntity({ type: 'shelter', data: sh })}
                  >
                    <polygon
                      points={`${sx},${sy - 1.8} ${sx + 1.8},${sy + 1.5} ${sx - 1.8},${sy + 1.5}`}
                      fill="#064e3b"
                      stroke="#34d399"
                      strokeWidth="0.4"
                    />
                  </g>
                );
              })}

              {/* 5. Active SOS Request Beacons */}
              {showSOS && sosRequests.map(sos => {
                const [px, py] = sos.coordinates;
                const isResolved = sos.status === 'resolved';
                return (
                  <g
                    key={sos.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedEntity({ type: 'sos', data: sos })}
                  >
                    <circle
                      cx={px}
                      cy={py}
                      r="2.2"
                      fill={isResolved ? '#065f46' : '#991b1b'}
                      stroke="#ffffff"
                      strokeWidth="0.5"
                    />
                    {!isResolved && (
                      <circle cx={px} cy={py} r="4.5" fill="none" stroke="#ef4444" strokeWidth="0.4" className="pulse-ring" />
                    )}
                    <text x={px} y={py + 0.7} textAnchor="middle" fill="#ffffff" fontSize="1.8" fontWeight="bold">!</text>
                  </g>
                );
              })}
            </g>
          )}

          {/* =========================================================================
              DYNAMIC HYDROLOGICAL MONITORING STATIONS (RENDERED AT ALL VIEW LEVELS)
             ========================================================================= */}
          {showStations && filteredStations.map(stn => {
            const [px, py] = projectCoords(stn.latitude, stn.longitude);
            const colors = getRiskColor(stn.riskLevel);
            const isCritical = stn.riskLevel === 'CRITICAL';
            const isHigh = stn.riskLevel === 'HIGH';

            return (
              <g
                key={stn.id}
                className="cursor-pointer group"
                onClick={() => handleStationClick(stn)}
              >
                {/* Critical / High Risk Ping Ripple */}
                {(isCritical || isHigh) && (
                  <circle
                    cx={px}
                    cy={py}
                    r={viewLevel === 'national' ? 2.8 : 3.5}
                    fill="none"
                    stroke={colors.fill}
                    strokeWidth="0.4"
                    className="pulse-ring"
                  />
                )}

                {/* Station Marker Outer Pin */}
                <circle
                  cx={px}
                  cy={py}
                  r={viewLevel === 'national' ? 1.4 : 1.8}
                  fill={colors.fill}
                  stroke="#ffffff"
                  strokeWidth="0.3"
                  className="transition-transform group-hover:scale-125"
                />

                {/* Station Sensor Core Pulse */}
                <circle
                  cx={px}
                  cy={py}
                  r={viewLevel === 'national' ? 0.6 : 0.8}
                  fill="#ffffff"
                />

                {/* Detailed Label shown in City or State view */}
                {viewLevel !== 'national' && (
                  <text
                    x={px}
                    y={py - 2.4}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="1.5"
                    fontFamily="monospace"
                    className="font-bold drop-shadow-md select-none group-hover:fill-cyan-300"
                  >
                    {stn.name.split(' ')[0]} ({stn.waterLevel}m)
                  </text>
                )}
              </g>
            );
          })}

        </svg>

        {/* ----------------- MAP FLOATING CONTROLS (BOTTOM RIGHT) ----------------- */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl shadow-xl">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.8))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* ----------------- COLOR-CODED RISK LEGEND (BOTTOM LEFT) ----------------- */}
        <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-3.5 bg-slate-950/90 border border-slate-800/90 backdrop-blur-md px-3.5 py-2 rounded-xl text-[11px] text-slate-300 shadow-xl">
          <span className="font-mono text-slate-400 font-bold uppercase text-[10px] border-r border-slate-800 pr-2">
            Stations Grid
          </span>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="font-medium text-emerald-400">LOW</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="font-medium text-yellow-400">MODERATE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            <span className="font-medium text-orange-400">HIGH</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-medium text-red-400">CRITICAL</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-[10px] text-slate-400 font-mono">
            {filteredStations.length} Active Stations Plotted
          </span>
        </div>

      </div>

      {/* ----------------- ENTITY & MONITORING STATION INSPECTOR DRAWER ----------------- */}
      {selectedEntity && (
        <div className="absolute top-28 right-4 z-40 w-88 sm:w-[420px] rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md text-xs">
          
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-cyan-400" />
              <span className="font-bold text-white uppercase tracking-wider font-mono">
                {selectedEntity.type === 'station' ? 'STATION TELEMETRY CORE' : `${selectedEntity.type} INSPECTOR`}
              </span>
            </div>
            <button
              onClick={() => { setSelectedEntity(null); selectStation(null); }}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>

          {/* 1. MONITORING STATION COMPLETE INSPECTOR */}
          {selectedEntity.type === 'station' && (() => {
            const stn: MonitoringStation = selectedEntity.data;
            const colors = getRiskColor(stn.riskLevel);
            const waterRatio = Math.min(100, Math.round((stn.waterLevel / stn.dangerLevel) * 100));

            return (
              <div className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-bold">{stn.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${colors.badge}`}>
                      {stn.riskLevel} RISK
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mt-1">{stn.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    <span>{stn.cityName || activeCity.name}, {stn.stateName || 'Tamil Nadu'}</span>
                    <span>·</span>
                    <span className="text-slate-500">{stn.latitude.toFixed(4)}°N, {stn.longitude.toFixed(4)}°E</span>
                  </div>
                </div>

                {/* Data Source Watermark Pill */}
                <div className="flex items-center justify-between bg-amber-950/40 border border-amber-500/30 p-2 rounded-xl text-[11px] text-amber-300">
                  <span className="font-mono font-semibold">FEED: {stn.dataSource || 'DEMO/SIMULATED'}</span>
                  <span className="text-[10px] text-amber-400/80 font-mono">IoT / IMD Protocol</span>
                </div>

                {/* Water Level Gauge Meter vs Danger Level */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Gauge className="h-3.5 w-3.5 text-cyan-400" />
                      Water Level Telemetry:
                    </span>
                    <span className={`font-mono font-bold text-sm ${colors.text}`}>
                      {stn.waterLevel} m
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors.bg} transition-all duration-500`}
                      style={{ width: `${waterRatio}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Baseline (0m)</span>
                    <span>Warn: {stn.warningLevel}m</span>
                    <span className="text-red-400 font-bold">Danger: {stn.dangerLevel}m</span>
                  </div>
                </div>

                {/* Multi-parameter Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block flex items-center gap-1">
                      <Droplets className="h-3 w-3 text-cyan-400" /> Rainfall Intensity:
                    </span>
                    <span className="font-mono text-cyan-300 font-bold text-xs">{stn.rainfall} mm/h</span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block flex items-center gap-1">
                      <Wind className="h-3 w-3 text-indigo-400" /> Flow Rate:
                    </span>
                    <span className="font-mono text-indigo-300 font-bold text-xs">{stn.flowRate} m³/s</span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">Drainage Capacity:</span>
                    <span className="font-mono text-slate-200 font-bold text-xs">{stn.drainageCapacity}%</span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">AI Confidence:</span>
                    <span className="font-mono text-emerald-400 font-bold text-xs">{stn.confidence}%</span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block">Sensor Health:</span>
                    <span className={`font-mono font-bold text-xs ${stn.sensorStatus === 'ALERT' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {stn.sensorStatus}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block flex items-center gap-1">
                      <Battery className="h-3 w-3 text-emerald-400" /> Battery Telemetry:
                    </span>
                    <span className="font-mono text-slate-200 font-bold text-xs">{stn.batteryLevel}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
                  <span>Trend: <strong className="capitalize text-slate-200">{stn.trend}</strong></span>
                  <span>Last Tick: {stn.lastUpdated}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => simulateSensorTick()}
                    className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Simulate Sensor Spike</span>
                  </button>
                  <button
                    onClick={() => setSelectedEntity(null)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          })()}

          {/* 2. ROAD INSPECTOR */}
          {selectedEntity.type === 'road' && (
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-white text-sm">{selectedEntity.data.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    selectedEntity.data.status === 'closed' ? 'bg-red-950 text-red-300 border border-red-800' :
                    selectedEntity.data.status === 'risky' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {selectedEntity.data.status}
                  </span>
                  <span className="text-slate-400">Depth: {selectedEntity.data.waterDepthM}m</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Clearance Limit:</span>
                  <span className="font-mono text-slate-200">{selectedEntity.data.maxPassableClearanceM}m (Vehicles)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Predicted Peak:</span>
                  <span className="font-mono text-amber-400">{selectedEntity.data.predictedDepthM}m</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                {selectedEntity.data.status === 'closed' ? (
                  <button
                    onClick={() => { toggleRoadStatus(selectedEntity.data.id, 'passable'); setSelectedEntity(null); }}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
                  >
                    Re-open Road
                  </button>
                ) : (
                  <button
                    onClick={() => { toggleRoadStatus(selectedEntity.data.id, 'closed'); setSelectedEntity(null); }}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition-colors"
                  >
                    Close Road &amp; Reroute
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 3. SOS INSPECTOR */}
          {selectedEntity.type === 'sos' && (
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-rose-400 font-mono font-bold">SOS #{selectedEntity.data.id}</span>
                  <span className="text-[10px] font-mono bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded">
                    PRIORITY: {selectedEntity.data.priorityScore}/100
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm mt-1">{selectedEntity.data.citizenName}</h4>
                <p className="text-slate-400 text-[11px]">{selectedEntity.data.locationName}</p>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">People Stranded:</span>
                  <span className="font-mono text-white font-bold">{selectedEntity.data.peopleCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Water Depth:</span>
                  <span className="font-mono text-rose-400 font-bold">{selectedEntity.data.waterDepthM}m</span>
                </div>
                <p className="text-slate-300 italic pt-1 border-t border-slate-800">"{selectedEntity.data.notes}"</p>
              </div>
            </div>
          )}

          {/* 4. HOSPITAL INSPECTOR */}
          {selectedEntity.type === 'hospital' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">{selectedEntity.data.name}</h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Available Beds:</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedEntity.data.availableBeds} / {selectedEntity.data.totalBeds}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ICU Beds Free:</span>
                  <span className="font-mono text-cyan-400 font-bold">{selectedEntity.data.icuBedsAvailable} / {selectedEntity.data.icuBedsTotal}</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. SHELTER INSPECTOR */}
          {selectedEntity.type === 'shelter' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">{selectedEntity.data.name}</h4>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Occupancy:</span>
                  <span className="font-mono text-white font-bold">{selectedEntity.data.occupancy} / {selectedEntity.data.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rations Remaining:</span>
                  <span className="font-mono text-emerald-400">{selectedEntity.data.foodDaysRemaining} days</span>
                </div>
              </div>
            </div>
          )}

          {/* 6. ZONE INSPECTOR */}
          {selectedEntity.type === 'zone' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">{selectedEntity.data.name}</h4>
              <p className="text-slate-400 text-[11px]">{selectedEntity.data.statusDescription}</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Current Depth:</span>
                  <span className="font-mono text-red-400 font-bold">{selectedEntity.data.waterDepthM}m</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Predicted Peak:</span>
                  <span className="font-mono text-amber-400 font-bold">{selectedEntity.data.predictedDepthM}m</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
