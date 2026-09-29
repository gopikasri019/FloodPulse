from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.database import get_db, SessionLocal
from backend import models
from backend.scenario import SCENARIOS_METADATA, advance_scenario_step
from backend.seed import seed_all_data

router = APIRouter(prefix="/scenarios", tags=["Scenario Simulation Engine"])

@router.get("")
def list_scenarios():
    """Returns the available disaster scenario simulations and their 8-step workflows."""
    return SCENARIOS_METADATA

@router.post("/{scenario_id}/step/{step}")
def trigger_step(
    scenario_id: str,
    step: int,
    db: Session = Depends(get_db)
):
    """
    Triggers an individual step in a simulation scenario,
    modifying database state and appending agent reasoning records.
    """
    result = advance_scenario_step(scenario_id, step, db)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.post("/reset")
def reset_to_baseline(db: Session = Depends(get_db)):
    """
    Resets all simulated entities (zones, roads, dams, approvals) back to
    initial clean baseline.
    """
    # Delete non-static records
    db.query(models.ActionApprovalRequest).delete()
    db.query(models.AgentActivityLog).delete()
    db.query(models.ImpactAlert).delete()
    db.query(models.NowcastPrediction).delete()
    db.query(models.SOSRequest).delete()
    db.query(models.Incident).delete()
    db.query(models.FleetVehicle).delete()
    db.query(models.ReliefResource).delete()
    db.query(models.Volunteer).delete()
    db.query(models.Shelter).delete()
    db.query(models.Hospital).delete()
    db.query(models.RoadSegment).delete()
    db.query(models.FloodZone).delete()
    db.query(models.DamReservoir).delete()
    db.query(models.AIAgentState).delete()
    db.query(models.City).delete()
    db.commit()

    # Re-seed baseline data
    seed_all_data(db)

    return {"status": "success", "message": "Baseline environment successfully re-initialized."}
