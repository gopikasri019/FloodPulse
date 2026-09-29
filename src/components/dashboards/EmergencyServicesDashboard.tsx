import React, { useState } from 'react';
import {
  Shield,
  Truck,
  Flame,
  Radio,
  Boxes,
  Activity,
  CheckCircle,
  AlertTriangle,
  Send,
  Sliders,
  Navigation,
  ExternalLink
} from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';

export const EmergencyServicesDashboard: React.FC = () => {
  const {
    currentUser,
    fleet,
    roads,
    resources,
    incidents,
    toggleRoadStatus,
    dispatchAmbulanceMission,
    allocateReliefResource
  } = useFloodPulse();

  const [selectedIncident, setSelectedIncident] = useState(incidents[0]?.title || 'Tansi Nagar Rescue');
  const [successMsg, setSuccessMsg] = useState('');

  const isPolice = currentUser.role === 'police';
  const isFire = currentUser.role === 'fire_rescue';
  const isAmbulance = currentUser.role === 'ambulance';
  const isLogistics = currentUser.role === 'logistics';
  const isSupplier = currentUser.role === 'relief_supplier' || currentUser.role === 'ngo';
  const isMunicipal = currentUser.role === 'municipal';
  const isAdmin = currentUser.role === 'admin';

  const handleDispatch = (vehicleId: string) => {
    dispatchAmbulanceMission(vehicleId, selectedIncident);
    setSuccessMsg(`Dispatched ${vehicleId} successfully to "${selectedIncident}"!`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentUser.avatar}</span>
          <div>
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              {currentUser.department || 'FIELD RESCUE COMMAND'}
            </span>
            <h1 className="text-xl font-bold text-white">{currentUser.name}</h1>
            <p className="text-xs text-slate-400">
              Role: {currentUser.roleTitle} · Call Sign: DELTA-OPERATIONS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>ENCRYPTED DISPATCH FREQ ACTIVE</span>
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Police / Municipal View: Road Cordons & Barricades */}
      {(isPolice || isMunicipal || isAdmin) && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-cyan-400" />
                <span>Road Network Perimeter Cordons &amp; Barricades</span>
              </h3>
              <p className="text-xs text-slate-400">
                Authorized officers can toggle physical police barricades. Closed corridors automatically force routing engines to divert traffic.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {roads.map(rd => (
              <div key={rd.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-white">{rd.name}</div>
                  <div className="text-slate-400 text-[11px]">
                    Water Depth: <span className="text-amber-400 font-mono font-bold">{rd.waterDepthM}m</span> · Max Clearance: {rd.maxPassableClearanceM}m
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    rd.status === 'closed' ? 'bg-red-950 text-red-300' :
                    rd.status === 'risky' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                  }`}>
                    {rd.status}
                  </span>
                  <button
                    onClick={() => toggleRoadStatus(rd.id, rd.status === 'closed' ? 'passable' : 'closed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      rd.status === 'closed'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-red-600 hover:bg-red-500 text-white'
                    }`}
                  >
                    {rd.status === 'closed' ? 'Lift Cordon' : 'Barricade'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fire & Rescue / Ambulance: Rescue Fleet Units & Mission Dispatch */}
      {(isFire || isAmbulance || isAdmin) && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-400" />
                <span>Field Fleet Units &amp; Emergency Mission Dispatch</span>
              </h3>
              <p className="text-xs text-slate-400">
                Deploy Zodiac inflatable craft, swift-water squads, and high-clearance ALS ambulances.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Target Incident:</span>
              <select
                value={selectedIncident}
                onChange={e => setSelectedIncident(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
              >
                {incidents.map(i => (
                  <option key={i.id} value={i.title}>{i.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fleet.map(v => (
              <div key={v.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between text-xs space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white font-mono">{v.callsign}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      v.status === 'en_route' ? 'bg-cyan-950 text-cyan-300' :
                      v.status === 'on_scene' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                    }`}>
                      {v.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] capitalize">{v.type.replace('_', ' ')} · Operator: {v.driverName}</div>
                  <div className="text-slate-400 text-[11px] mt-1">
                    Fuel: {v.fuelPercentage}% · Base: {v.currentLocation}
                  </div>
                  {v.assignedMission && (
                    <div className="text-cyan-300 text-[11px] mt-1 font-medium truncate">
                      Mission: {v.assignedMission}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDispatch(v.id)}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="h-3 w-3" />
                  <span>Dispatch to Incident</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logistics & Supplier View: Warehouse Stock & Consignments */}
      {(isLogistics || isSupplier || isAdmin) && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Boxes className="h-4 w-4 text-teal-400" />
                <span>Central Disaster Depots &amp; Relief Inventory</span>
              </h3>
              <p className="text-xs text-slate-400">
                Allocate high-clearance truck consignments to front-line community shelters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {resources.map(res => (
              <div key={res.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="font-bold text-white">{res.name}</div>
                  <div className="text-slate-400 text-[11px]">{res.locationName}</div>
                  <div className="text-lg font-bold text-teal-400 font-mono mt-1">
                    {res.quantity.toLocaleString()} <span className="text-xs text-slate-400 font-normal">{res.unit}</span>
                  </div>
                </div>

                <button
                  onClick={() => allocateReliefResource(res.id, 'sh-1', Math.min(200, res.quantity))}
                  className="w-full py-1.5 bg-teal-950/80 hover:bg-teal-900 text-teal-300 border border-teal-800/60 rounded-lg font-semibold transition-colors text-xs"
                >
                  Dispatch Consignment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
