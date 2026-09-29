from typing import List, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime
from backend import models

def get_all_agents(db: Session) -> List[models.AIAgentState]:
    """Retrieve state of all 8 autonomous AI agents."""
    agents = db.query(models.AIAgentState).all()
    return agents

def get_role_based_recommendations(city_id: str, db: Session) -> Dict[str, Any]:
    """
    Synthesizes active multi-agent intelligence into role-specific
    emergency operational recommendations.
    """
    city = db.query(models.City).filter(models.City.id == city_id).first()
    city_name = city.name if city else "Metropolitan Area"
    risk_level = city.active_risk_level.upper() if city else "HIGH"

    dam = db.query(models.DamReservoir).filter(models.DamReservoir.city_id == city_id).first()
    dam_status = f"{dam.name} at {dam.storage_percentage}% capacity, releasing {dam.outflow_cusecs} cusecs" if dam else "Reservoir levels stable"

    sos_count = db.query(models.SOSRequest).filter(
        models.SOSRequest.city_id == city_id,
        models.SOSRequest.status != "resolved"
    ).count()

    hospitals = db.query(models.Hospital).filter(models.Hospital.city_id == city_id).all()
    available_icu = sum(h.icu_beds_available for h in hospitals)

    recommendations = [
        {
            "role": "Government & District Administration",
            "priority": "CRITICAL" if risk_level in ["HIGH", "CRITICAL"] else "ELEVATED",
            "title": f"Incident Command Directive - {city_name}",
            "rationale": f"Hydrological risk level is {risk_level}. Active SOS backlog is {sos_count} distress calls across low-lying zones.",
            "action_items": [
                f"Declare Stage-{ '3 Red' if risk_level == 'CRITICAL' else '2 Orange' } Urban Flood Emergency across vulnerable wards.",
                "Authorize emergency procurement of additional rubberized zodiac rescue boats.",
                "Mandate immediate closure of subways and arterial underpasses with depth sensors > 0.3m.",
                "Activate State Disaster Response Force (SDRF) pre-deployment battalions at Sector HQ."
            ]
        },
        {
            "role": "Dam & Reservoir Operators",
            "priority": "HIGH" if (dam and dam.storage_percentage > 80) else "MODERATE",
            "title": "Discharge Modulation & Hydraulic Catchment Management",
            "rationale": dam_status,
            "action_items": [
                "Execute gradual stepped gate releases (max 1,500 cusecs increment per 30 minutes) to avoid downstream surge wave shock.",
                "Maintain continuous telemetry synchronization with downstream hydrological river gauge #RIV-02.",
                "Broadcast automated hydraulic wave arrival warnings 60 minutes prior to gate expansion.",
                "Check spillway apron and dissipator basin for debris blockages."
            ]
        },
        {
            "role": "Emergency Responders & Field Services",
            "priority": "HIGH",
            "title": "Tactical Evacuation & Safe Transit Corridors",
            "rationale": "Arterial roads experiencing localized inundation up to 0.85m; routing detours enforced.",
            "action_items": [
                "Deploy High-Clearance Tata 407 & Ashok Leyland rescue trucks to primary evacuation sectors.",
                "Enforce hard barricades and flashing yellow cordons at submerged bridge approaches.",
                f"Direct critical trauma casualties exclusively to hospitals with grid-independent power (Available ICU: {available_icu}).",
                "Keep dewatering trailer pumps running at subterranean drainage choke points."
            ]
        },
        {
            "role": "Volunteers & Civil Defense",
            "priority": "MODERATE",
            "title": "Community Relief & Ground Support Operations",
            "rationale": "High demand for drinking water, dry rations, and elderly rescue escort in community shelters.",
            "action_items": [
                "Form 4-person buddy squads equipped with life jackets and first-aid trauma pouches.",
                "Distribute halogen lanterns and bottled water packs to marooned upper-floor residents.",
                "Assist municipal staff in marking submerged open drains and open manholes with red reflector ribbons.",
                "Verify ground depth reports via the FloodPulse Field Reporter tool."
            ]
        },
        {
            "role": "Citizens & Residents",
            "priority": "IMMEDIATE",
            "title": "Life Safety & Public Advisory",
            "rationale": "Flash inundation possible in ground floors and basement parking complexes.",
            "action_items": [
                "Turn off main electrical circuit breaker and LPG cylinder regulators if water enters ground floor.",
                "Never walk or drive through flowing water; 15 cm of moving water can knock an adult down.",
                "Move elderly family members, medical prescriptions, and essential documents to first floor or designated high shelter.",
                "Use the FloodPulse SOS button if stranded, noting your exact landmark and any infant or medical needs."
            ]
        }
    ]

    return {
        "city_id": city_id,
        "overall_status": f"{risk_level} FLOOD EMERGENCY ACTIVE",
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "recommendations": recommendations
    }

def record_agent_activity(db: Session, agent_name: str, action: str, details: str, severity: str = "info"):
    """Appends an event to the agent activity log."""
    log_id = f"log-{int(datetime.utcnow().timestamp() * 1000)}"
    log_entry = models.AgentActivityLog(
        id=log_id,
        agent_name=agent_name,
        action=action,
        details=details,
        timestamp=datetime.utcnow().strftime("%H:%M:%S"),
        severity=severity
    )
    db.add(log_entry)
    db.commit()
    return log_entry
