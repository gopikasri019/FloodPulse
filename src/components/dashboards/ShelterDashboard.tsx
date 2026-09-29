import React, { useState } from 'react';
import {
  Home,
  Users,
  Utensils,
  Droplets,
  Zap,
  HeartPulse,
  Truck,
  PlusCircle,
  Save,
  CheckCircle
} from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';

export const ShelterDashboard: React.FC = () => {
  const { shelters, updateShelterRations, allocateReliefResource, resources, currentUser } = useFloodPulse();
  const myShelter = shelters[0];

  const [foodDays, setFoodDays] = useState(myShelter.foodDaysRemaining);
  const [waterLiters, setWaterLiters] = useState(myShelter.waterLitersRemaining);
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateShelterRations(myShelter.id, foodDays, waterLiters);
    setSuccessMsg('Shelter rations updated and synced with Logistics Agent');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleQuickReplenish = (resourceId: string, qty: number) => {
    allocateReliefResource(resourceId, myShelter.id, qty);
    setFoodDays(prev => prev + 2);
    setWaterLiters(prev => prev + 1500);
    setSuccessMsg('Urgent supply request approved & truck dispatched!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⛺</span>
          <div>
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase">CIVIC RELIEF SANCTUARY</span>
            <h1 className="text-xl font-bold text-white">{myShelter.name}</h1>
            <p className="text-xs text-slate-400">
              Shelter Lead: {currentUser.name} · Department of Social Welfare
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800">
            ROAD ACCESS: {myShelter.accessibilityStatus.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Shelter Occupancy</span>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
            {myShelter.occupancy} / {myShelter.capacity}
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">
            {myShelter.capacity - myShelter.occupancy} spaces available
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Rations Remaining</span>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums mt-1">
            {foodDays} days
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Hot meals ready</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Potable Water</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono tabular-nums mt-1">
            {waterLiters.toLocaleString()} L
          </div>
          <span className="text-[11px] text-cyan-300 font-mono">Filtered chlorinated supply</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Power &amp; Medical</span>
          <div className="text-sm font-bold text-emerald-400 font-mono mt-2 flex items-center gap-1">
            <Zap className="h-4 w-4" /> <span>Diesel Gen Online</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">First aid post active</span>
        </div>

      </div>

      {/* Shelter Rations Updating & Supply Replenishment Request */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Utensils className="h-5 w-5 text-cyan-400" />
            <span>Update Supply Telemetry &amp; Request Emergency Replenishment</span>
          </h3>
          {successMsg && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>{successMsg}</span>
            </span>
          )}
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Estimated Food Days Left</label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={foodDays}
              onChange={e => setFoodDays(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-base focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Potable Drinking Water (Liters)</label>
            <input
              type="number"
              step="100"
              min="0"
              value={waterLiters}
              onChange={e => setWaterLiters(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-base focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickReplenish('res-1', 500)}
                className="px-3 py-2 bg-amber-950 text-amber-300 hover:bg-amber-900 border border-amber-800 rounded-lg font-mono text-xs flex items-center gap-1.5"
              >
                <Truck className="h-3.5 w-3.5" />
                <span>Request +500 Ready-To-Eat Meal Consignment</span>
              </button>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-cyan-950/50"
            >
              <Save className="h-4 w-4" />
              <span>Save Shelter Status</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
