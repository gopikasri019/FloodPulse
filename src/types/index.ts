export type UserRole =
  | 'citizen'
  | 'government'
  | 'municipal'
  | 'police'
  | 'fire_rescue'
  | 'ambulance'
  | 'dam_operator'
  | 'hospital'
  | 'shelter'
  | 'ngo'
  | 'volunteer'
  | 'logistics'
  | 'relief_supplier'
  | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  department?: string;
  avatar: string;
  cityId: string;
  phone?: string;
}

export interface CityConfig {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  zoom: number;
  primaryDrivers: string[];
  rainfallMmHr: number;
  tideHeightM: number;
  riverLevelM: number;
  drainageEfficiency: number; // percentage
  populationAtRisk: number;
  activeRiskLevel: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
}

export interface FloodZone {
  id: string;
  name: string;
  cityId: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  waterDepthM: number;
  predictedDepthM: number;
  floodArrivalMinutes: number;
  affectedPopulation: number;
  coordinates: [number, number]; // [x, y] in percentage or lat/lng
  areaKm2: number;
  drainStatus: 'functional' | 'partially_blocked' | 'overflowing';
  statusDescription: string;
}

export interface RoadSegment {
  id: string;
  name: string;
  cityId: string;
  status: 'passable' | 'risky' | 'closed';
  waterDepthM: number;
  predictedDepthM: number;
  maxPassableClearanceM: number; // e.g. 0.3m for cars, 0.6m for trucks
  etaToInundationMin: number;
  isAlternateRoute: boolean;
  coordinates: { start: [number, number]; end: [number, number] };
  verifiedByGround: boolean;
  lastReportedBy?: string;
}

export type IncidentStatus = 'reported' | 'verified' | 'assigned' | 'responding' | 'resolved';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Incident {
  id: string;
  cityId: string;
  title: string;
  locationName: string;
  coordinates: [number, number];
  type: 'rescue' | 'medical' | 'road_blockage' | 'drain_clog' | 'dam_overflow' | 'shelter_need';
  severity: IncidentSeverity;
  peopleAffected: number;
  waterDepthM: number;
  status: IncidentStatus;
  reportedAt: string;
  assignedTeam?: string;
  assignedTeamType?: string;
  specialNeeds?: string[]; // e.g. 'Infant', 'Elderly', 'Wheelchair', 'Oxygen'
  resolvedAt?: string;
  description: string;
  imageUrl?: string;
}

export interface SOSRequest {
  id: string;
  cityId: string;
  citizenName: string;
  phone: string;
  locationName: string;
  coordinates: [number, number];
  peopleCount: number;
  waterDepthM: number;
  hasMedicalEmergency: boolean;
  childrenCount: number;
  elderlyCount: number;
  helpType: 'boat_evacuation' | 'medical_transport' | 'food_water' | 'stranded_on_roof';
  notes: string;
  status: IncidentStatus;
  reportedAt: string;
  assignedVehicleId?: string;
  assignedVolunteerId?: string;
  priorityScore: number; // 0-100
}

export interface Hospital {
  id: string;
  name: string;
  cityId: string;
  coordinates: [number, number];
  totalBeds: number;
  availableBeds: number;
  icuBedsTotal: number;
  icuBedsAvailable: number;
  ambulancesAvailable: number;
  powerStatus: 'grid_online' | 'generator_backup' | 'failing';
  oxygenSupplyHours: number;
  waterAccessible: boolean;
  incomingEmergencies: number;
}

export interface Shelter {
  id: string;
  name: string;
  cityId: string;
  coordinates: [number, number];
  capacity: number;
  occupancy: number;
  foodDaysRemaining: number;
  waterLitersRemaining: number;
  medicalSupportAvailable: boolean;
  powerStatus: 'normal' | 'backup' | 'none';
  accessibilityStatus: 'fully_accessible' | 'high_clearance_only' | 'boat_only';
  contactPerson: string;
  phone: string;
}

export interface Volunteer {
  id: string;
  name: string;
  cityId: string;
  phone: string;
  skills: string[]; // e.g. 'First Aid', 'Boat Operator', 'Swimmer', 'Logistics'
  isAvailable: boolean;
  currentLocation: string;
  coordinates: [number, number];
  activeTaskId?: string;
  completedTasksCount: number;
  badgeLevel: 'Bronze' | 'Silver' | 'Gold';
}

export interface ReliefResource {
  id: string;
  name: string;
  category: 'food' | 'water' | 'medical' | 'blankets' | 'boats' | 'sandbags';
  quantity: number;
  unit: string;
  locationName: string;
  cityId: string;
  allocatedTo?: string;
  status: 'available' | 'allocated' | 'in_transit' | 'delivered';
}

export interface FleetVehicle {
  id: string;
  callsign: string;
  type: 'ambulance' | 'rescue_boat' | 'high_clearance_truck' | 'police_patrol' | 'dewatering_pump_truck';
  cityId: string;
  status: 'idle' | 'en_route' | 'on_scene' | 'returning' | 'maintenance';
  currentLocation: string;
  coordinates: [number, number];
  assignedMission?: string;
  fuelPercentage: number;
  driverName: string;
}

export interface DamReservoir {
  id: string;
  name: string;
  cityId: string;
  currentLevelM: number;
  fullReservoirLevelM: number;
  storagePercentage: number;
  inflowCusecs: number;
  outflowCusecs: number;
  gateCount: number;
  openGates: number;
  plannedReleaseCusecs: number;
  downstreamRiskLevel: 'safe' | 'warning' | 'critical';
  rainfallCatchmentMm: number;
  trend: 'rising' | 'steady' | 'falling';
  aiRecommendation: string;
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'coordinating' | 'monitoring' | 're-evaluating';
  currentTask: string;
  recentInput: string;
  decision: string;
  confidence: number; // 0-100%
  lastUpdated: string;
  iconName: string;
}

export interface AgentActivityLog {
  id: string;
  agentName: string;
  action: string;
  details: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'alert' | 'success';
}

export interface ActionApprovalRequest {
  id: string;
  agentName: string;
  title: string;
  description: string;
  proposedAction: string;
  consequences: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  severity: 'moderate' | 'high' | 'critical';
  metadata?: {
    roadId?: string;
    vehicleId?: string;
    shelterId?: string;
    zoneId?: string;
  };
}

export interface ImpactAlert {
  id: string;
  title: string;
  severity: 'moderate' | 'severe' | 'extreme';
  location: string;
  eta: string;
  recommendedAction: string;
  targetAudience: string;
  active: boolean;
  issuedAt: string;
}

export interface CountryHierarchy {
  id: string;
  name: string;
  code: string;
  centerLat: number;
  centerLng: number;
  zoom: number;
  description: string;
}

export interface StateHierarchy {
  id: string;
  countryId: string;
  name: string;
  code: string;
  centerLat: number;
  centerLng: number;
  zoom: number;
  activeRiskLevel: 'low' | 'moderate' | 'high' | 'critical';
  monsoonStatus: string;
  totalStations: number;
  description: string;
}

export interface DistrictHierarchy {
  id: string;
  stateId: string;
  name: string;
  centerLat: number;
  centerLng: number;
  zoom: number;
  activeRiskLevel: 'low' | 'moderate' | 'high' | 'critical';
  rainfallMm: number;
  headquarters?: string;
}

export type StationRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type StationSensorStatus = 'ONLINE' | 'MAINTENANCE' | 'ALERT' | 'CALIBRATING' | 'OFFLINE';

export interface MonitoringStation {
  id: string;
  name: string;
  stationType: 'river_gauge' | 'urban_storm_drain' | 'reservoir_spillway' | 'coastal_tide_station' | 'culvert_sensor' | string;
  countryId: string;
  stateId: string;
  stateName?: string;
  districtId: string;
  districtName?: string;
  cityId: string;
  cityName?: string;
  zoneId?: string;
  zoneName?: string;
  latitude: number;
  longitude: number;
  waterLevel: number; // in meters
  warningLevel: number;
  dangerLevel: number;
  flowRate: number; // in m³/s
  rainfall: number; // in mm/hr
  drainageCapacity: number; // in %
  riskLevel: StationRiskLevel;
  confidence: number; // percentage 0-100
  sensorStatus: StationSensorStatus;
  dataSource: string; // 'DEMO/SIMULATED' | 'IMD_WEATHER_FEED' | 'CWC_HYDROLOGY' | 'IOT_GROUND_SENSOR'
  batteryLevel: number; // percentage 0-100
  trend: 'rising' | 'steady' | 'falling';
  lastUpdated: string;
}

export interface NowcastPrediction {
  id: string;
  roadName: string;
  floodProbability: number;
  predictedDepthM: number;
  actualDepthM?: number;
  etaMinutes: number;
  durationHours: number;
  confidence: number;
  verifiedStatus: 'predicted' | 'ground_verified_match' | 'corrected_divergence';
  divergenceDeltaM?: number;
}

export type WaterwayRiskLevel = 'low' | 'moderate' | 'high' | 'critical' | 'warning' | 'severe' | 'emergency';
export type WaterwaySensorStatus = 'online' | 'operational' | 'warning' | 'critical' | 'calibrating' | 'offline' | 'fault';
export type WaterwayScenarioType =
  | 'normal'
  | 'cloudburst_spike'
  | 'sensor_fault'
  | 'reservoir_release'
  | 'monsoon_surge'
  | 'dam_discharge'
  | 'tidal_backwater'
  | 'recession'
  | 'steady';

export interface WaterwayTelemetryPoint {
  timestamp: string;
  waterLevelM: number;
  rainfallMmHr?: number;
  flowRateM3s?: number;
  drainageCapacityPercent?: number;
}

export interface WaterwayEmergencyAction {
  id: string;
  actionType: 'sluice' | 'pump' | 'barricade' | 'evacuation' | 'alert' | 'siren' | 'drain_inspection' | string;
  title: string;
  description: string;
  targetEntity: string;
  status: 'pending' | 'approved' | 'rejected' | 'dispatched' | 'completed';
  timestamp: string;
  priority: 'low' | 'moderate' | 'high' | 'critical';
}

export interface WaterwayAlert {
  id: string;
  stationId: string;
  stationName: string;
  waterwayName?: string;
  cityId?: string;
  cityName: string;
  severity: WaterwayRiskLevel;
  type?: string;
  title?: string;
  message: string;
  waterLevelM?: number;
  rateOfRiseMPerHr?: number;
  timestamp: string;
  acknowledged: boolean;
  audioPlayed?: boolean;
}

export interface WaterwayStation {
  id: string;
  stationCode: string;
  name: string;
  waterwayName: string;
  cityId: string;
  cityName: string;
  coordinates: [number, number];
  waterLevelM: number;
  warningThresholdM: number;
  dangerThresholdM: number;
  flowRateM3s: number;
  rainfallMmHr: number;
  drainageCapacityPercent: number;
  rateOfRiseMPerHr: number;
  sensorStatus: WaterwaySensorStatus;
  batteryPercent: number;
  solarCharging: boolean;
  signalRssi: number;
  protocol: string;
  lastUpdated: string;
  currentRisk: WaterwayRiskLevel;
  confidenceScore: number;
  contributingFactors: string[];
  recommendedActions: WaterwayEmergencyAction[];
  telemetryHistory: WaterwayTelemetryPoint[];
}


