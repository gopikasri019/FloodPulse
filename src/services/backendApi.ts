/**
 * FloodPulse Backend API Service Layer
 * Connects the React/Vite frontend to the FastAPI Python backend.
 * Provides resilient fallbacks so the app functions seamlessly in standalone mode
 * while automatically activating live calculations when uvicorn is running.
 */

const BACKEND_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = ${BACKEND_URL}/api;

export interface BackendHealth {
  online: boolean;
  version?: string;
  database?: string;
  activeCities?: number;
  activeFloodZones?: number;
  timestamp?: string;
}

export interface RiskCalculationPayload {
  rainfall_intensity_mm_hr: number;
  accumulated_rainfall_3h_mm?: number;
  current_water_level_m?: number;
  drainage_capacity_percent?: number;
  soil_saturation_percent?: number;
  tide_surge_m?: number;
  river_level_m?: number;
  urban_density_factor?: number;
}

export interface RiskCalculationResult {
  risk_score: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  inundation_arrival_minutes: number;
  predicted_depth_m: number;
  runoff_coefficient: number;
  drainage_deficit_percent: number;
  factors: {
    rainfall_intensity_points: number;
    accumulated_soil_saturation_points: number;
    drainage_deficit_points: number;
    hydraulic_backwater_points: number;
  };
  recommended_interventions: string[];
}

export interface DamReleaseResult {
  reservoir_id: string;
  planned_release_cusecs: number;
  downstream_risk_level: string;
  wave_arrival_time_minutes: number;
  projected_river_level_rise_m: number;
  affected_ward_areas: string[];
  evacuation_advisory_required: boolean;
  ai_guidance: string;
}

class BackendApiService {
  private isOnline: boolean | null = null;
  private lastCheckTime = 0;

  /**
   * Probes backend health status with caching to avoid redundant requests.
   */
  async checkHealth(): Promise<BackendHealth> {
    const now = Date.now();
    if (this.isOnline !== null && now - this.lastCheckTime < 10000) {
      return { online: this.isOnline };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch('/health', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        this.isOnline = true;
        this.lastCheckTime = now;
        return {
          online: true,
          version: data.version,
          database: data.database,
          activeCities: data.active_cities,
          activeFloodZones: data.active_flood_zones,
          timestamp: data.timestamp
        };
      }
    } catch {
      // Backend not running locally
    }

    this.isOnline = false;
    this.lastCheckTime = now;
    return { online: false };
  }

  /**
   * Hydrological flood risk calculation.
   */
  async calculateRisk(payload: RiskCalculationPayload): Promise<RiskCalculationResult | null> {
    try {
      const res = await fetch(`${API_BASE}/flood/calculate-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback handled by caller
    }
    return null;
  }

  /**
   * Dam Release Simulation.
   */
  async simulateDamRelease(reservoirId: string, plannedReleaseCusecs: number): Promise<DamReleaseResult | null> {
    try {
      const res = await fetch(`${API_BASE}/flood/dam/simulate-release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservoir_id: reservoirId,
          planned_release_cusecs: plannedReleaseCusecs
        })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Return null on failure
    }
    return null;
  }

  /**
   * Submits a citizen SOS distress request to the backend.
   */
  async submitSos(sosData: any): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/alerts/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city_id: sosData.cityId || 'chennai',
          citizen_name: sosData.citizenName,
          phone: sosData.phone,
          location_name: sosData.locationName,
          coordinates: sosData.coordinates || [12.9815, 80.2180],
          people_count: sosData.peopleCount || 1,
          water_depth_m: sosData.waterDepthM || 0.5,
          has_medical_emergency: !!sosData.hasMedicalEmergency,
          children_count: sosData.childrenCount || 0,
          elderly_count: sosData.elderlyCount || 0,
          help_type: sosData.helpType || 'boat_evacuation',
          notes: sosData.notes || ''
        })
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Fetches AI Agent recommendations for Government, Dam, Volunteers, Citizens.
   */
  async getAIRecommendations(cityId: string): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE}/dashboard/recommendations?city_id=${cityId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return null;
  }

  /**
   * Submits human-in-the-loop action approval/rejection.
   */
  async submitApprovalAction(approvalId: string, decision: 'approved' | 'rejected'): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/dashboard/approvals/${approvalId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision })
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Advances simulation scenario step in backend SQLite database.
   */
  async advanceScenarioStep(scenarioId: string, step: number): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE}/scenarios/${scenarioId}/step/${step}`, {
        method: 'POST'
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return null;
  }

  /**
   * Fetches high-level geographic grid summary (Country -> State -> District -> City -> Zone -> Station).
   */
  async fetchLocationsSummary(): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE}/locations`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }
    return null;
  }

  /**
   * Fetches states across India.
   */
  async fetchStates(countryId?: string, riskLevel?: string): Promise<any[] | null> {
    try {
      const params = new URLSearchParams();
      if (countryId) params.append('country_id', countryId);
      if (riskLevel) params.append('risk_level', riskLevel);
      const url = `${API_BASE}/locations/states${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }
    return null;
  }

  /**
   * Fetches districts within a state.
   */
  async fetchDistricts(state?: string, riskLevel?: string): Promise<any[] | null> {
    try {
      const params = new URLSearchParams();
      if (state) params.append('state', state);
      if (riskLevel) params.append('risk_level', riskLevel);
      const url = `${API_BASE}/locations/districts${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }
    return null;
  }

  /**
   * Fetches hydrological and urban drainage monitoring stations with multi-level filtering.
   */
  async fetchStations(filters?: {
    state?: string;
    district?: string;
    city?: string;
    zone?: string;
    risk_level?: string;
    status?: string;
    search?: string;
  }): Promise<any[] | null> {
    try {
      const params = new URLSearchParams();
      if (filters?.state) params.append('state', filters.state);
      if (filters?.district) params.append('district', filters.district);
      if (filters?.city) params.append('city', filters.city);
      if (filters?.zone) params.append('zone', filters.zone);
      if (filters?.risk_level && filters.risk_level !== 'ALL') params.append('risk_level', filters.risk_level);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const url = `${API_BASE}/stations${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }
    return null;
  }

  /**
   * Fetches telemetry for a specific monitoring station.
   */
  async fetchStationDetails(stationId: string): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE}/stations/${stationId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }
    return null;
  }

  /**
   * Triggers a sensor simulation variation tick on the backend.
   */
  async triggerStationSimulatorTick(): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE}/stations/simulate-tick`, {
        method: 'POST'
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }
    return null;
  }
}


export const backendApi = new BackendApiService();
