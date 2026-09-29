from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from backend.database import get_db
from backend import models, schemas
from backend.agents import record_agent_activity

router = APIRouter(prefix="/alerts", tags=["Emergency Alerts & Citizen SOS"])

@router.get("", response_model=List[schemas.ImpactAlertResponse])
def get_alerts(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    db: Session = Depends(get_db)
):
    """Returns active emergency impact alerts."""
    alerts = db.query(models.ImpactAlert).filter(
        models.ImpactAlert.city_id == city_id,
        models.ImpactAlert.active == True
    ).all()
    return alerts

@router.post("", response_model=schemas.ImpactAlertResponse)
def create_alert(
    alert_in: schemas.ImpactAlertCreate,
    db: Session = Depends(get_db)
):
    """Issues and broadcasts a new emergency impact alert."""
    new_alert = models.ImpactAlert(
        id=f"alt-{int(datetime.utcnow().timestamp() * 1000)}",
        city_id=alert_in.city_id,
        title=alert_in.title,
        severity=alert_in.severity,
        location=alert_in.location,
        eta=alert_in.eta,
        recommended_action=alert_in.recommended_action,
        target_audience=alert_in.target_audience,
        active=True,
        issued_at="Just now"
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)

    record_agent_activity(
        db,
        agent_name="Commander Agent",
        action="Emergency Alert Broadcast",
        details=f"Issued {new_alert.severity.upper()} alert for {new_alert.location}.",
        severity="alert"
    )
    return new_alert

@router.delete("/{alert_id}")
def dismiss_alert(alert_id: str, db: Session = Depends(get_db)):
    """Dismisses or deactivates an emergency alert."""
    alert = db.query(models.ImpactAlert).filter(models.ImpactAlert.id == alert_id).first()
    if alert:
        alert.active = False
        db.commit()
    return {"status": "success", "message": "Alert deactivated"}

@router.get("/sos", response_model=List[schemas.SOSRequestResponse])
def get_sos_requests(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    status: Optional[str] = Query(None, description="Optional status filter"),
    db: Session = Depends(get_db)
):
    """Returns all citizen distress SOS beacons."""
    query = db.query(models.SOSRequest).filter(models.SOSRequest.city_id == city_id)
    if status:
        query = query.filter(models.SOSRequest.status == status)
    
    records = query.order_by(models.SOSRequest.priority_score.desc()).all()
    results = []
    for r in records:
        results.append({
            "id": r.id,
            "city_id": r.city_id,
            "citizen_name": r.citizen_name,
            "phone": r.phone,
            "location_name": r.location_name,
            "coordinates": [r.coord_lat, r.coord_lng],
            "people_count": r.people_count,
            "water_depth_m": r.water_depth_m,
            "has_medical_emergency": r.has_medical_emergency,
            "children_count": r.children_count,
            "elderly_count": r.elderly_count,
            "help_type": r.help_type,
            "notes": r.notes,
            "status": r.status,
            "reported_at": r.reported_at,
            "assigned_vehicle_id": r.assigned_vehicle_id,
            "assigned_volunteer_id": r.assigned_volunteer_id,
            "priority_score": r.priority_score
        })
    return results

@router.post("/sos", response_model=schemas.SOSRequestResponse)
def submit_sos(
    sos_in: schemas.SOSRequestCreate,
    db: Session = Depends(get_db)
):
    """
    Submits a high-priority citizen SOS distress call.
    Automatically prioritizes medical, infant, and elderly distress.
    """
    # Priority score algorithm (0 - 100)
    score = 40.0
    if sos_in.has_medical_emergency:
        score += 30.0
    if sos_in.water_depth_m > 0.8:
        score += 15.0
    if sos_in.elderly_count > 0 or sos_in.children_count > 0:
        score += 12.0
    score = min(99.0, score)

    coords = sos_in.coordinates if len(sos_in.coordinates) >= 2 else [12.9815, 80.2180]

    sos_obj = models.SOSRequest(
        id=f"sos-{int(datetime.utcnow().timestamp() * 1000) % 100000}",
        city_id=sos_in.city_id,
        citizen_name=sos_in.citizen_name,
        phone=sos_in.phone,
        location_name=sos_in.location_name,
        coord_lat=coords[0],
        coord_lng=coords[1],
        people_count=sos_in.people_count,
        water_depth_m=sos_in.water_depth_m,
        has_medical_emergency=sos_in.has_medical_emergency,
        children_count=sos_in.children_count,
        elderly_count=sos_in.elderly_count,
        help_type=sos_in.help_type,
        notes=sos_in.notes,
        status="reported",
        reported_at="Just now",
        priority_score=score
    )
    db.add(sos_obj)
    db.commit()
    db.refresh(sos_obj)

    record_agent_activity(
        db,
        agent_name="Incident Verification Agent",
        action=f"Distress SOS Received: {sos_obj.citizen_name}",
        details=f"Ingested SOS from {sos_obj.location_name} ({sos_obj.people_count} persons). Priority: {score}/100.",
        severity="alert"
    )

    return {
        "id": sos_obj.id,
        "city_id": sos_obj.city_id,
        "citizen_name": sos_obj.citizen_name,
        "phone": sos_obj.phone,
        "location_name": sos_obj.location_name,
        "coordinates": [sos_obj.coord_lat, sos_obj.coord_lng],
        "people_count": sos_obj.people_count,
        "water_depth_m": sos_obj.water_depth_m,
        "has_medical_emergency": sos_obj.has_medical_emergency,
        "children_count": sos_obj.children_count,
        "elderly_count": sos_obj.elderly_count,
        "help_type": sos_obj.help_type,
        "notes": sos_obj.notes,
        "status": sos_obj.status,
        "reported_at": sos_obj.reported_at,
        "assigned_vehicle_id": sos_obj.assigned_vehicle_id,
        "assigned_volunteer_id": sos_obj.assigned_volunteer_id,
        "priority_score": sos_obj.priority_score
    }

@router.patch("/sos/{sos_id}", response_model=schemas.SOSRequestResponse)
def update_sos_status(
    sos_id: str,
    update: schemas.SOSStatusUpdate,
    db: Session = Depends(get_db)
):
    """Updates status or assigns rescue units to an SOS distress beacon."""
    sos = db.query(models.SOSRequest).filter(models.SOSRequest.id == sos_id).first()
    if not sos:
        raise HTTPException(status_code=404, detail="SOS not found")
    
    sos.status = update.status
    if update.assigned_vehicle_id:
        sos.assigned_vehicle_id = update.assigned_vehicle_id
    if update.assigned_volunteer_id:
        sos.assigned_volunteer_id = update.assigned_volunteer_id
    
    db.commit()
    db.refresh(sos)

    record_agent_activity(
        db,
        agent_name="Commander Agent",
        action=f"SOS Status Updated: {sos.id}",
        details=f"Status transitioned to '{sos.status}'.",
        severity="info"
    )

    return {
        "id": sos.id,
        "city_id": sos.city_id,
        "citizen_name": sos.citizen_name,
        "phone": sos.phone,
        "location_name": sos.location_name,
        "coordinates": [sos.coord_lat, sos.coord_lng],
        "people_count": sos.people_count,
        "water_depth_m": sos.water_depth_m,
        "has_medical_emergency": sos.has_medical_emergency,
        "children_count": sos.children_count,
        "elderly_count": sos.elderly_count,
        "help_type": sos.help_type,
        "notes": sos.notes,
        "status": sos.status,
        "reported_at": sos.reported_at,
        "assigned_vehicle_id": sos.assigned_vehicle_id,
        "assigned_volunteer_id": sos.assigned_volunteer_id,
        "priority_score": sos.priority_score
    }

@router.get("/incidents", response_model=List[schemas.IncidentResponse])
def get_incidents(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    db: Session = Depends(get_db)
):
    """Returns field incident reports."""
    incidents = db.query(models.Incident).filter(models.Incident.city_id == city_id).all()
    results = []
    for inc in incidents:
        results.append({
            "id": inc.id,
            "city_id": inc.city_id,
            "title": inc.title,
            "location_name": inc.location_name,
            "coordinates": [inc.coord_lat, inc.coord_lng],
            "type": inc.type,
            "severity": inc.severity,
            "people_affected": inc.people_affected,
            "water_depth_m": inc.water_depth_m,
            "status": inc.status,
            "reported_at": inc.reported_at,
            "assigned_team": inc.assigned_team,
            "assigned_team_type": inc.assigned_team_type,
            "special_needs": inc.special_needs,
            "description": inc.description
        })
    return results

@router.post("/incidents", response_model=schemas.IncidentResponse)
def report_incident(
    inc_in: schemas.IncidentCreate,
    db: Session = Depends(get_db)
):
    """Submits a verified field incident."""
    coords = inc_in.coordinates if len(inc_in.coordinates) >= 2 else [12.9810, 80.2180]
    inc = models.Incident(
        id=f"inc-{int(datetime.utcnow().timestamp() * 1000) % 100000}",
        city_id=inc_in.city_id,
        title=inc_in.title,
        location_name=inc_in.location_name,
        coord_lat=coords[0],
        coord_lng=coords[1],
        type=inc_in.type,
        severity=inc_in.severity,
        people_affected=inc_in.people_affected,
        water_depth_m=inc_in.water_depth_m,
        status="reported",
        reported_at="Just now",
        description=inc_in.description
    )
    db.add(inc)
    db.commit()
    db.refresh(inc)

    return {
        "id": inc.id,
        "city_id": inc.city_id,
        "title": inc.title,
        "location_name": inc.location_name,
        "coordinates": [inc.coord_lat, inc.coord_lng],
        "type": inc.type,
        "severity": inc.severity,
        "people_affected": inc.people_affected,
        "water_depth_m": inc.water_depth_m,
        "status": inc.status,
        "reported_at": inc.reported_at,
        "assigned_team": inc.assigned_team,
        "assigned_team_type": inc.assigned_team_type,
        "special_needs": inc.special_needs,
        "description": inc.description
    }
