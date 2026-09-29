from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import asyncio
import json

from backend.config import settings
from backend.database import init_db, SessionLocal
from backend import models
from backend.routers import flood, locations, alerts, resources, scenarios, dashboard

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB schema & seed realistic data
    try:
        init_db()
        print(">> [FloodPulse API] SQLite / DB initialized & seeded successfully.")
    except Exception as e:
        print(f">> [FloodPulse API] Error initializing database: {e}")
    yield
    # Shutdown
    print(">> [FloodPulse API] Server shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(flood.router, prefix=settings.API_PREFIX)
app.include_router(locations.router, prefix=settings.API_PREFIX)
app.include_router(alerts.router, prefix=settings.API_PREFIX)
app.include_router(resources.router, prefix=settings.API_PREFIX)
app.include_router(scenarios.router, prefix=settings.API_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_PREFIX)

@app.get("/health", tags=["System Health"])
def health_check():
    """System health check and diagnostic status."""
    db = SessionLocal()
    try:
        cities_count = db.query(models.City).count()
        zones_count = db.query(models.FloodZone).count()
        stations_count = db.query(models.MonitoringStation).count()
        states_count = db.query(models.State).count()
        districts_count = db.query(models.District).count()
        db_status = "connected"
    except Exception as e:
        db_status = f"unreachable: {str(e)}"
        cities_count = 0
        zones_count = 0
        stations_count = 0
        states_count = 0
        districts_count = 0
    finally:
        db.close()

    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_status,
        "active_states": states_count,
        "active_districts": districts_count,
        "active_cities": cities_count,
        "active_flood_zones": zones_count,
        "active_monitoring_stations": stations_count,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@app.get("/", tags=["Root"])
def root():
    """API Root with operational metadata and link to Swagger documentation."""
    return {
        "name": settings.PROJECT_NAME,
        "description": settings.DESCRIPTION,
        "version": settings.VERSION,
        "documentation": "/docs",
        "redoc": "/redoc",
        "health": "/health",
        "api_endpoints": f"{settings.API_PREFIX}/*"
    }

# ----------------- WebSocket Live Telemetry Stream -----------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws/dashboard")
async def websocket_dashboard_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint providing real-time telemetry streaming,
    live agent thought updates, and simulation ticker notifications.
    """
    await manager.connect(websocket)
    try:
        # Send initial handshake message
        await websocket.send_json({
            "event": "connected",
            "message": "Connected to FloodPulse Real-Time Telemetry Stream",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })
        
        while True:
            # Keep connection alive & listen for client ping or telemetry requests
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                if msg.get("action") == "ping":
                    await websocket.send_json({"event": "pong", "time": datetime.utcnow().isoformat()})
            except Exception:
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
