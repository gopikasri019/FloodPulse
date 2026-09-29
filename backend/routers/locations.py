from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import List, Optional, Dict, Any
from datetime import datetime
import random
from backend.database import get_db
from backend import models, schemas

router = APIRouter(tags=["Locations, Zones & Hydrological Stations"])

# ----------------- Scalable Location Hierarchy Endpoints -----------------

@router.get("/locations")
def get_locations_summary(db: Session = Depends(get_db)):
    """
    Returns high-level geographical coverage summary across the hierarchy:
    Country -> State -> District -> City -> Zone/Ward -> Monitoring Station
    """
    country_count = db.query(models.Country).count()
    state_count = db.query(models.State).count()
    district_count = db.query(models.District).count()
    city_count = db.query(models.City).count()
    zone_count = db.query(models.FloodZone).count()
    station_count = db.query(models.MonitoringStation).count()

    # Risk breakdown of stations
    stations = db.query(models.MonitoringStation).all()
    risk_breakdown = {
        "LOW": sum(1 for s in stations if s.risk_level.upper() == "LOW"),
        "MODERATE": sum(1 for s in stations if s.risk_level.upper() == "MODERATE"),
        "HIGH": sum(1 for s in stations if s.risk_level.upper() == "HIGH"),
        "CRITICAL": sum(1 for s in stations if s.risk_level.upper() == "CRITICAL")
    }

    countries = db.query(models.Country).all()

    return {
        "platform": "FloodPulse Geo-Hydrological Grid",
        "hierarchy": "Country -> State -> District -> City -> Zone/Ward -> Monitoring Station",
        "data_status": "DEMO/SIMULATED (Engineered for IMD/CWC/IoT Live Feeds)",
        "statistics": {
            "total_countries": country_count,
            "total_states": state_count,
            "total_districts": district_count,
            "total_cities": city_count,
            "total_flood_zones": zone_count,
            "total_monitoring_stations": station_count,
            "risk_distribution": risk_breakdown
        },
        "countries": [
            {
                "id": c.id,
                "name": c.name,
                "code": c.code,
                "center_lat": c.center_lat,
                "center_lng": c.center_lng,
                "zoom": c.zoom,
                "description": c.description
            } for c in countries
        ]
    }


@router.get("/locations/states", response_model=List[schemas.StateResponse])
def get_states(
    country_id: Optional[str] = Query(None, description="Filter by Country ID (e.g., 'india')"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level (low, moderate, high, critical)"),
    db: Session = Depends(get_db)
):
    """Returns list of monitored Indian states and territories."""
    query = db.query(models.State)
    if country_id:
        query = query.filter(models.State.country_id == country_id)
    if risk_level:
        query = query.filter(func.lower(models.State.active_risk_level) == risk_level.lower())
    
    states = query.order_by(models.State.name).all()
    return [
        schemas.StateResponse(
            id=s.id,
            country_id=s.country_id,
            name=s.name,
            code=s.code,
            center_lat=s.center_lat,
            center_lng=s.center_lng,
            zoom=s.zoom,
            active_risk_level=s.active_risk_level,
            monsoon_status=s.monsoon_status,
            total_stations=s.total_stations,
            description=s.description
        ) for s in states
    ]


@router.get("/locations/districts", response_model=List[schemas.DistrictResponse])
def get_districts(
    state: Optional[str] = Query(None, description="State ID or name filter (e.g., 'tamil_nadu')"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level"),
    db: Session = Depends(get_db)
):
    """Returns districts within states with current flood risk and rainfall."""
    query = db.query(models.District)
    if state:
        query = query.filter(or_(
            models.District.state_id == state,
            func.lower(models.District.state_id) == state.lower()
        ))
    if risk_level:
        query = query.filter(func.lower(models.District.active_risk_level) == risk_level.lower())

    districts = query.order_by(models.District.name).all()
    return [
        schemas.DistrictResponse(
            id=d.id,
            state_id=d.state_id,
            name=d.name,
            center_lat=d.center_lat,
            center_lng=d.center_lng,
            zoom=d.zoom,
            active_risk_level=d.active_risk_level,
            rainfall_mm=d.rainfall_mm,
            headquarters=d.headquarters
        ) for d in districts
    ]


@router.get("/locations/cities", response_model=List[schemas.CityBase])
def get_cities(
    state: Optional[str] = Query(None, description="Filter by state (e.g. 'tamil_nadu' or 'Tamil Nadu')"),
    district: Optional[str] = Query(None, description="Filter by district"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level"),
    db: Session = Depends(get_db)
):
    """Returns list of supported multi-city configurations and baseline flood metrics."""
    query = db.query(models.City)
    if state:
        query = query.filter(or_(
            models.City.state_id == state,
            func.lower(models.City.state) == state.lower()
        ))
    if district:
        query = query.filter(models.City.district_id == district)
    if risk_level:
        query = query.filter(func.lower(models.City.active_risk_level) == risk_level.lower())

    cities = query.all()
    results = []
    for c in cities:
        results.append({
            "id": c.id,
            "country_id": c.country_id,
            "state_id": c.state_id,
            "district_id": c.district_id,
            "name": c.name,
            "state": c.state,
            "lat": c.lat,
            "lng": c.lng,
            "zoom": c.zoom,
            "primary_drivers": c.primary_drivers,
            "rainfall_mm_hr": c.rainfall_mm_hr,
            "tide_height_m": c.tide_height_m,
            "river_level_m": c.river_level_m,
            "drainage_efficiency": c.drainage_efficiency,
            "population_at_risk": c.population_at_risk,
            "active_risk_level": c.active_risk_level,
            "description": c.description
        })
    return results


@router.get("/locations/cities/{city_id}", response_model=schemas.CityBase)
def get_city(city_id: str, db: Session = Depends(get_db)):
    """Returns details for a specific metropolitan region."""
    city = db.query(models.City).filter(models.City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return {
        "id": city.id,
        "country_id": city.country_id,
        "state_id": city.state_id,
        "district_id": city.district_id,
        "name": city.name,
        "state": city.state,
        "lat": city.lat,
        "lng": city.lng,
        "zoom": city.zoom,
        "primary_drivers": city.primary_drivers,
        "rainfall_mm_hr": city.rainfall_mm_hr,
        "tide_height_m": city.tide_height_m,
        "river_level_m": city.river_level_m,
        "drainage_efficiency": city.drainage_efficiency,
        "population_at_risk": city.population_at_risk,
        "active_risk_level": city.active_risk_level,
        "description": city.description
    }


@router.get("/locations/zones", response_model=List[schemas.FloodZoneResponse])
def get_zones(
    city_id: Optional[str] = Query(None, description="Filter by city ID (e.g. 'chennai')"),
    district: Optional[str] = Query(None, description="Filter by district ID"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level"),
    db: Session = Depends(get_db)
):
    """Returns list of vulnerable flood zones/wards with water depth and arrival time."""
    query = db.query(models.FloodZone)
    if city_id:
        query = query.filter(models.FloodZone.city_id == city_id)
    if district:
        query = query.filter(models.FloodZone.district_id == district)
    if risk_level:
        query = query.filter(func.lower(models.FloodZone.risk_level) == risk_level.lower())

    zones = query.all()
    results = []
    for z in zones:
        results.append({
            "id": z.id,
            "city_id": z.city_id,
            "district_id": z.district_id,
            "name": z.name,
            "zone_code": z.zone_code,
            "ward_no": z.ward_no,
            "risk_level": z.risk_level,
            "water_depth_m": z.water_depth_m,
            "predicted_depth_m": z.predicted_depth_m,
            "flood_arrival_minutes": z.flood_arrival_minutes,
            "affected_population": z.affected_population,
            "coordinates": [z.coord_lat, z.coord_lng],
            "area_km2": z.area_km2,
            "drain_status": z.drain_status,
            "status_description": z.status_description
        })
    return results


# ----------------- Scalable Monitoring Stations API -----------------

def serialize_station(s: models.MonitoringStation) -> dict:
    return {
        "id": s.id,
        "name": s.name,
        "station_type": s.station_type,
        "country_id": s.country_id,
        "state_id": s.state_id,
        "district_id": s.district_id,
        "city_id": s.city_id,
        "zone_id": s.zone_id,
        "latitude": s.latitude,
        "longitude": s.longitude,
        "water_level": s.water_level,
        "warning_level": s.warning_level,
        "danger_level": s.danger_level,
        "flow_rate": s.flow_rate,
        "rainfall": s.rainfall,
        "drainage_capacity": s.drainage_capacity,
        "risk_level": s.risk_level,
        "confidence": s.confidence,
        "sensor_status": s.sensor_status,
        "data_source": s.data_source,
        "battery_level": s.battery_level,
        "trend": s.trend,
        "last_updated": s.last_updated.isoformat() if isinstance(s.last_updated, datetime) else str(s.last_updated)
    }


@router.get("/stations", response_model=List[schemas.MonitoringStationResponse])
@router.get("/locations/stations", response_model=List[schemas.MonitoringStationResponse])
def get_monitoring_stations(
    state: Optional[str] = Query(None, description="Filter by state ID or name"),
    district: Optional[str] = Query(None, description="Filter by district ID or name"),
    city: Optional[str] = Query(None, description="Filter by city ID or name"),
    zone: Optional[str] = Query(None, description="Filter by zone ID"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level: LOW, MODERATE, HIGH, CRITICAL"),
    status: Optional[str] = Query(None, description="Filter by sensor status: ONLINE, ALERT, MAINTENANCE, OFFLINE"),
    search: Optional[str] = Query(None, description="Search landmark or station ID"),
    db: Session = Depends(get_db)
):
    """
    Returns hydrological and urban drainage monitoring stations across India.
    Supports granular multi-level filtering by State, District, City, Zone, and Risk Level.
    """
    query = db.query(models.MonitoringStation)

    if state:
        query = query.filter(or_(
            models.MonitoringStation.state_id == state,
            func.lower(models.MonitoringStation.state_id) == state.lower()
        ))
    if district:
        query = query.filter(or_(
            models.MonitoringStation.district_id == district,
            func.lower(models.MonitoringStation.district_id) == district.lower()
        ))
    if city:
        query = query.filter(or_(
            models.MonitoringStation.city_id == city,
            func.lower(models.MonitoringStation.city_id) == city.lower()
        ))
    if zone:
        query = query.filter(models.MonitoringStation.zone_id == zone)
    if risk_level:
        query = query.filter(func.upper(models.MonitoringStation.risk_level) == risk_level.upper())
    if status:
        query = query.filter(func.upper(models.MonitoringStation.sensor_status) == status.upper())
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(or_(
            func.lower(models.MonitoringStation.id).like(search_term),
            func.lower(models.MonitoringStation.name).like(search_term)
        ))

    stations = query.order_by(models.MonitoringStation.risk_level.desc(), models.MonitoringStation.water_level.desc()).all()
    return [serialize_station(s) for s in stations]


@router.get("/stations/{station_id}", response_model=schemas.MonitoringStationResponse)
@router.get("/locations/stations/{station_id}", response_model=schemas.MonitoringStationResponse)
def get_station_details(station_id: str, db: Session = Depends(get_db)):
    """Returns complete telemetry information for a single monitoring station."""
    station = db.query(models.MonitoringStation).filter(models.MonitoringStation.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Monitoring station not found")
    return serialize_station(station)


@router.post("/stations/simulate-tick")
def simulate_sensor_tick(db: Session = Depends(get_db)):
    """
    Sensor Simulator Engine:
    Generates realistic dynamic variations in rainfall, water levels, and flow rates across
    all monitoring stations to simulate live hydrologic conditions.
    Clearly tags generated output as DEMO/SIMULATED.
    """
    stations = db.query(models.MonitoringStation).all()
    updated_count = 0

    for s in stations:
        # Realistic hydrology fluctuation
        rain_delta = random.uniform(-1.5, 2.0)
        s.rainfall = max(0.0, round(s.rainfall + rain_delta, 1))

        # Water level reacts to rainfall vs drainage capacity
        drainage_factor = s.drainage_capacity / 100.0
        level_delta = (s.rainfall * 0.015) - (drainage_factor * 0.03) + random.uniform(-0.02, 0.03)
        s.water_level = max(0.05, round(s.water_level + level_delta, 2))

        # Update flow rate proportionally
        s.flow_rate = max(0.1, round(s.water_level * random.uniform(6.5, 9.5), 1))

        # Re-evaluate dynamic risk level
        ratio = s.water_level / s.danger_level
        old_level = s.risk_level
        if ratio >= 1.0 or s.water_level >= s.danger_level:
            s.risk_level = "CRITICAL"
            s.sensor_status = "ALERT"
        elif ratio >= 0.75 or s.water_level >= s.warning_level:
            s.risk_level = "HIGH"
            s.sensor_status = "ALERT"
        elif ratio >= 0.45:
            s.risk_level = "MODERATE"
            s.sensor_status = "ONLINE"
        else:
            s.risk_level = "LOW"
            s.sensor_status = "ONLINE"

        # Determine trend
        if level_delta > 0.02:
            s.trend = "rising"
        elif level_delta < -0.02:
            s.trend = "falling"
        else:
            s.trend = "steady"

        s.last_updated = datetime.utcnow()
        updated_count += 1

    db.commit()

    return {
        "status": "success",
        "action": "Sensor Simulation Tick Completed",
        "stations_updated": updated_count,
        "data_tag": "DEMO/SIMULATED",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }


# ----------------- Road Segment & Transit Corridors -----------------

@router.get("/locations/roads", response_model=List[schemas.RoadSegmentResponse])
def get_roads(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    db: Session = Depends(get_db)
):
    """Returns road segment passability, flood depths, and dynamic routing detours."""
    roads = db.query(models.RoadSegment).filter(models.RoadSegment.city_id == city_id).all()
    results = []
    for r in roads:
        results.append({
            "id": r.id,
            "city_id": r.city_id,
            "name": r.name,
            "status": r.status,
            "water_depth_m": r.water_depth_m,
            "predicted_depth_m": r.predicted_depth_m,
            "max_passable_clearance_m": r.max_passable_clearance_m,
            "eta_to_inundation_min": r.eta_to_inundation_min,
            "is_alternate_route": r.is_alternate_route,
            "coordinates": {
                "start": [r.start_lat, r.start_lng],
                "end": [r.end_lat, r.end_lng]
            },
            "verified_by_ground": r.verified_by_ground,
            "last_reported_by": r.last_reported_by
        })
    return results


@router.patch("/locations/roads/{road_id}", response_model=schemas.RoadSegmentResponse)
def update_road_status(
    road_id: str,
    update: schemas.RoadStatusUpdate,
    db: Session = Depends(get_db)
):
    """Updates the clearance and passability status of a road corridor."""
    road = db.query(models.RoadSegment).filter(models.RoadSegment.id == road_id).first()
    if not road:
        raise HTTPException(status_code=404, detail="Road segment not found")
    
    road.status = update.status
    if update.water_depth_m is not None:
        road.water_depth_m = update.water_depth_m
    if update.verified_by_ground is not None:
        road.verified_by_ground = update.verified_by_ground
    if update.reported_by is not None:
        road.last_reported_by = update.reported_by

    db.commit()
    db.refresh(road)

    return {
        "id": road.id,
        "city_id": road.city_id,
        "name": road.name,
        "status": road.status,
        "water_depth_m": road.water_depth_m,
        "predicted_depth_m": road.predicted_depth_m,
        "max_passable_clearance_m": road.max_passable_clearance_m,
        "eta_to_inundation_min": road.eta_to_inundation_min,
        "is_alternate_route": road.is_alternate_route,
        "coordinates": {
            "start": [road.start_lat, road.start_lng],
            "end": [road.end_lat, road.end_lng]
        },
        "verified_by_ground": road.verified_by_ground,
        "last_reported_by": road.last_reported_by
    }
