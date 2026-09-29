from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db
from backend import models, schemas
from backend.flood_engine import calculate_flood_risk_score, simulate_dam_wave_release

router = APIRouter(prefix="/flood", tags=["Flood Intelligence & Nowcasting"])

@router.post("/calculate-risk", response_model=schemas.RiskAssessmentResponse)
def compute_risk(request: schemas.RiskAssessmentRequest):
    """
    Computes real-time multi-factor hydrological flood risk score (0-100)
    and categorical rating (LOW, MODERATE, HIGH, CRITICAL).
    """
    result = calculate_flood_risk_score(
        rainfall_intensity_mm_hr=request.rainfall_intensity_mm_hr,
        accumulated_rainfall_3h_mm=request.accumulated_rainfall_3h_mm,
        current_water_level_m=request.current_water_level_m,
        drainage_capacity_percent=request.drainage_capacity_percent,
        soil_saturation_percent=request.soil_saturation_percent,
        tide_surge_m=request.tide_surge_m,
        river_level_m=request.river_level_m,
        urban_density_factor=request.urban_density_factor
    )
    return result

@router.get("/nowcast", response_model=List[schemas.NowcastPredictionResponse])
def get_nowcast_predictions(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    db: Session = Depends(get_db)
):
    """Returns 0-3 hour road inundation nowcasting predictions and sensor verification deltas."""
    predictions = db.query(models.NowcastPrediction).filter(models.NowcastPrediction.city_id == city_id).all()
    return predictions

@router.get("/zones", response_model=List[schemas.FloodZoneResponse])
def get_flood_zones(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    db: Session = Depends(get_db)
):
    """Returns flood-prone and affected zones with real-time water depths and drain statuses."""
    zones = db.query(models.FloodZone).filter(models.FloodZone.city_id == city_id).all()
    response = []
    for z in zones:
        response.append({
            "id": z.id,
            "city_id": z.city_id,
            "name": z.name,
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
    return response

@router.get("/weather")
def get_weather_telemetry(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    db: Session = Depends(get_db)
):
    """Provides Doppler weather radar telemetry, rainfall rate, and atmospheric pressures."""
    city = db.query(models.City).filter(models.City.id == city_id).first()
    if not city:
        city = db.query(models.City).first()
    
    return {
        "city_id": city.id,
        "city_name": city.name,
        "rainfall_mm_hr": city.rainfall_mm_hr,
        "accumulated_rain_24h_mm": round(city.rainfall_mm_hr * 2.8, 1),
        "tide_height_m": city.tide_height_m,
        "river_level_m": city.river_level_m,
        "radar_reflectivity_dbz": min(65, int(city.rainfall_mm_hr * 0.7 + 15)),
        "cloud_top_height_km": 11.4,
        "barometric_pressure_hpa": 996.2,
        "wind_gust_kmh": 46.5,
        "primary_drivers": city.primary_drivers
    }

@router.get("/drainage")
def get_drainage_status(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    db: Session = Depends(get_db)
):
    """Returns municipal drainage efficiency, pump operations, and choke point statuses."""
    city = db.query(models.City).filter(models.City.id == city_id).first()
    efficiency = city.drainage_efficiency if city else 65.0
    
    return {
        "city_id": city_id,
        "overall_drainage_efficiency_percent": efficiency,
        "active_pumping_stations": 14,
        "total_pumping_stations": 16,
        "dewatering_capacity_liters_per_min": 240000,
        "outfall_tide_lock_status": "LOCKED" if (city and city.tide_height_m > 3.0) else "CLEAR",
        "primary_canals": [
            {"canal_name": "Buckingham Canal", "stage_percent": 92, "flow_status": "sluggish_backflow"},
            {"canal_name": "Adyar Estuary Outfall", "stage_percent": 88, "flow_status": "tidal_surcharge"},
            {"canal_name": "Otteri Nullah", "stage_percent": 74, "flow_status": "moderate"}
        ]
    }

@router.get("/dam", response_model=schemas.DamReservoirResponse)
def get_dam_reservoir_status(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    db: Session = Depends(get_db)
):
    """Returns upstream dam/reservoir telemetry, inflow/outflow, and storage percentage."""
    dam = db.query(models.DamReservoir).filter(models.DamReservoir.city_id == city_id).first()
    if not dam:
        dam = db.query(models.DamReservoir).first()
    if not dam:
        raise HTTPException(status_code=404, detail="No reservoir found")
    return dam

@router.post("/dam/simulate-release", response_model=schemas.DamReleaseSimulationResponse)
def simulate_dam_release(
    req: schemas.DamReleaseSimulationRequest,
    db: Session = Depends(get_db)
):
    """
    Simulates downstream surge wave propagation, riverbank overtopping,
    and arrival timing for planned dam discharge.
    """
    dam = db.query(models.DamReservoir).filter(models.DamReservoir.id == req.reservoir_id).first()
    if not dam:
        dam = db.query(models.DamReservoir).first()
    
    storage_pct = dam.storage_percentage if dam else 85.0
    inflow = dam.inflow_cusecs if dam else 12000.0

    simulation = simulate_dam_wave_release(
        reservoir_name=dam.name if dam else req.reservoir_id,
        current_storage_pct=storage_pct,
        inflow_cusecs=inflow,
        planned_release_cusecs=req.planned_release_cusecs
    )
    return simulation
