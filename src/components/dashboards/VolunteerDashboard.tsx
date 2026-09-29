import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  MapPin,
  Clock,
  Compass,
  Award,
  Upload,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Phone,
  Check
} from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';

export const VolunteerDashboard: React.FC = () => {
  const {
    currentUser,
    volunteers,
    acceptVolunteerTask,
    completeVolunteerTask,
    activeCity
  } = useFloodPulse();

  const myVolunteer = volunteers.find(v => v.name === currentUser.name) || volunteers[0];
  const [isAvailable, setIsAvailable] = useState(myVolunteer.isAvailable);
  const [proofUploaded, setProofUploaded] = useState(false);

  // Available tasks nearby
  const nearbyTasks = [
    {
      id: 'task-aid-702',
      title: 'Triage & Infant First-Aid: Tansi Nagar Avenue 2',
      distanceKm: 1.8,
      severity: 'high',
      skillsRequired: ['First Aid', 'Emergency Triage'],
      description: 'Assist with infant hypothermia stabilization and escort senior citizen after zodiac boat evacuation.',
      peopleCount: 6,
      urgency: 'Immediate'
    },
    {
      id: 'task-ration-104',
      title: 'Dry Food Distribution: Velachery Relief Shelter',
      distanceKm: 2.4,
      severity: 'medium',
      skillsRequired: ['Ration Distribution', 'Tamil / English Comm'],
      description: 'Help unload 1,200 nutrient meal packets from Ashok 6x6 truck and manage distribution queue.',
      peopleCount: 380,
      urgency: 'Next 30 min'
    },
    {
      id: 'task-boat-009',
      title: 'Inflatable Boat Navigator Assistant: Keelkattalai Link',
      distanceKm: 3.2,
      severity: 'critical',
      skillsRequired: ['Boat Operator', 'Deep Water Swimmer'],
      description: 'Guide rescue boat through submerged residential street with submerged power lines.',
      peopleCount: 12,
      urgency: 'Immediate'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Profile Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentUser.avatar}</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">{currentUser.name}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1 font-bold">
                <Award className="h-3 w-3" />
                <span>{myVolunteer.badgeLevel.toUpperCase()} BADGE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Current Base: {myVolunteer.currentLocation} · {myVolunteer.completedTasksCount} Verified Rescues Completed
            </p>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-300 font-medium">Duty Status:</span>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              isAvailable
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-slate-950' : 'bg-slate-500'}`} />
            <span>{isAvailable ? 'ACTIVE & ON-CALL' : 'OFF DUTY'}</span>
          </button>
        </div>
      </div>

      {/* Skills & Verified Capabilities */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium mr-2">Certified Skill Set:</span>
        {myVolunteer.skills.map(skill => (
          <span key={skill} className="px-2.5 py-1 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-medium">
            ✓ {skill}
          </span>
        ))}
      </div>

      {/* Active Assigned Task Card */}
      {myVolunteer.activeTaskId && (
        <div className="rounded-2xl border border-cyan-500/60 bg-gradient-to-r from-cyan-950/40 to-slate-900/90 p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-cyan-400 animate-spin" />
              <h3 className="font-bold text-white text-base">Active Field Deployment in Progress</h3>
            </div>
            <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-500/40">
              MISSION #{myVolunteer.activeTaskId}
            </span>
          </div>

          <p className="text-xs text-slate-300">
            You have accepted the Tansi Nagar emergency rescue mission. Provide infant first-aid stabilization at the Velachery Bypass staging rendezvous point.
          </p>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Safe Navigation Corridor:</span>
              <span className="text-emerald-400 font-bold">Via OMR Elevated &gt; Bypass Staging</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Rescue Team Lead Contact:</span>
              <span className="text-white">+91 94450 88990 (Sub-Officer Balan)</span>
            </div>
          </div>

          {/* Upload Proof & Complete Task */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setProofUploaded(true)}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>{proofUploaded ? '✓ GPS Geotag Proof Attached' : 'Attach Geotagged Photo Proof'}</span>
            </button>

            <button
              onClick={() => completeVolunteerTask(myVolunteer.id)}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Mark Mission Completed &amp; Return to Pool</span>
            </button>
          </div>
        </div>
      )}

      {/* Nearby Urgent Emergency Tasks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Nearby Tasks Awaiting Volunteer Matching</h3>
          <span className="text-xs font-mono text-slate-400">Within 5 km radius</span>
        </div>

        <div className="space-y-3">
          {nearbyTasks.map(task => (
            <div
              key={task.id}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    task.severity === 'critical' ? 'bg-red-950 text-red-400 border border-red-800' :
                    task.severity === 'high' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {task.urgency}
                  </span>
                  <h4 className="font-bold text-white text-sm">{task.title}</h4>
                </div>
                <p className="text-xs text-slate-300">{task.description}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-1">
                  <span>📍 {task.distanceKm} km away</span>
                  <span>·</span>
                  <span>👥 {task.peopleCount} people</span>
                  <span>·</span>
                  <span className="text-cyan-400">Skills: {task.skillsRequired.join(', ')}</span>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <button
                  disabled={!isAvailable || !!myVolunteer.activeTaskId}
                  onClick={() => acceptVolunteerTask(myVolunteer.id, task.id)}
                  className="w-full md:w-auto px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>Accept Task</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
