import React, { useState } from 'react';
import { X, ShieldCheck, Check, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoleAndNavigate: (role: UserRole) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSelectRoleAndNavigate }) => {
  const { users, currentUser, switchRole } = useFloodPulse();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);

  if (!isOpen) return null;

  const handleSwitch = (role: UserRole) => {
    switchRole(role);
    onSelectRoleAndNavigate(role);
    onClose();
  };

  const roleCategories = [
    {
      category: 'Command & Administration',
      roles: ['government', 'municipal', 'admin'] as UserRole[]
    },
    {
      category: 'First Responders & Field Rescue',
      roles: ['police', 'fire_rescue', 'ambulance'] as UserRole[]
    },
    {
      category: 'Critical Infrastructure & Facilities',
      roles: ['dam_operator', 'hospital', 'shelter'] as UserRole[]
    },
    {
      category: 'Civilian & Humanitarian Network',
      roles: ['citizen', 'volunteer', 'ngo', 'logistics', 'relief_supplier'] as UserRole[]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Multi-Role Access Gateway & Demo Accounts</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Select Role to Access Specialized Emergency Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Every role in the disaster response lifecycle has custom real-time telemetry, action permissions, and workflows. Click any account below to switch instantly.
          </p>
        </div>

        {/* Roles Grid Organized by Category */}
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
          {roleCategories.map(cat => (
            <div key={cat.category} className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                {cat.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {cat.roles.map(roleKey => {
                  const user = users.find(u => u.role === roleKey);
                  if (!user) return null;
                  const isCurrent = currentUser.role === roleKey;

                  return (
                    <button
                      key={roleKey}
                      onClick={() => handleSwitch(roleKey)}
                      className={`group flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? 'border-cyan-500/60 bg-cyan-500/10 text-white shadow-lg shadow-cyan-950/40'
                          : 'border-slate-800/80 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="text-2xl mt-0.5">{user.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-white truncate">
                            {user.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] text-cyan-400 font-mono font-semibold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-cyan-400 font-medium truncate mt-0.5">
                          {user.roleTitle}
                        </div>
                        {user.department && (
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            {user.department}
                          </div>
                        )}
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                          <span>Enter Dashboard</span>
                          <ArrowRight className="h-2.5 w-2.5" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-cyan-400" />
            <span>Demo authentication enabled for evaluation. Zero credential friction.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
