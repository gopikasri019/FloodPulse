from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ----------------- Base & Entity Schemas -----------------

class CountryResponse(BaseModel):
    id: str
    name: str
    code: str
    centerLat: float = Field(alias="center_lat")
    centerLng: float = Field(alias="center_lng")
    zoom: int = 5
    description: str = ""

    class Config:
        populate_by_name = True
        from_attributes = True


class StateResponse(BaseModel):
    id: str
    countryId: str = Field("india", alias="country_id")
    name: str
    code: str
    centerLat: float = Field(alias="center_lat")
    centerLng: float = Field(alias="center_lng")
    zoom: int = 7
    activeRiskLevel: str = Field("low", alias="active_risk_level")
    monsoonStatus: str = Field("Active", alias="monsoon_status")
    totalStations: int = Field(0, alias="total_stations")
    description: str = ""

    class Config:
        populate_by_name = True
        from_attributes = True


class DistrictResponse(BaseModel):
    id: str
    stateId: str = Field(alias="state_id")
    name: str
    centerLat: float = Field(alias="center_lat")
    centerLng: float = Field(alias="center_lng")
    zoom: int = 10
    activeRiskLevel: str = Field("low", alias="active_risk_level")
    rainfallMm: float = Field(0.0, alias="rainfall_mm")
    headquarters: str = ""

    class Config:
        populate_by_name = True
        from_attributes = True


class MonitoringStationResponse(BaseModel):
    id: str
    name: str
    stationType: str = Field("urban_storm_drain", alias="station_type")
    countryId: str = Field("india", alias="country_id")
    stateId: str = Field(alias="state_id")
    districtId: str = Field(alias="district_id")
    cityId: str = Field(alias="city_id")
    zoneId: Optional[str] = Field(None, alias="zone_id")
    latitude: float
    longitude: float
    waterLevel: float = Field(0.0, alias="water_level")
    warningLevel: float = Field(1.5, alias="warning_level")
    dangerLevel: float = Field(2.5, alias="danger_level")
    flowRate: float = Field(0.0, alias="flow_rate")
    rainfall: float = Field(0.0, alias="rainfall")
    drainageCapacity: float = Field(85.0, alias="drainage_capacity")
    riskLevel: str = Field("LOW", alias="risk_level")
    confidence: float = 95.0
    sensorStatus: str = Field("ONLINE", alias="sensor_status")
    dataSource: str = Field("DEMO/SIMULATED", alias="data_source")
    batteryLevel: float = Field(98.0, alias="battery_level")
    trend: str = "steady"
    lastUpdated: str = Field(alias="last_updated")

    class Config:
        populate_by_name = True
        from_attributes = True


class MonitoringStationUpdate(BaseModel):
    water_level: Optional[float] = None
    flow_rate: Optional[float] = None
    rainfall: Optional[float] = None
    drainage_capacity: Optional[float] = None
    risk_level: Optional[str] = None
    confidence: Optional[float] = None
    sensor_status: Optional[str] = None
    trend: Optional[str] = None


class CityBase(BaseModel):
    id: str
    countryId: Optional[str] = Field("india", alias="country_id")
    stateId: Optional[str] = Field(None, alias="state_id")
    districtId: Optional[str] = Field(None, alias="district_id")
    name: str
    state: str
    lat: float
    lng: float
    zoom: int = 12
    primaryDrivers: List[str] = Field(default_factory=list, alias="primary_drivers")
    rainfallMmHr: float = Field(0.0, alias="rainfall_mm_hr")
    tideHeightM: float = Field(1.0, alias="tide_height_m")
    riverLevelM: float = Field(2.0, alias="river_level_m")
    drainageEfficiency: float = Field(85.0, alias="drainage_efficiency")
    populationAtRisk: int = Field(0, alias="population_at_risk")
    activeRiskLevel: str = Field("low", alias="active_risk_level")
    description: str = ""

    class Config:
        populate_by_name = True
        from_attributes = True


class FloodZoneResponse(BaseModel):
    id: str
    cityId: str = Field(alias="city_id")
    districtId: Optional[str] = Field(None, alias="district_id")
    name: str
    zoneCode: Optional[str] = Field(None, alias="zone_code")
    wardNo: Optional[str] = Field(None, alias="ward_no")
    riskLevel: str = Field("low", alias="risk_level")
    waterDepthM: float = Field(0.0, alias="water_depth_m")
    predictedDepthM: float = Field(0.0, alias="predicted_depth_m")
    floodArrivalMinutes: int = Field(0, alias="flood_arrival_minutes")
    affectedPopulation: int = Field(0, alias="affected_population")
    coordinates: List[float]  # [lat, lng]
    areaKm2: float = Field(1.0, alias="area_km2")
    drainStatus: str = Field("functional", alias="drain_status")
    statusDescription: str = Field("", alias="status_description")

    class Config:
        populate_by_name = True
        from_attributes = True



class RoadSegmentResponse(BaseModel):
    id: str
    cityId: str = Field(alias="city_id")
    name: str
    status: str
    waterDepthM: float = Field(0.0, alias="water_depth_m")
    predictedDepthM: float = Field(0.0, alias="predicted_depth_m")
    maxPassableClearanceM: float = Field(0.3, alias="max_passable_clearance_m")
    etaToInundationMin: int = Field(0, alias="eta_to_inundation_min")
    isAlternateRoute: bool = Field(False, alias="is_alternate_route")
    coordinates: Dict[str, List[float]]  # {"start": [lat, lng], "end": [lat, lng]}
    verifiedByGround: bool = Field(False, alias="verified_by_ground")
    lastReportedBy: Optional[str] = Field("Hydrological Sensor", alias="last_reported_by")

    class Config:
        populate_by_name = True
        from_attributes = True


class RoadStatusUpdate(BaseModel):
    status: str
    water_depth_m: Optional[float] = None
    verified_by_ground: Optional[bool] = None
    reported_by: Optional[str] = None


class HospitalResponse(BaseModel):
    id: str
    cityId: str = Field(alias="city_id")
    name: str
    coordinates: List[float]
    totalBeds: int = Field(alias="total_beds")
    availableBeds: int = Field(alias="available_beds")
    icuBedsTotal: int = Field(alias="icu_beds_total")
    icuBedsAvailable: int = Field(alias="icu_beds_available")
    ambulancesAvailable: int = Field(alias="ambulances_available")
    powerStatus: str = Field(alias="power_status")
    oxygenSupplyHours: float = Field(alias="oxygen_supply_hours")
    waterAccessible: bool = Field(alias="water_accessible")
    incomingEmergencies: int = Field(alias="incoming_emergencies")

    class Config:
        populate_by_name = True
        from_attributes = True


class HospitalUpdate(BaseModel):
    available_beds: Optional[int] = None
    icu_beds_available: Optional[int] = None
    ambulances_available: Optional[int] = None
    power_status: Optional[str] = None
    water_accessible: Optional[bool] = None


class ShelterResponse(BaseModel):
    id: str
    cityId: str = Field(alias="city_id")
    name: str
    coordinates: List[float]
    capacity: int
    occupancy: int
    foodDaysRemaining: float = Field(alias="food_days_remaining")
    waterLitersRemaining: float = Field(alias="water_liters_remaining")
    medicalSupportAvailable: bool = Field(alias="medical_support_available")
    powerStatus: str = Field(alias="power_status")
    accessibilityStatus: str = Field(alias="accessibility_status")
    contactPerson: str = Field(alias="contact_person")
    phone: str

    class Config:
        populate_by_name = True
        from_attributes = True


class ShelterUpdate(BaseModel):
    occupancy: Optional[int] = None
    food_days_remaining: Optional[float] = None
    water_liters_remaining: Optional[float] = None
    power_status: Optional[str] = None
    accessibility_status: Optional[str] = None


class VolunteerResponse(BaseModel):
    id: str
    cityId: str = Field(alias="city_id")
    name: str
    phone: str
    skills: List[str]
    isAvailable: bool = Field(alias="is_available")
    currentLocation: str = Field(alias="current_location")
    coordinates: List[float]
    activeTaskId: Optional[str] = Field(None, alias="active_task_id")
    completedTasksCount: int = Field(alias="completed_tasks_count")
    badgeLevel: str = Field(alias="badge_level")

    class Config:
        populate_by_name = True
        from_attributes = True


class VolunteerTaskAction(BaseModel):
    task_id: str
    action: str = "assign"  # "assign" or "complete"


class ReliefResourceResponse(BaseModel):
    id: str
    cityId: str = Field(alias="city_id")
    name: str
    category: str
    quantity: int
    unit: str
    locationName: str = Field(alias="location_name")
    allocatedTo: Optional[str] = Field(None, alias="allocated_to")
    status: str

    class Config:
        populate_by_name = True
        from_attributes = True


class ResourceAllocateRequest(BaseModel):
    resource_id: str
    target_shelter_id: str
    quantity: int


class FleetVehicleResponse(BaseModel):
    id: str
    cityId: str = Field(alias="city_id")
    callsign: str
    type: str
    status: str
    currentLocation: str = Field(alias="current_location")
    coordinates: List[float]
    assignedMission: Optional[str] = Field(None, alias="assigned_mission")
    fuelPercentage: float = Field(alias="fuel_percentage")
    driverName: str = Field(alias="driver_name")

    class Config:
        populate_by_name = True
        from_attributes = True


class FleetDispatchAction(BaseModel):
    vehicle_id: str
    mission_title: str
    target_location: Optional[str] = None


class DamReservoirResponse(BaseModel):
    id: str
    cityId: str = Field(alias="city_id")
    name: str
    currentLevelM: float = Field(alias="current_level_m")
    fullReservoirLevelM: float = Field(alias="full_reservoir_level_m")
    storagePercentage: float = Field(alias="storage_percentage")
    inflowCusecs: float = Field(alias="inflow_cusecs")
    outflowCusecs: float = Field(alias="outflow_cusecs")
    gateCount: int = Field(alias="gate_count")
    openGates: int = Field(alias="open_gates")
    plannedReleaseCusecs: float = Field(alias="planned_release_cusecs")
    downstreamRiskLevel: str = Field(alias="downstream_risk_level")
    rainfallCatchmentMm: float = Field(alias="rainfall_catchment_mm")
    trend: str
    aiRecommendation: str = Field(alias="ai_recommendation")

    class Config:
        populate_by_name = True
        from_attributes = True


class DamReleaseSimulationRequest(BaseModel):
    reservoir_id: str
    planned_release_cusecs: float
    duration_hours: float = 6.0


class DamReleaseSimulationResponse(BaseModel):
    reservoir_id: str
    planned_release_cusecs: float
    downstream_risk_level: str
    wave_arrival_time_minutes: int
    projected_river_level_rise_m: float
    affected_ward_areas: List[str]
    evacuation_advisory_required: bool
    ai_guidance: str


class SOSRequestCreate(BaseModel):
    city_id: str = "chennai"
    citizen_name: str
    phone: str
    location_name: str
    coordinates: List[float] = [12.9815, 80.2180]
    people_count: int = 1
    water_depth_m: float = 0.5
    has_medical_emergency: bool = False
    children_count: int = 0
    elderly_count: int = 0
    help_type: str = "boat_evacuation"
    notes: str = ""


class SOSRequestResponse(BaseModel):
    id: str
    cityId: str = Field(alias="city_id")
    citizenName: str = Field(alias="citizen_name")
    phone: str
    locationName: str = Field(alias="location_name")
    coordinates: List[float]
    peopleCount: int = Field(alias="people_count")
    waterDepthM: float = Field(alias="water_depth_m")
    hasMedicalEmergency: bool = Field(alias="has_medical_emergency")
    childrenCount: int = Field(alias="children_count")
    elderlyCount: int = Field(alias="elderly_count")
    helpType: str = Field(alias="help_type")
    notes: str
    status: str
    reportedAt: str = Field(alias="reported_at")
    assignedVehicleId: Optional[str] = Field(None, alias="assigned_vehicle_id")
    assignedVolunteerId: Optional[str] = Field(None, alias="assigned_volunteer_id")
    priorityScore: float = Field(alias="priority_score")

    class Config:
        populate_by_name = True
        from_attributes = True


class SOSStatusUpdate(BaseModel):
    status: str
    assigned_vehicle_id: Optional[str] = None
    assigned_volunteer_id: Optional[str] = None


class IncidentCreate(BaseModel):
    city_id: str = "chennai"
    title: str
    location_name: str
    coordinates: List[float] = [12.9815, 80.2180]
    type: str = "rescue"
    severity: str = "medium"
    people_affected: int = 0
    water_depth_m: float = 0.5
    description: str = ""


class IncidentResponse(BaseModel):
    id: str
    cityId: str = Field(alias="city_id")
    title: str
    locationName: str = Field(alias="location_name")
    coordinates: List[float]
    type: str
    severity: str
    peopleAffected: int = Field(alias="people_affected")
    waterDepthM: float = Field(alias="water_depth_m")
    status: str
    reportedAt: str = Field(alias="reported_at")
    assignedTeam: Optional[str] = Field(None, alias="assigned_team")
    assignedTeamType: Optional[str] = Field(None, alias="assigned_team_type")
    specialNeeds: List[str] = Field(default_factory=list, alias="special_needs")
    description: str

    class Config:
        populate_by_name = True
        from_attributes = True


class AIAgentResponse(BaseModel):
    id: str
    name: str
    role: str
    status: str
    currentTask: str = Field(alias="current_task")
    recentInput: str = Field(alias="recent_input")
    decision: str
    confidence: int
    lastUpdated: str = Field(alias="last_updated")
    iconName: str = Field(alias="icon_name")

    class Config:
        populate_by_name = True
        from_attributes = True


class AgentActivityLogResponse(BaseModel):
    id: str
    agentName: str = Field(alias="agent_name")
    action: str
    details: str
    timestamp: str
    severity: str

    class Config:
        populate_by_name = True
        from_attributes = True


class ImpactAlertCreate(BaseModel):
    city_id: str = "chennai"
    title: str
    severity: str = "severe"
    location: str
    eta: str = "30 minutes"
    recommended_action: str
    target_audience: str = "Residents in low-lying zones"


class ImpactAlertResponse(BaseModel):
    id: str
    title: str
    severity: str
    location: str
    eta: str
    recommendedAction: str = Field(alias="recommended_action")
    targetAudience: str = Field(alias="target_audience")
    active: bool
    issuedAt: str = Field(alias="issued_at")

    class Config:
        populate_by_name = True
        from_attributes = True


class NowcastPredictionResponse(BaseModel):
    id: str
    roadName: str = Field(alias="road_name")
    floodProbability: int = Field(alias="flood_probability")
    predictedDepthM: float = Field(alias="predicted_depth_m")
    actualDepthM: Optional[float] = Field(None, alias="actual_depth_m")
    etaMinutes: int = Field(alias="eta_minutes")
    durationHours: float = Field(alias="duration_hours")
    confidence: int
    verifiedStatus: str = Field(alias="verified_status")
    divergenceDeltaM: Optional[float] = Field(None, alias="divergence_delta_m")

    class Config:
        populate_by_name = True
        from_attributes = True


class ActionApprovalRequestResponse(BaseModel):
    id: str
    agentName: str = Field(alias="agent_name")
    title: str
    description: str
    proposedAction: str = Field(alias="proposed_action")
    consequences: str
    status: str
    createdAt: str = Field(alias="created_at")
    severity: str

    class Config:
        populate_by_name = True
        from_attributes = True


class ActionApprovalDecision(BaseModel):
    decision: str  # "approved" or "rejected"


# ----------------- Computational & Decision Schemas -----------------

class RiskAssessmentRequest(BaseModel):
    rainfall_intensity_mm_hr: float
    accumulated_rainfall_3h_mm: float = 0.0
    current_water_level_m: float = 0.0
    drainage_capacity_percent: float = 85.0
    soil_saturation_percent: float = 75.0
    tide_surge_m: float = 1.0
    river_level_m: float = 2.0
    urban_density_factor: float = 1.2


class RiskAssessmentResponse(BaseModel):
    risk_score: float  # 0 to 100
    risk_level: str  # LOW, MODERATE, HIGH, CRITICAL
    inundation_arrival_minutes: int
    predicted_depth_m: float
    runoff_coefficient: float
    drainage_deficit_percent: float
    factors: Dict[str, Any]
    recommended_interventions: List[str]


class RoleRecommendation(BaseModel):
    role: str
    priority: str
    title: str
    rationale: str
    action_items: List[str]


class AIRecommendationsResponse(BaseModel):
    city_id: str
    overall_status: str
    timestamp: str
    recommendations: List[RoleRecommendation]


class DashboardStatsResponse(BaseModel):
    active_risk_level: str
    population_at_risk: int
    active_flood_zones: int
    closed_roads_count: int
    pending_sos_count: int
    available_icu_beds: int
    active_volunteers_count: int
    dam_storage_percentage: float
    current_rainfall_mm_hr: float
    river_level_m: float
    tide_height_m: float
