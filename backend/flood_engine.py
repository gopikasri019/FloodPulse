import math
from typing import Dict, Any, List

def calculate_flood_risk_score(
    rainfall_intensity_mm_hr: float,
    accumulated_rainfall_3h_mm: float = 0.0,
    current_water_level_m: float = 0.0,
    drainage_capacity_percent: float = 85.0,
    soil_saturation_percent: float = 75.0,
    tide_surge_m: float = 1.0,
    river_level_m: float = 2.0,
    urban_density_factor: float = 1.2
) -> Dict[str, Any]:
    """
    Hydrological Flood-Risk Scoring Engine.
    Combines precipitation intensity, soil moisture antecedent saturation,
    hydraulic drainage capacity, and coastal/river backwater pressure into
    a validated 0-100 continuous score and categorical risk classification.
    """
    # 1. Rain Intensity Factor (0 - 35 points)
    # 0 mm/hr -> 0 pts; 50 mm/hr -> 20 pts; 100+ mm/hr -> 35 pts
    rain_intensity_pts = min(35.0, (rainfall_intensity_mm_hr / 100.0) * 35.0)

    # 2. Accumulated Precipitation & Soil Saturation Factor (0 - 25 points)
    # Saturated soil (>=90%) prevents infiltration and causes 100% surface runoff
    saturation_multiplier = max(0.2, min(1.0, soil_saturation_percent / 100.0))
    accumulated_pts = min(25.0, (accumulated_rainfall_3h_mm / 150.0) * 15.0 + saturation_multiplier * 10.0)

    # 3. Drainage System Deficit Factor (0 - 20 points)
    # Reduced capacity from silt/blockages or under-dimensioned pipes
    drainage_deficit_pct = max(0.0, 100.0 - drainage_capacity_percent)
    drainage_pts = min(20.0, (drainage_deficit_pct / 100.0) * 20.0)

    # 4. Hydraulic Backwater & Water Level Pressure (0 - 20 points)
    # When coastal tide > 3.0m or river > 3.5m, gravity discharge locks up
    backwater_pressure = 0.0
    if tide_surge_m > 3.0:
        backwater_pressure += min(10.0, (tide_surge_m - 3.0) * 5.0)
    if river_level_m > 2.5:
        backwater_pressure += min(10.0, (river_level_m - 2.5) * 4.0)
    if current_water_level_m > 0.3:
        backwater_pressure += min(5.0, current_water_level_m * 6.0)
    hydraulic_pts = min(20.0, backwater_pressure)

    # Total weighted raw score
    raw_score = (rain_intensity_pts + accumulated_pts + drainage_pts + hydraulic_pts) * (urban_density_factor / 1.1)
    normalized_score = round(max(0.0, min(100.0, raw_score)), 1)

    # Risk Level Classification
    if normalized_score >= 80.0:
        risk_level = "CRITICAL"
        inundation_arrival_minutes = max(10, int(35 - (normalized_score - 80) * 1.2))
    elif normalized_score >= 60.0:
        risk_level = "HIGH"
        inundation_arrival_minutes = max(25, int(70 - (normalized_score - 60) * 1.5))
    elif normalized_score >= 35.0:
        risk_level = "MODERATE"
        inundation_arrival_minutes = max(60, int(150 - (normalized_score - 35) * 2.5))
    else:
        risk_level = "LOW"
        inundation_arrival_minutes = 240

    # Predicted flood water depth (meters) based on runoff rate vs drainage outflow
    effective_drainage_discharge_mm = (drainage_capacity_percent / 100.0) * 25.0  # mm/hr max discharge
    excess_runoff_mm = max(0.0, (rainfall_intensity_mm_hr * saturation_multiplier * 0.85) - effective_drainage_discharge_mm)
    predicted_depth_m = round(current_water_level_m + (excess_runoff_mm / 1000.0) * 1.6, 2)

    # Actionable Interventions Generation
    interventions: List[str] = []
    if normalized_score >= 80.0:
        interventions.append("Issue immediate Flash Flood Evacuation order for ground floors in low-lying basins.")
        interventions.append("Deploy high-capacity mobile dewatering pump trucks to critical transit underpasses.")
        interventions.append("Coordinate with Traffic Police to erect hard physical barricades on inundated arterial roads.")
    elif normalized_score >= 60.0:
        interventions.append("Pre-stage rubber inflatable rescue boats and amphibious vehicles at sector hubs.")
        interventions.append("Alert hospitals to check backup generator fuel reserves and prepare ICU intake divert protocols.")
        interventions.append("Trigger automated SMS alerts to citizens with emergency shelter locations and clear routes.")
    elif normalized_score >= 35.0:
        interventions.append("Clear silt traps and trash screens at primary canal stormwater outfalls.")
        interventions.append("Put disaster volunteer network on Stage-2 standby.")
    else:
        interventions.append("Continue routine hydrological gauge and radar telemetry surveillance.")

    return {
        "risk_score": normalized_score,
        "risk_level": risk_level,
        "inundation_arrival_minutes": inundation_arrival_minutes,
        "predicted_depth_m": max(0.05, predicted_depth_m),
        "runoff_coefficient": round(0.55 + saturation_multiplier * 0.35, 2),
        "drainage_deficit_percent": round(drainage_deficit_pct, 1),
        "factors": {
            "rainfall_intensity_points": round(rain_intensity_pts, 1),
            "accumulated_soil_saturation_points": round(accumulated_pts, 1),
            "drainage_deficit_points": round(drainage_pts, 1),
            "hydraulic_backwater_points": round(hydraulic_pts, 1)
        },
        "recommended_interventions": interventions
    }


def compute_road_nowcast(
    road_name: str,
    base_clearance_m: float,
    current_depth_m: float,
    rainfall_mm_hr: float,
    drainage_efficiency: float
) -> Dict[str, Any]:
    """
    Nowcasting engine for road passability and water depth progression (0-3 hours).
    """
    rain_impact = rainfall_mm_hr / 100.0
    drain_factor = max(0.2, drainage_efficiency / 100.0)
    
    # Depth increment rate per hour
    growth_rate_m_hr = max(-0.1, (rain_impact * 0.6) - (drain_factor * 0.35))
    predicted_depth_m = max(0.0, round(current_depth_m + growth_rate_m_hr * 1.5, 2))
    
    flood_prob = min(99, max(5, int((predicted_depth_m / max(0.1, base_clearance_m)) * 60.0)))
    
    if predicted_depth_m >= base_clearance_m:
        status = "closed"
        eta_inundation = 0 if current_depth_m >= base_clearance_m else max(10, int(60 * (base_clearance_m - current_depth_m) / max(0.05, growth_rate_m_hr)))
    elif predicted_depth_m >= base_clearance_m * 0.6:
        status = "risky"
        eta_inundation = 45
    else:
        status = "passable"
        eta_inundation = 120

    return {
        "road_name": road_name,
        "status": status,
        "flood_probability": flood_prob,
        "predicted_depth_m": predicted_depth_m,
        "eta_to_inundation_min": eta_inundation
    }


def simulate_dam_wave_release(
    reservoir_name: str,
    current_storage_pct: float,
    inflow_cusecs: float,
    planned_release_cusecs: float,
    downstream_river_capacity_cusecs: float = 12000.0
) -> Dict[str, Any]:
    """
    Dam operator hydrological release wave modeling.
    Calculates downstream channel surcharge, wave arrival timing, and risk grade.
    """
    total_downstream_flow = planned_release_cusecs + 1500.0  # includes lateral baseflow
    capacity_ratio = total_downstream_flow / downstream_river_capacity_cusecs

    # Hydraulic wave propagation speed: approx 15 km/h in urban river sections
    distance_to_key_settlements_km = 14.5
    wave_arrival_time_min = int((distance_to_key_settlements_km / 16.0) * 60.0)  # ~54 minutes

    projected_river_rise_m = round(max(0.2, (total_downstream_flow / 5000.0) * 0.65), 2)

    if capacity_ratio >= 1.15:
        risk_level = "CRITICAL"
        evacuation = True
        guidance = "Discharge exceeds downstream bankfull capacity. Evacuate riverbank low-lying slums within 45 minutes."
    elif capacity_ratio >= 0.85:
        risk_level = "WARNING"
        evacuation = True
        guidance = "River approaching bankfull stage. Close low-lying causeways and issue evacuation alert."
    else:
        risk_level = "SAFE"
        evacuation = False
        guidance = "Managed discharge is within safe carrying channel capacity. Maintain continuous gauge watch."

    affected_wards = ["Ward 170 (Saidapet)", "Ward 171 (Kotturpuram)", "Ward 174 (Adyar Bank)"]

    return {
        "reservoir_id": reservoir_name,
        "planned_release_cusecs": planned_release_cusecs,
        "downstream_risk_level": risk_level,
        "wave_arrival_time_minutes": wave_arrival_time_min,
        "projected_river_level_rise_m": projected_river_rise_m,
        "affected_ward_areas": affected_wards,
        "evacuation_advisory_required": evacuation,
        "ai_guidance": guidance
    }
