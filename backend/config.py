import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FloodPulse API"
    DESCRIPTION: str = "Agentic AI Urban Flood Intelligence & Emergency Response Platform"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database config: defaults to SQLite for local zero-dependency execution.
    # Can be seamlessly configured for PostgreSQL with:
    # postgresql+psycopg2://user:password@localhost:5432/floodpulse
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./floodpulse.db")
    
    # CORS Origins for frontend clients
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]
    
    # Simulation and calculation defaults
    DEFAULT_CITY_ID: str = "chennai"
    RUNOFF_COEFFICIENT_DEFAULT: float = 0.82
    SOIL_SATURATION_DEFAULT: float = 78.5

    class Config:
        case_sensitive = True
        extra = "allow"

settings = Settings()
