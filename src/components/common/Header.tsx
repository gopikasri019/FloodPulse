import React, { useState } from 'react';
import {
  Waves,
  Shield,
  MapPin,
  Users,
  Bell,
  ChevronDown,
  Activity,
  Play,
  Menu
} from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';
import { CITIES } from '../../data/initialData';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenLogin: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, onOpenLogin, onToggleMobileSidebar }) => {
  const { activeCity, switchCity, currentUser, alerts, startScenario, isScenarioRunning, isBackendConnected } = useFloodPulse();
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  const activeAlerts = alerts.filter(a => a.active);

  const viewTitles: Record<string, string> = {
    dashboard: 'Command Dashboard',
    map: 'Live GIS Flood Map',
    monitoring: 'Hydrological Monitoring',
    nowcasting: 'Nowcasting Engine',
    alerts: 'Impact Warnings & Alerts',
    agents: 'AI Command Center',
    resources: 'Logistics & Fleet Allocation',
    analytics: 'Hydrodynamic Analytics',
    reports: 'Situational Reports (SITREP)',
    settings: 'Platform Settings'
  };

  const isLanding = currentView === 'landing';

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 lg:px-8">
        
        {/* Left Side: Brand wordmark on Landing, or Mobile Toggle + Active View Badge after Login */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle (only shown when logged in and on small screens) */}
          {!isLanding && onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Original FloodPulse Wordmark */}
          <button 
            onClick={() => setCurrentView('landing')}
            className={`flex items-center gap-2.5 text-left group focus:outline-none ${!isLanding ? 'md:hidden' : ''}`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-colors">
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white font-mono flex items-center gap-1.5">
                FLOOD<span className="text-cyan-400">PULSE</span>
              </span>
            </div>
          </button>

          {/* Live Intelligence Pill on Landing */}
          {isLanding && (
            <span className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-2.5 py-0.5 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300 font-medium">LIVE INTELLIGENCE</span>
            </span>
          )}

          {/* Active View Badge on desktop when logged in */}
          {!isLanding && (
            <div className="hidden md:flex items-center gap-2.5">
              <span className="text-sm font-bold text-white tracking-tight">
                {viewTitles[currentView] || 'Command Center'}
              </span>
              <span className="h-3 w-px bg-slate-800" />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-2.5 py-0.5 text-xs text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-300 font-medium">LIVE SEOC COP</span>
              </span>
            </div>
          )}
        </div>

        {/* Clean text navigation links for Landing Page */}
        {isLanding && (
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setCurrentView('landing')}
              className="transition-colors hover:text-white text-cyan-400 font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="transition-colors hover:text-white text-slate-300"
            >
              Command Dashboard
            </button>
            <button
              onClick={() => setCurrentView('map')}
              className="transition-colors hover:text-white text-slate-300"
            >
              GIS Flood Map
            </button>
            <button
              onClick={() => setCurrentView('agents')}
              className="transition-colors hover:text-white text-slate-300"
            >
              AI Command Center
            </button>
            <button
              onClick={() => setCurrentView('nowcasting')}
              className="transition-colors hover:text-white text-slate-300"
            >
              Nowcasting Engine
            </button>
          </nav>
        )}

        {/* Zone 3: Actions - City selector, Alert indicator, Role profile, Start Scenario */}
        <div className="flex items-center gap-3">
          
          {/* Quick Scenario trigger */}
          <button
            onClick={() => startScenario('scenario_a')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 rounded-lg hover:bg-cyan-900/60 transition-colors whitespace-nowrap shadow-sm"
          >
            <Play className={`h-3.5 w-3.5 ${isScenarioRunning ? 'text-emerald-400 fill-emerald-400' : 'text-cyan-400'}`} />
            <span>{isScenarioRunning ? 'Scenario Active' : 'Start Scenario'}</span>
          </button>

          {/* FastAPI Swagger Docs Link */}
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono text-slate-300 bg-slate-900/90 border border-slate-800 rounded-lg hover:border-cyan-500/40 hover:text-cyan-300 transition-colors whitespace-nowrap"
            title="Open FastAPI Swagger Interactive API Documentation"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isBackendConnected ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
            <span>FastAPI Docs</span>
          </a>

          {/* City Selector */}
          <div className="relative">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors whitespace-nowrap"
            >
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              <span>{activeCity.name}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {cityDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-md z-50">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Active City
                </div>
                {CITIES.map(city => (
                  <button
                    key={city.id}
                    onClick={() => {
                      switchCity(city.id);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                      city.id === activeCity.id ? 'bg-cyan-500/10 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{city.name}, {city.state}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      city.activeRiskLevel === 'critical' ? 'bg-red-950 text-red-400' :
                      city.activeRiskLevel === 'high' ? 'bg-amber-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {city.activeRiskLevel.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Alerts Bell */}
          <div className="relative">
            <button
              onClick={() => setAlertsOpen(!alertsOpen)}
              className="relative p-2 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
              aria-label="Alerts"
            >
              <Bell className="h-4 w-4" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {alertsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-800 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-300">Active Impact Alerts ({activeAlerts.length})</span>
                  <span className="text-[10px] text-slate-500 font-mono">SEOC Broadcast</span>
                </div>
                <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                  {activeAlerts.length === 0 ? (
                    <p className="text-xs text-slate-500 py-3 text-center">No extreme alerts active.</p>
                  ) : (
                    activeAlerts.map(al => (
                      <div key={al.id} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
                        <div className="flex items-center justify-between gap-1 text-red-400 font-semibold mb-1">
                          <span>{al.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{al.eta}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] mb-1">{al.recommendedAction}</p>
                        <div className="text-[10px] text-slate-500 flex justify-between">
                          <span>Target: {al.targetAudience}</span>
                          <span>{al.issuedAt}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Role Switcher Button */}
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 text-xs text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
          >
            <span className="text-base">{currentUser.avatar}</span>
            <div className="text-left hidden md:block">
              <div className="font-semibold text-white leading-tight truncate max-w-[120px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-mono">
                {currentUser.role.replace('_', ' ')}
              </div>
            </div>
            <Users className="h-3 w-3 text-slate-400 ml-1" />
          </button>

        </div>
      </div>
    </header>
  );
};
