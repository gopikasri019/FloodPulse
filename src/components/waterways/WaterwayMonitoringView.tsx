import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Radio,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Droplets,
  Gauge,
  Sliders,
  Wind,
  ShieldAlert,
  BatteryCharging,
  Wifi,
  Search,
  MapPin,
  Play,
  Pause,
  Zap,
  Volume2,
  VolumeX,
  Eye,
  Check,
  X,
  Clock,
  Layers,
  Sparkles,
  RefreshCw,
  BellRing
} from 'lucide-react';
import {
  WaterwayStation,
  WaterwayRiskLevel,
  WaterwayScenarioType,
  WaterwayAlert,
  WaterwayEmergencyAction,
  WaterwayTelemetryPoint
} from '../../types';
import { waterwaySimulator } from '../../services/waterwaySimulator';
import { useFloodPulse } from '../../context/FloodPulseContext';

export const WaterwayMonitoringView: React.FC = () => {
  const { activeCity } = useFloodPulse();
  const [stations, setStations] = useState<WaterwayStation[]>([]);
  const [alerts, setAlerts] = useState<WaterwayAlert[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [scenario, setScenario] = useState<WaterwayScenarioType>('monsoon_surge');
  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(3000);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Subscribe to real-time simulator updates
  useEffect(() => {
    const unsubscribe = waterwaySimulator.subscribe((newStations, newAlerts) => {
      setStations([...newStations]);
      setAlerts([...newAlerts]);
    });

    setScenario(waterwaySimulator.getCurrentScenario());
    setIsSimRunning(waterwaySimulator.isSimulatorRunning());
    setAudioEnabled(waterwaySimulator.isAudioAlertEnabled());

    return () => unsubscribe();
  }, []);

  // Sync city filter on mount or if activeCity changes
  useEffect(() => {
    if (activeCity?.id) {
      setCityFilter(activeCity.id);
    }
  }, [activeCity?.id]);

  const selectedStation = useMemo(() => {
    if (!selectedStationId) return stations[0] || null;
    return stations.find((s) => s.id === selectedStationId) || stations[0] || null;
  }, [stations, selectedStationId]);

  // Filtered stations list
  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const matchCity = cityFilter === 'all' || station.cityId.toLowerCase() === cityFilter.toLowerCase();
      const matchRisk = riskFilter === 'all' || station.currentRisk.toLowerCase() === riskFilter.toLowerCase();
      const matchSearch =
        searchQuery === '' ||
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.stationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.waterwayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.cityName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCity && matchRisk && matchSearch;
    });
  }, [stations, cityFilter, riskFilter, searchQuery]);

  // Network Telemetry Summary Stats
  const stats = useMemo(() => {
    const total = stations.length;
    const online = stations.filter((s) => s.sensorStatus === 'online').length;
    const warning = stations.filter((s) => s.sensorStatus === 'warning').length;
    const fault = stations.filter((s) => s.sensorStatus === 'fault' || s.sensorStatus === 'offline').length;
    const criticalGauges = stations.filter((s) => s.currentRisk === 'critical').length;
    const highGauges = stations.filter((s) => s.currentRisk === 'high').length;

    const maxRateOfRise = stations.reduce(
      (max, s) => (s.rateOfRiseMPerHr > max ? s.rateOfRiseMPerHr : max),
      0
    );

    const avgDrainageCapacity = total > 0
      ? Math.round(stations.reduce((acc, s) => acc + s.drainageCapacityPercent, 0) / total)
      : 50;

    const avgConfidence = total > 0
      ? (stations.reduce((acc, s) => acc + s.confidenceScore, 0) / total).toFixed(1)
      : '92.5';

    return {
      total,
      online,
      warning,
      fault,
      criticalGauges,
      highGauges,
      maxRateOfRise,
      avgDrainageCapacity,
      avgConfidence
    };
  }, [stations]);

  // Scenario toggle handler
  const handleScenarioChange = (newScenario: WaterwayScenarioType) => {
    setScenario(newScenario);
    waterwaySimulator.setScenario(newScenario);
  };

  // Play/Pause simulation
  const togglePlayPause = () => {
    if (isSimRunning) {
      waterwaySimulator.pauseSimulation();
      setIsSimRunning(false);
    } else {
      waterwaySimulator.resumeSimulation();
      setIsSimRunning(true);
    }
  };

  // Speed change handler
  const handleSpeedChange = (speedMs: number) => {
    setSpeedMultiplier(speedMs);
    waterwaySimulator.setSpeed(speedMs);
  };

  // Trigger critical cloudburst surge
  const handleTriggerSurge = () => {
    waterwaySimulator.triggerSurgeSpike();
    setScenario('cloudburst_spike');
    setActionFeedback('⚡ Extreme Cloudburst Surge Triggered Across Network!');
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Approve action handler
  const handleApproveAction = (stationId: string, actionId: string) => {
    waterwaySimulator.approveAction(stationId, actionId);
    setActionFeedback('✓ AI Emergency Action Approved and Dispatched to Response Teams');
    setTimeout(() => setActionFeedback(null), 3500);
  };

  // Reject action handler
  const handleRejectAction = (stationId: string, actionId: string) => {
    waterwaySimulator.rejectAction(stationId, actionId);
    setActionFeedback('✕ Action Rejected by Command Operator');
    setTimeout(() => setActionFeedback(null), 3500);
  };

  // Helper for risk badge styling
  const getRiskBadge = (risk: WaterwayRiskLevel) => {
    switch (risk) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            HIGH RISK
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            MODERATE
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            LOW RISK
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Top Banner & Control Ribbon */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Radio className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  AI Real-Time Waterway Monitoring &amp; Flood Risk Engine
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Autonomous IoT sensor stream, hydrological hydrodynamic modeling, rate-of-rise nowcasting, and agentic action dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Global Simulation Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Scenario Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Scenario:</span>
            <select
              value={scenario}
              onChange={(e) => handleScenarioChange(e.target.value as WaterwayScenarioType)}
              className="bg-transparent text-cyan-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="monsoon_surge" className="bg-slate-900 text-slate-100">Monsoon Surge (Rising)</option>
              <option value="cloudburst_spike" className="bg-slate-900 text-slate-100">Flash Cloudburst Spike</option>
              <option value="normal" className="bg-slate-900 text-slate-100">Normal Dry / Low Tide</option>
              <option value="reservoir_release" className="bg-slate-900 text-slate-100">Reservoir Outflow Surge</option>
              <option value="sensor_fault" className="bg-slate-900 text-slate-100">Sensor Drift / Anomaly</option>
            </select>
          </div>

          {/* Trigger Critical Surge Button */}
          <button
            onClick={handleTriggerSurge}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 rounded-xl transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            title="Simulate sudden cloudburst water level spike"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span>Trigger Critical Surge</span>
          </button>

          {/* Speed & Pause */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={togglePlayPause}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isSimRunning ? 'text-emerald-400 hover:bg-emerald-950/40' : 'text-amber-400 hover:bg-amber-950/40'
              }`}
              title={isSimRunning ? 'Pause Live Telemetry Stream' : 'Resume Live Telemetry Stream'}
            >
              {isSimRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={() => handleSpeedChange(speedMultiplier === 1500 ? 3000 : 1500)}
              className="px-2 py-1 text-[11px] font-mono font-semibold rounded-lg text-slate-300 hover:bg-slate-800"
              title="Toggle Telemetry Tick Frequency"
            >
              {speedMultiplier === 1500 ? '2x FAST' : '1x RT'}
            </button>
          </div>

          {/* Audio toggle */}
          <button
            onClick={() => {
              const res = waterwaySimulator.toggleAudioAlert();
              setAudioEnabled(res);
            }}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              audioEnabled
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={audioEnabled ? 'Mute Alert Chimes' : 'Enable Alert Chimes'}
          >
            {audioEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionFeedback && (
        <div className="bg-cyan-950/80 border border-cyan-500/50 p-3 rounded-xl flex items-center justify-between text-xs text-cyan-200 animate-fadeIn shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="font-semibold">{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-cyan-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Network KPI Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Monitored Stations</span>
            <Gauge className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{stats.total}</span>
            <span className="text-[11px] text-emerald-400">{stats.online} Online</span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="text-amber-400">{stats.warning} Warning</span>
            <span>·</span>
            <span className="text-rose-400">{stats.fault} Offline</span>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border transition-all ${
          stats.criticalGauges > 0
            ? 'bg-rose-950/30 border-rose-500/40 shadow-lg shadow-rose-950/30'
            : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className={stats.criticalGauges > 0 ? 'text-rose-300 font-semibold' : 'text-slate-400'}>
              Critical Gauges
            </span>
            <ShieldAlert className={`h-4 w-4 ${stats.criticalGauges > 0 ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${stats.criticalGauges > 0 ? 'text-rose-400' : 'text-white'}`}>
              {stats.criticalGauges}
            </span>
            <span className="text-[11px] text-amber-400 font-medium">+{stats.highGauges} High Risk</span>
          </div>
          <div className="mt-1.5 text-[10px] text-slate-400">
            {stats.criticalGauges > 0 ? 'Thresholds breached' : 'Operating within limits'}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Peak Rate of Rise</span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">
              +{stats.maxRateOfRise.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">m / hr</span>
          </div>
          <div className="mt-1.5 text-[10px] text-slate-400">
            {stats.maxRateOfRise > 0.35 ? '⚠️ Rapid runoff surge' : 'Steady inflow velocity'}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Drainage Capacity</span>
            <Droplets className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${
              stats.avgDrainageCapacity < 30 ? 'text-rose-400' : stats.avgDrainageCapacity < 60 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {stats.avgDrainageCapacity}%
            </span>
            <span className="text-[11px] text-slate-400">remaining</span>
          </div>
          <div className="mt-1.5 text-[10px] text-slate-400">
            {stats.avgDrainageCapacity < 30 ? 'Near hydraulic lock' : 'Gravity outfalls active'}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>AI Risk Engine</span>
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">{stats.avgConfidence}%</span>
            <span className="text-[11px] text-slate-400">confidence</span>
          </div>
          <div className="mt-1.5 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Agentic dispatch active</span>
          </div>
        </div>
      </div>

      {/* Active Threshold Breach Alerts Ticker */}
      {alerts.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-500/50 p-3.5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
            <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
              <BellRing className="h-4 w-4 text-rose-400 animate-pulse" />
              <span>Real-Time Waterway Threshold Breaches &amp; Alarms ({alerts.length})</span>
            </div>
            <button
              onClick={() => waterwaySimulator.clearAllAlerts()}
              className="text-[11px] text-rose-400 hover:text-rose-200 underline"
            >
              Clear All
            </button>
          </div>
          <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {alerts.slice(0, 4).map((al) => (
              <div
                key={al.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-slate-950/60 border border-rose-900/50 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500 text-white uppercase">
                    {al.severity}
                  </span>
                  <span className="font-medium text-slate-200">{al.message}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono">{al.timestamp}</span>
                  <button
                    onClick={() => setSelectedStationId(al.stationId)}
                    className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-medium border border-rose-500/30 transition-colors"
                  >
                    Inspect Station
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Navigation Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 p-3 rounded-xl">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* City Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-200">All Cities ({stations.length})</option>
              <option value="chennai" className="bg-slate-900 text-slate-200">Chennai</option>
              <option value="mumbai" className="bg-slate-900 text-slate-200">Mumbai</option>
              <option value="bengaluru" className="bg-slate-900 text-slate-200">Bengaluru</option>
              <option value="hyderabad" className="bg-slate-900 text-slate-200">Hyderabad</option>
              <option value="guwahati" className="bg-slate-900 text-slate-200">Guwahati</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-slate-200">All Risk Levels</option>
              <option value="critical" className="bg-slate-900 text-rose-400">Critical Only</option>
              <option value="high" className="bg-slate-900 text-amber-400">High Risk</option>
              <option value="moderate" className="bg-slate-900 text-sky-400">Moderate</option>
              <option value="low" className="bg-slate-900 text-emerald-400">Low Risk</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station, river..."
              className="bg-slate-950 pl-8 pr-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-44"
            />
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Matrix Grid ({filteredStations.length})
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              viewMode === 'map' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            GIS Sensor Map
          </button>
        </div>
      </div>

      {/* Main Content Area: Left Grid / Map & Right Detailed Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Stations Grid or Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredStations.map((station) => {
                const isSelected = selectedStation?.id === station.id;
                const ratioToDanger = Math.min(100, Math.round((station.waterLevelM / station.dangerThresholdM) * 100));

                return (
                  <div
                    key={station.id}
                    onClick={() => setSelectedStationId(station.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-bold text-cyan-400">
                            {station.stationCode}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-mono">
                            {station.protocol}
                          </span>
                        </div>
                        <h2 className="text-sm font-bold text-white mt-0.5 leading-snug">
                          {station.name}
                        </h2>
                        <span className="text-[11px] text-slate-400">
                          {station.waterwayName} · {station.cityName}
                        </span>
                      </div>
                      <div>{getRiskBadge(station.currentRisk)}</div>
                    </div>

                    {/* Water Level Gauge Bar */}
                    <div className="mt-3.5 space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-400 font-medium">Water Depth</span>
                        <div className="flex items-baseline gap-1 font-mono">
                          <span className={`text-lg font-bold ${
                            station.currentRisk === 'critical' ? 'text-rose-400' : station.currentRisk === 'high' ? 'text-amber-400' : 'text-cyan-300'
                          }`}>
                            {station.waterLevelM.toFixed(2)} m
                          </span>
                          <span className="text-[10px] text-slate-500">
                            / {station.dangerThresholdM.toFixed(2)}m danger
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div
                          className={`h-full transition-all duration-500 ${
                            station.currentRisk === 'critical'
                              ? 'bg-rose-500'
                              : station.currentRisk === 'high'
                              ? 'bg-amber-500'
                              : station.currentRisk === 'moderate'
                              ? 'bg-sky-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${ratioToDanger}%` }}
                        />
                      </div>
                    </div>

                    {/* Telemetry Chips */}
                    <div className="mt-3 grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-800/80 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Rate of Rise</span>
                        <span className={`font-semibold flex items-center gap-0.5 ${
                          station.rateOfRiseMPerHr > 0.3 ? 'text-rose-400' : station.rateOfRiseMPerHr > 0.1 ? 'text-amber-400' : 'text-slate-300'
                        }`}>
                          {station.rateOfRiseMPerHr >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {station.rateOfRiseMPerHr >= 0 ? '+' : ''}{station.rateOfRiseMPerHr.toFixed(2)}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 text-[10px] block">Rainfall</span>
                        <span className="font-semibold text-slate-200">
                          {station.rainfallMmHr} <span className="text-[9px] text-slate-400">mm/h</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 text-[10px] block">Drainage</span>
                        <span className={`font-semibold ${
                          station.drainageCapacityPercent < 25 ? 'text-rose-400' : 'text-slate-200'
                        }`}>
                          {station.drainageCapacityPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Footer button */}
                    <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/60">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Wifi className="h-3 w-3 text-cyan-400" />
                        <span>{station.signalRssi} dBm</span>
                        <span>·</span>
                        <BatteryCharging className="h-3 w-3 text-emerald-400" />
                        <span>{station.batteryPercent}%</span>
                      </div>
                      <span className="text-cyan-400 font-medium hover:underline flex items-center gap-0.5">
                        Inspect Telemetry <Eye className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* GIS Interactive Sensor Map Canvas */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-cyan-400" />
                    Spatial Waterway Network Sensor GIS
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click any station node to open hydro-telemetry and trigger emergency agent dispatch.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-rose-400">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" /> Critical
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> High
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Normal
                  </span>
                </div>
              </div>

              {/* Tactical Sensor Map Canvas Representation */}
              <div className="relative h-[480px] w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                  }}
                />

                {/* SVG Waterway Rivers & Station Nodes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 400">
                  <defs>
                    <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Flow curves */}
                  <path
                    d="M 50 80 Q 200 140, 320 220 T 550 340"
                    fill="none"
                    stroke="url(#riverGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="opacity-70"
                  />
                  <path
                    d="M 120 350 Q 260 260, 420 180 T 580 80"
                    fill="none"
                    stroke="#0369a1"
                    strokeWidth="5"
                    strokeDasharray="4 4"
                    className="opacity-50"
                  />
                  <path
                    d="M 30 240 Q 220 210, 380 260 T 560 220"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="6"
                    className="opacity-60"
                  />
                </svg>

                {/* Interactive Station Markers */}
                <div className="relative w-full h-full">
                  {filteredStations.map((stn, idx) => {
                    // Normalize station coords to relative canvas percentage
                    const xPercent = 15 + ((idx * 27) % 72);
                    const yPercent = 20 + ((idx * 31) % 65);
                    const isSelected = selectedStation?.id === stn.id;

                    const colorClass =
                      stn.currentRisk === 'critical'
                        ? 'bg-rose-500 ring-rose-400 text-rose-300'
                        : stn.currentRisk === 'high'
                        ? 'bg-amber-500 ring-amber-400 text-amber-300'
                        : stn.currentRisk === 'moderate'
                        ? 'bg-sky-500 ring-sky-400 text-sky-300'
                        : 'bg-emerald-500 ring-emerald-400 text-emerald-300';

                    return (
                      <div
                        key={stn.id}
                        onClick={() => setSelectedStationId(stn.id)}
                        style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                      >
                        <div className="relative flex items-center justify-center">
                          {stn.currentRisk === 'critical' && (
                            <span className="absolute h-8 w-8 rounded-full bg-rose-500/40 animate-ping" />
                          )}
                          <div
                            className={`h-5 w-5 rounded-full border-2 border-slate-900 shadow-lg flex items-center justify-center transition-transform group-hover:scale-125 ${
                              isSelected ? 'scale-125 ring-4 ring-cyan-400' : ''
                            } ${colorClass.split(' ')[0]}`}
                          />
                        </div>

                        {/* Station popup card on hover or select */}
                        <div
                          className={`absolute left-1/2 -translate-x-1/2 bottom-7 w-48 p-2 rounded-lg bg-slate-900/95 border shadow-xl backdrop-blur-md text-[11px] pointer-events-auto transition-opacity z-30 ${
                            isSelected
                              ? 'opacity-100 border-cyan-500'
                              : 'opacity-0 group-hover:opacity-100 border-slate-700'
                          }`}
                        >
                          <div className="font-bold text-white truncate">{stn.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{stn.waterwayName}</div>
                          <div className="mt-1 flex items-center justify-between font-mono">
                            <span className="text-cyan-400 font-semibold">{stn.waterLevelM.toFixed(2)}m</span>
                            <span className="text-[10px] text-slate-400">+{stn.rateOfRiseMPerHr}m/h</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Station Detail Drawer & Inspection Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedStation ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-5 shadow-2xl backdrop-blur-md">
              
              {/* Station Drawer Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      {selectedStation.stationCode}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedStation.coordinates[0].toFixed(4)}°N, {selectedStation.coordinates[1].toFixed(4)}°E
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {selectedStation.name}
                  </h3>
                  <div className="text-xs text-slate-400">
                    Waterway: <strong className="text-slate-200">{selectedStation.waterwayName}</strong> ({selectedStation.cityName})
                  </div>
                </div>
                <div className="text-right">
                  {getRiskBadge(selectedStation.currentRisk)}
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Updated {selectedStation.lastUpdated}
                  </div>
                </div>
              </div>

              {/* Hydrodynamic Riverbed Gauge Tank Visualizer */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Droplets className="h-4 w-4 text-cyan-400" />
                    Hydraulic Gauge Profile &amp; Freeboard
                  </span>
                  <span className="font-mono text-cyan-300 font-bold text-sm">
                    {selectedStation.waterLevelM.toFixed(2)} m
                  </span>
                </div>

                {/* SVG Visualizer Graphic */}
                <div className="relative h-28 w-full bg-slate-900/80 rounded-lg overflow-hidden border border-slate-800 flex flex-col justify-end">
                  {/* Danger line */}
                  <div
                    className="absolute w-full border-b border-rose-500 border-dashed z-10 flex items-center justify-between px-2 text-[10px] text-rose-400 font-mono"
                    style={{
                      bottom: `${Math.min(92, (selectedStation.dangerThresholdM / (selectedStation.dangerThresholdM * 1.25)) * 100)}%`
                    }}
                  >
                    <span>Danger ({selectedStation.dangerThresholdM.toFixed(2)}m)</span>
                    <span className="bg-rose-950 px-1 rounded text-[9px]">CRITICAL</span>
                  </div>

                  {/* Warning line */}
                  <div
                    className="absolute w-full border-b border-amber-500/80 border-dashed z-10 flex items-center justify-between px-2 text-[10px] text-amber-400 font-mono"
                    style={{
                      bottom: `${Math.min(80, (selectedStation.warningThresholdM / (selectedStation.dangerThresholdM * 1.25)) * 100)}%`
                    }}
                  >
                    <span>Warning ({selectedStation.warningThresholdM.toFixed(2)}m)</span>
                  </div>

                  {/* Water Depth Layer with Wave Effect */}
                  <div
                    className={`w-full transition-all duration-700 relative ${
                      selectedStation.currentRisk === 'critical'
                        ? 'bg-gradient-to-t from-rose-900/80 to-rose-600/70'
                        : selectedStation.currentRisk === 'high'
                        ? 'bg-gradient-to-t from-amber-900/80 to-amber-600/70'
                        : 'bg-gradient-to-t from-cyan-900/80 to-cyan-500/70'
                    }`}
                    style={{
                      height: `${Math.min(98, Math.max(10, (selectedStation.waterLevelM / (selectedStation.dangerThresholdM * 1.25)) * 100))}%`
                    }}
                  >
                    {/* Simulated surface shimmer */}
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-white/30 animate-pulse" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>Riverbed Base: 0.00m</span>
                  <span className={`font-semibold ${selectedStation.rateOfRiseMPerHr > 0.3 ? 'text-rose-400' : 'text-slate-300'}`}>
                    Rate: {selectedStation.rateOfRiseMPerHr >= 0 ? '+' : ''}{selectedStation.rateOfRiseMPerHr.toFixed(2)} m/hr
                  </span>
                  <span>Max Gauge: {(selectedStation.dangerThresholdM * 1.25).toFixed(2)}m</span>
                </div>
              </div>

              {/* Time-Series Telemetry Charts (SVG) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-cyan-400" />
                    Telemetry History Trend (Water Level &amp; Rain)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Last 6 Readings</span>
                </div>

                {/* SVG Time-Series Chart */}
                <div className="h-32 bg-slate-950 p-2 rounded-xl border border-slate-800 relative">
                  <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="25" x2="300" y2="25" stroke="#334155" strokeDasharray="2 2" strokeWidth="0.5" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#334155" strokeDasharray="2 2" strokeWidth="0.5" />
                    <line x1="0" y1="75" x2="300" y2="75" stroke="#334155" strokeDasharray="2 2" strokeWidth="0.5" />

                    {/* Water Level Trend Line */}
                    {selectedStation.telemetryHistory.length > 1 && (() => {
                      const points = selectedStation.telemetryHistory.map((pt: WaterwayTelemetryPoint, idx: number) => {
                        const x = (idx / (selectedStation.telemetryHistory.length - 1)) * 300;
                        const y = 90 - (pt.waterLevelM / (selectedStation.dangerThresholdM * 1.2)) * 80;
                        return `${x},${Math.max(5, y)}`;
                      }).join(' ');

                      return (
                        <>
                          <polyline
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={points}
                          />
                          {selectedStation.telemetryHistory.map((pt: WaterwayTelemetryPoint, idx: number) => {
                            const x = (idx / (selectedStation.telemetryHistory.length - 1)) * 300;
                            const y = 90 - (pt.waterLevelM / (selectedStation.dangerThresholdM * 1.2)) * 80;
                            return (
                              <circle
                                key={idx}
                                cx={x}
                                cy={Math.max(5, y)}
                                r="3"
                                fill="#06b6d4"
                                stroke="#0f172a"
                                strokeWidth="1.5"
                              />
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>

                  {/* Horizontal labels */}
                  <div className="absolute bottom-1 inset-x-2 flex justify-between text-[9px] font-mono text-slate-500">
                    {selectedStation.telemetryHistory.slice(-4).map((pt: WaterwayTelemetryPoint, i: number) => (
                      <span key={i}>{pt.timestamp}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Risk Decision & Contributing Factors */}
              <div className="space-y-2 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    AI Risk Reasoning &amp; Contributing Factors
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="text-slate-400">Confidence:</span>
                    <strong className="text-cyan-300">{selectedStation.confidenceScore}%</strong>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  {selectedStation.contributingFactors.map((factor: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agentic AI Action Recommendations & Human-In-The-Loop Approval */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-amber-400" />
                    Agentic AI Recommendations ({selectedStation.recommendedActions?.length || 0})
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Operator Review</span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedStation.recommendedActions && selectedStation.recommendedActions.length > 0 ? (
                    selectedStation.recommendedActions.map((action: WaterwayEmergencyAction) => (
                      <div
                        key={action.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
                            {action.priority === 'critical' ? (
                              <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                            ) : (
                              <Activity className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            )}
                            {action.title}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            action.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : action.status === 'rejected'
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {action.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {action.description}
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-slate-500">
                          <span>Target: <strong className="text-slate-400">{action.targetEntity}</strong></span>
                          <span>{action.timestamp}</span>
                        </div>

                        {/* Human approval buttons */}
                        {action.status === 'pending' && (
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleApproveAction(selectedStation.id, action.id)}
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Approve &amp; Dispatch</span>
                            </button>
                            <button
                              onClick={() => handleRejectAction(selectedStation.id, action.id)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-500 bg-slate-950 rounded-xl">
                      No active emergency actions needed for this station.
                    </div>
                  )}
                </div>
              </div>

              {/* Hardware Diagnostics Bar */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <BatteryCharging className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{selectedStation.batteryPercent}% {selectedStation.solarCharging ? '(Solar)' : '(Batt)'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wifi className="h-3.5 w-3.5 text-cyan-400" />
                  <span>RSSI {selectedStation.signalRssi} dBm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Interval 3s</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
              Select a waterway station on the left to inspect its telemetry and AI recommendations.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
