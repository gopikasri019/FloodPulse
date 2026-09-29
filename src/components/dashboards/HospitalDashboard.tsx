import React, { useState } from 'react';
import {
  Hospital as HospIcon,
  HeartPulse,
  Activity,
  BedDouble,
  Ambulance,
  Zap,
  Droplets,
  AlertCircle,
  Save,
  CheckCircle
} from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';

export const HospitalDashboard: React.FC = () => {
  const { hospitals, updateHospitalAvailability, currentUser } = useFloodPulse();
  const myHospital = hospitals.find(h => h.name.includes('Gleneagles')) || hospitals[0];

  const [availableBeds, setAvailableBeds] = useState(myHospital.availableBeds);
  const [icuBeds, setIcuBeds] = useState(myHospital.icuBedsAvailable);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateHospitalAvailability(myHospital.id, availableBeds, icuBeds);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏥</span>
          <div>
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase">TRAUMA &amp; CRITICAL CARE EMS DESK</span>
            <h1 className="text-xl font-bold text-white">{myHospital.name}</h1>
            <p className="text-xs text-slate-400">
              Chief Medical Officer: {currentUser.name} · SEOC Network Linked
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>TRIAGE ONLINE</span>
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Total Bed Capacity</span>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">{myHospital.totalBeds}</div>
          <span className="text-[11px] text-emerald-400 font-mono">{availableBeds} available now</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">ICU Ventilator Slots</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono tabular-nums mt-1">{myHospital.icuBedsTotal}</div>
          <span className="text-[11px] text-cyan-300 font-mono">{icuBeds} free</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Incoming Flood Casualties</span>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums mt-1">{myHospital.incomingEmergencies}</div>
          <span className="text-[11px] text-amber-500 font-mono">En route via EMS</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Backup Oxygen Supply</span>
          <div className="text-2xl font-bold text-teal-400 font-mono tabular-nums mt-1">{myHospital.oxygenSupplyHours}h</div>
          <span className="text-[11px] text-slate-500 font-mono">Cryogenic tanks full</span>
        </div>

      </div>

      {/* Hospital Staff Live Availability Updater */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-cyan-400" />
            <span>Broadcast Real-Time Bed &amp; ICU Availability to EMS Dispatch</span>
          </h3>
          {saveSuccess && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Synced with Medical Coordination Agent</span>
            </span>
          )}
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Available General Wards</label>
              <input
                type="number"
                min="0"
                max={myHospital.totalBeds}
                value={availableBeds}
                onChange={e => setAvailableBeds(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-base focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Available ICU / Ventilator Beds</label>
              <input
                type="number"
                min="0"
                max={myHospital.icuBedsTotal}
                value={icuBeds}
                onChange={e => setIcuBeds(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-base focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-cyan-950/50"
            >
              <Save className="h-4 w-4" />
              <span>Update Hospital Status in FloodPulse Core</span>
            </button>
          </div>
        </form>
      </div>

      {/* Network Hospital Load Balance */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono text-slate-400">
          City-Wide EMS Load Balancing &amp; Diverted Routes
        </h4>
        <div className="space-y-2.5">
          {hospitals.map(h => (
            <div key={h.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white">{h.name}</span>
                <span className="text-slate-400 ml-2">
                  ({h.availableBeds} beds / {h.icuBedsAvailable} ICU free)
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                h.waterAccessible ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
              }`}>
                {h.waterAccessible ? 'ACCESSIBLE' : 'ACCESS ROAD FLOODED (DIVERSIÓN)'}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
