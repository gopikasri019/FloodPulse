import React from 'react';
import {
  Waves,
  Shield,
  Activity,
  ArrowRight,
  AlertTriangle,
  Compass,
  Zap,
  Users,
  Building2,
  PhoneCall,
  Sparkles,
  MapPin,
  CheckCircle2,
  Layers,
  HeartPulse,
  Truck,
  Flame,
  Radio,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';
import { CITIES } from '../../data/initialData';

interface LandingPageProps {
  onExplore: () => void;
  onOpenMap: () => void;
  onEmergencyAccess: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExplore,
  onOpenMap,
  onEmergencyAccess,
  onOpenLogin
}) => {
  const {
    activeCity,
    switchCity,
    floodZones,
    sosRequests,
    roads,
    hospitals,
    shelters,
    volunteers,
    resources,
    agents,
    startScenario
  } = useFloodPulse();

  const activeSOSCount = sosRequests.filter(s => s.status !== 'resolved').length;
  const criticalZones = floodZones.filter(z => z.riskLevel === 'critical' || z.riskLevel === 'high').length;
  const riskyRoads = roads.filter(r => r.status === 'closed' || r.status === 'risky').length;
  const availableBedsTotal = hospitals.reduce((acc, h) => acc + h.availableBeds, 0);
  const openSheltersCount = shelters.length;
  const availableVolunteers = volunteers.filter(v => v.isAvailable).length;

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20">
      
      {/* 1. Cinematic Hero Section with High-Fidelity Flood Image & Dark Transparent Overlay */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/floodpulse_hero_cinematic_1790179568435.jpg"
            alt="Urban city street flooded with flowing water at dusk with emergency vehicle reflections"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Dark measured gradient scrim overlays for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/70" />
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]" />
          
          {/* Subtle animated water ripple overlay */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.2) 0%, transparent 60%)',
              animation: 'waterFlow 12s ease infinite'
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center pt-8 pb-16">
          
          {/* Live Intelligence Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-8 backdrop-blur-md shadow-lg shadow-cyan-950/50">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold tracking-wider">● LIVE FLOOD INTELLIGENCE</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">MULTI-CITY AGENTIC RESPONSE NETWORK</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 text-balance">
            AI-Powered Flood Intelligence.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
              Faster Decisions. Safer Cities.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-10 text-balance">
            FloodPulse connects real-time flood intelligence, agentic AI, emergency responders, resources and communities through one location-adaptive disaster response platform.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="px-6 py-3.5 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all duration-200 shadow-xl shadow-cyan-500/20 hover:scale-[1.02] flex items-center gap-2"
            >
              <span>Explore Platform</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenMap}
              className="px-6 py-3.5 text-sm font-semibold text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl transition-all duration-200 flex items-center gap-2 backdrop-blur-md"
            >
              <Compass className="h-4 w-4 text-cyan-400" />
              <span>Live Flood Map</span>
            </button>

            <button
              onClick={onEmergencyAccess}
              className="px-6 py-3.5 text-sm font-bold text-rose-300 bg-rose-950/80 hover:bg-rose-900/80 border border-rose-600/50 rounded-xl transition-all duration-200 flex items-center gap-2 backdrop-blur-md shadow-lg shadow-rose-950/40"
            >
              <PhoneCall className="h-4 w-4 text-rose-400" />
              <span>Emergency Access (Citizen SOS)</span>
            </button>

            <button
              onClick={onOpenLogin}
              className="px-6 py-3.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-950/80 hover:bg-slate-900 border border-slate-800 rounded-xl transition-all duration-200 backdrop-blur-md"
            >
              <span>Sign In (14 Roles)</span>
            </button>
          </div>

          {/* Quick Scenario Launcher Ribbon */}
          <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span className="font-mono text-cyan-400 font-semibold uppercase">Demonstration Simulator:</span>
            <button
              onClick={() => {
                startScenario('scenario_a');
                onExplore();
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <span>⚡ Scenario A: Urban Rain Inundation</span>
            </button>
            <button
              onClick={() => {
                startScenario('scenario_b');
                onExplore();
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <span>🌊 Scenario B: Reservoir Release</span>
            </button>
            <button
              onClick={() => {
                startScenario('scenario_c');
                onExplore();
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <span>🌀 Scenario C: Coastal Surge &amp; High Tide</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. Section: Live Situation (Animated Demo Telemetry Stats) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
                Real-Time Operational Snapshot
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Live Situation Telemetry ({activeCity.name})
              </h2>
            </div>
            <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sensors Synchronized · Doppler Rain Rate: {activeCity.rainfallMmHr} mm/h</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90">
              <div className="text-xs text-slate-400 font-medium">Active Risk Zones</div>
              <div className="text-2xl font-bold text-rose-400 font-mono tabular-nums mt-1">{criticalZones}</div>
              <div className="text-[10px] text-rose-500 font-mono mt-0.5">Velachery &amp; Madipakkam</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90">
              <div className="text-xs text-slate-400 font-medium">Active SOS Requests</div>
              <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums mt-1">{activeSOSCount}</div>
              <div className="text-[10px] text-amber-500 font-mono mt-0.5">3 Triage Responding</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90">
              <div className="text-xs text-slate-400 font-medium">Roads at Risk</div>
              <div className="text-2xl font-bold text-orange-400 font-mono tabular-nums mt-1">{riskyRoads}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">2 Corridors Closed</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90">
              <div className="text-xs text-slate-400 font-medium">Available ICU Beds</div>
              <div className="text-2xl font-bold text-cyan-400 font-mono tabular-nums mt-1">{availableBedsTotal}</div>
              <div className="text-[10px] text-cyan-500 font-mono mt-0.5">Across 3 City Hospitals</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90">
              <div className="text-xs text-slate-400 font-medium">Shelters Active</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1">{openSheltersCount}</div>
              <div className="text-[10px] text-emerald-500 font-mono mt-0.5">Capacity 1,850 Ppl</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90">
              <div className="text-xs text-slate-400 font-medium">Volunteers Ready</div>
              <div className="text-2xl font-bold text-blue-400 font-mono tabular-nums mt-1">{availableVolunteers}</div>
              <div className="text-[10px] text-blue-500 font-mono mt-0.5">First Aid &amp; Boat Crew</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 col-span-2 md:col-span-4 lg:col-span-1">
              <div className="text-xs text-slate-400 font-medium">Relief Rations</div>
              <div className="text-2xl font-bold text-teal-400 font-mono tabular-nums mt-1">4.8k</div>
              <div className="text-[10px] text-teal-500 font-mono mt-0.5">Meals &amp; Water Packets</div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Section: How It Works (Sense → Predict → Verify → Coordinate → Respond → Learn) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-b border-slate-900">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Autonomous Coordination Pipeline
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
              How FloodPulse Works
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Moving beyond passive weather charts. An end-to-end intelligent operating loop that transforms sensor spikes into field-deployed rescue missions with human authorization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold block mb-2">01. SENSE</span>
                <h3 className="font-bold text-white text-base mb-1">Telemetry Ingestion</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Doppler rain radar, river depth sonars, reservoir inflow sensors, and geo-tagged citizen field reports.
                </p>
              </div>
              <div className="mt-4 text-[10px] font-mono text-slate-500">68.5 mm/h rain rate</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold block mb-2">02. PREDICT</span>
                <h3 className="font-bold text-white text-base mb-1">0–3hr Nowcasting</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ML hydrological physics engine calculates water depth, arrival velocities, and impacted road segments.
                </p>
              </div>
              <div className="mt-4 text-[10px] font-mono text-slate-500">0.85m peak depth in 25m</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold block mb-2">03. VERIFY</span>
                <h3 className="font-bold text-white text-base mb-1">Cross-Validation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Incident Agent cross-verifies citizen SOS submissions with surrounding sensor nodes to filter noise and fake alarms.
                </p>
              </div>
              <div className="mt-4 text-[10px] font-mono text-slate-500">98% confidence score</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold block mb-2">04. COORDINATE</span>
                <h3 className="font-bold text-white text-base mb-1">Multi-Agent Plan</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Routing agent discovers unflooded detours; medical agent reserves ICU beds; volunteer agent matches skills.
                </p>
              </div>
              <div className="mt-4 text-[10px] font-mono text-slate-500">Safe detour computed</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold block mb-2">05. RESPOND</span>
                <h3 className="font-bold text-white text-base mb-1">Authorized Action</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  District commissioner authorizes road closures and rescue boat dispatch with one click; alerts broadcast to civilians.
                </p>
              </div>
              <div className="mt-4 text-[10px] font-mono text-slate-500">Human-in-the-loop lock</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold block mb-2">06. LEARN</span>
                <h3 className="font-bold text-white text-base mb-1">Adaptive Re-plan</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  If an ambulance encounters an unmapped flood barrier, the system reroutes in real-time and updates the city flood model.
                </p>
              </div>
              <div className="mt-4 text-[10px] font-mono text-slate-500">Self-correcting loop</div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Section: Agentic AI Command Architecture */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Autonomous Multi-Agent Architecture
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
              8 Specialized AI Agents. Zero Siloed Teams.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Unlike generic chatbots, FloodPulse deploys autonomous software agents with deterministic tools, geo-spatial solvers, and strict safety guardrails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map(agent => (
              <div
                key={agent.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-cyan-500/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-white truncate">
                      {agent.name}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      {agent.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-xs text-cyan-400 font-medium mb-2">
                    {agent.role}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {agent.currentTask}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] space-y-1 bg-slate-950/40 -mx-5 -mb-5 p-4 rounded-b-2xl">
                  <div className="text-slate-400 flex justify-between font-mono">
                    <span>Confidence:</span>
                    <span className="text-emerald-400 font-bold">{agent.confidence}%</span>
                  </div>
                  <div className="text-slate-400 text-[10px] truncate">
                    Decision: {agent.decision}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Section: Multi-City Intelligence (Interactive India Map & Location-Adaptive Drivers) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 border-b border-slate-900">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            <div className="lg:w-1/2 space-y-6">
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Scalable Location-Adaptive Engine
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                One Unified Architecture. Distinct Hydrological Realities.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Rather than building isolated municipal portals for every city, FloodPulse’s model adapts to the primary flood drivers of each terrain:
              </p>

              <div className="space-y-3">
                {CITIES.map(city => {
                  const isSelected = city.id === activeCity.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => switchCity(city.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-500/60 shadow-lg shadow-cyan-950/30'
                          : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-sm">
                          {city.name}, {city.state}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                          city.activeRiskLevel === 'critical' ? 'bg-rose-950 text-rose-300' :
                          city.activeRiskLevel === 'high' ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {city.activeRiskLevel} RISK
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">
                        {city.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {city.primaryDrivers.map(d => (
                          <span key={d} className="text-[10px] font-mono text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800/40">
                            {d}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Multi-City Topology Card */}
            <div className="lg:w-1/2 w-full">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div>
                    <span className="text-xs font-mono text-cyan-400">ACTIVE REGION OVERVIEW</span>
                    <h3 className="text-lg font-bold text-white">{activeCity.name} Hydrological Node</h3>
                  </div>
                  <span className="text-xs font-mono bg-slate-900 px-3 py-1 rounded-lg text-slate-300 border border-slate-800">
                    LAT {activeCity.lat.toFixed(2)} / LNG {activeCity.lng.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Monsoon Precipitation</span>
                    <span className="text-lg font-bold text-white font-mono">{activeCity.rainfallMmHr} mm/h</span>
                  </div>
                  <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Tidal Crest Height</span>
                    <span className="text-lg font-bold text-white font-mono">{activeCity.tideHeightM}m</span>
                  </div>
                  <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Drainage Hydraulic Eff.</span>
                    <span className="text-lg font-bold text-white font-mono">{activeCity.drainageEfficiency}%</span>
                  </div>
                  <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Population in Buffer</span>
                    <span className="text-lg font-bold text-white font-mono">{activeCity.populationAtRisk.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Expandable to any Indian or Global municipality.</span>
                  <button
                    onClick={onOpenMap}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>View City GIS Map</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Section: Connected 10-Ecosystem Hub */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Multi-Stakeholder Federation
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
              Connecting the Entire Emergency Ecosystem
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Disasters fail when agencies operate on fragmented communication. FloodPulse unifies 14 key groups into one single source of ground truth.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            
            {[
              { icon: '🏛️', name: 'Government & SEOC', desc: 'Authorizes road closures & emergency orders' },
              { icon: '👮', name: 'Police Services', desc: 'Perimeter cordons & traffic diversions' },
              { icon: '🚒', name: 'Fire & Rescue', desc: 'Inflatable boat fleets & swift water ops' },
              { icon: '🌊', name: 'Dam Operators', desc: 'Reservoir inflow & planned spill models' },
              { icon: '🏥', name: 'Hospitals & EMS', desc: 'Triage bed reserves & ambulance routes' },
              { icon: '⛺', name: 'Shelters & Relief', desc: 'Rations, beds, and vulnerable family care' },
              { icon: '🌱', name: 'NGO Networks', desc: 'Distributed food & emergency medical packs' },
              { icon: '🤝', name: 'Field Volunteers', desc: 'Localized first-aid & neighborhood rescue' },
              { icon: '👤', name: 'Civic Citizens', desc: 'Instant SOS & crowd-sourced flood depth' },
              { icon: '🚛', name: 'Logistics Fleet', desc: 'High-clearance trucks & dewatering pumps' }
            ].map(eco => (
              <div
                key={eco.name}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors text-center flex flex-col items-center justify-center"
              >
                <span className="text-3xl mb-2">{eco.icon}</span>
                <h4 className="font-bold text-white text-xs mb-1">{eco.name}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{eco.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Ready for Immediate Deployment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-6">
            Enter the FloodPulse Command Network
          </h2>
          <p className="text-slate-300 text-base mb-8 max-w-2xl mx-auto">
            Experience real-time AI flood nowcasting, interactive emergency rerouting, and multi-agency response orchestration today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="px-8 py-4 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-xl shadow-cyan-500/20 hover:scale-105"
            >
              Launch Command Center
            </button>
            <button
              onClick={onOpenLogin}
              className="px-8 py-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all"
            >
              Test Demo Roles
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
