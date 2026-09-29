import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Radio,
  Camera,
  Layers,
  Sparkles,
  Sliders,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Droplets,
  Wind,
  Gauge,
  Activity,
  Maximize2,
  RefreshCw,
  BellRing,
  MapPin,
  Eye,
  Shield,
  Play,
  Pause,
  Download,
  Check,
  ChevronRight,
  Zap,
  Info,
  SlidersHorizontal,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';
import { WaterwayStation, WaterwayRiskLevel, WaterwayAlert } from '../../types';
import { INITIAL_WATERWAY_STATIONS } from '../../data/waterwayData';
import { InteractiveGISMap } from '../map/InteractiveGISMap';

export const AIWaterwayMonitoringSuite: React.FC = () => {
  const { activeCity } = useFloodPulse();

  // All stations loaded from data (including premier ST-009)
  const [stations, setStations] = useState<WaterwayStation[]>(INITIAL_WATERWAY_STATIONS);
  const [selectedStationId, setSelectedStationId] = useState<string>('ST-009');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Camera & Computer Vision Controls
  const [cvOverlayActive, setCvOverlayActive] = useState<boolean>(true);
  const [nightVisionMode, setNightVisionMode] = useState<boolean>(false);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'camera' | 'pipeline' | 'matrix' | 'map'>('camera');

  // Interactive Configurable Thresholds for the active station
  const [warningThreshold, setWarningThreshold] = useState<number>(1.80);
  const [dangerThreshold, setDangerThreshold] = useState<number>(2.50);

  // Active Real-Time Alerts
  const [activeAlerts, setActiveAlerts] = useState<{
    id: string;
    stationId: string;
    title: string;
    location: string;
    waterLevel: number;
    flowRate: number;
    rainfall: number;
    risk: string;
    confidence: number;
    timestamp: string;
  }[]>([
    {
      id: 'alert-st-009',
      stationId: 'ST-009',
      title: '🚨 FLOOD WARNING',
      location: 'Chennai (Velachery Drainage Canal)',
      waterLevel: 2.10,
      flowRate: 4.2,
      rainfall: 86,
      risk: 'HIGH',
      confidence: 94.2,
      timestamp: 'Just now'
    }
  ]);

  // Current selected station
  const selectedStation = useMemo(() => {
    return stations.find(s => s.id === selectedStationId) || stations[0];
  }, [stations, selectedStationId]);

  // Sync configurable thresholds when selected station changes
  useEffect(() => {
    if (selectedStation) {
      setWarningThreshold(selectedStation.warningThresholdM || 1.80);
      setDangerThreshold(selectedStation.dangerThresholdM || 2.50);
    }
  }, [selectedStation?.id]);

  // Animated Camera Canvas Reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic Real-Time Ticking Simulation (1.82m -> 1.91m -> 2.03m -> 2.10m)
  useEffect(() => {
    if (!isLiveStreamActive) return;

    const interval = setInterval(() => {
      setStations(prev => prev.map(st => {
        if (st.id === selectedStationId) {
          // Subtle realistic hydrodynamic fluctuation
          const delta = (Math.random() - 0.46) * 0.02;
          const newLevel = Math.max(0.5, Number((st.waterLevelM + delta).toFixed(2)));
          const newFlow = Number((st.flowRateM3s + (Math.random() - 0.48) * 0.08).toFixed(1));
          const newRain = Math.max(10, Math.min(130, Math.round(st.rainfallMmHr + (Math.random() - 0.5) * 2)));

          // Recalculate Risk based on configurable thresholds
          let calculatedRisk: WaterwayRiskLevel = 'low';
          let calculatedConfidence = 91.7;

          if (newLevel >= dangerThreshold) {
            calculatedRisk = 'critical';
            calculatedConfidence = 96.5;
          } else if (newLevel >= warningThreshold || newRain > 75) {
            calculatedRisk = 'high';
            calculatedConfidence = 94.2;
          } else if (newLevel >= warningThreshold * 0.8) {
            calculatedRisk = 'moderate';
            calculatedConfidence = 89.4;
          }

          return {
            ...st,
            waterLevelM: newLevel,
            flowRateM3s: newFlow,
            rainfallMmHr: newRain,
            currentRisk: calculatedRisk,
            confidenceScore: calculatedConfidence,
            lastUpdated: 'Just now'
          };
        }
        return st;
      }));
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveStreamActive, selectedStationId, warningThreshold, dangerThreshold]);

  // Camera Canvas Rendering Loop (Realistic Water Simulation & AI Overlay)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const render = () => {
      step += 0.04;
      const width = canvas.width;
      const height = canvas.height;

      // Background canal wall / sky gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (nightVisionMode) {
        bgGrad.addColorStop(0, '#021808');
        bgGrad.addColorStop(0.5, '#052b0f');
        bgGrad.addColorStop(1, '#021507');
      } else {
        bgGrad.addColorStop(0, '#0f172a');
        bgGrad.addColorStop(0.45, '#1e293b');
        bgGrad.addColorStop(1, '#090d16');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw concrete canal walls & culvert architecture
      ctx.fillStyle = nightVisionMode ? '#0a3d16' : '#334155';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(120, height * 0.45);
      ctx.lineTo(120, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(width, 0);
      ctx.lineTo(width - 120, height * 0.45);
      ctx.lineTo(width - 120, height);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Concrete wall texture lines
      ctx.strokeStyle = nightVisionMode ? '#0f5220' : '#475569';
      ctx.lineWidth = 1;
      for (let y = 30; y < height; y += 35) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(120, height * 0.45 + (y - 30) * 0.3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width, y);
        ctx.lineTo(width - 120, height * 0.45 + (y - 30) * 0.3);
        ctx.stroke();
      }

      // Water Level calculation (ratio to gauge)
      const currentLevel = selectedStation.waterLevelM;
      const waterHeightRatio = Math.min(0.9, Math.max(0.15, currentLevel / 3.0));
      const waterSurfaceY = height - (waterHeightRatio * (height * 0.65));

      // Dynamic water body with simulated waves
      const waterGrad = ctx.createLinearGradient(0, waterSurfaceY, 0, height);
      if (nightVisionMode) {
        waterGrad.addColorStop(0, 'rgba(34, 197, 94, 0.7)');
        waterGrad.addColorStop(1, 'rgba(5, 46, 22, 0.95)');
      } else if (selectedStation.currentRisk === 'critical') {
        waterGrad.addColorStop(0, 'rgba(239, 68, 68, 0.75)');
        waterGrad.addColorStop(0.3, 'rgba(185, 28, 28, 0.85)');
        waterGrad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
      } else if (selectedStation.currentRisk === 'high') {
        waterGrad.addColorStop(0, 'rgba(245, 158, 11, 0.75)');
        waterGrad.addColorStop(0.3, 'rgba(180, 83, 9, 0.85)');
        waterGrad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
      } else {
        waterGrad.addColorStop(0, 'rgba(6, 182, 212, 0.75)');
        waterGrad.addColorStop(0.4, 'rgba(2, 132, 199, 0.85)');
        waterGrad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
      }

      ctx.fillStyle = waterGrad;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, waterSurfaceY);

      // Flowing sinusoidal surface
      for (let x = 0; x <= width; x += 15) {
        const wave = Math.sin(x * 0.02 + step * 2) * 5 + Math.cos(x * 0.015 - step) * 3;
        ctx.lineTo(x, waterSurfaceY + wave);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // Water surface shimmer line
      ctx.strokeStyle = nightVisionMode ? 'rgba(74, 222, 128, 0.9)' : 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 15) {
        const wave = Math.sin(x * 0.02 + step * 2) * 5 + Math.cos(x * 0.015 - step) * 3;
        if (x === 0) ctx.moveTo(x, waterSurfaceY + wave);
        else ctx.lineTo(x, waterSurfaceY + wave);
      }
      ctx.stroke();

      // Staff Gauge Scale on Left Canal Wall
      const gaugeX = 135;
      const gaugeTopY = height * 0.2;
      const gaugeBottomY = height * 0.85;
      const gaugeH = gaugeBottomY - gaugeTopY;

      // Staff Gauge Plate
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(gaugeX, gaugeTopY, 26, gaugeH);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(gaugeX, gaugeTopY, 26, gaugeH);

      // Gauge markings & centimetre increments
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 9px monospace';
      for (let m = 0; m <= 30; m += 2) {
        const tickY = gaugeBottomY - (m / 30) * gaugeH;
        const tickWidth = m % 10 === 0 ? 18 : m % 5 === 0 ? 12 : 7;

        ctx.fillRect(gaugeX, tickY - 0.5, tickWidth, 1.5);
        if (m % 5 === 0) {
          ctx.fillText(`${(m * 10)}`, gaugeX + 5, tickY - 3);
        }
      }

      // Warning and Critical Limit Lines on Gauge
      const warnY = gaugeBottomY - (warningThreshold / 3.0) * gaugeH;
      const dangY = gaugeBottomY - (dangerThreshold / 3.0) * gaugeH;

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(gaugeX - 10, warnY);
      ctx.lineTo(width - 135, warnY);
      ctx.stroke();

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gaugeX - 10, dangY);
      ctx.lineTo(width - 135, dangY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Flow Vector Arrows
      ctx.strokeStyle = nightVisionMode ? 'rgba(74, 222, 128, 0.5)' : 'rgba(255, 255, 255, 0.4)';
      ctx.fillStyle = nightVisionMode ? 'rgba(74, 222, 128, 0.5)' : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      const arrowY1 = waterSurfaceY + 45;
      const arrowY2 = waterSurfaceY + 95;
      const arrowOffset = (step * 80) % 180;

      [180, 360, 540, 720].forEach(baseX => {
        const ax = (baseX + arrowOffset) % (width - 260) + 130;
        ctx.beginPath();
        ctx.moveTo(ax, arrowY1);
        ctx.lineTo(ax + 28, arrowY1);
        ctx.lineTo(ax + 22, arrowY1 - 4);
        ctx.moveTo(ax + 28, arrowY1);
        ctx.lineTo(ax + 22, arrowY1 + 4);
        ctx.stroke();
      });

      // Rain Particle Simulation
      if (selectedStation.rainfallMmHr > 20) {
        ctx.strokeStyle = nightVisionMode ? 'rgba(74, 222, 128, 0.35)' : 'rgba(203, 213, 225, 0.3)';
        ctx.lineWidth = 1;
        const rainDensity = Math.min(80, Math.round(selectedStation.rainfallMmHr * 0.8));
        for (let i = 0; i < rainDensity; i++) {
          const rx = (i * 37 + step * 250) % width;
          const ry = (i * 73 + step * 400) % height;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 3, ry + 12);
          ctx.stroke();
        }
      }

      // COMPUTER VISION (YOLO) OBJECT DETECTION BOUNDING BOXES
      if (cvOverlayActive) {
        // 1. Staff Gauge Detection Bounding Box
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.strokeRect(gaugeX - 6, gaugeTopY - 14, 40, gaugeH + 28);

        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(gaugeX - 6, gaugeTopY - 28, 140, 14);
        ctx.fillStyle = '#082f49';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('STAFF GAUGE [conf: 98.4%]', gaugeX - 2, gaugeTopY - 18);

        // 2. Water Surface Segmentation Bounding Box
        ctx.strokeStyle = selectedStation.currentRisk === 'critical' ? '#ef4444' : selectedStation.currentRisk === 'high' ? '#f59e0b' : '#10b981';
        ctx.lineWidth = 2;
        ctx.strokeRect(150, waterSurfaceY - 15, width - 300, 32);

        ctx.fillStyle = selectedStation.currentRisk === 'critical' ? '#ef4444' : selectedStation.currentRisk === 'high' ? '#f59e0b' : '#10b981';
        ctx.fillRect(150, waterSurfaceY - 30, 210, 15);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`WATER SURFACE [${Math.round(currentLevel * 100)}cm / conf: 96.2%]`, 154, waterSurfaceY - 19);

        // 3. Culvert Inflow / Debris Blockage Detection Box
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(width - 240, height * 0.48, 100, 80);
        ctx.setLineDash([]);

        ctx.fillStyle = '#ec4899';
        ctx.fillRect(width - 240, height * 0.48 - 14, 125, 14);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8.5px monospace';
        ctx.fillText('DRAINAGE OUTLET [92%]', width - 236, height * 0.48 - 3);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedStation, cvOverlayActive, nightVisionMode, warningThreshold, dangerThreshold]);

  // Trigger rapid surge spike simulation
  const handleSimulateSurge = () => {
    setStations(prev => prev.map(s => {
      if (s.id === selectedStation.id) {
        const spikedLevel = Number((s.waterLevelM + 0.35).toFixed(2));
        const spikedRisk: WaterwayRiskLevel = spikedLevel >= dangerThreshold ? 'critical' : 'high';

        // Add real-time flood warning alert
        setActiveAlerts(curr => [
          {
            id: `alert-${Date.now()}`,
            stationId: s.id,
            title: spikedLevel >= dangerThreshold ? '🚨 CRITICAL OVERTOPPING ALERT' : '⚠️ FLOOD WARNING',
            location: `${s.cityName} (${s.waterwayName})`,
            waterLevel: spikedLevel,
            flowRate: Number((s.flowRateM3s + 1.2).toFixed(1)),
            rainfall: Math.min(140, s.rainfallMmHr + 24),
            risk: spikedRisk.toUpperCase(),
            confidence: 96.8,
            timestamp: 'Just now'
          },
          ...curr
        ]);

        return {
          ...s,
          waterLevelM: spikedLevel,
          flowRateM3s: Number((s.flowRateM3s + 1.2).toFixed(1)),
          rainfallMmHr: Math.min(140, s.rainfallMmHr + 24),
          rateOfRiseMPerHr: 0.54,
          currentRisk: spikedRisk,
          confidenceScore: 96.8,
          lastUpdated: 'Just now'
        };
      }
      return s;
    }));
  };

  // Reset/recession simulation
  const handleSimulateRecession = () => {
    setStations(prev => prev.map(s => {
      if (s.id === selectedStation.id) {
        return {
          ...s,
          waterLevelM: 1.65,
          flowRateM3s: 2.8,
          rainfallMmHr: 34,
          rateOfRiseMPerHr: -0.18,
          currentRisk: 'low',
          confidenceScore: 92.0,
          lastUpdated: 'Just now'
        };
      }
      return s;
    }));
  };

  // Filtered station list for matrix
  const filteredStations = useMemo(() => {
    return stations.filter(s => {
      const matchCity = cityFilter === 'all' || s.cityId.toLowerCase() === cityFilter.toLowerCase();
      const matchRisk = riskFilter === 'all' || s.currentRisk.toLowerCase() === riskFilter.toLowerCase();
      const matchSearch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.stationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.waterwayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.cityName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchRisk && matchSearch;
    });
  }, [stations, cityFilter, riskFilter, searchQuery]);

  // Risk badge helper
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical':
      case 'emergency':
        return { bg: 'bg-rose-500', text: 'text-rose-400', badge: 'bg-rose-950/80 border-rose-500/60 text-rose-300' };
      case 'high':
      case 'severe':
        return { bg: 'bg-amber-500', text: 'text-amber-400', badge: 'bg-amber-950/80 border-amber-500/60 text-amber-300' };
      case 'moderate':
      case 'warning':
        return { bg: 'bg-yellow-500', text: 'text-yellow-400', badge: 'bg-yellow-950/80 border-yellow-500/60 text-yellow-300' };
      case 'low':
      default:
        return { bg: 'bg-emerald-500', text: 'text-emerald-400', badge: 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300' };
    }
  };

  const currentRiskTheme = getRiskColor(selectedStation.currentRisk);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto w-full font-sans">
      
      {/* 1. Header Ribbon & Live Intelligence Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  AI Real-Time Waterway Monitoring
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800">
                  CCTV + HYDRO-AI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Computer-vision water level detection, Doppler radar flow telemetry, and automated risk reasoning across India.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('camera')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'camera'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Camera &amp; Vision</span>
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'pipeline'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>AI Detection Pipeline</span>
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'matrix'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Station Matrix ({stations.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Live GIS Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME THRESHOLD BREACH ALERTS BANNER (If Active) */}
      {activeAlerts.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-500/50 p-4 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-500/20">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-mono font-black uppercase tracking-wider text-rose-300">
                ACTIVE AI WATERWAY FLOOD WARNING ALERTS ({activeAlerts.length})
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              SEOC High-Priority Telemetry Broadcast
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeAlerts.map(al => (
              <div key={al.id} className="p-3.5 rounded-xl bg-slate-950/90 border border-rose-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{al.title}</span>
                    <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                      {al.stationId}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                    RISK: {al.risk}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Location: <strong className="text-white">{al.location}</strong>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] font-mono pt-1 border-t border-slate-800 text-slate-400">
                  <div>Level: <strong className="text-white">{al.waterLevel.toFixed(2)}m</strong></div>
                  <div>Flow: <strong className="text-indigo-300">{al.flowRate} m³/s</strong></div>
                  <div>Rain: <strong className="text-cyan-300">{al.rainfall} mm/h</strong></div>
                  <div>Conf: <strong className="text-emerald-400">{al.confidence}%</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PRIMARY VIEW 1: CAMERA-BASED MONITORING & AI INFERENCE */}
      {activeTab === 'camera' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Simulated Camera Feed & Overlay (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
              
              {/* Camera Header Bar */}
              <div className="bg-slate-950 p-3 sm:px-4 flex items-center justify-between border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono font-bold text-white tracking-wider text-[11px]">
                    LIVE CCTV STREAM · {selectedStation.stationCode}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                    (30 FPS · H.265 RTSP)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Night vision toggle */}
                  <button
                    onClick={() => setNightVisionMode(!nightVisionMode)}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
                      nightVisionMode ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {nightVisionMode ? '🌙 THERMAL/NV ON' : '☀️ STANDARD'}
                  </button>
                  {/* Computer vision bounding box toggle */}
                  <button
                    onClick={() => setCvOverlayActive(!cvOverlayActive)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
                      cvOverlayActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cvOverlayActive ? '👁️ YOLO CV OVERLAY' : 'RAW FEED'}
                  </button>
                </div>
              </div>

              {/* Real-time Dynamic Video Canvas */}
              <div className="relative aspect-[16/10] w-full bg-slate-950">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full h-full object-cover"
                />

                {/* Prominent Demo/Simulated Watermark Badge (Mandatory Requirement) */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/60 backdrop-blur-md text-[10px] font-mono font-bold text-amber-300 shadow-lg">
                  <AlertTriangle className="h-3 w-3 text-amber-400" />
                  <span>DEMO / SIMULATED DATA</span>
                </div>

                {/* Reference Concept Overlay Card (Exact Requirements Match) */}
                <div className="absolute bottom-3 left-3 z-20 p-3 rounded-xl bg-slate-950/90 border border-slate-700/80 backdrop-blur-md shadow-2xl text-[11px] font-mono space-y-1 min-w-[210px]">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                    <span className="text-slate-400">STATION ID:</span>
                    <strong className="text-cyan-400 font-bold">{selectedStation.stationCode}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">RISK:</span>
                    <strong className={`font-bold ${currentRiskTheme.text}`}>
                      {selectedStation.currentRisk === 'critical' ? 'CRITICAL FLOOD' : selectedStation.currentRisk === 'high' ? 'FLOOD WARNING' : 'MODERATE RISK'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">CONFIDENCE:</span>
                    <strong className="text-emerald-400">{selectedStation.confidenceScore}%</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">WATER LEVEL:</span>
                    <strong className="text-white">
                      {Math.round(selectedStation.waterLevelM * 100)} cm ({selectedStation.waterLevelM.toFixed(2)} m)
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">FLOW:</span>
                    <strong className="text-indigo-300">{selectedStation.flowRateM3s} m³/s</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">RATE OF RISE:</span>
                    <strong className={selectedStation.rateOfRiseMPerHr > 0.2 ? 'text-rose-400' : 'text-slate-300'}>
                      +{selectedStation.rateOfRiseMPerHr} m/h
                    </strong>
                  </div>
                </div>

                {/* Camera Status & Timestamp (Top Right) */}
                <div className="absolute top-3 right-3 z-20 text-right font-mono text-[10px] text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 backdrop-blur-md">
                  <div className="flex items-center justify-end gap-1.5 text-emerald-400 font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>SENSOR: ONLINE</span>
                  </div>
                  <div className="text-slate-400 text-[9px] mt-0.5">Updated: {selectedStation.lastUpdated}</div>
                </div>
              </div>

              {/* Station Switcher Bottom Ribbon */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="text-[11px] font-mono text-slate-400 shrink-0">Switch Camera Feed:</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {stations.slice(0, 5).map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStationId(s.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                        selectedStation.id === s.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {s.stationCode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Simulation Trigger Buttons */}
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-white block">Simulation Controls</span>
                <span className="text-[11px] text-slate-400">Test rapid water-level increase and automated risk recalculation</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateSurge}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors flex items-center gap-1.5 shadow-lg"
                >
                  <Flame className="h-3.5 w-3.5" />
                  <span>Simulate Water Spike (+0.35m)</span>
                </button>
                <button
                  onClick={handleSimulateRecession}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reset / Drain</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: AI Water-Level Detection, Configurable Thresholds & Reasoning (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* 3. AI WATER-LEVEL DETECTION & GAUGE INDICATOR */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">
                    AI Water-Level Detection &amp; Gauge
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${currentRiskTheme.badge}`}>
                  {selectedStation.currentRisk} RISK
                </span>
              </div>

              {/* Water Level Big Readout */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs block">Detected Water Level</span>
                  <div className="text-3xl font-black font-mono text-white mt-0.5">
                    {selectedStation.waterLevelM.toFixed(2)} <span className="text-base text-cyan-400 font-normal">m</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    ({Math.round(selectedStation.waterLevelM * 100)} cm surface elevation)
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 text-xs block">Rate of Rise</span>
                  <div className={`text-xl font-bold font-mono mt-0.5 ${selectedStation.rateOfRiseMPerHr > 0.25 ? 'text-rose-400' : 'text-slate-200'}`}>
                    +{selectedStation.rateOfRiseMPerHr} <span className="text-xs">m/h</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {selectedStation.rateOfRiseMPerHr > 0.25 ? '⚡ Rapid Inundation Spike' : 'Steady Runoff'}
                  </span>
                </div>
              </div>

              {/* Visual Staff Gauge Meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Channel Gauge (0m to 3.0m)</span>
                  <span className="text-cyan-300 font-bold">{Math.round((selectedStation.waterLevelM / 3.0) * 100)}% Capacity</span>
                </div>

                <div className="h-4 bg-slate-950 rounded-full border border-slate-800 overflow-hidden relative">
                  {/* Safe Zone (Green) */}
                  <div className="absolute left-0 top-0 bottom-0 bg-emerald-500/30" style={{ width: `${(warningThreshold / 3.0) * 100}%` }} />
                  {/* Warning Zone (Amber) */}
                  <div
                    className="absolute top-0 bottom-0 bg-amber-500/30"
                    style={{
                      left: `${(warningThreshold / 3.0) * 100}%`,
                      width: `${((dangerThreshold - warningThreshold) / 3.0) * 100}%`
                    }}
                  />
                  {/* Danger Zone (Red) */}
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-rose-500/30"
                    style={{ left: `${(dangerThreshold / 3.0) * 100}%` }}
                  />

                  {/* Current Level Fill Bar */}
                  <div
                    className={`h-full transition-all duration-500 ${currentRiskTheme.bg}`}
                    style={{ width: `${Math.min(100, (selectedStation.waterLevelM / 3.0) * 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>0.0m (Bed)</span>
                  <span className="text-amber-400">Warn: {warningThreshold.toFixed(2)}m</span>
                  <span className="text-rose-400">Critical: {dangerThreshold.toFixed(2)}m</span>
                  <span>3.0m (Crest)</span>
                </div>
              </div>

              {/* Configurable Risk Threshold Sliders (User Requirement 3) */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
                    Configurable Risk Thresholds
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Dynamic Recalibration</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                      <span>Warning Threshold:</span>
                      <strong className="text-amber-400 font-mono">{warningThreshold.toFixed(2)} m</strong>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="2.4"
                      step="0.05"
                      value={warningThreshold}
                      onChange={e => setWarningThreshold(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                      <span>Critical Danger Threshold:</span>
                      <strong className="text-rose-400 font-mono">{dangerThreshold.toFixed(2)} m</strong>
                    </div>
                    <input
                      type="range"
                      min="2.0"
                      max="3.2"
                      step="0.05"
                      value={dangerThreshold}
                      onChange={e => setDangerThreshold(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. AI FLOOD-RISK REASONING & CONTRIBUTING FACTORS (User Requirements 4 & 5) */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">
                    AI Flood-Risk Engine &amp; Reasoning
                  </h3>
                </div>
                <div className="text-xs font-mono text-cyan-300 font-bold">
                  Confidence: {selectedStation.confidenceScore}%
                </div>
              </div>

              {/* AI Explanation Paragraph */}
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-200 leading-relaxed">
                <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold mb-1 flex items-center gap-1">
                  <span>AI DIAGNOSTIC EXPLANATION</span>
                </div>
                {selectedStation.currentRisk === 'critical' ? (
                  <p>
                    Flood risk is <strong className="text-rose-400 font-bold">CRITICAL</strong> because water level ({selectedStation.waterLevelM}m) has breached the critical threshold ({dangerThreshold}m), rainfall is surging at {selectedStation.rainfallMmHr} mm/hr, and downstream gravity discharge is overwhelmed.
                  </p>
                ) : selectedStation.currentRisk === 'high' ? (
                  <p>
                    Flood risk is <strong className="text-amber-400 font-bold">HIGH (FLOOD WARNING)</strong> because rainfall intensity is high ({selectedStation.rainfallMmHr} mm/hr), water level is rising rapidly (+{selectedStation.rateOfRiseMPerHr} m/hr), and drainage capacity is reduced to {selectedStation.drainageCapacityPercent}%.
                  </p>
                ) : (
                  <p>
                    Flood risk is <strong className="text-emerald-400 font-bold">STABLE/LOW</strong>. Water level is below the warning threshold ({warningThreshold}m) and canal culverts maintain active hydraulic clearance.
                  </p>
                )}
              </div>

              {/* Major Contributing Factors Breakdown */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400 font-semibold block">
                  Major Contributing Risk Factors:
                </span>
                <div className="space-y-1.5">
                  {selectedStation.contributingFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span className="text-slate-300">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multi-parameter Telemetry Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Flow Rate</span>
                  <strong className="text-indigo-300 text-sm">{selectedStation.flowRateM3s} m³/s</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Rainfall Intensity</span>
                  <strong className="text-cyan-300 text-sm">{selectedStation.rainfallMmHr} mm/h</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Drainage Capacity</span>
                  <strong className="text-white text-sm">{selectedStation.drainageCapacityPercent}%</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">GPS Coordinates</span>
                  <strong className="text-slate-300 text-[11px]">{selectedStation.coordinates[0].toFixed(3)}°N, {selectedStation.coordinates[1].toFixed(3)}°E</strong>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 4. PRIMARY VIEW 2: AI DETECTION PIPELINE ARCHITECTURE (User Requirement 9) */}
      {activeTab === 'pipeline' && (
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">AI Flood Detection Pipeline Architecture</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              End-to-end multi-modal data processing pipeline designed for real-time computer vision inference (YOLO/OpenCV) and hydrologic fusion.
            </p>
          </div>

          {/* Interactive Pipeline Stages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                title: 'Camera / Sensor Data',
                desc: 'Captures RTSP H.265 video streams from waterway CCTV and ultrasonic telemetry via LoRaWAN/NB-IoT.',
                status: 'ONLINE (30 FPS)'
              },
              {
                step: '02',
                title: 'Data Pre-Processing',
                desc: 'Frame extraction, lens distortion correction, contrast enhancement, and noise filtering.',
                status: 'LATENCY: 4ms'
              },
              {
                step: '03',
                title: 'Water-Level Detection',
                desc: 'Computer-vision staff gauge reading and water surface segmentation (YOLOv8-Seg model architecture).',
                status: 'ACTIVE INFERENCE'
              },
              {
                step: '04',
                title: 'Flow & Rainfall Analysis',
                desc: 'Fuses optical flow vector tracking with automated tipping-bucket rain gauge data.',
                status: 'FUSED TELEMETRY'
              },
              {
                step: '05',
                title: 'AI Flood-Risk Engine',
                desc: 'Calculates multi-input probability distribution using catchment runoff and culvert surcharge models.',
                status: 'EVALUATING'
              },
              {
                step: '06',
                title: 'Risk Classification',
                desc: 'Categorizes basin status into LOW, MODERATE, HIGH, or CRITICAL with confidence scores.',
                status: 'CLASSIFIED'
              },
              {
                step: '07',
                title: 'AI Explanation Generator',
                desc: 'Synthesizes plain-language diagnostic reasoning with ranked contributing factors.',
                status: 'LLM REASONER'
              },
              {
                step: '08',
                title: 'Real-Time Alert Dispatch',
                desc: 'Broadcasts CAP standard warning sirens, SMS cell alerts, and automated sluice triggers.',
                status: 'WEBSOCKET DISPATCH'
              },
              {
                step: '09',
                title: 'Emergency Dashboard Integration',
                desc: 'Synchronizes live telemetry into the State Emergency Operations Center (SEOC) Common Operating Picture.',
                status: 'SYNCHRONIZED'
              }
            ].map(stage => (
              <div key={stage.step} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">STAGE {stage.step}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                    {stage.status}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{stage.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{stage.desc}</p>
              </div>
            ))}
          </div>

          {/* Computer Vision Readiness Callout (User Requirement 10) */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-cyan-300 block">Computer Vision (YOLO/OpenCV) Architecture Ready</span>
              <p className="text-slate-300">
                Interfaces are prepared for staff gauge detection, flooded area segmentation, and blocked drain detection. In the current demo, simulated inference pipelines are clearly marked as <strong>DEMO / SIMULATED</strong>.
              </p>
            </div>
            <span className="shrink-0 px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-[11px]">
              YOLOv8-Seg Ready
            </span>
          </div>
        </div>
      )}

      {/* 5. PRIMARY VIEW 3: STATIONS MATRIX GRID */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search stations across India..."
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-full sm:w-60"
              />

              <select
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">All Cities</option>
                <option value="chennai">Chennai</option>
                <option value="mumbai">Mumbai</option>
                <option value="bengaluru">Bengaluru</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="guwahati">Guwahati</option>
              </select>

              <select
                value={riskFilter}
                onChange={e => setRiskFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">All Risk Levels</option>
                <option value="critical">Critical Only</option>
                <option value="high">High Risk</option>
                <option value="moderate">Moderate</option>
                <option value="low">Low Risk</option>
              </select>
            </div>

            <span className="text-xs font-mono text-slate-400 self-end sm:self-auto">
              Showing {filteredStations.length} of {stations.length} stations
            </span>
          </div>

          {/* Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStations.map(s => {
              const theme = getRiskColor(s.currentRisk);
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedStationId(s.id);
                    setActiveTab('camera');
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedStation.id === s.id
                      ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                        {s.stationCode}
                      </span>
                      <h4 className="font-bold text-white text-sm mt-1.5">{s.name}</h4>
                      <p className="text-xs text-slate-400">{s.waterwayName} · {s.cityName}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${theme.badge}`}>
                      {s.currentRisk}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Level</span>
                      <strong className="text-white font-bold">{s.waterLevelM.toFixed(2)}m</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Flow</span>
                      <strong className="text-indigo-300 font-bold">{s.flowRateM3s} m³/s</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Rain</span>
                      <strong className="text-cyan-300 font-bold">{s.rainfallMmHr} mm/h</strong>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800/60">
                    <span className="text-emerald-400">Conf: {s.confidenceScore}%</span>
                    <span className="text-cyan-400 flex items-center gap-1 hover:underline">
                      <span>Inspect Camera</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. PRIMARY VIEW 4: LIVE FLOOD MAP WITH COLOR-CODED MARKERS */}
      {activeTab === 'map' && (
        <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">Live Waterway Monitoring GIS Network</h2>
              <p className="text-xs text-slate-400">
                Markers color-coded by real-time risk tier: <strong className="text-emerald-400">GREEN = LOW</strong>, <strong className="text-yellow-400">YELLOW = MODERATE</strong>, <strong className="text-amber-400">ORANGE = HIGH</strong>, <strong className="text-rose-400">RED = CRITICAL</strong>.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('camera')}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors self-start sm:self-auto"
            >
              Open Camera Feed for {selectedStation.stationCode}
            </button>
          </div>

          <InteractiveGISMap heightClass="h-[620px]" />
        </div>
      )}

    </div>
  );
};
