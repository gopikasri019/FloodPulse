import json
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    Boolean,
    Text,
    DateTime
)
from backend.database import Base

class Country(Base):
    __tablename__ = "countries"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(10), nullable=False)
    center_lat = Column(Float, nullable=False, default=21.7679)
    center_lng = Column(Float, nullable=False, default=78.8718)
    zoom = Column(Integer, default=5)
    description = Column(Text, default="National Hydrological & Disaster Network")


class State(Base):
    __tablename__ = "states"

    id = Column(String(50), primary_key=True, index=True)
    country_id = Column(String(50), index=True, default="india")
    name = Column(String(100), nullable=False)
    code = Column(String(10), nullable=False)
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    zoom = Column(Integer, default=7)
    active_risk_level = Column(String(20), default="low")
    monsoon_status = Column(String(100), default="Active")
    total_stations = Column(Integer, default=0)
    description = Column(Text, default="")


class District(Base):
    __tablename__ = "districts"

    id = Column(String(50), primary_key=True, index=True)
    state_id = Column(String(50), index=True, nullable=False)
    name = Column(String(100), nullable=False)
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    zoom = Column(Integer, default=10)
    active_risk_level = Column(String(20), default="low")
    rainfall_mm = Column(Float, default=0.0)
    headquarters = Column(String(100), default="")


class City(Base):
    __tablename__ = "cities"

    id = Column(String(50), primary_key=True, index=True)
    country_id = Column(String(50), default="india")
    state_id = Column(String(50), index=True, default="tamil_nadu")
    district_id = Column(String(50), index=True, default="chennai")
    name = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    zoom = Column(Integer, default=12)
    primary_drivers_json = Column(Text, default="[]")
    rainfall_mm_hr = Column(Float, default=0.0)
    tide_height_m = Column(Float, default=1.0)
    river_level_m = Column(Float, default=2.0)
    drainage_efficiency = Column(Float, default=85.0)
    population_at_risk = Column(Integer, default=0)
    active_risk_level = Column(String(20), default="low")
    description = Column(Text, default="")

    @property
    def primary_drivers(self):
        try:
            return json.loads(self.primary_drivers_json)
        except Exception:
            return []

    @primary_drivers.setter
    def primary_drivers(self, value):
        self.primary_drivers_json = json.dumps(value)


class FloodZone(Base):
    __tablename__ = "flood_zones"

    id = Column(String(50), primary_key=True, index=True)
    city_id = Column(String(50), index=True, nullable=False)
    district_id = Column(String(50), nullable=True)
    name = Column(String(150), nullable=False)
    zone_code = Column(String(50), nullable=True)
    ward_no = Column(String(50), nullable=True)
    risk_level = Column(String(20), default="low")
    water_depth_m = Column(Float, default=0.0)
    predicted_depth_m = Column(Float, default=0.0)
    flood_arrival_minutes = Column(Integer, default=0)
    affected_population = Column(Integer, default=0)
    coord_lat = Column(Float, nullable=False)
    coord_lng = Column(Float, nullable=False)
    area_km2 = Column(Float, default=1.0)
    drain_status = Column(String(50), default="functional")
    status_description = Column(Text, default="")
    updated_at = Column(DateTime, default=datetime.utcnow)


class MonitoringStation(Base):
    __tablename__ = "monitoring_stations"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    station_type = Column(String(50), default="urban_storm_drain")
    country_id = Column(String(50), default="india")
    state_id = Column(String(50), index=True, nullable=False)
    district_id = Column(String(50), index=True, nullable=False)
    city_id = Column(String(50), index=True, nullable=False)
    zone_id = Column(String(50), index=True, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    water_level = Column(Float, default=0.0)
    warning_level = Column(Float, default=1.5)
    danger_level = Column(Float, default=2.5)
    flow_rate = Column(Float, default=0.0)
    rainfall = Column(Float, default=0.0)
    drainage_capacity = Column(Float, default=85.0)
    risk_level = Column(String(20), default="LOW")
    confidence = Column(Float, default=95.0)
    sensor_status = Column(String(30), default="ONLINE")
    data_source = Column(String(50), default="DEMO/SIMULATED")
    battery_level = Column(Float, default=98.0)
    trend = Column(String(20), default="steady")
    last_updated = Column(DateTime, default=datetime.utcnow)



class RoadSegment(Base):
    __tablename__ = "road_segments"

    id = Column(String(50), primary_key=True, index=True)
    city_id = Column(String(50), index=True, nullable=False)
    name = Column(String(150), nullable=False)
    status = Column(String(20), default="passable")
    water_depth_m = Column(Float, default=0.0)
    predicted_depth_m = Column(Float, default=0.0)
    max_passable_clearance_m = Column(Float, default=0.3)
    eta_to_inundation_min = Column(Integer, default=0)
    is_alternate_route = Column(Boolean, default=False)
    start_lat = Column(Float, default=0.0)
    start_lng = Column(Float, default=0.0)
    end_lat = Column(Float, default=0.0)
    end_lng = Column(Float, default=0.0)
    verified_by_ground = Column(Boolean, default=False)
    last_reported_by = Column(String(100), default="Hydrological Sensor")


class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(String(50), primary_key=True, index=True)
    city_id = Column(String(50), index=True, nullable=False)
    name = Column(String(150), nullable=False)
    coord_lat = Column(Float, nullable=False)
    coord_lng = Column(Float, nullable=False)
    total_beds = Column(Integer, default=200)
    available_beds = Column(Integer, default=50)
    icu_beds_total = Column(Integer, default=30)
    icu_beds_available = Column(Integer, default=8)
    ambulances_available = Column(Integer, default=4)
    power_status = Column(String(30), default="grid_online")
    oxygen_supply_hours = Column(Float, default=72.0)
    water_accessible = Column(Boolean, default=True)
    incoming_emergencies = Column(Integer, default=0)


class Shelter(Base):
    __tablename__ = "shelters"

    id = Column(String(50), primary_key=True, index=True)
    city_id = Column(String(50), index=True, nullable=False)
    name = Column(String(150), nullable=False)
    coord_lat = Column(Float, nullable=False)
    coord_lng = Column(Float, nullable=False)
    capacity = Column(Integer, default=500)
    occupancy = Column(Integer, default=120)
    food_days_remaining = Column(Float, default=4.0)
    water_liters_remaining = Column(Float, default=6000.0)
    medical_support_available = Column(Boolean, default=True)
    power_status = Column(String(20), default="normal")
    accessibility_status = Column(String(40), default="fully_accessible")
    contact_person = Column(String(100), default="Relief Officer")
    phone = Column(String(50), default="+91 94440 12345")


class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(String(50), primary_key=True, index=True)
    city_id = Column(String(50), index=True, nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(50), default="")
    skills_json = Column(Text, default="[]")
    is_available = Column(Boolean, default=True)
    current_location = Column(String(150), default="")
    coord_lat = Column(Float, default=0.0)
    coord_lng = Column(Float, default=0.0)
    active_task_id = Column(String(100), nullable=True)
    completed_tasks_count = Column(Integer, default=0)
    badge_level = Column(String(20), default="Bronze")

    @property
    def skills(self):
        try:
            return json.loads(self.skills_json)
        except Exception:
            return []

    @skills.setter
    def skills(self, value):
        self.skills_json = json.dumps(value)


class ReliefResource(Base):
    __tablename__ = "relief_resources"

    id = Column(String(50), primary_key=True, index=True)
    city_id = Column(String(50), index=True, nullable=False)
    name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)
    quantity = Column(Integer, default=100)
    unit = Column(String(50), default="units")
    location_name = Column(String(150), default="Central Disaster Warehouse")
    allocated_to = Column(String(150), nullable=True)
    status = Column(String(30), default="available")


class FleetVehicle(Base):
    __tablename__ = "fleet_vehicles"

    id = Column(String(50), primary_key=True, index=True)
    city_id = Column(String(50), index=True, nullable=False)
    callsign = Column(String(50), nullable=False)
    type = Column(String(50), nullable=False)
    status = Column(String(30), default="idle")
    current_location = Column(String(150), default="")
    coord_lat = Column(Float, default=0.0)
    coord_lng = Column(Float, default=0.0)
    assigned_mission = Column(String(200), nullable=True)
    fuel_percentage = Column(Float, default=100.0)
    driver_name = Column(String(100), default="Operator")


class DamReservoir(Base):
    __tablename__ = "dam_reservoirs"

    id = Column(String(50), primary_key=True, index=True)
    city_id = Column(String(50), index=True, nullable=False)
    name = Column(String(150), nullable=False)
    current_level_m = Column(Float, default=20.0)
    full_reservoir_level_m = Column(Float, default=24.0)
    storage_percentage = Column(Float, default=75.0)
    inflow_cusecs = Column(Float, default=4500.0)
    outflow_cusecs = Column(Float, default=2000.0)
    gate_count = Column(Integer, default=12)
    open_gates = Column(Integer, default=4)
    planned_release_cusecs = Column(Float, default=3000.0)
    downstream_risk_level = Column(String(20), default="safe")
    rainfall_catchment_mm = Column(Float, default=45.0)
    trend = Column(String(20), default="rising")
    ai_recommendation = Column(Text, default="")


class SOSRequest(Base):
    __tablename__ = "sos_requests"

    id = Column(String(50), primary_key=True, index=True)
    city_id = Column(String(50), index=True, nullable=False)
    citizen_name = Column(String(100), nullable=False)
    phone = Column(String(50), nullable=False)
    location_name = Column(String(150), nullable=False)
    coord_lat = Column(Float, default=0.0)
    coord_lng = Column(Float, default=0.0)
    people_count = Column(Integer, default=1)
    water_depth_m = Column(Float, default=0.5)
    has_medical_emergency = Column(Boolean, default=False)
    children_count = Column(Integer, default=0)
    elderly_count = Column(Integer, default=0)
    help_type = Column(String(50), default="boat_evacuation")
    notes = Column(Text, default="")
    status = Column(String(30), default="reported")
    reported_at = Column(String(50), default="Just now")
    assigned_vehicle_id = Column(String(50), nullable=True)
    assigned_volunteer_id = Column(String(50), nullable=True)
    priority_score = Column(Float, default=50.0)


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(50), primary_key=True, index=True)
    city_id = Column(String(50), index=True, nullable=False)
    title = Column(String(150), nullable=False)
    location_name = Column(String(150), nullable=False)
    coord_lat = Column(Float, default=0.0)
    coord_lng = Column(Float, default=0.0)
    type = Column(String(50), default="rescue")
    severity = Column(String(20), default="medium")
    people_affected = Column(Integer, default=0)
    water_depth_m = Column(Float, default=0.5)
    status = Column(String(30), default="reported")
    reported_at = Column(String(50), default="Just now")
    assigned_team = Column(String(100), nullable=True)
    assigned_team_type = Column(String(50), nullable=True)
    special_needs_json = Column(Text, default="[]")
    description = Column(Text, default="")

    @property
    def special_needs(self):
        try:
            return json.loads(self.special_needs_json)
        except Exception:
            return []

    @special_needs.setter
    def special_needs(self, value):
        self.special_needs_json = json.dumps(value)


class AIAgentState(Base):
    __tablename__ = "ai_agents"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    status = Column(String(30), default="active")
    current_task = Column(Text, default="")
    recent_input = Column(Text, default="")
    decision = Column(Text, default="")
    confidence = Column(Integer, default=95)
    last_updated = Column(String(50), default="Just now")
    icon_name = Column(String(50), default="Bot")


class AgentActivityLog(Base):
    __tablename__ = "agent_activity_logs"

    id = Column(String(100), primary_key=True, index=True)
    agent_name = Column(String(100), nullable=False)
    action = Column(String(200), nullable=False)
    details = Column(Text, default="")
    timestamp = Column(String(50), default="Just now")
    severity = Column(String(20), default="info")


class ImpactAlert(Base):
    __tablename__ = "impact_alerts"

    id = Column(String(100), primary_key=True, index=True)
    city_id = Column(String(50), index=True, default="chennai")
    title = Column(String(200), nullable=False)
    severity = Column(String(20), default="severe")
    location = Column(String(150), nullable=False)
    eta = Column(String(100), default="Immediate")
    recommended_action = Column(Text, default="")
    target_audience = Column(String(150), default="General Public")
    active = Column(Boolean, default=True)
    issued_at = Column(String(50), default="Just now")


class NowcastPrediction(Base):
    __tablename__ = "nowcast_predictions"

    id = Column(String(50), primary_key=True, index=True)
    city_id = Column(String(50), index=True, default="chennai")
    road_name = Column(String(150), nullable=False)
    flood_probability = Column(Integer, default=50)
    predicted_depth_m = Column(Float, default=0.4)
    actual_depth_m = Column(Float, nullable=True)
    eta_minutes = Column(Integer, default=30)
    duration_hours = Column(Float, default=3.0)
    confidence = Column(Integer, default=90)
    verified_status = Column(String(50), default="predicted")
    divergence_delta_m = Column(Float, nullable=True)


class ActionApprovalRequest(Base):
    __tablename__ = "action_approvals"

    id = Column(String(50), primary_key=True, index=True)
    agent_name = Column(String(100), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    proposed_action = Column(Text, default="")
    consequences = Column(Text, default="")
    status = Column(String(20), default="pending")
    created_at = Column(String(50), default="Just now")
    severity = Column(String(20), default="high")
