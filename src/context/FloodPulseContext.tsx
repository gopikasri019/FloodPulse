import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  UserRole,
  UserProfile,
  CityConfig,
  FloodZone,
  RoadSegment,
  Incident,
  SOSRequest,
  Hospital,
  Shelter,
  Volunteer,
  ReliefResource,
  FleetVehicle,
  DamReservoir,
  AIAgent,
  AgentActivityLog,
  ActionApprovalRequest,
  ImpactAlert,
  NowcastPrediction,
  IncidentStatus,
  StateHierarchy,
  DistrictHierarchy,
  MonitoringStation,
  StationRiskLevel
} from '../types';
import { backendApi } from '../services/backendApi';
import {
  CITIES,
  DEMO_USERS,
  INITIAL_FLOOD_ZONES,
  INITIAL_ROADS,
  INITIAL_HOSPITALS,
  INITIAL_SHELTERS,
  INITIAL_VOLUNTEERS,
  INITIAL_RESOURCES,
  INITIAL_FLEET,
  INITIAL_DAM,
  INITIAL_AGENTS,
  INITIAL_LOGS,
  INITIAL_APPROVALS,
  INITIAL_ALERTS,
  INITIAL_NOWCASTS,
  INITIAL_SOS_REQUESTS,
  INITIAL_INCIDENTS,
  STATES,
  DISTRICTS,
  MONITORING_STATIONS
} from '../data/initialData';

export type SimulationScenarioId = 'scenario_a' | 'scenario_b' | 'scenario_c';

export interface ScenarioDefinition {
  id: SimulationScenarioId;
  name: string;
  tagline: string;
  totalSteps: number;
  steps: {
    title: string;
    description: string;
    agentName: string;
    actionDetail: string;
  }[];
}

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'scenario_a',
    name: 'Scenario A: Urban Heavy Rain (Flash Inundation)',
    tagline: 'Monsoon cloudburst triggers 85mm/h rain, flooding arterial corridors in Velachery.',
    totalSteps: 8,
    steps: [
      {
        title: 'Step 1: Heavy Rainfall Detected',
        description: 'Automatic rain gauges and radar telemetry record a sudden cloudburst (68.5 -> 88.0 mm/hr) over Velachery basin.',
        agentName: 'Flood Intelligence Agent',
        actionDetail: 'Detected spike in runoff coefficient; raised Basin Inundation Probability to 96%.'
      },
      {
        title: 'Step 2: Flood Agent Increases Zone Risk',
        description: 'Velachery Lake Catchment predicted water depth spikes to 1.15m within 25 minutes.',
        agentName: 'Flood Intelligence Agent',
        actionDetail: 'Updated Zone 1 risk level to CRITICAL. Sent early alert to SEOC government desk.'
      },
      {
        title: 'Step 3: Citizen SOS Received',
        description: 'Karthik Ramanathan submits high-urgency SOS from Tansi Nagar with 6 stranded residents (including an infant).',
        agentName: 'Incident Agent',
        actionDetail: 'SOS #702 ingested. Verified spatial coordinates against adjacent depth sensor #VEL-04.'
      },
      {
        title: 'Step 4: Ground Truth Verification & Road Closure',
        description: 'Spotter report confirms Velachery Main Road has 0.85m standing water. Inundation exceeds vehicle clearance.',
        agentName: 'Incident Agent',
        actionDetail: 'Marked Velachery Main Road as CLOSED. Barricade alert dispatched to Traffic Police.'
      },
      {
        title: 'Step 5: Routing Agent Recalculates Safe Corridor',
        description: 'Ambulance ALS-108 and rescue vehicles automatically diverted to Rajiv Gandhi Salai (OMR Elevated).',
        agentName: 'Emergency Routing Agent',
        actionDetail: 'Generated dynamic detour: Avoids 0.85m flood zone, saves 14 min transit time.'
      },
      {
        title: 'Step 6: Medical & Resource Allocation',
        description: 'Medical Agent reserves pediatric care bed at Gleneagles; Resource Agent mobilizes 1,200 meal packets.',
        agentName: 'Resource Allocation Agent',
        actionDetail: 'Matched patient triage needs to Gleneagles; dispatched high-clearance truck from Central Depot.'
      },
      {
        title: 'Step 7: Commander Agent Generates Response Plan',
        description: 'Comprehensive response package synthesized. Awaiting District Collector authorization.',
        agentName: 'Commander Agent',
        actionDetail: 'Generated Action Plan #702. Human-in-the-loop approval card presented on SEOC console.'
      },
      {
        title: 'Step 8: Officer Approves & Missions Dispatched',
        description: 'District Commissioner approves plan. Rescue boat on scene, volunteers dispatched, incident resolved.',
        agentName: 'Commander Agent',
        actionDetail: 'All 6 citizens safely transferred to Velachery Community Shelter. Status marked RESOLVED.'
      }
    ]
  },
  {
    id: 'scenario_b',
    name: 'Scenario B: Dam Reservoir Release Surge',
    tagline: 'Chembarambakkam reservoir reaches 86.5% capacity; managed spill increases Adyar river volume.',
    totalSteps: 6,
    steps: [
      {
        title: 'Step 1: Reservoir Inflow Surge',
        description: 'Catchment precipitation forces inflow up to 16,800 cusecs. Water level reaches 22.8m (FRL 24.0m).',
        agentName: 'Dam Risk Agent',
        actionDetail: 'Analyzed storage curve. Advised phased gate discharge to prevent catastrophic emergency spill.'
      },
      {
        title: 'Step 2: Planned Release Simulation',
        description: 'Operator plans 11,500 cusecs release. AI simulates downstream wave front reaching Saidapet in 75 min.',
        agentName: 'Dam Risk Agent',
        actionDetail: 'Simulated 0.42m rise at Maraimalai Adigal Causeway. Low-lying riverbank huts at risk.'
      },
      {
        title: 'Step 3: Downstream Impact Alerts Issued',
        description: 'Targeted broadcast sent to Ward 170-174 residents, ward councillors, and police patrols.',
        agentName: 'Commander Agent',
        actionDetail: 'Triggered mobile alert sirens and automated SMS to 18,000 citizens in river buffer zone.'
      },
      {
        title: 'Step 4: Pre-emptive Shelter Staging',
        description: 'Adyar Government Girls High School Shelter opened. Blankets and dry rations transferred.',
        agentName: 'Resource Allocation Agent',
        actionDetail: 'Dispatched 300 emergency cots and 4,000 water pouches to Adyar Shelter.'
      },
      {
        title: 'Step 5: Embankment Reinforcement',
        description: 'PWD teams deploy 4,000 sandbags at vulnerable secondary canal bend in Mudichur.',
        agentName: 'Incident Agent',
        actionDetail: 'Secured canal bund. Verified structural integrity with field sensor telemetry.'
      },
      {
        title: 'Step 6: Discharge Stabilized & Inundation Contained',
        description: 'River discharge safely routed to Bay of Bengal without residential casualties.',
        agentName: 'Commander Agent',
        actionDetail: 'Water levels downstream stabilized below danger threshold. Operation successful.'
      }
    ]
  },
  {
    id: 'scenario_c',
    name: 'Scenario C: Coastal Surge & High Tide Lock',
    tagline: 'Combined 4.6m astronomical spring tide and intense coastal rain prevent natural drainage.',
    totalSteps: 6,
    steps: [
      {
        title: 'Step 1: High Tide Coincides with Storm',
        description: 'Astronomical tide reaches 4.6m, creating negative hydraulic gradient at river outfall.',
        agentName: 'Flood Intelligence Agent',
        actionDetail: 'Detected backwater lockup; stormwater drains unable to discharge by gravity.'
      },
      {
        title: 'Step 2: Tidal Inundation Nowcast',
        description: 'Nowcasting engine flags coastal avenues and underpasses as high-risk within 40 minutes.',
        agentName: 'Flood Intelligence Agent',
        actionDetail: 'Generated 0-3hr hazard contours; alerted traffic and municipal dewatering wings.'
      },
      {
        title: 'Step 3: Heavy Pump Stations Activated',
        description: 'Municipal engineering deploys 8 high-capacity 2000 GPM dewatering trucks to subterranean subways.',
        agentName: 'Resource Allocation Agent',
        actionDetail: 'Allocated mobile pump fleet to critical underpasses before water hits 0.5m.'
      },
      {
        title: 'Step 4: Hospital Inbound Casualty Diversion',
        description: 'Submerged access corridor prevents ambulances reaching Dr. Kamakshi Memorial.',
        agentName: 'Medical Coordination Agent',
        actionDetail: 'Rerouted 7 incoming ambulances to Omandurar GH and reserved emergency ICU slots.'
      },
      {
        title: 'Step 5: Evacuation of Tidal Encroachments',
        description: 'Volunteers and Fire & Rescue escort 120 families to higher-elevation civic shelters.',
        agentName: 'Volunteer Coordination Agent',
        actionDetail: 'Coordinated 18 volunteers with Tamil-speaking community guides.'
      },
      {
        title: 'Step 6: Ebb Tide & Flood Recession',
        description: 'Tidal level recedes to 1.8m. Pumps restore arterial traffic flow. All routes cleared.',
        agentName: 'Commander Agent',
        actionDetail: 'Normalized city transit network. Rerouting flags lifted.'
      }
    ]
  }
];

interface FloodPulseContextType {
  activeCity: CityConfig;
  switchCity: (cityId: string) => void;
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  users: UserProfile[];
  
  // Entities
  floodZones: FloodZone[];
  roads: RoadSegment[];
  hospitals: Hospital[];
  shelters: Shelter[];
  volunteers: Volunteer[];
  resources: ReliefResource[];
  fleet: FleetVehicle[];
  dam: DamReservoir;
  agents: AIAgent[];
  logs: AgentActivityLog[];
  approvals: ActionApprovalRequest[];
  alerts: ImpactAlert[];
  nowcasts: NowcastPrediction[];
  sosRequests: SOSRequest[];
  incidents: Incident[];

  // Simulation
  scenarioId: SimulationScenarioId;
  scenarioStep: number;
  isScenarioRunning: boolean;
  activeScenario: ScenarioDefinition;
  startScenario: (id?: SimulationScenarioId) => void;
  pauseScenario: () => void;
  resumeScenario: () => void;
  stepForwardScenario: () => void;
  resetScenario: () => void;

  // Actions
  submitSOS: (sosData: Partial<SOSRequest>) => void;
  updateSOSStatus: (id: string, status: IncidentStatus) => void;
  submitCitizenReport: (report: { title: string; location: string; type: Incident['type']; depthM: number; desc: string }) => void;
  approveAction: (id: string) => void;
  rejectAction: (id: string) => void;
  toggleRoadStatus: (id: string, newStatus: RoadSegment['status']) => void;
  updateHospitalAvailability: (id: string, beds: number, icu: number) => void;
  updateShelterRations: (id: string, foodDays: number, waterLiters: number) => void;
  simulateDamRelease: (releaseCusecs: number) => void;
  acceptVolunteerTask: (volunteerId: string, taskId: string) => void;
  completeVolunteerTask: (volunteerId: string) => void;
  allocateReliefResource: (resourceId: string, targetShelterId: string, qty: number) => void;
  dispatchAmbulanceMission: (vehicleId: string, incidentTitle: string) => void;
  dismissAlert: (alertId: string) => void;

  // Scalable Geographic Hierarchy & Hydrological Stations
  states: StateHierarchy[];
  districts: DistrictHierarchy[];
  stations: MonitoringStation[];
  selectedStation: MonitoringStation | null;
  activeStateId: string;
  activeDistrictId: string;
  stationRiskFilter: 'ALL' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  isSimulatorRunning: boolean;
  selectStation: (station: MonitoringStation | string | null) => void;
  setActiveStateId: (stateId: string) => void;
  setActiveDistrictId: (districtId: string) => void;
  setStationRiskFilter: (filter: 'ALL' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL') => void;
  simulateSensorTick: () => void;
  toggleSimulator: () => void;

  // Backend Integration
  isBackendConnected: boolean;
  backendInfo?: { version?: string; database?: string; activeCities?: number };
}

const FloodPulseContext = createContext<FloodPulseContextType | undefined>(undefined);

export const FloodPulseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeCityId, setActiveCityId] = useState<string>('chennai');
  const [currentRole, setCurrentRole] = useState<UserRole>('government');
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [backendInfo, setBackendInfo] = useState<{ version?: string; database?: string; activeCities?: number } | undefined>();

  // Scalable Geographic Hierarchy & Station State
  const [states, setStates] = useState<StateHierarchy[]>(STATES);
  const [districts, setDistricts] = useState<DistrictHierarchy[]>(DISTRICTS);
  const [stations, setStations] = useState<MonitoringStation[]>(MONITORING_STATIONS);
  const [selectedStation, setSelectedStation] = useState<MonitoringStation | null>(null);
  const [activeStateId, setActiveStateId] = useState<string>('tamil_nadu');
  const [activeDistrictId, setActiveDistrictId] = useState<string>('dist-chennai');
  const [stationRiskFilter, setStationRiskFilter] = useState<'ALL' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'>('ALL');
  const [isSimulatorRunning, setIsSimulatorRunning] = useState<boolean>(true);

  useEffect(() => {
    backendApi.checkHealth().then(status => {
      setIsBackendConnected(status.online);
      if (status.online) {
        setBackendInfo({
          version: status.version,
          database: status.database,
          activeCities: status.activeCities
        });
        // Load live geographic stations and hierarchy from FastAPI backend
        backendApi.fetchStates().then(serverStates => {
          if (serverStates && serverStates.length > 0) {
            setStates(serverStates);
          }
        });
        backendApi.fetchDistricts().then(serverDistricts => {
          if (serverDistricts && serverDistricts.length > 0) {
            setDistricts(serverDistricts);
          }
        });
        backendApi.fetchStations().then(serverStations => {
          if (serverStations && serverStations.length > 0) {
            setStations(serverStations);
          }
        });
      }
    });
  }, []);

  
  // Operational state
  const [floodZones, setFloodZones] = useState<FloodZone[]>(INITIAL_FLOOD_ZONES);
  const [roads, setRoads] = useState<RoadSegment[]>(INITIAL_ROADS);
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [shelters, setShelters] = useState<Shelter[]>(INITIAL_SHELTERS);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [resources, setResources] = useState<ReliefResource[]>(INITIAL_RESOURCES);
  const [fleet, setFleet] = useState<FleetVehicle[]>(INITIAL_FLEET);
  const [dam, setDam] = useState<DamReservoir>(INITIAL_DAM);
  const [agents, setAgents] = useState<AIAgent[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<AgentActivityLog[]>(INITIAL_LOGS);
  const [approvals, setApprovals] = useState<ActionApprovalRequest[]>(INITIAL_APPROVALS);
  const [alerts, setAlerts] = useState<ImpactAlert[]>(INITIAL_ALERTS);
  const [nowcasts, setNowcasts] = useState<NowcastPrediction[]>(INITIAL_NOWCASTS);
  const [sosRequests, setSosRequests] = useState<SOSRequest[]>(INITIAL_SOS_REQUESTS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);

  // Simulation engine state
  const [scenarioId, setScenarioId] = useState<SimulationScenarioId>('scenario_a');
  const [scenarioStep, setScenarioStep] = useState<number>(0);
  const [isScenarioRunning, setIsScenarioRunning] = useState<boolean>(false);

  const activeCity = useMemo(() => {
    return CITIES.find(c => c.id === activeCityId) || CITIES[0];
  }, [activeCityId]);

  const currentUser = useMemo(() => {
    return DEMO_USERS.find(u => u.role === currentRole) || DEMO_USERS[0];
  }, [currentRole]);

  const activeScenario = useMemo(() => {
    return SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];
  }, [scenarioId]);

  const switchCity = (cityId: string) => {
    setActiveCityId(cityId);
    // Add activity log
    const cityObj = CITIES.find(c => c.id === cityId);
    if (cityObj) {
      addLog({
        agentName: 'Commander Agent',
        action: `Switched City to ${cityObj.name}`,
        details: `Loaded location-adaptive hydrological profile: ${cityObj.primaryDrivers.join(', ')}.`,
        severity: 'info'
      });
    }
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const addLog = (logItem: Omit<AgentActivityLog, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog: AgentActivityLog = {
      ...logItem,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: timeStr
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  // Automated step progression when scenario is running
  useEffect(() => {
    if (!isScenarioRunning) return;

    const timer = setInterval(() => {
      setScenarioStep(prev => {
        if (prev >= activeScenario.totalSteps) {
          setIsScenarioRunning(false);
          return prev;
        }
        const nextStep = prev + 1;
        executeScenarioStepEffects(scenarioId, nextStep);
        return nextStep;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isScenarioRunning, scenarioId, activeScenario]);

  const executeScenarioStepEffects = (scen: SimulationScenarioId, step: number) => {
    const stepData = activeScenario.steps[step - 1];
    if (!stepData) return;

    addLog({
      agentName: stepData.agentName,
      action: stepData.title,
      details: stepData.actionDetail,
      severity: step === 8 || step === 6 ? 'success' : 'alert'
    });

    // Notify backend if online
    backendApi.advanceScenarioStep(scen, step);

    if (scen === 'scenario_a') {
      if (step === 2) {
        // Water rises in Zone 1
        setFloodZones(prev => prev.map(z => z.id === 'fz-1' ? { ...z, waterDepthM: 1.15, riskLevel: 'critical' } : z));
      } else if (step === 4) {
        // Close Velachery Main Road
        setRoads(prev => prev.map(r => r.id === 'rd-1' ? { ...r, status: 'closed', waterDepthM: 0.85, verifiedByGround: true } : r));
      } else if (step === 5) {
        // Update vehicle path and update routing agent decision
        setAgents(prev => prev.map(a => a.id === 'agent_routing' ? {
          ...a,
          decision: 'Active emergency detour enforced: Rajiv Gandhi Salai (OMR Elevated) clear; transit time 16 min.',
          lastUpdated: 'Just now'
        } : a));
      } else if (step === 7) {
        // Pending approval appears
        setApprovals(prev => prev.map(app => app.id === 'appr-1' ? { ...app, status: 'pending' } : app));
      } else if (step === 8) {
        // Mark incident and SOS as resolved
        setSosRequests(prev => prev.map(s => s.id === 'sos-702' ? { ...s, status: 'resolved' } : s));
        setIncidents(prev => prev.map(i => i.id === 'inc-101' ? { ...i, status: 'resolved' } : i));
        setApprovals(prev => prev.map(app => app.id === 'appr-1' ? { ...app, status: 'approved' } : app));
      }
    } else if (scen === 'scenario_b') {
      if (step === 2) {
        setDam(prev => ({
          ...prev,
          currentLevelM: 23.1,
          storagePercentage: 91.2,
          inflowCusecs: 16800,
          outflowCusecs: 11500,
          openGates: 8,
          downstreamRiskLevel: 'critical',
          aiRecommendation: 'Downstream surge warning broadcasted. Adyar causeways closing in 45 minutes.'
        }));
      } else if (step === 3) {
        setAlerts(prev => [
          {
            id: `alt-b-${Date.now()}`,
            title: 'CHEMBARAMBAKKAM SURGE RELEASE: ADYAR RIVERBANK EVACUATION',
            severity: 'extreme',
            location: 'Saidapet to Kotturpuram Riverbank Buffer',
            eta: '45 - 60 minutes',
            recommendedAction: 'Move to elevated ground immediately. Primary schools and community halls in Ward 170 activated.',
            targetAudience: 'Riverbank residents, emergency responders',
            active: true,
            issuedAt: 'Just now'
          },
          ...prev
        ]);
      }
    } else if (scen === 'scenario_c') {
      if (step === 2) {
        setRoads(prev => prev.map(r => r.id === 'rd-2' ? { ...r, status: 'closed', waterDepthM: 0.62 } : r));
      } else if (step === 4) {
        setHospitals(prev => prev.map(h => h.id === 'hosp-2' ? { ...h, incomingEmergencies: 14, availableBeds: 6 } : h));
      }
    }
  };

  const startScenario = (id?: SimulationScenarioId) => {
    if (id) {
      setScenarioId(id);
    }
    setScenarioStep(1);
    setIsScenarioRunning(true);
    executeScenarioStepEffects(id || scenarioId, 1);
  };

  const pauseScenario = () => {
    setIsScenarioRunning(false);
  };

  const resumeScenario = () => {
    setIsScenarioRunning(true);
  };

  const stepForwardScenario = () => {
    setScenarioStep(prev => {
      const next = Math.min(prev + 1, activeScenario.totalSteps);
      executeScenarioStepEffects(scenarioId, next);
      return next;
    });
  };

  const resetScenario = () => {
    setIsScenarioRunning(false);
    setScenarioStep(0);
    setFloodZones(INITIAL_FLOOD_ZONES);
    setRoads(INITIAL_ROADS);
    setHospitals(INITIAL_HOSPITALS);
    setShelters(INITIAL_SHELTERS);
    setVolunteers(INITIAL_VOLUNTEERS);
    setResources(INITIAL_RESOURCES);
    setFleet(INITIAL_FLEET);
    setDam(INITIAL_DAM);
    setAgents(INITIAL_AGENTS);
    setLogs(INITIAL_LOGS);
    setApprovals(INITIAL_APPROVALS);
    setAlerts(INITIAL_ALERTS);
    setNowcasts(INITIAL_NOWCASTS);
    setSosRequests(INITIAL_SOS_REQUESTS);
    setIncidents(INITIAL_INCIDENTS);
    addLog({
      agentName: 'Commander Agent',
      action: 'Simulation Reset',
      details: 'Restored baseline urban sensors, road statuses, and dispatch units to nominal state.',
      severity: 'info'
    });
  };

  const submitSOS = (sosData: Partial<SOSRequest>) => {
    const newId = `sos-${Math.floor(100 + Math.random() * 900)}`;
    const newSOS: SOSRequest = {
      id: newId,
      cityId: activeCityId,
      citizenName: sosData.citizenName || currentUser.name,
      phone: sosData.phone || currentUser.phone || '+91 99999 00000',
      locationName: sosData.locationName || 'Velachery Central Sector',
      coordinates: sosData.coordinates || [32, 63],
      peopleCount: sosData.peopleCount || 2,
      waterDepthM: sosData.waterDepthM || 0.6,
      hasMedicalEmergency: !!sosData.hasMedicalEmergency,
      childrenCount: sosData.childrenCount || 0,
      elderlyCount: sosData.elderlyCount || 0,
      helpType: sosData.helpType || 'boat_evacuation',
      notes: sosData.notes || 'Emergency assistance requested via citizen interface.',
      status: 'reported',
      reportedAt: new Date().toTimeString().split(' ')[0],
      priorityScore: sosData.hasMedicalEmergency ? 95 : 75
    };

    setSosRequests(prev => [newSOS, ...prev]);

    // Send to Python FastAPI backend
    backendApi.submitSos(newSOS);

    // Also trigger agentic flow
    addLog({
      agentName: 'Incident Agent',
      action: `New SOS Ingested (${newId})`,
      details: `Received from ${newSOS.citizenName}: ${newSOS.peopleCount} people, water depth ${newSOS.waterDepthM}m.`,
      severity: 'alert'
    });

    // Auto-verify after 1.5s
    setTimeout(() => {
      setSosRequests(prev => prev.map(s => s.id === newId ? { ...s, status: 'verified' } : s));
      addLog({
        agentName: 'Incident Agent',
        action: `SOS #${newId} Verified`,
        details: `Correlated with hydrological gauge data. Priority score assigned: ${newSOS.priorityScore}/100.`,
        severity: 'warning'
      });
    }, 1500);

    // Auto-assign after 3.5s
    setTimeout(() => {
      setSosRequests(prev => prev.map(s => s.id === newId ? { ...s, status: 'assigned', assignedVehicleId: 'veh-2', assignedVolunteerId: 'vol-1' } : s));
      addLog({
        agentName: 'Volunteer Agent',
        action: `Assigned Response Unit to SOS #${newId}`,
        details: `Assigned Rescue Boat 03 and Volunteer Priya Meenakshi (First Aid certified).`,
        severity: 'info'
      });
    }, 3500);
  };

  const updateSOSStatus = (id: string, status: IncidentStatus) => {
    setSosRequests(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    addLog({
      agentName: 'Incident Agent',
      action: `SOS #${id} Status -> ${status.toUpperCase()}`,
      details: `Updated by authorized personnel (${currentUser.roleTitle}).`,
      severity: status === 'resolved' ? 'success' : 'info'
    });
  };

  const submitCitizenReport = (report: { title: string; location: string; type: Incident['type']; depthM: number; desc: string }) => {
    const newInc: Incident = {
      id: `inc-${Math.floor(200 + Math.random() * 800)}`,
      cityId: activeCityId,
      title: report.title,
      locationName: report.location,
      coordinates: [35, 55],
      type: report.type,
      severity: report.depthM > 0.6 ? 'high' : 'medium',
      peopleAffected: 10,
      waterDepthM: report.depthM,
      status: 'reported',
      reportedAt: new Date().toTimeString().split(' ')[0],
      description: report.desc
    };
    setIncidents(prev => [newInc, ...prev]);

    addLog({
      agentName: 'Flood Intelligence Agent',
      action: `Citizen Ground Observation: ${report.title}`,
      details: `Reported depth: ${report.depthM}m at ${report.location}. Calibration factor updated.`,
      severity: 'info'
    });
  };

  const approveAction = (id: string) => {
    backendApi.submitApprovalAction(id, 'approved');
    setApprovals(prev => prev.map(a => {
      if (a.id === id) {
        // Execute side effect based on metadata
        if (a.metadata?.roadId) {
          toggleRoadStatus(a.metadata.roadId, 'closed');
        }
        return { ...a, status: 'approved' };
      }
      return a;
    }));

    const target = approvals.find(a => a.id === id);
    if (target) {
      addLog({
        agentName: 'Commander Agent',
        action: `Officer Approved: ${target.title}`,
        details: `Authorized by ${currentUser.name} (${currentUser.roleTitle}). Enforcing action.`,
        severity: 'success'
      });
    }
  };

  const rejectAction = (id: string) => {
    backendApi.submitApprovalAction(id, 'rejected');
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    const target = approvals.find(a => a.id === id);
    if (target) {
      addLog({
        agentName: 'Commander Agent',
        action: `Action Rejected: ${target.title}`,
        details: `Rejected by ${currentUser.name}. AI Commander replanning alternatives.`,
        severity: 'warning'
      });
    }
  };

  const toggleRoadStatus = (id: string, newStatus: RoadSegment['status']) => {
    setRoads(prev => prev.map(r => r.id === id ? { ...r, status: newStatus, verifiedByGround: true } : r));
    const rd = roads.find(r => r.id === id);
    addLog({
      agentName: 'Emergency Routing Agent',
      action: `Road Segment ${newStatus.toUpperCase()}`,
      details: `${rd?.name || id} marked as ${newStatus}. Recomputing network traversal graph.`,
      severity: newStatus === 'closed' ? 'alert' : 'info'
    });
  };

  const updateHospitalAvailability = (id: string, beds: number, icu: number) => {
    setHospitals(prev => prev.map(h => h.id === id ? { ...h, availableBeds: beds, icuBedsAvailable: icu } : h));
    addLog({
      agentName: 'Medical Coordination Agent',
      action: 'Hospital Capacity Updated',
      details: `Bed count updated: ${beds} regular beds, ${icu} ICU beds available.`,
      severity: 'info'
    });
  };

  const updateShelterRations = (id: string, foodDays: number, waterLiters: number) => {
    setShelters(prev => prev.map(s => s.id === id ? { ...s, foodDaysRemaining: foodDays, waterLitersRemaining: waterLiters } : s));
    addLog({
      agentName: 'Resource Allocation Agent',
      action: 'Shelter Rations Updated',
      details: `Food days: ${foodDays}d, Water supply: ${waterLiters}L remaining.`,
      severity: 'info'
    });
  };

  const simulateDamRelease = (releaseCusecs: number) => {
    backendApi.simulateDamRelease(dam.id, releaseCusecs);
    const riskLevel = releaseCusecs > 11000 ? 'critical' : releaseCusecs > 9000 ? 'warning' : 'safe';
    setDam(prev => ({
      ...prev,
      plannedReleaseCusecs: releaseCusecs,
      downstreamRiskLevel: riskLevel,
      aiRecommendation: releaseCusecs > 11000 
        ? 'HIGH DOWNSTREAM RISK: Discharges over 11,000 cusecs will submerge Saidapet Causeway in 70 minutes. Siren warnings mandatory.'
        : 'Discharge within managed river buffer envelope. Downstream embankments stable.'
    }));

    addLog({
      agentName: 'Dam Risk Agent',
      action: `Simulated Dam Outflow: ${releaseCusecs.toLocaleString()} cusecs`,
      details: `Calculated downstream hydrodynamic impact: ${riskLevel.toUpperCase()} risk tier.`,
      severity: riskLevel === 'critical' ? 'alert' : 'info'
    });
  };

  const acceptVolunteerTask = (volunteerId: string, taskId: string) => {
    setVolunteers(prev => prev.map(v => v.id === volunteerId ? { ...v, activeTaskId: taskId, isAvailable: false } : v));
    addLog({
      agentName: 'Volunteer Coordination Agent',
      action: 'Volunteer Accepted Mission',
      details: `Volunteer dispatched to task #${taskId}. Safe routing sent to mobile app.`,
      severity: 'info'
    });
  };

  const completeVolunteerTask = (volunteerId: string) => {
    setVolunteers(prev => prev.map(v => v.id === volunteerId ? {
      ...v,
      activeTaskId: undefined,
      isAvailable: true,
      completedTasksCount: v.completedTasksCount + 1
    } : v));
    addLog({
      agentName: 'Volunteer Coordination Agent',
      action: 'Mission Completed & Verified',
      details: `Task resolved with GPS and photo proof. Volunteer available for redeployment.`,
      severity: 'success'
    });
  };

  const allocateReliefResource = (resourceId: string, targetShelterId: string, qty: number) => {
    setResources(prev => prev.map(r => r.id === resourceId ? {
      ...r,
      quantity: Math.max(0, r.quantity - qty),
      allocatedTo: targetShelterId,
      status: 'allocated'
    } : r));

    const shelter = shelters.find(s => s.id === targetShelterId);
    const res = resources.find(r => r.id === resourceId);

    addLog({
      agentName: 'Resource Allocation Agent',
      action: 'Relief Consignment Allocated',
      details: `Dispatched ${qty} ${res?.unit || 'units'} of ${res?.name} to ${shelter?.name || targetShelterId}.`,
      severity: 'success'
    });
  };

  const dispatchAmbulanceMission = (vehicleId: string, incidentTitle: string) => {
    setFleet(prev => prev.map(v => v.id === vehicleId ? {
      ...v,
      status: 'en_route',
      assignedMission: incidentTitle
    } : v));

    addLog({
      agentName: 'Emergency Routing Agent',
      action: `Dispatched ${vehicleId}`,
      details: `En route to "${incidentTitle}" via high-clearance flood bypass.`,
      severity: 'info'
    });
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, active: false } : a));
  };

  // Station Simulator & Interaction Handlers
  const selectStation = (stationOrId: MonitoringStation | string | null) => {
    if (!stationOrId) {
      setSelectedStation(null);
      return;
    }
    if (typeof stationOrId === 'string') {
      const match = stations.find(s => s.id === stationOrId);
      setSelectedStation(match || null);
    } else {
      setSelectedStation(stationOrId);
    }
  };

  const toggleSimulator = () => {
    setIsSimulatorRunning(prev => !prev);
  };

  const simulateSensorTick = () => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setStations(prev => prev.map(s => {
      // Natural hydrological fluctuation
      const rainDelta = (Math.random() * 3.0) - 1.4;
      const newRainfall = Math.max(0, Math.round((s.rainfall + rainDelta) * 10) / 10);
      
      const drainageEfficiency = (s.drainageCapacity || 50) / 100;
      const levelDelta = (newRainfall * 0.012) - (drainageEfficiency * 0.025) + ((Math.random() * 0.04) - 0.02);
      const newWaterLevel = Math.max(0.1, Math.round((s.waterLevel + levelDelta) * 100) / 100);
      const newFlow = Math.max(1, Math.round(newWaterLevel * (7.0 + Math.random() * 2.5) * 10) / 10);

      // Recompute risk level
      let newRisk: StationRiskLevel = 'LOW';
      let newStatus = s.sensorStatus;
      if (newWaterLevel >= s.dangerLevel) {
        newRisk = 'CRITICAL';
        newStatus = 'ALERT';
      } else if (newWaterLevel >= s.warningLevel) {
        newRisk = 'HIGH';
        newStatus = 'ALERT';
      } else if (newWaterLevel >= s.warningLevel * 0.6) {
        newRisk = 'MODERATE';
        newStatus = 'ONLINE';
      } else {
        newRisk = 'LOW';
        newStatus = 'ONLINE';
      }

      const trend = levelDelta > 0.01 ? 'rising' : levelDelta < -0.01 ? 'falling' : 'steady';

      return {
        ...s,
        waterLevel: newWaterLevel,
        rainfall: newRainfall,
        flowRate: newFlow,
        riskLevel: newRisk,
        sensorStatus: newStatus,
        trend,
        lastUpdated: timeStr
      };
    }));

    // If a station is currently inspected, refresh its instance
    if (selectedStation) {
      setSelectedStation(prev => {
        if (!prev) return null;
        const updated = stations.find(s => s.id === prev.id);
        return updated || prev;
      });
    }

    // Call backend simulator if connected
    if (isBackendConnected) {
      backendApi.triggerStationSimulatorTick().catch(() => {});
    }
  };

  // Background ticker for live telemetry (every 9 seconds)
  useEffect(() => {
    if (!isSimulatorRunning) return;
    const interval = setInterval(() => {
      simulateSensorTick();
    }, 9000);
    return () => clearInterval(interval);
  }, [isSimulatorRunning, selectedStation, isBackendConnected]);

  return (
    <FloodPulseContext.Provider
      value={{
        activeCity,
        switchCity,
        currentUser,
        switchRole,
        users: DEMO_USERS,
        floodZones,
        roads,
        hospitals,
        shelters,
        volunteers,
        resources,
        fleet,
        dam,
        agents,
        logs,
        approvals,
        alerts,
        nowcasts,
        sosRequests,
        incidents,
        scenarioId,
        scenarioStep,
        isScenarioRunning,
        activeScenario,
        startScenario,
        pauseScenario,
        resumeScenario,
        stepForwardScenario,
        resetScenario,
        submitSOS,
        updateSOSStatus,
        submitCitizenReport,
        approveAction,
        rejectAction,
        toggleRoadStatus,
        updateHospitalAvailability,
        updateShelterRations,
        simulateDamRelease,
        acceptVolunteerTask,
        completeVolunteerTask,
        allocateReliefResource,
        dispatchAmbulanceMission,
        dismissAlert,
        isBackendConnected,
        backendInfo,
        // Scalable Geographic Grid & Stations
        states,
        districts,
        stations,
        selectedStation,
        activeStateId,
        activeDistrictId,
        stationRiskFilter,
        isSimulatorRunning,
        selectStation,
        setActiveStateId,
        setActiveDistrictId,
        setStationRiskFilter,
        simulateSensorTick,
        toggleSimulator
      }}
    >
      {children}
    </FloodPulseContext.Provider>
  );
};

export const useFloodPulse = (): FloodPulseContextType => {
  const context = useContext(FloodPulseContext);
  if (!context) {
    throw new Error('useFloodPulse must be used within a FloodPulseProvider');
  }
  return context;
};
