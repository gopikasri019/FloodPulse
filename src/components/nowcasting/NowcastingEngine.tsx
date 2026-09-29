import React, { useState } from 'react';
import {
  CloudRain,
  Activity,
  Droplets,
  TrendingUp,
  Clock,
  Gauge,
  Sliders,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Compass,
  CheckCircle2,
  AlertCircle,
  GitCompare
} from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';
import { NowcastPrediction } from '../../types';

export const NowcastingEngine: React.FC = () => {
  const { nowcasts, activeCity } = useFloodPulse();
  const [selectedPrediction, setSelectedPrediction] = useState<NowcastPrediction>(nowcasts[0]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase mb-1">
            <CloudRain className="h-4 w-4" />
            <span>0–3 HOUR HYDRO-PHYSICS NOWCASTING ENGINE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            High-Resolution Urban Inundation Nowcasting ({activeCity.name})
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Coupling Doppler precipitation nowcasting, terrain digital elevation models (DEM), storm drain Manning friction coefficients, and astronomical tidal backflow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>MODEL CALIBRATED WITH GROUND TRUTH</span>
          </span>
        </div>
      </div>

      {/* Physics Calibration Multi-Drivers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 block font-mono text-xs">Precipitation Telemetry:</span>
          <div className="text-xl font-bold text-white font-mono">{activeCity.rainfallMmHr} mm/h</div>
          <p className="text-[11px] text-slate-400">Doppler nowcast runoff coefficient: 0.88 over urban concrete.</p>
        </div>

        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 block font-mono text-xs">Stormwater Drainage Efficiency:</span>
          <div className="text-xl font-bold text-amber-400 font-mono">{activeCity.drainageEfficiency}% Nominal</div>
          <p className="text-[11px] text-slate-400">Subterranean silt choke reduces gravity discharge by 42%.</p>
        </div>

        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 block font-mono text-xs">Astronomical Tidal Lock:</span>
          <div className="text-xl font-bold text-cyan-400 font-mono">{activeCity.tideHeightM}m High Tide</div>
          <p className="text-[11px] text-slate-400">Positive sea head prevents river estuary gravity discharge.</p>
        </div>

      </div>

      {/* Ground Truth Validation: PREDICT → OBSERVE → VERIFY → CORRECT */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-cyan-400" />
              <span>Predict vs. Observe: Ground Truth Calibration Pipeline</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison between algorithmic hydrologic forecasts and field spotter telemetry. Divergences update the real-time Kalman filter.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nowcasts.map(nc => {
            const isSelected = selectedPrediction.id === nc.id;
            const hasDivergence = nc.verifiedStatus === 'corrected_divergence';

            return (
              <div
                key={nc.id}
                onClick={() => setSelectedPrediction(nc)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-950 border-cyan-500/60 shadow-xl shadow-cyan-950/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      nc.floodProbability > 80 ? 'bg-red-950 text-red-400 border border-red-800' :
                      nc.floodProbability > 50 ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {nc.floodProbability}% PROBABILITY
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ETA: {nc.etaMinutes === 0 ? 'NOW' : `+${nc.etaMinutes}m`}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-xs mb-3">{nc.roadName}</h4>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Model Depth:</span>
                      <span className="font-mono text-white font-bold">{nc.predictedDepthM}m</span>
                    </div>
                    {nc.actualDepthM !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ground Depth:</span>
                        <span className="font-mono text-cyan-300 font-bold">{nc.actualDepthM}m</span>
                      </div>
                    )}
                    {nc.divergenceDeltaM !== undefined && nc.divergenceDeltaM !== 0 && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Model Delta:</span>
                        <span className={`font-mono font-bold ${nc.divergenceDeltaM > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {nc.divergenceDeltaM > 0 ? `+${nc.divergenceDeltaM}m (Under-predicted)` : `${nc.divergenceDeltaM}m (Over-predicted)`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] font-mono flex items-center justify-between">
                  <span className="text-slate-400">Confidence: {nc.confidence}%</span>
                  <span className={`capitalize ${hasDivergence ? 'text-amber-400 font-semibold' : 'text-emerald-400'}`}>
                    {nc.verifiedStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Prediction Deep-Dive Inspector */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <h3 className="font-bold text-white text-base">
          Detailed Nowcast Telemetry: {selectedPrediction.roadName}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Expected Inundation Duration</span>
            <span className="text-lg font-bold text-white font-mono">{selectedPrediction.durationHours} hours</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Passability Verdict</span>
            <span className={`text-lg font-bold font-mono ${selectedPrediction.predictedDepthM > 0.6 ? 'text-red-400' : 'text-emerald-400'}`}>
              {selectedPrediction.predictedDepthM > 0.6 ? 'IMPASSABLE' : 'HIGH CLEARANCE ONLY'}
            </span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Sensor Calibration Score</span>
            <span className="text-lg font-bold text-cyan-400 font-mono">{selectedPrediction.confidence}%</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Adaptive Re-routing State</span>
            <span className="text-lg font-bold text-amber-400 font-mono">ACTIVE BYPASS</span>
          </div>
        </div>
      </div>

    </div>
  );
};
