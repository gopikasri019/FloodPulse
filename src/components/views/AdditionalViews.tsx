import React, { useState } from 'react';
import {
  Radio,
  Bell,
  Boxes,
  BarChart3,
  FileText,
  Settings,
  Search,
  RefreshCw,
  Truck,
  Hospital as HospIcon,
  Download,
  Sliders,
  Zap
} from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';
import { InteractiveGISMap } from '../map/InteractiveGISMap';
import { StationRiskLevel } from '../../types';
import { AIWaterwayMonitoringSuite } from '../waterways/AIWaterwayMonitoringSuite';

// ==========================================
// 1. MONITORING VIEW (AI REAL-TIME WATERWAY MONITORING)
// ==========================================
export const MonitoringView: React.FC = () => {
  return <AIWaterwayMonitoringSuite />;
};

// ==========================================
// 2. ALERTS VIEW
// ==========================================
export const AlertsView: React.FC = () => {
  const { alerts, activeCity } = useFloodPulse();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = alerts.filter(a => (filterType === 'all' ? true : a.severity === filterType));

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              SEOC Disaster Warning &amp; Impact Alerts
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated early warning sirens, SMS cell broadcasts, and municipal disaster advisories for {activeCity.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-rose-400 bg-rose-950/60 border border-rose-800/80 px-3 py-1.5 rounded-xl">
            {alerts.filter(a => a.active).length} Extreme Warnings Active
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['all', 'extreme', 'severe', 'moderate'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium uppercase font-mono tracking-wider transition-colors ${
              filterType === t
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(al => (
          <div
            key={al.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] font-mono uppercase font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800">
                  {al.severity}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{al.eta}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{al.issuedAt}</span>
            </div>

            <h3 className="text-sm font-bold text-white">{al.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{al.recommendedAction}</p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Target: <strong className="text-slate-200">{al.targetAudience}</strong></span>
              <span className="font-mono text-cyan-400">CAP Standard v1.2</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. RESOURCES VIEW
// ==========================================
export const ResourcesView: React.FC = () => {
  const { resources, hospitals, fleet, activeCity } = useFloodPulse();

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div>
        <div className="flex items-center gap-2">
          <Boxes className="h-5 w-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Logistics, Emergency Fleet &amp; Relief Inventory
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Real-time tracking of NDRF/SDRF rescue boats, dewatering pumps, relief kits, and available hospital beds across {activeCity.name}.
        </p>
      </div>

      {/* Grid of Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Relief Inventory */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Boxes className="h-4 w-4 text-cyan-400" />
            <span>Warehouse Stockpile</span>
          </h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {resources.map(res => (
              <div key={res.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{res.name}</div>
                  <div className="text-[10px] text-slate-400">{res.locationName}</div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold text-cyan-400">{res.quantity.toLocaleString()} {res.unit}</div>
                  <div className="text-[10px] text-slate-500">Status: {res.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rescue Fleet */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Truck className="h-4 w-4 text-blue-400" />
            <span>Rescue Fleet ({fleet.length})</span>
          </h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {fleet.map(veh => (
              <div key={veh.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{veh.type.replace('_', ' ').toUpperCase()}</div>
                  <div className="text-[10px] text-slate-400">Team: {veh.callsign}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                  veh.status === 'on_scene' ? 'bg-amber-950 text-amber-300' :
                  veh.status === 'en_route' ? 'bg-cyan-950 text-cyan-300' : 'bg-emerald-950 text-emerald-300'
                }`}>
                  {veh.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hospitals */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HospIcon className="h-4 w-4 text-emerald-400" />
            <span>Designated Hospitals</span>
          </h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {hospitals.map(h => (
              <div key={h.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{h.name}</div>
                  <div className="text-[10px] text-slate-400">ICU: {h.icuBedsAvailable} available</div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold text-emerald-400">{h.availableBeds} beds</div>
                  <div className="text-[10px] text-slate-500">Power: {h.powerStatus}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. ANALYTICS VIEW
// ==========================================
export const AnalyticsView: React.FC = () => {
  const { activeCity } = useFloodPulse();

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Hydrodynamic Basin Analytics &amp; Trends
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Historical precipitation vs storm-drain discharge volume curves for {activeCity.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Precipitation Accumulation Rate (24h)</h3>
          <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
            {[24, 45, 62, 98, 140, 185, 210, 160, 120, 85, 60, 42].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-cyan-500/80 hover:bg-cyan-400 transition-all rounded-t"
                  style={{ height: `${(val / 220) * 100}%` }}
                />
                <span className="text-[9px] font-mono text-slate-500">{idx * 2}h</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Peak: <strong>210 mm at T+12h</strong></span>
            <span className="text-cyan-400 font-mono">Doppler Radar Ground Truth</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Drainage Canal Surcharge Capacity</h3>
          <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
            {[45, 55, 70, 85, 98, 110, 105, 92, 80, 68, 55, 48].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t transition-all ${
                    val > 100 ? 'bg-red-500' : val > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ height: `${(val / 120) * 100}%` }}
                />
                <span className="text-[9px] font-mono text-slate-500">{idx * 2}h</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Peak Inundation: <strong className="text-red-400">110% Canal Surcharge</strong></span>
            <span className="text-red-400 font-mono">Overtopping Threshold Exceeded</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. REPORTS VIEW
// ==========================================
export const ReportsView: React.FC = () => {
  const { activeCity } = useFloodPulse();

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              State Disaster Management Situational Reports (SITREP)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated intelligence briefs ready for Chief Secretary, NDMA, and Municipal Commissioner signatures.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors flex items-center gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export SITREP PDF</span>
        </button>
      </div>

      <div className="space-y-4">
        {[
          {
            title: `SITREP #14 — Extreme Inundation & Dam Release Coordination (${activeCity.name})`,
            date: 'September 27, 2026 · 11:30 AM IST',
            status: 'FINAL',
            summary: 'Chembarambakkam outflow held at 12,000 cusecs. 143 citizens triaged in South Zone. 12 arterial diversions established.'
          },
          {
            title: `SITREP #13 — 6-Hour Flash Flood Vulnerability & Hospital Power Continuity`,
            date: 'September 27, 2026 · 05:30 AM IST',
            status: 'ARCHIVED',
            summary: 'Backup diesel gensets verified across 4 designated trauma centers. 8 NDRF inflatables deployed.'
          }
        ].map((rep, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {rep.status}
              </span>
              <span className="text-xs font-mono text-slate-400">{rep.date}</span>
            </div>
            <h3 className="text-sm font-bold text-white">{rep.title}</h3>
            <p className="text-xs text-slate-300">{rep.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 6. SETTINGS VIEW
// ==========================================
export const SettingsView: React.FC = () => {
  const { activeCity } = useFloodPulse();

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Platform Configuration &amp; Sensor Feeds
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Adjust hydrodynamic simulation parameters, IMD Doppler telemetry hooks, and automated emergency routing thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-cyan-400" />
            <span>Hydraulic Warning Thresholds</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Critical Water Level Threshold (Meters)</label>
              <input
                type="number"
                defaultValue={4.5}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Rainfall Inundation Trigger (mm/hr)</label>
              <input
                type="number"
                defaultValue={65.0}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>FastAPI Backend &amp; Data Pipeline Status</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-300">FastAPI REST Server</span>
              <span className="text-emerald-400 font-mono font-bold">ONLINE (:8000)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-300">Scalable Hierarchy API</span>
              <span className="text-cyan-400 font-mono font-bold">/api/locations (V2)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-300">IMD Doppler Radar Mirror</span>
              <span className="text-emerald-400 font-mono font-bold">POLLING 10s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. SHELTERS & HOSPITALS VIEW
// ==========================================
export const SheltersHospitalsView: React.FC = () => {
  const { shelters, hospitals, activeCity } = useFloodPulse();

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div>
        <div className="flex items-center gap-2">
          <HospIcon className="h-5 w-5 text-emerald-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Designated Shelters &amp; Critical Hospital Facilities
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Real-time bed availability, ICU surge capacity, emergency generators, and food/water reserves across {activeCity.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hospitals */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Hospitals &amp; Trauma Centers ({hospitals.length})</span>
            <span className="text-xs font-mono text-emerald-400">
              {hospitals.reduce((a, b) => a + b.availableBeds, 0)} Total Free Beds
            </span>
          </h2>

          <div className="space-y-3">
            {hospitals.map(h => (
              <div key={h.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">{h.name}</h3>
                    <p className="text-xs text-slate-400">Power: <strong className="text-slate-200 uppercase font-mono text-[10px]">{h.powerStatus}</strong></p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {h.availableBeds} / {h.totalBeds} Beds Free
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                  <div className="text-slate-400">
                    ICU Beds: <span className="text-white font-bold">{h.icuBedsAvailable}</span>
                  </div>
                  <div className="text-slate-400">
                    Ambulances: <span className="text-cyan-400 font-bold">{h.ambulancesAvailable}</span>
                  </div>
                  <div className="text-slate-400">
                    Oxygen: <span className="text-amber-400 font-bold">{h.oxygenSupplyHours}h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shelters */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Community Evacuation Shelters ({shelters.length})</span>
            <span className="text-xs font-mono text-cyan-400">
              {shelters.reduce((a, b) => a + (b.capacity - b.occupancy), 0)} Free Capacity
            </span>
          </h2>

          <div className="space-y-3">
            {shelters.map(s => {
              const occupancyPct = Math.round((s.occupancy / s.capacity) * 100);
              return (
                <div key={s.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white">{s.name}</h3>
                      <p className="text-xs text-slate-400">
                        Occupancy: <strong className="text-slate-200">{s.occupancy} / {s.capacity} ({occupancyPct}%)</strong>
                      </p>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      occupancyPct > 85 ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                    }`}>
                      {occupancyPct > 85 ? 'NEAR CAPACITY' : 'SPACE AVAILABLE'}
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${occupancyPct > 85 ? 'bg-rose-500' : 'bg-cyan-400'}`}
                      style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                    <div className="text-slate-400">
                      Rations: <span className="text-white font-bold">{s.foodDaysRemaining} days</span>
                    </div>
                    <div className="text-slate-400">
                      Water: <span className="text-cyan-400 font-bold">{s.waterLitersRemaining}L</span>
                    </div>
                    <div className="text-slate-400">
                      Medic: <span className="text-emerald-400 font-bold">{s.medicalSupportAvailable ? 'YES' : 'NO'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. ROAD & DRAINAGE STATUS VIEW
// ==========================================
export const RoadsDrainageView: React.FC = () => {
  const { roads, floodZones, activeCity } = useFloodPulse();

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div>
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-amber-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Road Corridors &amp; Drainage Overflow Status
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Active arterial blockages, vehicle height clearance thresholds, and storm-drain overflow in {activeCity.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Road Corridors */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white">Arterial Road Network ({roads.length})</h2>
          <div className="space-y-2.5">
            {roads.map(r => (
              <div key={r.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-white text-xs">{r.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Water Depth: <strong className="text-white">{r.waterDepthM}m</strong> · Passable Clearance: {r.maxPassableClearanceM}m
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  r.status === 'closed' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  r.status === 'risky' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Drainage Basins */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white">Stormwater Drains &amp; Canals ({floodZones.length})</h2>
          <div className="space-y-2.5">
            {floodZones.map(z => (
              <div key={z.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs">{z.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    z.riskLevel === 'critical' ? 'bg-rose-950 text-rose-300' :
                    z.riskLevel === 'high' ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {z.riskLevel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{z.statusDescription}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Drain: <strong className="text-white">{z.drainStatus.replace('_', ' ')}</strong></span>
                  <span>Depth: <strong className="text-cyan-400">{z.waterDepthM}m</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. SCENARIOS SIMULATION VIEW
// ==========================================
export const ScenariosView: React.FC = () => {
  const {
    activeScenario,
    scenarioStep,
    isScenarioRunning,
    startScenario,
    pauseScenario,
    resumeScenario,
    stepForwardScenario,
    resetScenario
  } = useFloodPulse();

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Autonomous Disaster Simulation Engine
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Launch multi-step simulated extreme flooding scenarios to stress-test autonomous agent coordination and municipal defenses.
        </p>
      </div>

      {/* Scenario Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { id: 'scenario_a' as const, title: '⚡ Scenario A: Urban Rain Inundation', desc: '140mm intense downpour over 3 hours causing Velachery storm-drain overflow.' },
          { id: 'scenario_b' as const, title: '🌊 Scenario B: Reservoir Release', desc: 'Chembarambakkam Dam gates opened at 12,000 cusecs downstream into Adyar river.' },
          { id: 'scenario_c' as const, title: '🌀 Scenario C: Coastal Surge & High Tide', desc: '2.4m astronomical spring tide blocking canal gravity outflow into Bay of Bengal.' }
        ].map(sc => (
          <div
            key={sc.id}
            className={`p-4 rounded-2xl border transition-all ${
              activeScenario.id === sc.id
                ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-950/50'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <h3 className="font-bold text-white text-xs mb-1">{sc.title}</h3>
            <p className="text-[11px] text-slate-400 mb-3">{sc.desc}</p>
            <button
              onClick={() => startScenario(sc.id)}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-colors"
            >
              {activeScenario.id === sc.id && isScenarioRunning ? 'Active Scenario' : 'Execute Scenario'}
            </button>
          </div>
        ))}
      </div>

      {/* Current Step Progression */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Active Sequence</span>
            <h3 className="text-base font-bold text-white">{activeScenario.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={isScenarioRunning ? pauseScenario : resumeScenario}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              {isScenarioRunning ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={stepForwardScenario}
              className="px-3 py-1.5 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
            >
              Step Forward
            </button>
            <button
              onClick={resetScenario}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {activeScenario.steps.map((st, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border text-xs transition-colors ${
                scenarioStep === idx
                  ? 'bg-cyan-950/60 border-cyan-500/60 text-white shadow-md'
                  : scenarioStep > idx
                  ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                  : 'bg-slate-950/20 border-slate-800/30 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between font-bold mb-1">
                <span>{st.title}</span>
                <span className="text-[10px] font-mono uppercase">
                  {scenarioStep === idx ? 'IN PROGRESS' : scenarioStep > idx ? 'COMPLETED' : 'PENDING'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">{st.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

