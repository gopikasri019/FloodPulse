# FloodPulse — Python FastAPI Backend

### Agentic AI Urban Flood Intelligence & Emergency Response Platform

The FloodPulse backend provides high-performance, asynchronous REST and WebSocket APIs for real-time urban flood intelligence, hydrological nowcasting, autonomous multi-agent swarm coordination, and multi-agency disaster response.

---

## 🚀 Quickstart (Local Setup)

### 1. Prerequisites
- Python 3.10+
- SQLite (included by default) or PostgreSQL

### 2. Setup Virtual Environment & Install Dependencies

**Windows (PowerShell / Command Prompt):**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**macOS / Linux (Bash / Zsh):**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Open API Documentation (Swagger & ReDoc)
Once running:
- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🏗️ Architecture & Modules

```
backend/
├── main.py              # FastAPI app instance, CORS, lifespan, and WebSockets
├── config.py            # Environment configurations & database URL
├── database.py          # SQLAlchemy engine, session maker, SQLite/Postgres switch
├── models.py            # Complete ORM schema for cities, roads, hospitals, SOS, etc.
├── schemas.py           # Pydantic v2 schemas for request validation & responses
├── flood_engine.py      # Hydrological calculation & 0-3hr nowcasting algorithms
├── agents.py            # Multi-agent decision-support swarm & role recommendations
├── scenario.py          # 8-step simulation engine across multiple scenario profiles
├── seed.py              # Rich realistic demo data for Chennai, Mumbai, Bengaluru, etc.
├── requirements.txt     # Python package requirements
└── routers/
    ├── flood.py         # Flood risk scoring, nowcasting, telemetry & dam release
    ├── locations.py     # Multi-city configurations and dynamic road corridors
    ├── alerts.py        # Emergency broadcasts, citizen distress SOS beacons
    ├── resources.py     # Hospital ICU, shelters, volunteers, fleet, & stockpiles
    ├── scenarios.py     # Disaster simulation lifecycle controls
    └── dashboard.py     # Government stats, AI agent reasoning logs & approvals
```

---

## ⚡ Core API Endpoints

### Geographic Hierarchy & Hydrological Monitoring Stations
- `GET /api/locations`: National coverage summary (Country -> State -> District -> City -> Zone -> Station counts & risk distribution).
- `GET /api/locations/states`: List of monitored Indian states with active risk and monsoon status (`?country_id=india&risk_level=critical`).
- `GET /api/locations/districts`: Districts within states with local rainfall and risk levels (`?state=tamil_nadu`).
- `GET /api/locations/cities`: Supported metropolitan regions and baseline flood metrics (`?state=tamil_nadu&district=dist-chennai`).
- `GET /api/locations/zones`: Flood-prone wards and inundation zones with arrival times.
- `GET /api/stations`: Hydrological and drainage monitoring stations across India with filtering (`?state=tamil_nadu&risk_level=CRITICAL&status=ALERT&search=Adyar`).
- `GET /api/stations/{id}`: Detailed telemetry for a specific station (water level, danger level, rainfall, flow rate, drainage efficiency, battery, trend).
- `POST /api/stations/simulate-tick`: Sensor simulator engine generating realistic dynamic variations across all stations.
- `GET /api/locations/roads`: Road corridors with clearance heights and dynamic flood rerouting.
- `PATCH /api/locations/roads/{id}`: Live road clearance and passability status updates.

### Hydrology & Risk Calculation
- `POST /api/flood/calculate-risk`: Computes 0-100 continuous risk score and categorical ratings (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
- `GET /api/flood/nowcast`: 0-3 hour road-by-road inundation predictions with ground divergence.
- `GET /api/flood/weather`: Rainfall mm/hr, Doppler radar reflectivity (dBZ), and storm telemetry.
- `POST /api/flood/dam/simulate-release`: Hydrodynamic downstream release wave modeling.

### Emergency Response & Alerts
- `POST /api/alerts/sos`: Citizen SOS distress intake with automated triage scoring (medical, infant, elderly).
- `GET /api/alerts/sos`: Real-time queue of distress beacons.
- `GET /api/alerts`: Active public broadcasts and evacuation notices.

### Resources & Healthcare
- `GET /api/resources/hospitals`: Real-time bed, ICU, oxygen, and emergency power statuses.
- `GET /api/resources/shelters`: Capacity, occupancy, and remaining food/water rations.
- `GET /api/resources/volunteers`: Skills matrix and dispatch assignments.
- `GET /api/resources/fleet`: Emergency response boats, ambulances, and dewatering pumps.

### Agent Swarm & Executive Decisions
- `GET /api/dashboard/stats`: SEOC executive overview KPIs.
- `GET /api/dashboard/agents`: Status, reasoning, and tasks of all 8 AI agents.
- `GET /api/dashboard/recommendations`: Role-tailored action items for Government, Dam Operators, Volunteers, Responders, and Citizens.
- `POST /api/dashboard/approvals/{id}/action`: Human-in-the-loop sign-off for tactical actions.

### Real-Time WebSocket
- `ws://localhost:8000/ws/dashboard`: Live streaming of hydrological events and agent logs.
