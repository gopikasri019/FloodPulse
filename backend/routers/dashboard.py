from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db
from backend import models, schemas
from backend.agents import get_all_agents, get_role_based_recommendations, record_agent_activity

router = APIRouter(prefix="/dashboard", tags=["Government Executive Dashboard & Agent Swarm"])

@router.get("/stats", response_model=schemas.DashboardStatsResponse)
def get_dashboard_stats(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    db: Session = Depends(get_db)
):
    """
    Returns executive summary statistics for government disaster managers:
    active risk level, population at risk, closed roads, ICU capacity, etc.
    """
    city = db.query(models.City).filter(models.City.id == city_id).first()
    if not city:
        city = db.query(models.City).first()

    active_zones = db.query(models.FloodZone).filter(
        models.FloodZone.city_id == city_id,
        models.FloodZone.risk_level.in_(["high", "critical"])
    ).count()

    closed_roads = db.query(models.RoadSegment).filter(
        models.RoadSegment.city_id == city_id,
        models.RoadSegment.status == "closed"
    ).count()

    pending_sos = db.query(models.SOSRequest).filter(
        models.SOSRequest.city_id == city_id,
        models.SOSRequest.status != "resolved"
    ).count()

    hospitals = db.query(models.Hospital).filter(models.Hospital.city_id == city_id).all()
    available_icu = sum(h.icu_beds_available for h in hospitals)

    active_vols = db.query(models.Volunteer).filter(
        models.Volunteer.city_id == city_id,
        models.Volunteer.is_available == True
    ).count()

    dam = db.query(models.DamReservoir).filter(models.DamReservoir.city_id == city_id).first()
    dam_storage = dam.storage_percentage if dam else 75.0

    return {
        "active_risk_level": city.active_risk_level if city else "moderate",
        "population_at_risk": city.population_at_risk if city else 150000,
        "active_flood_zones": active_zones,
        "closed_roads_count": closed_roads,
        "pending_sos_count": pending_sos,
        "available_icu_beds": available_icu,
        "active_volunteers_count": active_vols,
        "dam_storage_percentage": dam_storage,
        "current_rainfall_mm_hr": city.rainfall_mm_hr if city else 0.0,
        "river_level_m": city.river_level_m if city else 2.0,
        "tide_height_m": city.tide_height_m if city else 1.0
    }

@router.get("/agents", response_model=List[schemas.AIAgentResponse])
def get_agents(db: Session = Depends(get_db)):
    """Returns the operational status, current task, and confidence for all 8 AI agents."""
    agents = get_all_agents(db)
    return agents

@router.get("/logs", response_model=List[schemas.AgentActivityLogResponse])
def get_logs(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Returns the latest agent reasoning and coordination activity stream."""
    logs = db.query(models.AgentActivityLog).order_by(models.AgentActivityLog.id.desc()).limit(limit).all()
    return logs

@router.get("/recommendations", response_model=schemas.AIRecommendationsResponse)
def get_recommendations(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    db: Session = Depends(get_db)
):
    """
    Returns AI multi-agent recommendations structured for:
    Government Officials, Dam Operators, Volunteers, Citizens, and Responders.
    """
    recs = get_role_based_recommendations(city_id, db)
    return recs

@router.get("/approvals", response_model=List[schemas.ActionApprovalRequestResponse])
def get_approvals(db: Session = Depends(get_db)):
    """Returns pending Human-in-the-Loop emergency actions needing official authorization."""
    approvals = db.query(models.ActionApprovalRequest).all()
    return approvals

@router.post("/approvals/{approval_id}/action", response_model=schemas.ActionApprovalRequestResponse)
def handle_approval_action(
    approval_id: str,
    body: schemas.ActionApprovalDecision,
    db: Session = Depends(get_db)
):
    """Authorizes or rejects an AI-proposed tactical response plan."""
    approval = db.query(models.ActionApprovalRequest).filter(models.ActionApprovalRequest.id == approval_id).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    approval.status = body.decision
    db.commit()
    db.refresh(approval)

    record_agent_activity(
        db,
        agent_name="Commander Agent",
        action=f"Tactical Proposal {body.decision.upper()}",
        details=f"Human Official {body.decision} proposal '{approval.title}'.",
        severity="success" if body.decision == "approved" else "warning"
    )
    return approval
