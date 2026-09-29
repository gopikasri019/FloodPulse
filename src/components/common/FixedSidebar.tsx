import React from 'react';
import {
  Waves,
  LayoutDashboard,
  Map as MapIcon,
  Radio,
  CloudRain,
  Bell,
  Cpu,
  Boxes,
  Home,
  Navigation,
  Play,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';

interface FixedSidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const FixedSidebar: React.FC<FixedSidebarProps> = ({
  currentView,
  setCurrentView,
  onLogout,
  isOpenMobile,
  onCloseMobile
}) => {
  const { alerts, currentUser, activeCity } = useFloodPulse();
  const activeAlertsCount = alerts.filter(a => a.active).length;

  // The 13 exact navigation items specified by the user
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Live Flood Map', icon: MapIcon },
    { id: 'monitoring', label: 'Waterway Monitoring', icon: Radio },
    { id: 'nowcasting', label: 'Flood Nowcasting', icon: CloudRain },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: activeAlertsCount },
    { id: 'agents', label: 'AI Intelligence', icon: Cpu },
    { id: 'resources', label: 'Emergency Resources', icon: Boxes },
    { id: 'shelters_hospitals', label: 'Shelters & Hospitals', icon: Home },
    { id: 'roads_drainage', label: 'Road & Drainage Status', icon: Navigation },
    { id: 'scenarios', label: 'Scenarios', icon: Play },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Fixed Vertical Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 h-screen bg-slate-950 border-r border-slate-800/90 flex flex-col justify-between transition-transform duration-300 ease-in-out select-none shadow-2xl ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: FloodPulse Logo & Name */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950/90">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 group-hover:scale-105 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold font-mono tracking-tight text-white flex items-center gap-1 leading-none">
                FLOOD<span className="text-cyan-400">PULSE</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 tracking-wider mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>COMMAND COP</span>
              </div>
            </div>
          </button>

          {/* Close button on mobile screens */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Items (Scrollable internally if viewport height is small) */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="px-3 py-1 mb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
            Command Navigation
          </div>

          <nav className="space-y-0.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)] translate-x-0.5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="tracking-wide text-left truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Active User Card & Fixed Logout Button */}
        <div className="p-3 border-t border-slate-800/90 bg-slate-950/95 shrink-0 space-y-2">
          {/* Active User Summary */}
          <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base shrink-0">{currentUser.avatar}</span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-mono truncate">
                  {currentUser.roleTitle || currentUser.role.replace('_', ' ')}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
              {activeCity.name}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-red-300 bg-slate-900/90 hover:bg-red-950/40 border border-slate-800 hover:border-red-900/50 transition-all group"
          >
            <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-400 transition-colors" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
