import React, { useState } from 'react';
import { FloodPulseProvider, useFloodPulse } from './context/FloodPulseContext';
import { Header } from './components/common/Header';
import { FixedSidebar } from './components/common/FixedSidebar';
import { ScenarioBar } from './components/common/ScenarioBar';
import { LoginModal } from './components/auth/LoginModal';
import { LandingPage } from './components/landing/LandingPage';
import { InteractiveGISMap } from './components/map/InteractiveGISMap';
import { AICommandCenter } from './components/ai/AICommandCenter';
import { NowcastingEngine } from './components/nowcasting/NowcastingEngine';
import { GovernmentDashboard } from './components/dashboards/GovernmentDashboard';
import { CitizenDashboard } from './components/dashboards/CitizenDashboard';
import { VolunteerDashboard } from './components/dashboards/VolunteerDashboard';
import { DamOperatorDashboard } from './components/dashboards/DamOperatorDashboard';
import { HospitalDashboard } from './components/dashboards/HospitalDashboard';
import { ShelterDashboard } from './components/dashboards/ShelterDashboard';
import { EmergencyServicesDashboard } from './components/dashboards/EmergencyServicesDashboard';
import {
  MonitoringView,
  AlertsView,
  ResourcesView,
  SheltersHospitalsView,
  RoadsDrainageView,
  ScenariosView,
  AnalyticsView,
  ReportsView,
  SettingsView
} from './components/views/AdditionalViews';
import { UserRole } from './types';

const MainApp: React.FC = () => {
  // 1. Initial State: The user first sees the original FloodPulse landing/login page
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const { currentUser, activeCity, switchRole } = useFloodPulse();

  // Login Handler: Only after successful login does the user enter the dashboard and see the sidebar
  const handleRoleSelectAndNavigate = (role: UserRole) => {
    switchRole(role);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  // Logout Handler: Resets auth state, hides sidebar, and returns to previous landing/login interface
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('landing');
    setIsMobileSidebarOpen(false);
  };

  // Sidebar appears ONLY after login and NOT on the landing/login screen
  const showSidebar = isLoggedIn && currentView !== 'landing';

  // Render Role-Specific Dashboard
  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'citizen':
        return <CitizenDashboard />;
      case 'dam_operator':
        return <DamOperatorDashboard />;
      case 'volunteer':
        return <VolunteerDashboard />;
      case 'hospital':
        return <HospitalDashboard />;
      case 'shelter':
        return <ShelterDashboard />;
      case 'police':
      case 'fire_rescue':
      case 'ambulance':
      case 'logistics':
      case 'relief_supplier':
      case 'ngo':
      case 'municipal':
        return <EmergencyServicesDashboard />;
      case 'government':
      case 'admin':
      default:
        return <GovernmentDashboard onNavigateToAgents={() => setCurrentView('agents')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-cyan-500/20">
      
      {/* 1. FIXED VERTICAL SIDEBAR: Shown ONLY after successful login */}
      {showSidebar && (
        <FixedSidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          onLogout={handleLogout}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 2. MAIN APPLICATION CONTENT:
          - Full width (ml-0) on Landing/Login Page
          - Has left margin (md:ml-64) ONLY after login so dashboard never goes underneath sidebar
          - Normal document scrolling (no inner scrollbars, no overflow:hidden locking)
      */}
      <div className={`flex-1 min-w-0 flex flex-col min-h-screen transition-all duration-200 ${showSidebar ? 'md:ml-64' : 'ml-0'}`}>
        
        {/* Top Header */}
        <Header
          currentView={currentView}
          setCurrentView={(view) => {
            if (view === 'landing') {
              setIsLoggedIn(false);
            }
            setCurrentView(view);
          }}
          onOpenLogin={() => setIsLoginOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        />

        {/* Global Simulation & Scenario Execution Ribbon (shown on dashboard & specialized views) */}
        {showSidebar && <ScenarioBar />}

        {/* Viewport Router */}
        <main className="flex-1">
          {currentView === 'landing' && (
            <LandingPage
              onExplore={() => {
                setIsLoggedIn(true);
                setCurrentView('dashboard');
              }}
              onOpenMap={() => {
                setIsLoggedIn(true);
                setCurrentView('map');
              }}
              onEmergencyAccess={() => {
                switchRole('citizen');
                setIsLoggedIn(true);
                setCurrentView('dashboard');
              }}
              onOpenLogin={() => setIsLoginOpen(true)}
            />
          )}

          {currentView === 'dashboard' && renderDashboard()}

          {currentView === 'map' && (
            <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    Live GIS Flood Risk, Road Status &amp; Emergency Routing Map
                  </h1>
                  <p className="text-xs text-slate-400">
                    Real-time hydrodynamic layers for {activeCity.name}. Click elements to inspect depth, closures, and bed counts.
                  </p>
                </div>
              </div>
              <InteractiveGISMap heightClass="h-[750px]" />
            </div>
          )}

          {currentView === 'monitoring' && <MonitoringView />}

          {currentView === 'nowcasting' && <NowcastingEngine />}

          {currentView === 'alerts' && <AlertsView />}

          {currentView === 'agents' && <AICommandCenter />}

          {currentView === 'resources' && <ResourcesView />}

          {currentView === 'shelters_hospitals' && <SheltersHospitalsView />}

          {currentView === 'roads_drainage' && <RoadsDrainageView />}

          {currentView === 'scenarios' && <ScenariosView />}

          {currentView === 'analytics' && <AnalyticsView />}

          {currentView === 'reports' && <ReportsView />}

          {currentView === 'settings' && <SettingsView />}
        </main>

        {/* 14-Role Demo Authentication Modal */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSelectRoleAndNavigate={handleRoleSelectAndNavigate}
        />

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/90 py-6 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="font-mono text-[11px] text-slate-400">
              FLOODPULSE URBAN INTELLIGENCE · UNIFIED DISASTER RESPONSE PLATFORM
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Active City: <strong>{activeCity.name}</strong></span>
              <span>·</span>
              <span>Logged in as: <strong className="text-cyan-400">{currentUser.name} ({currentUser.roleTitle})</strong></span>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
};

export default function App() {
  return (
    <FloodPulseProvider>
      <MainApp />
    </FloodPulseProvider>
  );
}
