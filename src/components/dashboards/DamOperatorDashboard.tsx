import React, { useState } from 'react';
import {
  Waves,
  Sliders,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Activity,
  Gauge,
  CheckCircle,
  ShieldAlert,
  Info,
  Layers
} from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';

export const DamOperatorDashboard: React.FC = () => {
  const { dam, simulateDamRelease, activeCity, currentUser } = useFloodPulse();
  const [releaseSlider, setReleaseSlider] = useState<number>(dam.plannedReleaseCusecs || 10500);
  const [simulationActive, setSimulationActive] = useState(false);

  const handleSimulate = () => {
    simulateDamRelease(releaseSlider);
    setSimulationActive(true);
  };

  const downstreamImpactTimeMin = releaseSlider > 12000 ? 55 : releaseSlider > 10000 ? 75 : 120;
  const projectedSaidapetRiseM = releaseSlider > 12000 ? 0.65 : releaseSlider > 10000 ? 0.42 : 0.2;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div>
          <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            HYDRO-INFRASTRUCTURE &amp; RESERVOIR CONTROL
          </span>
          <h1 className="text-xl font-bold text-white">{dam.name}</h1>
          <p className="text-xs text-slate-400">
            Water Resources Department · Basin Control Node · {currentUser.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-3 py-1 rounded-lg">
            BASIN: ADYAR &amp; POONAMALLEE
          </span>
        </div>
      </div>

      {/* Primary Reservoir Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1 font-medium">Current Water Level</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono tabular-nums">
            {dam.currentLevelM}m
          </div>
          <span className="text-[11px] text-slate-500 font-mono">FRL: {dam.fullReservoirLevelM}m</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1 font-medium">Storage Percentage</span>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
            {dam.storagePercentage}%
          </div>
          <span className="text-[11px] text-amber-500 font-mono">Warning threshold: 85%</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1 font-medium">Catchment Inflow</span>
          <div className="text-2xl font-bold text-white font-mono tabular-nums flex items-center gap-1">
            <ArrowUp className="h-5 w-5 text-red-400" />
            <span>{dam.inflowCusecs.toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">cusecs (surging)</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1 font-medium">Managed Outflow</span>
          <div className="text-2xl font-bold text-white font-mono tabular-nums flex items-center gap-1">
            <ArrowDown className="h-5 w-5 text-blue-400" />
            <span>{dam.outflowCusecs.toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">{dam.openGates} of {dam.gateCount} gates active</span>
        </div>

      </div>

      {/* Interactive Discharge Simulator */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">HYDRODYNAMIC SIMULATION</span>
            <h3 className="text-base font-bold text-white">Controlled Gate Release &amp; Downstream Impact Model</h3>
            <p className="text-xs text-slate-400">
              Test planned discharge volume and evaluate wave front velocity and downstream flood risk.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-amber-400 bg-amber-950/70 border border-amber-800 px-2.5 py-1 rounded-lg">
              HUMAN OPERATOR AUTHORIZATION REQUIRED
            </span>
          </div>
        </div>

        {/* Release Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Planned Discharge Rate:</span>
            <span className="text-base font-mono font-bold text-cyan-300">
              {releaseSlider.toLocaleString()} cusecs
            </span>
          </div>
          <input
            type="range"
            min="5000"
            max="25000"
            step="500"
            value={releaseSlider}
            onChange={e => setReleaseSlider(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>5,000 cusecs (Nominal)</span>
            <span>12,000 cusecs (Safe River Limit)</span>
            <span>25,000 cusecs (Severe Inundation)</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSimulate}
            className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors shadow-lg shadow-cyan-950/50 flex items-center gap-2"
          >
            <Gauge className="h-4 w-4" />
            <span>Run Downstream Wave Front Simulation</span>
          </button>
        </div>

        {/* Simulation Output Card */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold">Simulated Hydraulic Consequences</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
              dam.downstreamRiskLevel === 'critical' ? 'bg-red-950 text-red-400 border border-red-800' :
              dam.downstreamRiskLevel === 'warning' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
              'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>
              {dam.downstreamRiskLevel} Downstream Risk
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Wave Arrival at Saidapet</span>
              <span className="text-sm font-bold text-white font-mono">{downstreamImpactTimeMin} minutes</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Projected River Rise</span>
              <span className="text-sm font-bold text-amber-400 font-mono">+{projectedSaidapetRiseM}m</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Buffer Zone Impact</span>
              <span className="text-sm font-bold text-slate-300">Ward 170-174 Banks</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-300">
            <strong>AI Dam Risk Agent Advisory:</strong> {dam.aiRecommendation}
          </div>
        </div>

      </div>

      {/* Safety Notice Rule */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <p>
          <strong>Safety Protocol Compliance:</strong> AI agents provide 2D hydrodynamic flood forecasts and advisory notifications. Direct physical actuation of dam sluice gates is strictly isolated and reserved exclusively for authorized human engineers on-site.
        </p>
      </div>

    </div>
  );
};
