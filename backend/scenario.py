from typing import Dict, Any, List
from sqlalchemy.orm import Session
from datetime import datetime
from backend import models
from backend.agents import record_agent_activity

SCENARIOS_METADATA = [
    {
        "id": "scenario_a",
        "name": "Scenario A: Urban Heavy Rain (Flash Inundation)",
        "tagline": "Monsoon cloudburst triggers 85mm/h rain, flooding arterial corridors in Velachery basin.",
        "total_steps": 8,
        "steps": [
            {
                "step": 1,
                "title": "Heavy Rainfall Detected",
                "description": "Automatic rain gauges record sudden cloudburst (68.5 -> 88.0 mm/hr).",
                "agent": "Flood Intelligence Agent",
                "detail": "Spike in runoff coefficient; raised Basin Inundation Probability to 96%."
            },
            {
                "step": 2,
                "title": "Flood Agent Increases Zone Risk",
                "description": "Velachery Lake Catchment predicted water depth spikes to 1.15m within 25 minutes.",
                "agent": "Flood Intelligence Agent",
                "detail": "Updated Zone 1 risk level to CRITICAL. Sent early alert to SEOC government desk."
            },
            {
                "step": 3,
                "title": "Citizen SOS Received",
                "description": "Karthik Ramanathan submits high-urgency SOS from Tansi Nagar with 6 stranded residents.",
                "agent": "Incident Agent",
                "detail": "SOS #702 ingested. Verified spatial coordinates against depth sensor #VEL-04."
            },
            {
                "step": 4,
                "title": "Ground Truth Verification & Road Closure",
                "description": "Spotter report confirms Velachery Main Road has 0.85m standing water.",
                "agent": "Incident Agent",
                "detail": "Marked Velachery Main Road as CLOSED. Barricade alert dispatched to Traffic Police."
            },
            {
                "step": 5,
                "title": "Routing Agent Recalculates Safe Corridor",
                "description": "Ambulance ALS-108 diverted to Rajiv Gandhi Salai (OMR Elevated).",
                "agent": "Emergency Routing Agent",
                "detail": "Generated dynamic detour: Avoids 0.85m flood zone, saves 14 min transit time."
            },
            {
                "step": 6,
                "title": "Medical & Resource Allocation",
                "description": "Medical Agent reserves pediatric bed at Gleneagles; mobilizes 1,200 meal packets.",
                "agent": "Resource Allocation Agent",
                "detail": "Matched patient triage needs to Gleneagles; dispatched high-clearance truck."
            },
            {
                "step": 7,
                "title": "Commander Agent Generates Response Plan",
                "description": "Comprehensive response package synthesized. Awaiting District Collector authorization.",
                "agent": "Commander Agent",
                "detail": "Generated Action Plan #702. Human-in-the-loop approval card presented."
            },
            {
                "step": 8,
                "title": "Officer Approves & Missions Dispatched",
                "description": "District Commissioner approves plan. Rescue boat on scene, incident resolved.",
                "agent": "Commander Agent",
                "detail": "All 6 citizens safely transferred to Velachery Shelter. Marked RESOLVED."
            }
        ]
    },
    {
        "id": "scenario_b",
        "name": "Scenario B: Dam Reservoir Release Surge",
        "tagline": "Chembarambakkam reservoir reaches 86.5% capacity; managed spill increases Adyar river volume.",
        "total_steps": 6,
        "steps": [
            {
                "step": 1,
                "title": "Reservoir Inflow Surge",
                "description": "Catchment precipitation forces inflow up to 16,800 cusecs. Water level reaches 22.8m.",
                "agent": "Dam Risk Agent",
                "detail": "Advised phased gate discharge to prevent emergency spillway breach."
            },
            {
                "step": 2,
                "title": "Planned Release Simulation",
                "description": "Operator plans 11,500 cusecs release. Wave front reaches Saidapet in 55 min.",
                "agent": "Dam Risk Agent",
                "detail": "Simulated 0.42m rise at Maraimalai Adigal Causeway. Low-lying huts at risk."
            },
            {
                "step": 3,
                "title": "Downstream Impact Alerts Issued",
                "description": "Targeted broadcast sent to Ward 170-174 residents, ward councillors, and police patrols.",
                "agent": "Commander Agent",
                "detail": "Triggered mobile alert sirens and SMS to 18,000 citizens in river buffer zone."
            },
            {
                "step": 4,
                "title": "Pre-emptive Shelter Staging",
                "description": "Adyar Government Girls High School Shelter opened. Blankets and dry rations transferred.",
                "agent": "Resource Allocation Agent",
                "detail": "Dispatched 300 emergency cots and 4,000 water pouches to Adyar Shelter."
            },
            {
                "step": 5,
                "title": "Embankment Reinforcement",
                "description": "PWD teams deploy 4,000 sandbags at vulnerable secondary canal bend.",
                "agent": "Incident Agent",
                "detail": "Secured canal bund. Verified structural integrity with field sensor telemetry."
            },
            {
                "step": 6,
                "title": "Discharge Stabilized & Inundation Contained",
                "description": "River discharge safely routed to Bay of Bengal without residential casualties.",
                "agent": "Commander Agent",
                "detail": "Water levels downstream stabilized below danger threshold. Operation successful."
            }
        ]
    },
    {
        "id": "scenario_c",
        "name": "Scenario C: Coastal Surge & High Tide Lock",
        "tagline": "Combined 4.6m astronomical spring tide and intense coastal rain prevent natural drainage.",
        "total_steps": 6,
        "steps": [
            {
                "step": 1,
                "title": "High Tide Coincides with Storm",
                "description": "Astronomical tide reaches 4.6m, creating negative hydraulic gradient at river outfall.",
                "agent": "Flood Intelligence Agent",
                "detail": "Detected backwater lockup; stormwater drains unable to discharge by gravity."
            },
            {
                "step": 2,
                "title": "Tidal Inundation Nowcast",
                "description": "Nowcasting engine flags coastal avenues and underpasses as high-risk within 40 minutes.",
                "agent": "Flood Intelligence Agent",
                "detail": "Generated 0-3hr hazard contours; alerted traffic and municipal dewatering wings."
            },
            {
                "step": 3,
                "title": "Heavy Pump Stations Activated",
                "description": "Municipal engineering deploys 8 high-capacity 2000 GPM dewatering trucks to subways.",
                "agent": "Resource Allocation Agent",
                "detail": "Allocated mobile pump fleet to critical underpasses before water hits 0.5m."
            },
            {
                "step": 4,
                "title": "Hospital Inbound Casualty Diversion",
                "description": "Submerged access corridor prevents ambulances reaching Dr. Kamakshi Memorial.",
                "agent": "Medical Coordination Agent",
                "detail": "Rerouted 7 incoming ambulances to Omandurar GH and reserved emergency ICU slots."
            },
            {
                "step": 5,
                "title": "Evacuation of Tidal Encroachments",
                "description": "Volunteers and Fire & Rescue escort 120 families to higher-elevation civic shelters.",
                "agent": "Volunteer Coordination Agent",
                "detail": "Coordinated 18 volunteers with local community guides."
            },
            {
                "step": 6,
                "title": "Ebb Tide & Flood Recession",
                "description": "Tidal level recedes to 1.8m. Pumps restore arterial traffic flow. All routes cleared.",
                "agent": "Commander Agent",
                "detail": "Normalized city transit network. Rerouting flags lifted."
            }
        ]
    }
]

def advance_scenario_step(scenario_id: str, step: int, db: Session) -> Dict[str, Any]:
    """
    Executes state changes and records agent logs corresponding to the scenario step.
    """
    scen = next((s for s in SCENARIOS_METADATA if s["id"] == scenario_id), None)
    if not scen:
        return {"error": "Invalid scenario ID"}

    step_data = next((st for st in scen["steps"] if st["step"] == step), None)
    if not step_data:
        return {"error": f"Step {step} not found in scenario {scenario_id}"}

    record_agent_activity(
        db,
        agent_name=step_data["agent"],
        action=f"[{scen['name'][:10]}] {step_data['title']}",
        details=step_data["detail"],
        severity="success" if step == scen["total_steps"] else "alert"
    )

    # Perform specific DB state mutations for Scenario A
    if scenario_id == "scenario_a":
        if step == 2:
            zone = db.query(models.FloodZone).filter(models.FloodZone.id == "fz-1").first()
            if zone:
                zone.water_depth_m = 1.15
                zone.risk_level = "critical"
                db.commit()
        elif step == 4:
            road = db.query(models.RoadSegment).filter(models.RoadSegment.id == "rd-1").first()
            if road:
                road.status = "closed"
                road.water_depth_m = 0.85
                road.verified_by_ground = True
                db.commit()
        elif step == 7:
            approval = db.query(models.ActionApprovalRequest).filter(models.ActionApprovalRequest.id == "appr-1").first()
            if approval:
                approval.status = "pending"
                db.commit()
        elif step == 8:
            sos = db.query(models.SOSRequest).filter(models.SOSRequest.id == "sos-702").first()
            if sos:
                sos.status = "resolved"
            approval = db.query(models.ActionApprovalRequest).filter(models.ActionApprovalRequest.id == "appr-1").first()
            if approval:
                approval.status = "approved"
            db.commit()

    elif scenario_id == "scenario_b":
        if step == 2:
            dam = db.query(models.DamReservoir).filter(models.DamReservoir.id == "dam-1").first()
            if dam:
                dam.current_level_m = 23.1
                dam.storage_percentage = 91.2
                dam.inflow_cusecs = 16800.0
                dam.outflow_cusecs = 11500.0
                dam.open_gates = 8
                dam.downstream_risk_level = "critical"
                dam.ai_recommendation = "Downstream surge warning broadcasted. Adyar causeways closing in 45 minutes."
                db.commit()
        elif step == 3:
            alert = models.ImpactAlert(
                id=f"alt-b-{int(datetime.utcnow().timestamp())}",
                city_id="chennai",
                title="CHEMBARAMBAKKAM SURGE RELEASE: ADYAR RIVERBANK EVACUATION",
                severity="extreme",
                location="Saidapet to Kotturpuram Riverbank Buffer",
                eta="45 - 60 minutes",
                recommended_action="Move to elevated ground immediately. Primary schools in Ward 170 activated.",
                target_audience="Riverbank residents, emergency responders",
                active=True,
                issued_at="Just now"
            )
            db.add(alert)
            db.commit()

    elif scenario_id == "scenario_c":
        if step == 2:
            road = db.query(models.RoadSegment).filter(models.RoadSegment.id == "rd-2").first()
            if road:
                road.status = "closed"
                road.water_depth_m = 0.62
                db.commit()
        elif step == 4:
            hospital = db.query(models.Hospital).filter(models.Hospital.id == "hosp-2").first()
            if hospital:
                hospital.incoming_emergencies = 14
                hospital.available_beds = 6
                db.commit()

    return {
        "scenario_id": scenario_id,
        "step": step,
        "total_steps": scen["total_steps"],
        "title": step_data["title"],
        "description": step_data["description"],
        "agent": step_data["agent"],
        "detail": step_data["detail"]
    }
