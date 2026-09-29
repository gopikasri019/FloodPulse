from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.database import get_db
from backend import models, schemas
from backend.agents import record_agent_activity

router = APIRouter(prefix="/resources", tags=["Emergency Resources, Medical & Shelters"])

# ---------------- Hospitals ----------------
@router.get("/hospitals", response_model=List[schemas.HospitalResponse])
def get_hospitals(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    db: Session = Depends(get_db)
):
    """Returns hospitals with available regular and ICU beds, power, and oxygen metrics."""
    hospitals = db.query(models.Hospital).filter(models.Hospital.city_id == city_id).all()
    results = []
    for h in hospitals:
        results.append({
            "id": h.id,
            "city_id": h.city_id,
            "name": h.name,
            "coordinates": [h.coord_lat, h.coord_lng],
            "total_beds": h.total_beds,
            "available_beds": h.available_beds,
            "icu_beds_total": h.icu_beds_total,
            "icu_beds_available": h.icu_beds_available,
            "ambulances_available": h.ambulances_available,
            "power_status": h.power_status,
            "oxygen_supply_hours": h.oxygen_supply_hours,
            "water_accessible": h.water_accessible,
            "incoming_emergencies": h.incoming_emergencies
        })
    return results

@router.patch("/hospitals/{hospital_id}", response_model=schemas.HospitalResponse)
def update_hospital(
    hospital_id: str,
    update: schemas.HospitalUpdate,
    db: Session = Depends(get_db)
):
    """Updates hospital beds or operational status."""
    h = db.query(models.Hospital).filter(models.Hospital.id == hospital_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")
    
    if update.available_beds is not None:
        h.available_beds = update.available_beds
    if update.icu_beds_available is not None:
        h.icu_beds_available = update.icu_beds_available
    if update.ambulances_available is not None:
        h.ambulances_available = update.ambulances_available
    if update.power_status is not None:
        h.power_status = update.power_status
    if update.water_accessible is not None:
        h.water_accessible = update.water_accessible
    
    db.commit()
    db.refresh(h)

    return {
        "id": h.id,
        "city_id": h.city_id,
        "name": h.name,
        "coordinates": [h.coord_lat, h.coord_lng],
        "total_beds": h.total_beds,
        "available_beds": h.available_beds,
        "icu_beds_total": h.icu_beds_total,
        "icu_beds_available": h.icu_beds_available,
        "ambulances_available": h.ambulances_available,
        "power_status": h.power_status,
        "oxygen_supply_hours": h.oxygen_supply_hours,
        "water_accessible": h.water_accessible,
        "incoming_emergencies": h.incoming_emergencies
    }


# ---------------- Shelters ----------------
@router.get("/shelters", response_model=List[schemas.ShelterResponse])
def get_shelters(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    db: Session = Depends(get_db)
):
    """Returns relief shelters, capacity, occupancy, and remaining food/water rations."""
    shelters = db.query(models.Shelter).filter(models.Shelter.city_id == city_id).all()
    results = []
    for s in shelters:
        results.append({
            "id": s.id,
            "city_id": s.city_id,
            "name": s.name,
            "coordinates": [s.coord_lat, s.coord_lng],
            "capacity": s.capacity,
            "occupancy": s.occupancy,
            "food_days_remaining": s.food_days_remaining,
            "water_liters_remaining": s.water_liters_remaining,
            "medical_support_available": s.medical_support_available,
            "power_status": s.power_status,
            "accessibility_status": s.accessibility_status,
            "contact_person": s.contact_person,
            "phone": s.phone
        })
    return results

@router.patch("/shelters/{shelter_id}", response_model=schemas.ShelterResponse)
def update_shelter(
    shelter_id: str,
    update: schemas.ShelterUpdate,
    db: Session = Depends(get_db)
):
    """Updates shelter occupancy and consumable rations."""
    s = db.query(models.Shelter).filter(models.Shelter.id == shelter_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Shelter not found")
    
    if update.occupancy is not None:
        s.occupancy = update.occupancy
    if update.food_days_remaining is not None:
        s.food_days_remaining = update.food_days_remaining
    if update.water_liters_remaining is not None:
        s.water_liters_remaining = update.water_liters_remaining
    if update.power_status is not None:
        s.power_status = update.power_status
    if update.accessibility_status is not None:
        s.accessibility_status = update.accessibility_status
    
    db.commit()
    db.refresh(s)

    return {
        "id": s.id,
        "city_id": s.city_id,
        "name": s.name,
        "coordinates": [s.coord_lat, s.coord_lng],
        "capacity": s.capacity,
        "occupancy": s.occupancy,
        "food_days_remaining": s.food_days_remaining,
        "water_liters_remaining": s.water_liters_remaining,
        "medical_support_available": s.medical_support_available,
        "power_status": s.power_status,
        "accessibility_status": s.accessibility_status,
        "contact_person": s.contact_person,
        "phone": s.phone
    }


# ---------------- Volunteers ----------------
@router.get("/volunteers", response_model=List[schemas.VolunteerResponse])
def get_volunteers(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    db: Session = Depends(get_db)
):
    """Returns active registered volunteers, skill matrix, and operational availability."""
    volunteers = db.query(models.Volunteer).filter(models.Volunteer.city_id == city_id).all()
    results = []
    for v in volunteers:
        results.append({
            "id": v.id,
            "city_id": v.city_id,
            "name": v.name,
            "phone": v.phone,
            "skills": v.skills,
            "is_available": v.is_available,
            "current_location": v.current_location,
            "coordinates": [v.coord_lat, v.coord_lng],
            "active_task_id": v.active_task_id,
            "completed_tasks_count": v.completed_tasks_count,
            "badge_level": v.badge_level
        })
    return results

@router.post("/volunteers/{volunteer_id}/assign")
def assign_volunteer_task(
    volunteer_id: str,
    action: schemas.VolunteerTaskAction,
    db: Session = Depends(get_db)
):
    """Assigns an emergency task to a volunteer."""
    v = db.query(models.Volunteer).filter(models.Volunteer.id == volunteer_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    
    v.active_task_id = action.task_id
    v.is_available = False
    db.commit()

    record_agent_activity(
        db,
        agent_name="Volunteer Coordination Agent",
        action=f"Volunteer Assigned: {v.name}",
        details=f"Assigned task {action.task_id} to volunteer {v.name}.",
        severity="info"
    )
    return {"status": "success", "message": f"Task {action.task_id} assigned to {v.name}"}

@router.post("/volunteers/{volunteer_id}/complete")
def complete_volunteer_task(
    volunteer_id: str,
    db: Session = Depends(get_db)
):
    """Marks a volunteer's current mission as completed."""
    v = db.query(models.Volunteer).filter(models.Volunteer.id == volunteer_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    
    v.active_task_id = None
    v.is_available = True
    v.completed_tasks_count += 1
    db.commit()

    record_agent_activity(
        db,
        agent_name="Volunteer Coordination Agent",
        action=f"Volunteer Mission Completed: {v.name}",
        details=f"{v.name} completed task. Total tasks: {v.completed_tasks_count}.",
        severity="success"
    )
    return {"status": "success", "completed_count": v.completed_tasks_count}


# ---------------- Relief Resources ----------------
@router.get("/relief", response_model=List[schemas.ReliefResourceResponse])
def get_relief_resources(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    db: Session = Depends(get_db)
):
    """Returns stockpile of food, water, boats, blankets, sandbags, and medical kits."""
    resources = db.query(models.ReliefResource).filter(models.ReliefResource.city_id == city_id).all()
    return resources

@router.post("/relief/allocate")
def allocate_relief(
    req: schemas.ResourceAllocateRequest,
    db: Session = Depends(get_db)
):
    """Allocates stockpile resources to a designated shelter or relief center."""
    res = db.query(models.ReliefResource).filter(models.ReliefResource.id == req.resource_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    shelter = db.query(models.Shelter).filter(models.Shelter.id == req.target_shelter_id).first()
    shelter_name = shelter.name if shelter else req.target_shelter_id

    res.allocated_to = shelter_name
    res.status = "in_transit"
    db.commit()

    record_agent_activity(
        db,
        agent_name="Resource Allocation Agent",
        action=f"Supply Allocation: {res.name}",
        details=f"Mobilized {req.quantity} {res.unit} of {res.name} to {shelter_name}.",
        severity="info"
    )
    return {"status": "success", "message": f"Allocated {req.quantity} units to {shelter_name}"}


# ---------------- Fleet Vehicles ----------------
@router.get("/fleet", response_model=List[schemas.FleetVehicleResponse])
def get_fleet(
    city_id: Optional[str] = Query("chennai", description="Target city ID"),
    db: Session = Depends(get_db)
):
    """Returns emergency vehicles: boats, ambulances, high-clearance trucks, and pumps."""
    fleet = db.query(models.FleetVehicle).filter(models.FleetVehicle.city_id == city_id).all()
    results = []
    for f in fleet:
        results.append({
            "id": f.id,
            "city_id": f.city_id,
            "callsign": f.callsign,
            "type": f.type,
            "status": f.status,
            "current_location": f.current_location,
            "coordinates": [f.coord_lat, f.coord_lng],
            "assigned_mission": f.assigned_mission,
            "fuel_percentage": f.fuel_percentage,
            "driver_name": f.driver_name
        })
    return results

@router.post("/fleet/{vehicle_id}/dispatch")
def dispatch_fleet_vehicle(
    vehicle_id: str,
    action: schemas.FleetDispatchAction,
    db: Session = Depends(get_db)
):
    """Dispatches an emergency vehicle on an active rescue or dewatering mission."""
    v = db.query(models.FleetVehicle).filter(models.FleetVehicle.id == vehicle_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    v.status = "en_route"
    v.assigned_mission = action.mission_title
    if action.target_location:
        v.current_location = action.target_location
    db.commit()

    record_agent_activity(
        db,
        agent_name="Emergency Routing Agent",
        action=f"Fleet Dispatched: {v.callsign}",
        details=f"Assigned mission '{action.mission_title}'. Clear corridor path calculated.",
        severity="info"
    )
    return {"status": "success", "vehicle": v.callsign, "mission": v.assigned_mission}
