import React, { useState } from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  AlertOctagon,
  CloudRain,
  PhoneCall,
  Boxes,
  Navigation,
  Home,
  Hospital as HospIcon,
  Users,
  Cpu,
  Bell,
  BarChart3,
  Settings,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Send,
  Truck
} from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';
import { InteractiveGISMap } from '../map/InteractiveGISMap';

export const GovernmentDashboard: React.FC<{ onNavigateToAgents: () => void }> = ({ onNavigateToAgents }) => {
  const {
    activeCity,
    floodZones,
    roads,
    hospitals,
    shelters,
    volunteers,
    resources,
    fleet,
    sosRequests,
    incidents,
    approvals,
    approveAction,
    rejectAction,
    alerts,
    currentUser
  } = useFloodPulse();

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const criticalZonesCount = floodZones.filter(z => z.riskLevel === 'critical' || z.riskLevel === 'high').length;
  const closedRoadsCount = roads.filter(r => r.status === 'closed').length;
  const activeSOSCount = sosRequests.filter(s => s.status !== 'resolved').length;
  const availableBeds = hospitals.reduce((acc, h) => acc + h.availableBeds, 0);
  const activeFleetCount = fleet.filter(f => f.status === 'en_route' || f.status === 'on_scene').length;
  const availableVolunteers = volunteers.filter(v => v.isAvailable).length;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* Header Ribbon with AI Situation Summary */}
        <div className="rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/40 via-slate-900/90 to-slate-900/90 p-5 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                  AI SITUATION SUMMARY · CRITICAL ALERT
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                HIGH INUNDATION RISK DETECTED ACROSS {activeCity.name.toUpperCase()} BASIN
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                2 arterial corridors are completely impassable. 12 road segments may become inaccessible within 35 minutes. 2 hospitals are potentially impacted. 143 citizens in Velachery and Madipakkam require active evacuation assistance.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                Authorized: {currentUser.name}
              </span>
            </div>
          </div>
        </div>

        {/* 8 Operational KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Flood Zones</span>
            <div className="text-xl font-bold text-red-400 font-mono tabular-nums mt-1">{criticalZonesCount}</div>
            <span className="text-[10px] text-slate-500 font-mono">Critical Tier</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">High-Risk Roads</span>
            <div className="text-xl font-bold text-amber-400 font-mono tabular-nums mt-1">{closedRoadsCount}</div>
            <span className="text-[10px] text-slate-500 font-mono">Closed &amp; Diverted</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Active SOS</span>
            <div className="text-xl font-bold text-rose-400 font-mono tabular-nums mt-1">{activeSOSCount}</div>
            <span className="text-[10px] text-rose-500 font-mono">6 Responding</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Hospital Beds</span>
            <div className="text-xl font-bold text-cyan-400 font-mono tabular-nums mt-1">{availableBeds}</div>
            <span className="text-[10px] text-slate-500 font-mono">Free Capacity</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Rescue Units</span>
            <div className="text-xl font-bold text-blue-400 font-mono tabular-nums mt-1">{activeFleetCount}</div>
            <span className="text-[10px] text-slate-500 font-mono">Boats &amp; Trucks</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Volunteers</span>
            <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums mt-1">{availableVolunteers}</div>
            <span className="text-[10px] text-slate-500 font-mono">Ready On-Call</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Relief Rations</span>
            <div className="text-xl font-bold text-teal-400 font-mono tabular-nums mt-1">4.8k</div>
            <span className="text-[10px] text-slate-500 font-mono">Ready Meals</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Shelters</span>
            <div className="text-xl font-bold text-sky-400 font-mono tabular-nums mt-1">{shelters.length}</div>
            <span className="text-[10px] text-slate-500 font-mono">1.8k Max Cap</span>
          </div>

        </div>

        {/* HUMAN-IN-THE-LOOP APPROVAL CARD: AI Recommended Actions */}
        <div className="rounded-2xl border border-amber-500/40 bg-slate-900/80 p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-white text-sm">
                  Human-In-The-Loop AI Recommended Actions
                </h3>
                <p className="text-[11px] text-slate-400">
                  Autonomous agents propose tactical interventions; state authorization required before execution.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-950 px-2.5 py-1 rounded-lg border border-amber-800">
              {pendingApprovals.length} PENDING AUTHORIZATION
            </span>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              No pending emergency actions awaiting approval. All autonomous actions synchronized.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map(app => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                        {app.agentName}
                      </span>
                      <span className="text-xs font-bold text-white">{app.title}</span>
                    </div>
                    <p className="text-xs text-slate-300">{app.description}</p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Proposed: {app.proposedAction} · <em>Impact: {app.consequences}</em>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                    <button
                      onClick={() => approveAction(app.id)}
                      className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve &amp; Execute</span>
                    </button>
                    <button
                      onClick={() => rejectAction(app.id)}
                      className="flex-1 md:flex-none px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live GIS Map Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Live GIS Common Operating Picture</h3>
            <span className="text-xs font-mono text-slate-400">Click any road, hospital, or SOS beacon to inspect</span>
          </div>
          <InteractiveGISMap heightClass="h-[520px]" />
        </div>

        {/* Incident Stream & SOS Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Active Incidents */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <AlertOctagon className="h-4 w-4 text-rose-400" />
                <span>Verified Field Incidents ({incidents.length})</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">SEOC Log</span>
            </div>
            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {incidents.map(inc => (
                <div key={inc.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{inc.title}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                      inc.status === 'resolved' ? 'bg-emerald-950 text-emerald-300' :
                      inc.status === 'responding' ? 'bg-amber-950 text-amber-300' : 'bg-red-950 text-red-300'
                    }`}>
                      {inc.status}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] mb-1.5">{inc.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{inc.locationName} · {inc.waterDepthM}m depth</span>
                    <span>Assigned: {inc.assignedTeam || 'Deploying'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active SOS Requests */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-amber-400" />
                <span>Citizen SOS Triage Queue ({sosRequests.length})</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">Prioritized Triage</span>
            </div>
            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {sosRequests.map(sos => (
                <div key={sos.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-rose-400 font-bold">#{sos.id}</span>
                      <span className="font-semibold text-white">{sos.citizenName}</span>
                    </div>
                    <span className="text-[10px] font-mono bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded">
                      PRIORITY: {sos.priorityScore}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 mb-1">{sos.locationName} · {sos.peopleCount} people ({sos.elderlyCount} elderly, {sos.childrenCount} kids)</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Depth: {sos.waterDepthM}m · {sos.helpType.replace('_', ' ')}</span>
                    <span className="text-cyan-400 uppercase font-semibold">{sos.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

    </div>
  );
};
