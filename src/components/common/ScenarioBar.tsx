import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Activity,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useFloodPulse, SCENARIOS, SimulationScenarioId } from '../../context/FloodPulseContext';

export const ScenarioBar: React.FC = () => {
  const {
    scenarioId,
    scenarioStep,
    isScenarioRunning,
    activeScenario,
    startScenario,
    pauseScenario,
    resumeScenario,
    stepForwardScenario,
    resetScenario
  } = useFloodPulse();

  const currentStepData = activeScenario.steps[scenarioStep - 1];

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 backdrop-blur-md">
      <div className="mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 max-w-7xl">
        
        {/* Left: Scenario Selector & Status */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              SIMULATION ENGINE
            </span>
          </div>

          <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800 text-xs">
            {SCENARIOS.map(scen => (
              <button
                key={scen.id}
                onClick={() => startScenario(scen.id as SimulationScenarioId)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  scen.id === scenarioId
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {scen.id === 'scenario_a' ? 'A: Urban Rain' : scen.id === 'scenario_b' ? 'B: Dam Release' : 'C: Coastal Surge'}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Live Step Tracker */}
        <div className="flex-1 max-w-2xl w-full px-2">
          {scenarioStep === 0 ? (
            <div className="flex items-center justify-center text-xs text-slate-400 gap-2 py-1">
              <span>Ready to simulate: <strong>{activeScenario.name}</strong></span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500">Click Play or Start Scenario to initiate 8-agent response</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-cyan-400 font-mono">
                  {currentStepData?.title || `Step ${scenarioStep} of ${activeScenario.totalSteps}`}
                </span>
                <span className="text-[11px] text-slate-400">
                  {currentStepData?.agentName}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
                  style={{ width: `${(scenarioStep / activeScenario.totalSteps) * 100}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-300 truncate">
                {currentStepData?.description}
              </div>
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {isScenarioRunning ? (
            <button
              onClick={pauseScenario}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/40 rounded-lg hover:bg-amber-900/60 transition-colors"
            >
              <Pause className="h-3.5 w-3.5" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (scenarioStep === 0 || scenarioStep >= activeScenario.totalSteps) {
                  startScenario(scenarioId);
                } else {
                  resumeScenario();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 rounded-lg hover:bg-emerald-900/60 transition-colors"
            >
              <Play className="h-3.5 w-3.5" />
              <span>{scenarioStep === 0 ? 'Start' : 'Resume'}</span>
            </button>
          )}

          <button
            onClick={stepForwardScenario}
            disabled={scenarioStep >= activeScenario.totalSteps}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 disabled:opacity-40 transition-colors"
            title="Step Forward"
          >
            <FastForward className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={resetScenario}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
            title="Reset Scenario"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
