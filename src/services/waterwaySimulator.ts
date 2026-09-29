import {
  WaterwayStation,
  WaterwayRiskLevel,
  WaterwaySensorStatus,
  WaterwayScenarioType,
  WaterwayAlert,
  WaterwayEmergencyAction,
  WaterwayTelemetryPoint
} from '../types';
import { INITIAL_WATERWAY_STATIONS } from '../data/waterwayData';

type Listener = (stations: WaterwayStation[], alerts: WaterwayAlert[]) => void;

class WaterwaySimulationService {
  private stations: WaterwayStation[] = JSON.parse(JSON.stringify(INITIAL_WATERWAY_STATIONS));
  private alerts: WaterwayAlert[] = [];
  private currentScenario: WaterwayScenarioType = 'monsoon_surge';
  private isRunning: boolean = true;
  private simulationSpeedMs: number = 3000;
  private intervalId: any = null;
  private listeners: Set<Listener> = new Set();
  private ws: WebSocket | null = null;
  private isWsConnected: boolean = false;
  private audioAlertEnabled: boolean = true;

  constructor() {
    this.initWebSocket();
    this.startSimulation();
  }

  // --- WebSocket Connection with auto-reconnect & fallback ---
  private initWebSocket() {
    if (typeof window === 'undefined') return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws/waterways`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isWsConnected = true;
        // Connected to FastAPI WebSocket
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'telemetry_tick' && Array.isArray(data.stations)) {
            this.mergeRemoteTelemetry(data.stations);
          }
        } catch {
          // Fall back to local simulator
        }
      };

      this.ws.onerror = () => {
        this.isWsConnected = false;
      };

      this.ws.onclose = () => {
        this.isWsConnected = false;
        // Retry connection after 10s
        setTimeout(() => this.initWebSocket(), 10000);
      };
    } catch {
      this.isWsConnected = false;
    }
  }

  private mergeRemoteTelemetry(remoteStations: Partial<WaterwayStation>[]) {
    const stationMap = new Map(this.stations.map((s) => [s.id, s]));
    remoteStations.forEach((remote) => {
      if (remote.id && stationMap.has(remote.id)) {
        const existing = stationMap.get(remote.id)!;
        Object.assign(existing, remote);
      }
    });
    this.notifyListeners();
  }

  // --- Simulation Loop ---
  public startSimulation() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.stepSimulation();
    }, this.simulationSpeedMs);
  }

  public pauseSimulation() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.notifyListeners();
  }

  public resumeSimulation() {
    this.startSimulation();
    this.notifyListeners();
  }

  public setSpeed(speedMs: number) {
    this.simulationSpeedMs = speedMs;
    if (this.isRunning) {
      this.startSimulation();
    }
  }

  public setScenario(scenario: WaterwayScenarioType) {
    this.currentScenario = scenario;
    // Immediate state shift according to scenario
    this.stations = this.stations.map((station) => {
      let targetWater = station.waterLevelM;
      let targetRain = station.rainfallMmHr;
      let targetDrain = station.drainageCapacityPercent;
      let targetFlow = station.flowRateM3s;
      let sensorStatus: WaterwaySensorStatus = 'online';

      switch (scenario) {
        case 'normal':
          targetWater = Math.max(1.2, station.warningThresholdM * 0.55);
          targetRain = 8 + Math.random() * 12;
          targetDrain = 75 + Math.random() * 20;
          targetFlow = 40 + Math.random() * 30;
          sensorStatus = 'online';
          break;

        case 'monsoon_surge':
          targetWater = station.warningThresholdM * 0.95 + (Math.random() * 0.35);
          targetRain = 50 + Math.random() * 35;
          targetDrain = 25 + Math.random() * 20;
          targetFlow = 130 + Math.random() * 80;
          sensorStatus = targetWater >= station.warningThresholdM ? 'warning' : 'online';
          break;

        case 'cloudburst_spike':
          targetWater = station.dangerThresholdM * 1.06 + (Math.random() * 0.25);
          targetRain = 85 + Math.random() * 40;
          targetDrain = 10 + Math.random() * 15;
          targetFlow = 220 + Math.random() * 120;
          sensorStatus = 'warning';
          break;

        case 'sensor_fault':
          sensorStatus = Math.random() > 0.4 ? 'fault' : 'offline';
          targetRain = 40;
          break;

        case 'reservoir_release':
          targetWater = station.warningThresholdM * 1.08;
          targetFlow = 280 + Math.random() * 150;
          targetDrain = 30 + Math.random() * 15;
          sensorStatus = 'warning';
          break;
      }

      const updated = {
        ...station,
        waterLevelM: parseFloat(targetWater.toFixed(2)),
        rainfallMmHr: parseFloat(targetRain.toFixed(1)),
        drainageCapacityPercent: Math.round(targetDrain),
        flowRateM3s: parseFloat(targetFlow.toFixed(1)),
        sensorStatus
      };

      const analysis = this.computeRiskAnalysis(updated);
      return {
        ...updated,
        currentRisk: analysis.risk,
        confidenceScore: analysis.confidence,
        contributingFactors: analysis.factors,
        recommendedActions: this.syncActionsForRisk(updated, analysis.risk)
      };
    });

    this.notifyListeners();
  }

  // --- Step calculation with hydrodynamic logic ---
  public stepSimulation() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    this.stations = this.stations.map((station) => {
      // Dynamic micro-jitter and drift based on scenario
      let deltaWater = 0;
      let deltaRain = 0;
      let deltaDrain = 0;

      const jitter = (Math.random() - 0.48) * 0.04;

      switch (this.currentScenario) {
        case 'normal':
          // Slowly recede or remain low
          deltaWater = -0.01 + jitter * 0.3;
          deltaRain = (Math.random() - 0.5) * 2;
          deltaDrain = 0.5;
          break;

        case 'monsoon_surge':
          // Steady rise
          deltaWater = 0.025 + Math.random() * 0.035;
          deltaRain = (Math.random() - 0.4) * 4;
          deltaDrain = -0.4;
          break;

        case 'cloudburst_spike':
          // Rapid flash rise
          deltaWater = 0.05 + Math.random() * 0.06;
          deltaRain = (Math.random() - 0.3) * 6;
          deltaDrain = -0.8;
          break;

        case 'sensor_fault':
          // Unstable fluctuations
          deltaWater = (Math.random() - 0.5) * 0.4;
          deltaRain = (Math.random() - 0.5) * 15;
          break;

        case 'reservoir_release':
          // Wave crest surge
          deltaWater = 0.03 + Math.random() * 0.04;
          deltaRain = (Math.random() - 0.5) * 3;
          deltaDrain = -0.3;
          break;
      }

      // Calculate new values with bounds
      const minLevel = 0.5;
      const maxLevel = station.dangerThresholdM * 1.35;
      const prevLevel = station.waterLevelM;
      let newLevel = Math.max(minLevel, Math.min(maxLevel, prevLevel + deltaWater));
      newLevel = parseFloat(newLevel.toFixed(2));

      // Rate of rise dH/dt (meters per hour based on 3s step scaled)
      const instantaneousRisePerHour = ((newLevel - prevLevel) * (3600 / (this.simulationSpeedMs / 1000)));
      const smoothedRateOfRise = parseFloat((station.rateOfRiseMPerHr * 0.7 + instantaneousRisePerHour * 0.3).toFixed(2));

      // Rainfall intensity
      let newRain = Math.max(0, Math.min(180, station.rainfallMmHr + deltaRain));
      newRain = parseFloat(newRain.toFixed(1));

      // Drainage capacity
      let newDrain = Math.max(5, Math.min(100, station.drainageCapacityPercent + deltaDrain));
      newDrain = Math.round(newDrain);

      // Flow rate roughly proportional to water level squared (Manning hydraulic relation)
      const baseFlow = station.cityId === 'guwahati' && station.stationCode.includes('BRH') ? 18000 : 120;
      const flowMultiplier = Math.pow(Math.max(0.2, newLevel / station.warningThresholdM), 1.6);
      const newFlow = parseFloat((baseFlow * flowMultiplier + (Math.random() - 0.5) * 8).toFixed(1));

      // Battery & Solar Simulation
      let newBattery = station.batteryPercent;
      let isSolar = station.solarCharging;
      if (Math.random() > 0.85) {
        newBattery = Math.max(15, Math.min(100, station.batteryPercent + (isSolar ? 1 : -1)));
      }

      // Sensor Status logic
      let sensorStatus: WaterwaySensorStatus = station.sensorStatus;
      if (this.currentScenario === 'sensor_fault' && Math.random() > 0.7) {
        sensorStatus = Math.random() > 0.5 ? 'fault' : 'offline';
      } else if (newLevel >= station.dangerThresholdM) {
        sensorStatus = 'warning';
      } else if (newLevel >= station.warningThresholdM) {
        sensorStatus = 'warning';
      } else {
        sensorStatus = 'online';
      }

      // Add to telemetry history (keep last 12 points)
      const newHistory: WaterwayTelemetryPoint[] = [
        ...station.telemetryHistory.slice(-11),
        {
          timestamp: timeStr,
          waterLevelM: newLevel,
          flowRateM3s: newFlow,
          rainfallMmHr: newRain,
          drainageCapacityPercent: newDrain
        }
      ];

      // Run AI Risk Engine
      const mockStationForRisk = {
        ...station,
        waterLevelM: newLevel,
        rainfallMmHr: newRain,
        drainageCapacityPercent: newDrain,
        rateOfRiseMPerHr: smoothedRateOfRise,
        flowRateM3s: newFlow,
        sensorStatus
      };

      const analysis = this.computeRiskAnalysis(mockStationForRisk);

      // Check alert triggers
      this.evaluateAlerts(mockStationForRisk, analysis.risk);

      return {
        ...station,
        waterLevelM: newLevel,
        rainfallMmHr: newRain,
        drainageCapacityPercent: newDrain,
        flowRateM3s: newFlow,
        rateOfRiseMPerHr: smoothedRateOfRise,
        sensorStatus,
        batteryPercent: newBattery,
        lastUpdated: 'Just now',
        currentRisk: analysis.risk,
        confidenceScore: analysis.confidence,
        contributingFactors: analysis.factors,
        recommendedActions: this.syncActionsForRisk(mockStationForRisk, analysis.risk),
        telemetryHistory: newHistory
      };
    });

    this.notifyListeners();
  }

  // --- AI Risk Calculation Engine ---
  private computeRiskAnalysis(station: WaterwayStation): {
    risk: WaterwayRiskLevel;
    confidence: number;
    factors: string[];
  } {
    const factors: string[] = [];

    // Factor 1: Depth vs Thresholds
    const ratioToDanger = station.waterLevelM / station.dangerThresholdM;
    const ratioToWarning = station.waterLevelM / station.warningThresholdM;

    let points = 0;

    if (station.waterLevelM >= station.dangerThresholdM) {
      points += 45;
      factors.push(
        `CRITICAL: Water level (${station.waterLevelM.toFixed(2)}m) exceeds danger threshold (${station.dangerThresholdM.toFixed(2)}m)`
      );
    } else if (station.waterLevelM >= station.warningThresholdM) {
      points += 28;
      factors.push(
        `ELEVATED: Water level (${station.waterLevelM.toFixed(2)}m) breached warning mark (${station.warningThresholdM.toFixed(2)}m)`
      );
    } else if (ratioToWarning >= 0.85) {
      points += 15;
      factors.push(`Water level at ${Math.round(ratioToWarning * 100)}% of warning limit`);
    } else {
      points += 5;
    }

    // Factor 2: Rate of Rise (dH/dt)
    if (station.rateOfRiseMPerHr >= 0.40) {
      points += 30;
      factors.push(`Rapid rate of rise (+${station.rateOfRiseMPerHr.toFixed(2)} m/hr) indicates flash hydraulic surge`);
    } else if (station.rateOfRiseMPerHr >= 0.20) {
      points += 18;
      factors.push(`Steady upward trend (+${station.rateOfRiseMPerHr.toFixed(2)} m/hr)`);
    } else if (station.rateOfRiseMPerHr < -0.1) {
      factors.push(`Receding water level (${station.rateOfRiseMPerHr.toFixed(2)} m/hr)`);
    }

    // Factor 3: Rainfall Intensity
    if (station.rainfallMmHr >= 70) {
      points += 22;
      factors.push(`Intense cloudburst rainfall (${station.rainfallMmHr} mm/hr) over catchment basin`);
    } else if (station.rainfallMmHr >= 40) {
      points += 12;
      factors.push(`Moderate-to-heavy rainfall (${station.rainfallMmHr} mm/hr)`);
    }

    // Factor 4: Drainage Capacity
    if (station.drainageCapacityPercent <= 20) {
      points += 18;
      factors.push(`Severe drainage bottleneck: Only ${station.drainageCapacityPercent}% capacity available`);
    } else if (station.drainageCapacityPercent <= 40) {
      points += 10;
      factors.push(`Drainage conduits under stress (${station.drainageCapacityPercent}% available)`);
    }

    // Determine Risk Classification
    let risk: WaterwayRiskLevel = 'low';
    if (points >= 65 || station.waterLevelM >= station.dangerThresholdM) {
      risk = 'critical';
    } else if (points >= 45 || station.waterLevelM >= station.warningThresholdM) {
      risk = 'high';
    } else if (points >= 22) {
      risk = 'moderate';
    } else {
      risk = 'low';
      if (factors.length === 0) {
        factors.push('Water level within nominal seasonal bounds', 'Hydrodynamic drainage operating efficiently');
      }
    }

    // Calculate AI Confidence Score (0-100%)
    let confidence = 96.0;
    if (station.sensorStatus === 'warning') confidence -= 4.5;
    if (station.sensorStatus === 'fault') confidence -= 28.0;
    if (station.sensorStatus === 'offline') confidence -= 45.0;
    if (station.signalRssi < -85) confidence -= 5.0;
    if (station.batteryPercent < 25) confidence -= 8.0;

    confidence = parseFloat(Math.max(30.0, Math.min(99.4, confidence + (Math.random() - 0.5) * 2)).toFixed(1));

    return { risk, confidence, factors };
  }

  // --- Dynamic Agentic Emergency Actions ---
  private syncActionsForRisk(station: WaterwayStation, risk: WaterwayRiskLevel): WaterwayEmergencyAction[] {
    const existing = station.recommendedActions || [];
    const pendingExisting = existing.filter((a: WaterwayEmergencyAction) => a.status === 'pending');

    if (risk === 'critical') {
      const hasSiren = pendingExisting.some((a: WaterwayEmergencyAction) => a.actionType === 'siren');
      const hasPump = pendingExisting.some((a: WaterwayEmergencyAction) => a.actionType === 'pump');

      const actions = [...existing];
      if (!hasSiren) {
        actions.unshift({
          id: `act-siren-${station.id}-${Date.now()}`,
          actionType: 'siren',
          title: `Activate Flood Warning Sirens at ${station.name}`,
          description: `Direct automated sirens to broadcast 90-second evacuation tone across downstream residential sectors.`,
          targetEntity: 'Emergency Operations Control Room',
          status: 'pending',
          timestamp: 'Just now',
          priority: 'critical'
        });
      }
      if (!hasPump) {
        actions.unshift({
          id: `act-pump-${station.id}-${Date.now()}`,
          actionType: 'pump',
          title: `Mobilize 5,000 GPM High-Flow Mobile Pumps to ${station.waterwayName}`,
          description: `Discharge trapped surface water over containment bunds into main channel.`,
          targetEntity: 'Municipal Disaster Rescue Wing',
          status: 'pending',
          timestamp: '1m ago',
          priority: 'critical'
        });
      }
      return actions.slice(0, 5);
    } else if (risk === 'high') {
      const hasInspection = pendingExisting.some((a: WaterwayEmergencyAction) => a.actionType === 'drain_inspection');
      const actions = [...existing];
      if (!hasInspection) {
        actions.unshift({
          id: `act-inspect-${station.id}-${Date.now()}`,
          actionType: 'drain_inspection',
          title: `Emergency Debris Clearing at ${station.waterwayName}`,
          description: `Inspect culvert choke point and clear floating vegetation to avoid backwater surge.`,
          targetEntity: 'Public Works Dept Ground Crew',
          status: 'pending',
          timestamp: 'Just now',
          priority: 'high'
        });
      }
      return actions.slice(0, 4);
    }

    return existing;
  }

  // --- Alert Evaluation ---
  private evaluateAlerts(station: WaterwayStation, risk: WaterwayRiskLevel) {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Danger Breach
    if (station.waterLevelM >= station.dangerThresholdM) {
      const exists = this.alerts.some(
        (a) => a.stationId === station.id && a.type === 'threshold_breach' && !a.acknowledged
      );
      if (!exists) {
        this.alerts.unshift({
          id: `alert-thresh-${station.id}-${Date.now()}`,
          stationId: station.id,
          stationName: station.name,
          cityId: station.cityId,
          cityName: station.cityName,
          type: 'threshold_breach',
          severity: 'emergency',
          message: `DANGER THRESHOLD BREACHED: ${station.name} reached ${station.waterLevelM.toFixed(2)}m (Danger: ${station.dangerThresholdM.toFixed(2)}m)`,
          timestamp: nowStr,
          acknowledged: false,
          waterLevelM: station.waterLevelM,
          rateOfRiseMPerHr: station.rateOfRiseMPerHr
        });
      }
    }

    // 2. Rapid Rate of Rise Alert
    if (station.rateOfRiseMPerHr >= 0.45) {
      const exists = this.alerts.some(
        (a) => a.stationId === station.id && a.type === 'rapid_rise' && !a.acknowledged
      );
      if (!exists) {
        this.alerts.unshift({
          id: `alert-rise-${station.id}-${Date.now()}`,
          stationId: station.id,
          stationName: station.name,
          cityId: station.cityId,
          cityName: station.cityName,
          type: 'rapid_rise',
          severity: 'severe',
          message: `RAPID WATER SURGE: ${station.name} rising at +${station.rateOfRiseMPerHr.toFixed(2)} m/hr! Flash flood risk high.`,
          timestamp: nowStr,
          acknowledged: false,
          rateOfRiseMPerHr: station.rateOfRiseMPerHr
        });
      }
    }

    // 3. Drainage Failure Alert
    if (station.drainageCapacityPercent <= 15) {
      const exists = this.alerts.some(
        (a) => a.stationId === station.id && a.type === 'drainage_failure' && !a.acknowledged
      );
      if (!exists) {
        this.alerts.unshift({
          id: `alert-drain-${station.id}-${Date.now()}`,
          stationId: station.id,
          stationName: station.name,
          cityId: station.cityId,
          cityName: station.cityName,
          type: 'drainage_failure',
          severity: 'warning',
          message: `DRAINAGE CHOKE: Outfall conduits at ${station.name} near total saturation (${station.drainageCapacityPercent}% capacity remaining).`,
          timestamp: nowStr,
          acknowledged: false
        });
      }
    }

    // Keep alert list capped
    if (this.alerts.length > 20) {
      this.alerts = this.alerts.slice(0, 20);
    }
  }

  // --- Public APIs for UI Components ---
  public getStations(): WaterwayStation[] {
    return this.stations;
  }

  public getStationById(id: string): WaterwayStation | undefined {
    return this.stations.find((s) => s.id === id);
  }

  public getAlerts(): WaterwayAlert[] {
    return this.alerts;
  }

  public getCurrentScenario(): WaterwayScenarioType {
    return this.currentScenario;
  }

  public isSimulatorRunning(): boolean {
    return this.isRunning;
  }

  public approveAction(stationId: string, actionId: string): boolean {
    const station = this.stations.find((s) => s.id === stationId);
    if (!station) return false;

    const action = station.recommendedActions.find((a: WaterwayEmergencyAction) => a.id === actionId);
    if (action) {
      action.status = 'approved';
      this.notifyListeners();
      return true;
    }
    return false;
  }

  public rejectAction(stationId: string, actionId: string): boolean {
    const station = this.stations.find((s) => s.id === stationId);
    if (!station) return false;

    const action = station.recommendedActions.find((a: WaterwayEmergencyAction) => a.id === actionId);
    if (action) {
      action.status = 'rejected';
      this.notifyListeners();
      return true;
    }
    return false;
  }

  public acknowledgeAlert(alertId: string) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.notifyListeners();
    }
  }

  public clearAllAlerts() {
    this.alerts = [];
    this.notifyListeners();
  }

  public triggerSurgeSpike() {
    // Instantly simulate sudden cloudburst surge across stations
    this.setScenario('cloudburst_spike');
  }

  public toggleAudioAlert(): boolean {
    this.audioAlertEnabled = !this.audioAlertEnabled;
    return this.audioAlertEnabled;
  }

  public isAudioAlertEnabled(): boolean {
    return this.audioAlertEnabled;
  }

  // --- Pub/Sub Subscriptions ---
  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.stations, this.alerts);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.stations, this.alerts);
      } catch {
        // Safe execution
      }
    });
  }
}

export const waterwaySimulator = new WaterwaySimulationService();
