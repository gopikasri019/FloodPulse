import React, { useState } from 'react';
import {
  PhoneCall,
  AlertTriangle,
  MapPin,
  CheckCircle,
  Clock,
  Compass,
  Home,
  Hospital,
  Droplets,
  PlusCircle,
  FileCheck,
  Send,
  Camera,
  HeartPulse,
  Users,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useFloodPulse } from '../../context/FloodPulseContext';
import { SOSRequest } from '../../types';

export const CitizenDashboard: React.FC = () => {
  const {
    activeCity,
    currentUser,
    sosRequests,
    submitSOS,
    submitCitizenReport,
    shelters,
    hospitals,
    roads
  } = useFloodPulse();

  // Find user's existing SOS if any
  const mySOS = sosRequests.find(s => s.phone === currentUser.phone || s.citizenName === currentUser.name) || sosRequests[0];

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState<'road' | 'drain' | 'water' | null>(null);

  // SOS Form state
  const [locationName, setLocationName] = useState('14/2 Tansi Nagar 3rd Street, Velachery');
  const [peopleCount, setPeopleCount] = useState(4);
  const [waterDepthM, setWaterDepthM] = useState(0.8);
  const [hasMedicalEmergency, setHasMedicalEmergency] = useState(true);
  const [childrenCount, setChildrenCount] = useState(1);
  const [elderlyCount, setElderlyCount] = useState(1);
  const [helpType, setHelpType] = useState<SOSRequest['helpType']>('boat_evacuation');
  const [notes, setNotes] = useState('Ground floor flooded, senior citizen requires insulin, water rising.');

  // Crowd Report state
  const [reportLocation, setReportLocation] = useState('Bypass Road Junction');
  const [reportDepth, setReportDepth] = useState(0.65);
  const [reportDesc, setReportDesc] = useState('Storm drain overflowed, cars cannot pass.');

  const handleSOSSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSOS({
      citizenName: currentUser.name,
      phone: currentUser.phone,
      locationName,
      peopleCount,
      waterDepthM,
      hasMedicalEmergency,
      childrenCount,
      elderlyCount,
      helpType,
      notes
    });
    setIsFormOpen(false);
  };

  const handleCrowdReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportModalOpen) return;

    submitCitizenReport({
      title: reportModalOpen === 'road' ? 'Citizen Flooded Road Report' :
             reportModalOpen === 'drain' ? 'Blocked Stormwater Drain' : 'Rapid Rising Water Alert',
      location: reportLocation,
      type: reportModalOpen === 'road' ? 'road_blockage' :
            reportModalOpen === 'drain' ? 'drain_clog' : 'rescue',
      depthM: reportDepth,
      desc: reportDesc
    });
    setReportModalOpen(null);
  };

  const statusSteps = [
    { key: 'reported', label: 'Reported' },
    { key: 'verified', label: 'Verified' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'responding', label: 'Responding' },
    { key: 'resolved', label: 'Resolved' }
  ];

  const getStepIndex = (status: string) => {
    const idx = statusSteps.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIdx = mySOS ? getStepIndex(mySOS.status) : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div>
          <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase">CITIZEN SAFETY PORTAL</span>
          <h1 className="text-xl font-bold text-white">{currentUser.name}</h1>
          <p className="text-xs text-slate-400">Ward 178, {activeCity.name} · GPS Online</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>COMM DISPATCH ONLINE</span>
          </span>
        </div>
      </div>

      {/* Primary Emergency CTA Button */}
      {!isFormOpen ? (
        <div className="text-center py-4">
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full py-6 px-8 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xl sm:text-2xl shadow-2xl shadow-red-950/80 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 border border-red-400/50 cursor-pointer"
          >
            <PhoneCall className="h-7 w-7 animate-bounce" />
            <span>REQUEST EMERGENCY HELP</span>
          </button>
          <p className="text-xs text-slate-400 mt-2">
            Connects directly to SEOC First Responders, Inflatable Rescue Boats, and Paramedics with live GPS telemetry.
          </p>
        </div>
      ) : (
        /* Emergency Request Form */
        <div className="rounded-2xl border border-red-500/50 bg-slate-900/95 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h3 className="font-bold text-white text-base">Emergency SOS Submission Form</h3>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSOSSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Your Exact Location / Landmark</label>
              <input
                type="text"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                placeholder="Building name, street, floor..."
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Total People</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={peopleCount}
                  onChange={e => setPeopleCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Water Depth (m)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="5.0"
                  value={waterDepthM}
                  onChange={e => setWaterDepthM(parseFloat(e.target.value) || 0.5)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Children (under 12)</label>
                <input
                  type="number"
                  min="0"
                  value={childrenCount}
                  onChange={e => setChildrenCount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Elderly (60+)</label>
                <input
                  type="number"
                  min="0"
                  value={elderlyCount}
                  onChange={e => setElderlyCount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Primary Help Required</label>
                <select
                  value={helpType}
                  onChange={e => setHelpType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                >
                  <option value="boat_evacuation">Boat Evacuation (High Water)</option>
                  <option value="stranded_on_roof">Stranded on Terrace / Upper Floor</option>
                  <option value="medical_transport">Urgent Medical Transport</option>
                  <option value="food_water">Emergency Food &amp; Water Packets</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="medEmerg"
                  checked={hasMedicalEmergency}
                  onChange={e => setHasMedicalEmergency(e.target.checked)}
                  className="h-4 w-4 rounded accent-red-500"
                />
                <label htmlFor="medEmerg" className="text-white font-semibold flex items-center gap-1">
                  <HeartPulse className="h-4 w-4 text-rose-400" />
                  <span>Critical Medical Emergency (Heart, Insulin, Infant, Oxygen)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Situation Details / Symptoms</label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                placeholder="Mention specific medical conditions, battery levels, landmarks..."
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-red-950"
              >
                <Send className="h-4 w-4" />
                <span>Submit High-Priority SOS</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Live SOS Status Tracker: Reported → Verified → Assigned → Responding → Resolved */}
      {mySOS && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-rose-400 font-bold">ACTIVE RESCUE DISPATCH TRACKER</span>
              <h3 className="font-bold text-white text-base">SOS Request #{mySOS.id}</h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
              Reported at {mySOS.reportedAt}
            </span>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {statusSteps.map((step, idx) => {
              const isPastOrCurrent = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step.key} className="space-y-1.5">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isPastOrCurrent ? 'bg-cyan-400' : 'bg-slate-800'
                    }`}
                  />
                  <span className={`block text-[11px] font-mono ${
                    isCurrent ? 'text-cyan-300 font-bold' : isPastOrCurrent ? 'text-slate-200' : 'text-slate-600'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-slate-400">Assigned Rescue Unit: </span>
              <strong className="text-white">{mySOS.assignedVehicleId ? 'Zodiac Inflatable Boat 03' : 'Incident Agent Matching Dispatch Unit'}</strong>
            </div>
            <div>
              <span className="text-slate-400">Field Volunteer: </span>
              <strong className="text-cyan-300">{mySOS.assignedVolunteerId ? 'Priya Meenakshi (First Aid Certified)' : 'Matching nearby'}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Citizen Crowd-Reporting Actions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-cyan-400" />
          <span>Crowd-Sourced Community Flood Reporting</span>
        </h3>
        <p className="text-xs text-slate-400">
          Help AI agents improve the live nowcasting model by reporting ground observations in your area.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setReportModalOpen('road')}
            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left transition-colors flex items-center gap-3"
          >
            <span className="text-xl">🚧</span>
            <div>
              <div className="font-semibold text-white text-xs">Report Flooded Road</div>
              <div className="text-[11px] text-slate-400">Standing water &gt; 0.3m</div>
            </div>
          </button>

          <button
            onClick={() => setReportModalOpen('drain')}
            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left transition-colors flex items-center gap-3"
          >
            <span className="text-xl">🕳️</span>
            <div>
              <div className="font-semibold text-white text-xs">Report Drain Blockage</div>
              <div className="text-[11px] text-slate-400">Silt choke &amp; backflow</div>
            </div>
          </button>

          <button
            onClick={() => setReportModalOpen('water')}
            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left transition-colors flex items-center gap-3"
          >
            <span className="text-xl">🌊</span>
            <div>
              <div className="font-semibold text-white text-xs">Report Rising Water</div>
              <div className="text-[11px] text-slate-400">Sudden inflow alert</div>
            </div>
          </button>
        </div>
      </div>

      {/* Crowd Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-white text-sm">
              Submit Ground Report: {reportModalOpen === 'road' ? 'Flooded Road' : reportModalOpen === 'drain' ? 'Drain Blockage' : 'Rising Water'}
            </h4>
            <form onSubmit={handleCrowdReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Location / Street</label>
                <input
                  type="text"
                  value={reportLocation}
                  onChange={e => setReportLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Water Depth (Meters)</label>
                <input
                  type="number"
                  step="0.05"
                  value={reportDepth}
                  onChange={e => setReportDepth(parseFloat(e.target.value) || 0.3)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Observation Description</label>
                <textarea
                  rows={2}
                  value={reportDesc}
                  onChange={e => setReportDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(null)}
                  className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Nearby Shelters & Hospitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Nearby Shelters */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <Home className="h-4 w-4 text-emerald-400" />
              <span>Nearby Safe Relief Shelters</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Verified Safe Zones</span>
          </div>
          <div className="space-y-2">
            {shelters.map(sh => (
              <div key={sh.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">{sh.name}</div>
                  <div className="text-[11px] text-slate-400">Available: {sh.capacity - sh.occupancy} spaces · Food: {sh.foodDaysRemaining} days</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                  {sh.accessibilityStatus.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Hospitals */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <Hospital className="h-4 w-4 text-indigo-400" />
              <span>Nearby Emergency Hospitals</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">ICU &amp; Emergency</span>
          </div>
          <div className="space-y-2">
            {hospitals.map(h => (
              <div key={h.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold text-white">{h.name}</div>
                  <div className="text-[11px] text-slate-400">Available Beds: {h.availableBeds} · ICU Beds: {h.icuBedsAvailable}</div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-1 rounded shrink-0 ${
                  h.waterAccessible ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-red-950 text-red-300 border border-red-800'
                }`}>
                  {h.waterAccessible ? 'Safe Road Access' : 'Partial Flood Road'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
