import React, { useState } from 'react';
import {
  Cpu,
  Activity,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  GitMerge,
  Sparkles,
  Terminal,
  Navigation,
  Compass,
  Radio,
  Sliders,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';
import { AIAgent } from '../../types';

export const AICommandCenter: React.FC = () => {
  const { agents, logs, activeCity, roads, startScenario, isScenarioRunning } = useFloodPulse();
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(agents[0]);
  const [activeTab, setActiveTab] = useState<'agents' | 'workflow' | 'logs' | 'routing'>('agents');

  const velacheryRoad = roads.find(r => r.id === 'rd-1');
  const isVelacheryClosed = velacheryRoad?.status === 'closed';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase mb-1">
            <Cpu className="h-4 w-4" />
            <span>AUTONOMOUS MULTI-AGENT SWARM RUNTIME</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Agentic Flood Intelligence &amp; Autonomous Task Swarm
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Eight specialized AI agents continuously coordinate sensor telemetry, verify civilian ground reports, solve dynamic routing graphs, and propose human-authorized emergency plans.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => startScenario('scenario_a')}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors shadow-lg shadow-cyan-950 flex items-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            <span>Trigger Scenario Test</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('agents')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'agents' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          Specialized Agents (8)
        </button>
        <button
          onClick={() => setActiveTab('workflow')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'workflow' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          Inter-Agent Decision Loop
        </button>
        <button
          onClick={() => setActiveTab('routing')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'routing' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          Dynamic Rerouting Engine
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'logs' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Live Reasoning Logs</span>
          <span className="text-[10px] font-mono px-1.5 rounded bg-slate-800 text-cyan-400">{logs.length}</span>
        </button>
      </div>

      {/* View 1: 8 Specialized Agent Cards */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map(agent => {
            const isSelected = selectedAgent.id === agent.id;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/60 shadow-xl shadow-cyan-950/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-xs truncate max-w-[170px]">{agent.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      agent.status === 'coordinating' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      agent.status === 're-evaluating' ? 'bg-red-950 text-red-400 border border-red-800' :
                      'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}>
                      {agent.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-cyan-400 font-medium mb-2">{agent.role}</div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{agent.currentTask}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="font-mono text-emerald-400 font-bold">{agent.confidence}%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">
                    <strong className="text-slate-300">Decision:</strong> {agent.decision}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Inter-Agent Decision Loop */}
      {activeTab === 'workflow' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base">Autonomous Agent Collaboration Pipeline</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              How the 8 agents communicate via JSON event buses to transition from hydrological detection to verified evacuation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { step: '01', title: 'Flood Agent', desc: 'Detects radar spike & increases basin risk score.' },
              { step: '02', title: 'Incident Agent', desc: 'Ingests citizen SOS & checks nearby depth sensors.' },
              { step: '03', title: 'Dam Agent', desc: 'Calculates downstream wave impact & safe release ceiling.' },
              { step: '04', title: 'Routing Agent', desc: 'Computes alternative unflooded high-clearance routes.' },
              { step: '05', title: 'Resource Agent', desc: 'Dispatches relief trucks, boats, and ICU reservations.' },
              { step: '06', title: 'Commander Agent', desc: 'Packages multi-agency plan for government sign-off.' }
            ].map(flow => (
              <div key={flow.step} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-cyan-400 font-bold">{flow.step}</span>
                <h4 className="font-bold text-white text-xs">{flow.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{flow.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-cyan-400 shrink-0" />
            <span>
              <strong>Deterministic Tool Constraint:</strong> Agents cannot directly trigger physical actuators or bypass human authority. Road barricades, dam releases, and evacuation orders always require human confirmation.
            </span>
          </div>
        </div>
      )}

      {/* View 3: Dynamic Rerouting Engine Simulator Card */}
      {activeTab === 'routing' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Navigation className="h-5 w-5 text-cyan-400" />
              <span>Emergency Routing Agent: Live Graph Traversal &amp; Flood Bypass</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              When water depth exceeds vehicle clearance limits (0.3m for civilian, 0.6m for ambulances, 0.9m for 6x6 rescue trucks), routes recalculate autonomously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Direct Route (Flooded) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-red-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-400 text-xs font-mono">DIRECT PASS: VELACHERY MAIN ROAD</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold">
                  {isVelacheryClosed ? 'CLOSED (IMPASSABLE)' : 'RISKY (0.85m)'}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Water Depth:</span>
                  <span className="font-mono text-red-400 font-bold">0.85m (Exceeds 0.6m clearance)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stranded Vehicle Risk:</span>
                  <span className="font-mono text-red-400 font-bold">98% Engine Hydraulic Hydro-lock</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-red-400">Bypassed by AI Routing Agent</span>
                </div>
              </div>
            </div>

            {/* AI Detour Corridor */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 text-xs font-mono">RECOMMENDED BYPASS: OMR ELEVATED</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                  PASSABLE (DRY)
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Water Depth:</span>
                  <span className="font-mono text-emerald-400 font-bold">0.05m (Safe for all vehicles)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Transit Time:</span>
                  <span className="font-mono text-emerald-400 font-bold">16 min (Saved 14 min vs. gridlock)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Vehicles:</span>
                  <span className="text-emerald-300">Ambulance ALS-108, Ashok 6x6</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* View 4: Live Activity & Reasoning Logs */}
      {activeTab === 'logs' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Agent Communication &amp; Reasoning Stream</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Latest 50 entries</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-xs pr-1">
            {logs.map(log => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
                  <span className="text-cyan-400 font-bold shrink-0">[{log.agentName}]</span>
                  <span className="text-white font-medium">{log.action}:</span>
                  <span className="text-slate-400">{log.details}</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.2 rounded shrink-0 uppercase font-bold ${
                  log.severity === 'alert' ? 'bg-red-950 text-red-400' :
                  log.severity === 'warning' ? 'bg-amber-950 text-amber-400' :
                  log.severity === 'success' ? 'bg-emerald-950 text-emerald-400' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {log.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
