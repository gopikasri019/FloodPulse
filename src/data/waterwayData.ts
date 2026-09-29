import { WaterwayStation } from '../types';

export const INITIAL_WATERWAY_STATIONS: WaterwayStation[] = [
  // --- CHENNAI PREMIER AI CAMERA & SENSOR STATION ---
  {
    id: 'ST-009',
    stationCode: 'ST-009',
    name: 'Velachery Stormwater Canal & Outfall Gauge',
    waterwayName: 'Velachery Drainage Canal',
    cityId: 'chennai',
    cityName: 'Chennai',
    coordinates: [12.9790, 80.2215],
    waterLevelM: 2.10,
    warningThresholdM: 1.80,
    dangerThresholdM: 2.50,
    flowRateM3s: 4.2,
    rainfallMmHr: 86.0,
    drainageCapacityPercent: 34.0,
    rateOfRiseMPerHr: 0.28,
    sensorStatus: 'online',
    batteryPercent: 96,
    solarCharging: true,
    signalRssi: -58,
    protocol: 'CCTV-AI + LoRaWAN',
    lastUpdated: '5 seconds ago',
    currentRisk: 'high',
    confidenceScore: 91.7,
    contributingFactors: [
      'Rainfall intensity is high (86 mm/hr) over Velachery urban catchment',
      'Water level is rising rapidly (+0.28 m/hr) towards critical culvert crest',
      'Canal drainage capacity reduced to 34% due to downstream tidal resistance',
      'Computer-vision staff gauge detects 210cm water elevation (+0.30m over warning)'
    ],
    recommendedActions: [
      {
        id: 'act-st009-01',
        actionType: 'siren',
        title: 'Issue Automated Flood Warning Siren for Velachery South',
        description: 'Water level at 2.10m exceeding warning threshold (1.80m). Alert low-lying residents.',
        targetEntity: 'Greater Chennai Corporation SEOC',
        status: 'pending',
        timestamp: 'Just now',
        priority: 'high'
      },
      {
        id: 'act-st009-02',
        actionType: 'pump',
        title: 'Activate Automated Dewatering Pump Station #3',
        description: 'Deploy 4,000 GPM submersible pumps to relieve upstream culvert ponding.',
        targetEntity: 'GCC Stormwater Drain Division',
        status: 'pending',
        timestamp: '1m ago',
        priority: 'high'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 1.62, flowRateM3s: 2.8, rainfallMmHr: 24, drainageCapacityPercent: 78 },
      { timestamp: '12:15', waterLevelM: 1.74, flowRateM3s: 3.1, rainfallMmHr: 42, drainageCapacityPercent: 68 },
      { timestamp: '12:30', waterLevelM: 1.82, flowRateM3s: 3.5, rainfallMmHr: 62, drainageCapacityPercent: 55 },
      { timestamp: '12:45', waterLevelM: 1.91, flowRateM3s: 3.8, rainfallMmHr: 74, drainageCapacityPercent: 46 },
      { timestamp: '13:00', waterLevelM: 2.03, flowRateM3s: 4.0, rainfallMmHr: 82, drainageCapacityPercent: 39 },
      { timestamp: '13:15', waterLevelM: 2.10, flowRateM3s: 4.2, rainfallMmHr: 86, drainageCapacityPercent: 34 }
    ]
  },
  // --- CHENNAI STATIONS ---
  {
    id: 'stn-chn-ady-01',
    stationCode: 'STN-CHN-ADY-01',
    name: 'Adyar River Estuary Gauge',
    waterwayName: 'Adyar River',
    cityId: 'chennai',
    cityName: 'Chennai',
    coordinates: [13.0135, 80.2465], // Kotturpuram
    waterLevelM: 3.42,
    warningThresholdM: 3.20,
    dangerThresholdM: 4.50,
    flowRateM3s: 142.5,
    rainfallMmHr: 54.0,
    drainageCapacityPercent: 38.0,
    rateOfRiseMPerHr: 0.38,
    sensorStatus: 'warning',
    batteryPercent: 94,
    solarCharging: true,
    signalRssi: -68,
    protocol: 'LoRaWAN',
    lastUpdated: '10s ago',
    currentRisk: 'high',
    confidenceScore: 92.4,
    contributingFactors: [
      'Water level exceeds warning threshold (+0.22m over 3.20m)',
      'High rate of rise (+0.38 m/hr) indicates rapid basin runoff',
      'Downstream tidal backwater obstructing free gravity discharge',
      'Upriver surplus weir discharging 1,800 cusecs'
    ],
    recommendedActions: [
      {
        id: 'act-chn-ady-01',
        actionType: 'sluice',
        title: 'Open Adyar Estuary Sandbar Sluices',
        description: 'Breach coastal bar-mouth sediment plug to maximize gravitational discharge into Bay of Bengal.',
        targetEntity: 'Public Works Dept (PWD) Marine Wing',
        status: 'pending',
        timestamp: 'Just now',
        priority: 'high'
      },
      {
        id: 'act-chn-ady-02',
        actionType: 'pump',
        title: 'Deploy High-Volume Mobile Pumps to Kotturpuram',
        description: 'Position two 5,000 GPM trailer pumps at low-lying river bank drainage outfalls.',
        targetEntity: 'Greater Chennai Corporation (GCC)',
        status: 'pending',
        timestamp: '2m ago',
        priority: 'high'
      },
      {
        id: 'act-chn-ady-03',
        actionType: 'road_closure',
        title: 'Pre-Alert Kotturpuram High Road Underpass',
        description: 'Inundation risk high if river rises another 0.40m within 60 minutes.',
        targetEntity: 'Chennai Traffic Police',
        status: 'pending',
        timestamp: '5m ago',
        priority: 'moderate'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 2.10, flowRateM3s: 60, rainfallMmHr: 12, drainageCapacityPercent: 85 },
      { timestamp: '12:15', waterLevelM: 2.25, flowRateM3s: 72, rainfallMmHr: 22, drainageCapacityPercent: 78 },
      { timestamp: '12:30', waterLevelM: 2.48, flowRateM3s: 88, rainfallMmHr: 35, drainageCapacityPercent: 65 },
      { timestamp: '12:45', waterLevelM: 2.75, flowRateM3s: 104, rainfallMmHr: 48, drainageCapacityPercent: 52 },
      { timestamp: '13:00', waterLevelM: 3.10, flowRateM3s: 122, rainfallMmHr: 58, drainageCapacityPercent: 44 },
      { timestamp: '13:15', waterLevelM: 3.42, flowRateM3s: 142.5, rainfallMmHr: 54, drainageCapacityPercent: 38 }
    ]
  },
  {
    id: 'stn-chn-coo-02',
    stationCode: 'STN-CHN-COO-02',
    name: 'Cooum River Choolaimedu Weir',
    waterwayName: 'Cooum River',
    cityId: 'chennai',
    cityName: 'Chennai',
    coordinates: [13.0612, 80.2285], // Choolaimedu
    waterLevelM: 4.85,
    warningThresholdM: 3.80,
    dangerThresholdM: 4.60,
    flowRateM3s: 210.0,
    rainfallMmHr: 72.0,
    drainageCapacityPercent: 18.0,
    rateOfRiseMPerHr: 0.52,
    sensorStatus: 'warning',
    batteryPercent: 88,
    solarCharging: false,
    signalRssi: -74,
    protocol: 'NB-IoT',
    lastUpdated: '5s ago',
    currentRisk: 'critical',
    confidenceScore: 95.8,
    contributingFactors: [
      'CRITICAL DANGER: Water level (4.85m) exceeds danger threshold (4.60m)',
      'Severe rate of rise (+0.52 m/hr) during heavy precipitation',
      'Urban stormwater trunk line culverts severely chocked with debris',
      'Overtopping risk along low floodwall segments at Choolaimedu High Road'
    ],
    recommendedActions: [
      {
        id: 'act-chn-coo-01',
        actionType: 'siren',
        title: 'Activate Downstream Public Flood Warning Sirens',
        description: 'Sound automated siren alert for Wards 108 and 112 advising immediate upper-floor evacuation.',
        targetEntity: 'Disaster Management Authority SEOC',
        status: 'pending',
        timestamp: 'Just now',
        priority: 'critical'
      },
      {
        id: 'act-chn-coo-02',
        actionType: 'road_closure',
        title: 'Hard Barricade Choolaimedu Bridge & Subway',
        description: 'Direct traffic diversion to Poonamallee High Road to prevent trapped motorists.',
        targetEntity: 'Traffic Enforcement Sector 3',
        status: 'pending',
        timestamp: '1m ago',
        priority: 'critical'
      },
      {
        id: 'act-chn-coo-03',
        actionType: 'responder_notify',
        title: 'Scramble SDRF Rescue Boat Unit 4',
        description: 'Pre-position 2 inflatable motorized boats at Gill Nagar community grounds.',
        targetEntity: 'State Disaster Response Force',
        status: 'pending',
        timestamp: '3m ago',
        priority: 'critical'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 2.80, flowRateM3s: 90, rainfallMmHr: 20, drainageCapacityPercent: 70 },
      { timestamp: '12:15', waterLevelM: 3.15, flowRateM3s: 115, rainfallMmHr: 38, drainageCapacityPercent: 55 },
      { timestamp: '12:30', waterLevelM: 3.65, flowRateM3s: 145, rainfallMmHr: 55, drainageCapacityPercent: 40 },
      { timestamp: '12:45', waterLevelM: 4.10, flowRateM3s: 170, rainfallMmHr: 68, drainageCapacityPercent: 28 },
      { timestamp: '13:00', waterLevelM: 4.55, flowRateM3s: 195, rainfallMmHr: 75, drainageCapacityPercent: 22 },
      { timestamp: '13:15', waterLevelM: 4.85, flowRateM3s: 210, rainfallMmHr: 72, drainageCapacityPercent: 18 }
    ]
  },
  {
    id: 'stn-chn-buk-03',
    stationCode: 'STN-CHN-BUK-03',
    name: 'Buckingham Canal South Lock',
    waterwayName: 'Buckingham Canal',
    cityId: 'chennai',
    cityName: 'Chennai',
    coordinates: [12.9850, 80.2580], // Thiruvanmiyur
    waterLevelM: 2.15,
    warningThresholdM: 2.60,
    dangerThresholdM: 3.40,
    flowRateM3s: 48.0,
    rainfallMmHr: 32.0,
    drainageCapacityPercent: 62.0,
    rateOfRiseMPerHr: 0.14,
    sensorStatus: 'online',
    batteryPercent: 98,
    solarCharging: true,
    signalRssi: -62,
    protocol: 'LoRaWAN',
    lastUpdated: '12s ago',
    currentRisk: 'moderate',
    confidenceScore: 89.1,
    contributingFactors: [
      'Water level within safe operating margin (2.15m vs 2.60m warning)',
      'Moderate canal flow velocity; stormwater discharge steady',
      'No structural lock obstructions detected'
    ],
    recommendedActions: [
      {
        id: 'act-chn-buk-01',
        actionType: 'drain_inspection',
        title: 'Routine Trash Rack De-silting',
        description: 'Inspect floating garbage booms at Thiruvanmiyur bridge crossover.',
        targetEntity: 'Municipal Canal Maintenance',
        status: 'approved',
        timestamp: '15m ago',
        priority: 'moderate'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 1.60, flowRateM3s: 28, rainfallMmHr: 10, drainageCapacityPercent: 82 },
      { timestamp: '12:15', waterLevelM: 1.72, flowRateM3s: 32, rainfallMmHr: 18, drainageCapacityPercent: 78 },
      { timestamp: '12:30', waterLevelM: 1.85, flowRateM3s: 38, rainfallMmHr: 24, drainageCapacityPercent: 72 },
      { timestamp: '12:45', waterLevelM: 1.98, flowRateM3s: 42, rainfallMmHr: 28, drainageCapacityPercent: 68 },
      { timestamp: '13:00', waterLevelM: 2.08, flowRateM3s: 45, rainfallMmHr: 30, drainageCapacityPercent: 65 },
      { timestamp: '13:15', waterLevelM: 2.15, flowRateM3s: 48, rainfallMmHr: 32, drainageCapacityPercent: 62 }
    ]
  },
  {
    id: 'stn-chn-vel-04',
    stationCode: 'STN-CHN-VEL-04',
    name: 'Velachery Lake Inflow Sluice Culvert',
    waterwayName: 'Velachery Catchment Canal',
    cityId: 'chennai',
    cityName: 'Chennai',
    coordinates: [12.9780, 80.2220], // Velachery Lake
    waterLevelM: 3.85,
    warningThresholdM: 3.00,
    dangerThresholdM: 3.70,
    flowRateM3s: 96.0,
    rainfallMmHr: 68.0,
    drainageCapacityPercent: 24.0,
    rateOfRiseMPerHr: 0.44,
    sensorStatus: 'warning',
    batteryPercent: 91,
    solarCharging: false,
    signalRssi: -71,
    protocol: 'LoRaWAN',
    lastUpdated: '8s ago',
    currentRisk: 'critical',
    confidenceScore: 94.6,
    contributingFactors: [
      'Inundation depth exceeds culvert danger threshold (3.85m / 3.70m)',
      'Velachery residential catchment runoff exceeding hydraulic conduit diameter',
      'Surrounding residential streets report 0.6m standing water'
    ],
    recommendedActions: [
      {
        id: 'act-chn-vel-01',
        actionType: 'pump',
        title: 'Dispatch GCC Dewatering Team to Tansi Nagar',
        description: 'Deploy 4 trailer-mounted diesel dewatering suction units to prevent residential backflow.',
        targetEntity: 'GCC Zone 13 Engineering Wing',
        status: 'pending',
        timestamp: 'Just now',
        priority: 'critical'
      },
      {
        id: 'act-chn-vel-02',
        actionType: 'shelter_prep',
        title: 'Open Guru Nanak College Evacuation Shelter',
        description: 'Ready 400 cot capacity, food ration kits, and emergency medical station.',
        targetEntity: 'Disaster Relief Logistics Desk',
        status: 'pending',
        timestamp: '4m ago',
        priority: 'high'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 2.10, flowRateM3s: 40, rainfallMmHr: 22, drainageCapacityPercent: 75 },
      { timestamp: '12:15', waterLevelM: 2.45, flowRateM3s: 52, rainfallMmHr: 36, drainageCapacityPercent: 62 },
      { timestamp: '12:30', waterLevelM: 2.85, flowRateM3s: 68, rainfallMmHr: 50, drainageCapacityPercent: 48 },
      { timestamp: '12:45', waterLevelM: 3.25, flowRateM3s: 80, rainfallMmHr: 60, drainageCapacityPercent: 36 },
      { timestamp: '13:00', waterLevelM: 3.60, flowRateM3s: 90, rainfallMmHr: 66, drainageCapacityPercent: 28 },
      { timestamp: '13:15', waterLevelM: 3.85, flowRateM3s: 96, rainfallMmHr: 68, drainageCapacityPercent: 24 }
    ]
  },
  {
    id: 'stn-chn-otr-05',
    stationCode: 'STN-CHN-OTR-05',
    name: 'Otteri Nullah Outfall Hydro Gauge',
    waterwayName: 'Otteri Nullah',
    cityId: 'chennai',
    cityName: 'Chennai',
    coordinates: [13.0950, 80.2620], // Perambur / Basin Bridge
    waterLevelM: 2.88,
    warningThresholdM: 2.80,
    dangerThresholdM: 3.60,
    flowRateM3s: 78.0,
    rainfallMmHr: 46.0,
    drainageCapacityPercent: 45.0,
    rateOfRiseMPerHr: 0.28,
    sensorStatus: 'warning',
    batteryPercent: 86,
    solarCharging: true,
    signalRssi: -79,
    protocol: 'NB-IoT',
    lastUpdated: '14s ago',
    currentRisk: 'high',
    confidenceScore: 91.0,
    contributingFactors: [
      'Water level crossing warning threshold (2.88m vs 2.80m)',
      'Silt deposition reducing channel cross-sectional carrying capacity',
      'Continuous inflow from Vyasarpadi lowlands'
    ],
    recommendedActions: [
      {
        id: 'act-chn-otr-01',
        actionType: 'drain_inspection',
        title: 'Clear Debris at Basin Bridge Sluice',
        description: 'Remove floating vegetation and debris jam at railway culvert underpass.',
        targetEntity: 'PWD Zone 4',
        status: 'pending',
        timestamp: '6m ago',
        priority: 'high'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 1.80, flowRateM3s: 35, rainfallMmHr: 15, drainageCapacityPercent: 78 },
      { timestamp: '12:15', waterLevelM: 2.05, flowRateM3s: 44, rainfallMmHr: 26, drainageCapacityPercent: 68 },
      { timestamp: '12:30', waterLevelM: 2.30, flowRateM3s: 55, rainfallMmHr: 34, drainageCapacityPercent: 60 },
      { timestamp: '12:45', waterLevelM: 2.55, flowRateM3s: 66, rainfallMmHr: 40, drainageCapacityPercent: 52 },
      { timestamp: '13:00', waterLevelM: 2.74, flowRateM3s: 72, rainfallMmHr: 44, drainageCapacityPercent: 48 },
      { timestamp: '13:15', waterLevelM: 2.88, flowRateM3s: 78, rainfallMmHr: 46, drainageCapacityPercent: 45 }
    ]
  },

  // --- MUMBAI STATIONS ---
  {
    id: 'stn-mum-mit-01',
    stationCode: 'STN-MUM-MIT-01',
    name: 'Mithi River BKC Culvert Gauge',
    waterwayName: 'Mithi River',
    cityId: 'mumbai',
    cityName: 'Mumbai',
    coordinates: [19.0600, 72.8680], // BKC
    waterLevelM: 4.15,
    warningThresholdM: 3.50,
    dangerThresholdM: 4.20,
    flowRateM3s: 245.0,
    rainfallMmHr: 82.0,
    drainageCapacityPercent: 22.0,
    rateOfRiseMPerHr: 0.46,
    sensorStatus: 'warning',
    batteryPercent: 92,
    solarCharging: false,
    signalRssi: -72,
    protocol: 'LoRaWAN',
    lastUpdated: '4s ago',
    currentRisk: 'critical',
    confidenceScore: 96.1,
    contributingFactors: [
      'Approaching danger threshold (4.15m / 4.20m danger)',
      'High coastal spring tide (4.4m) coincides with cloudburst (82 mm/hr)',
      'Gravity outfall into Mahim Bay completely locked by tide',
      'Major arterial roads in BKC business district flooded up to 0.45m'
    ],
    recommendedActions: [
      {
        id: 'act-mum-mit-01',
        actionType: 'pump',
        title: 'Activate Cleveland Bunder & Love Grove Pumping Stations',
        description: 'Fire all 6 submersible flood discharge pumps at maximum RPM to force water over tide level.',
        targetEntity: 'BMC Stormwater Drainage Dept',
        status: 'pending',
        timestamp: 'Just now',
        priority: 'critical'
      },
      {
        id: 'act-mum-mit-02',
        actionType: 'road_closure',
        title: 'Halt Traffic on Western Express Highway Subway',
        description: 'Divert south-bound traffic to elevated connectors due to rapid underpass water rise.',
        targetEntity: 'Mumbai Traffic Police',
        status: 'pending',
        timestamp: '2m ago',
        priority: 'critical'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 2.20, flowRateM3s: 110, rainfallMmHr: 25, drainageCapacityPercent: 75 },
      { timestamp: '12:15', waterLevelM: 2.65, flowRateM3s: 145, rainfallMmHr: 45, drainageCapacityPercent: 60 },
      { timestamp: '12:30', waterLevelM: 3.15, flowRateM3s: 180, rainfallMmHr: 65, drainageCapacityPercent: 44 },
      { timestamp: '12:45', waterLevelM: 3.60, flowRateM3s: 210, rainfallMmHr: 76, drainageCapacityPercent: 32 },
      { timestamp: '13:00', waterLevelM: 3.92, flowRateM3s: 232, rainfallMmHr: 80, drainageCapacityPercent: 26 },
      { timestamp: '13:15', waterLevelM: 4.15, flowRateM3s: 245, rainfallMmHr: 82, drainageCapacityPercent: 22 }
    ]
  },
  {
    id: 'stn-mum-pow-02',
    stationCode: 'STN-MUM-POW-02',
    name: 'Powai Lake Spillway Inundation Gauge',
    waterwayName: 'Powai Lake Basin',
    cityId: 'mumbai',
    cityName: 'Mumbai',
    coordinates: [19.1250, 72.9050],
    waterLevelM: 2.65,
    warningThresholdM: 2.80,
    dangerThresholdM: 3.50,
    flowRateM3s: 85.0,
    rainfallMmHr: 58.0,
    drainageCapacityPercent: 58.0,
    rateOfRiseMPerHr: 0.22,
    sensorStatus: 'online',
    batteryPercent: 96,
    solarCharging: true,
    signalRssi: -65,
    protocol: 'NB-IoT',
    lastUpdated: '18s ago',
    currentRisk: 'moderate',
    confidenceScore: 90.5,
    contributingFactors: [
      'Water level within safe retention capacity (2.65m vs 2.80m warning)',
      'Lake surplus channel discharging steadily into Mithi upper basin',
      'IIT Bombay perimeter bunds stable'
    ],
    recommendedActions: [
      {
        id: 'act-mum-pow-01',
        actionType: 'drain_inspection',
        title: 'Check Spillway Weirs for Aquatic Hyacinth Clogging',
        description: 'Inspect mechanical screens at Powai surplus outfall.',
        targetEntity: 'Hydraulic Engineer Dept',
        status: 'approved',
        timestamp: '25m ago',
        priority: 'moderate'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 1.95, flowRateM3s: 45, rainfallMmHr: 22, drainageCapacityPercent: 78 },
      { timestamp: '12:15', waterLevelM: 2.10, flowRateM3s: 55, rainfallMmHr: 34, drainageCapacityPercent: 72 },
      { timestamp: '12:30', waterLevelM: 2.28, flowRateM3s: 66, rainfallMmHr: 44, drainageCapacityPercent: 66 },
      { timestamp: '12:45', waterLevelM: 2.44, flowRateM3s: 74, rainfallMmHr: 52, drainageCapacityPercent: 62 },
      { timestamp: '13:00', waterLevelM: 2.56, flowRateM3s: 80, rainfallMmHr: 56, drainageCapacityPercent: 60 },
      { timestamp: '13:15', waterLevelM: 2.65, flowRateM3s: 85, rainfallMmHr: 58, drainageCapacityPercent: 58 }
    ]
  },
  {
    id: 'stn-mum-poh-03',
    stationCode: 'STN-MUM-POH-03',
    name: 'Poisar River Inflow Weir Gauge',
    waterwayName: 'Poisar River',
    cityId: 'mumbai',
    cityName: 'Mumbai',
    coordinates: [19.2080, 72.8420], // Kandivali
    waterLevelM: 3.12,
    warningThresholdM: 2.90,
    dangerThresholdM: 3.80,
    flowRateM3s: 112.0,
    rainfallMmHr: 64.0,
    drainageCapacityPercent: 35.0,
    rateOfRiseMPerHr: 0.32,
    sensorStatus: 'warning',
    batteryPercent: 84,
    solarCharging: false,
    signalRssi: -77,
    protocol: 'LoRaWAN',
    lastUpdated: '9s ago',
    currentRisk: 'high',
    confidenceScore: 93.2,
    contributingFactors: [
      'Water level exceeds warning threshold (+0.22m over 2.90m)',
      'Suburban low-lying pockets along SV Road experiencing waterlogging',
      'High siltation in storm culvert choke points'
    ],
    recommendedActions: [
      {
        id: 'act-mum-poh-01',
        actionType: 'pump',
        title: 'Position Dewatering Pumps at Kandivali Subway',
        description: 'Deploy 2 high-capacity diesel pumps to maintain road transit.',
        targetEntity: 'BMC R-South Ward',
        status: 'pending',
        timestamp: '8m ago',
        priority: 'high'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 2.00, flowRateM3s: 50, rainfallMmHr: 20, drainageCapacityPercent: 72 },
      { timestamp: '12:15', waterLevelM: 2.28, flowRateM3s: 68, rainfallMmHr: 38, drainageCapacityPercent: 58 },
      { timestamp: '12:30', waterLevelM: 2.58, flowRateM3s: 84, rainfallMmHr: 50, drainageCapacityPercent: 48 },
      { timestamp: '12:45', waterLevelM: 2.82, flowRateM3s: 96, rainfallMmHr: 58, drainageCapacityPercent: 40 },
      { timestamp: '13:00', waterLevelM: 3.00, flowRateM3s: 105, rainfallMmHr: 62, drainageCapacityPercent: 37 },
      { timestamp: '13:15', waterLevelM: 3.12, flowRateM3s: 112, rainfallMmHr: 64, drainageCapacityPercent: 35 }
    ]
  },

  // --- BENGALURU STATIONS ---
  {
    id: 'stn-blr-vrb-01',
    stationCode: 'STN-BLR-VRB-01',
    name: 'Vrishabhavathi River Basin Station',
    waterwayName: 'Vrishabhavathi River',
    cityId: 'bengaluru',
    cityName: 'Bengaluru',
    coordinates: [12.9120, 77.5180], // RR Nagar
    waterLevelM: 3.75,
    warningThresholdM: 3.20,
    dangerThresholdM: 4.20,
    flowRateM3s: 168.0,
    rainfallMmHr: 62.0,
    drainageCapacityPercent: 32.0,
    rateOfRiseMPerHr: 0.36,
    sensorStatus: 'warning',
    batteryPercent: 91,
    solarCharging: true,
    signalRssi: -70,
    protocol: 'LoRaWAN',
    lastUpdated: '11s ago',
    currentRisk: 'high',
    confidenceScore: 92.8,
    contributingFactors: [
      'Rapid inflow from western catchment storm canals',
      'Water level elevated at 3.75m (warning: 3.20m)',
      'Submergence risk for low-lying commercial godowns along Mysore Road'
    ],
    recommendedActions: [
      {
        id: 'act-blr-vrb-01',
        actionType: 'sluice',
        title: 'Regulate Vrishabhavathi Secondary Sluice Gates',
        description: 'Adjust hydraulic crest level to divert peak discharge towards agricultural balancing reservoir.',
        targetEntity: 'BWSSB Hydro Unit',
        status: 'pending',
        timestamp: '3m ago',
        priority: 'high'
      },
      {
        id: 'act-blr-vrb-02',
        actionType: 'road_closure',
        title: 'Barricade Mysore Road Underpass',
        description: 'Water accumulation reaches 0.38m; dangerous for two-wheelers and sedans.',
        targetEntity: 'Bengaluru City Traffic Police',
        status: 'pending',
        timestamp: '7m ago',
        priority: 'high'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 2.10, flowRateM3s: 70, rainfallMmHr: 18, drainageCapacityPercent: 78 },
      { timestamp: '12:15', waterLevelM: 2.45, flowRateM3s: 92, rainfallMmHr: 32, drainageCapacityPercent: 65 },
      { timestamp: '12:30', waterLevelM: 2.88, flowRateM3s: 118, rainfallMmHr: 46, drainageCapacityPercent: 52 },
      { timestamp: '12:45', waterLevelM: 3.25, flowRateM3s: 140, rainfallMmHr: 54, drainageCapacityPercent: 42 },
      { timestamp: '13:00', waterLevelM: 3.55, flowRateM3s: 158, rainfallMmHr: 60, drainageCapacityPercent: 36 },
      { timestamp: '13:15', waterLevelM: 3.75, flowRateM3s: 168, rainfallMmHr: 62, drainageCapacityPercent: 32 }
    ]
  },
  {
    id: 'stn-blr-bel-02',
    stationCode: 'STN-BLR-BEL-02',
    name: 'Bellandur Lake Outflow Spillway',
    waterwayName: 'Koramangala-Challaghatta Valley',
    cityId: 'bengaluru',
    cityName: 'Bengaluru',
    coordinates: [12.9350, 77.6650], // Bellandur
    waterLevelM: 4.10,
    warningThresholdM: 3.40,
    dangerThresholdM: 4.00,
    flowRateM3s: 195.0,
    rainfallMmHr: 70.0,
    drainageCapacityPercent: 20.0,
    rateOfRiseMPerHr: 0.42,
    sensorStatus: 'warning',
    batteryPercent: 89,
    solarCharging: false,
    signalRssi: -73,
    protocol: 'NB-IoT',
    lastUpdated: '6s ago',
    currentRisk: 'critical',
    confidenceScore: 95.2,
    contributingFactors: [
      'CRITICAL: Water level (4.10m) breached lake danger threshold (4.00m)',
      'Severe stormwater pressure from Koramangala primary storm canal',
      'Risk of foam overflow and inundation along Outer Ring Road (ORR) tech corridor'
    ],
    recommendedActions: [
      {
        id: 'act-blr-bel-01',
        actionType: 'seoc_alert',
        title: 'Issue High Alert for ORR Tech Corridor IT Campuses',
        description: 'Advise work-from-home or phased employee departure to avoid gridlock and basement flooding.',
        targetEntity: 'BBMP Disaster Management Cell',
        status: 'pending',
        timestamp: 'Just now',
        priority: 'critical'
      },
      {
        id: 'act-blr-bel-02',
        actionType: 'pump',
        title: 'Deploy High-Volume Dewatering Pumps to Ecospace Subway',
        description: 'Protect main power transformer substations from basement inundation.',
        targetEntity: 'State Fire & Emergency Services',
        status: 'pending',
        timestamp: '2m ago',
        priority: 'critical'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 2.30, flowRateM3s: 85, rainfallMmHr: 22, drainageCapacityPercent: 74 },
      { timestamp: '12:15', waterLevelM: 2.70, flowRateM3s: 112, rainfallMmHr: 38, drainageCapacityPercent: 58 },
      { timestamp: '12:30', waterLevelM: 3.15, flowRateM3s: 142, rainfallMmHr: 52, drainageCapacityPercent: 44 },
      { timestamp: '12:45', waterLevelM: 3.58, flowRateM3s: 168, rainfallMmHr: 64, drainageCapacityPercent: 32 },
      { timestamp: '13:00', waterLevelM: 3.90, flowRateM3s: 184, rainfallMmHr: 68, drainageCapacityPercent: 24 },
      { timestamp: '13:15', waterLevelM: 4.10, flowRateM3s: 195, rainfallMmHr: 70, drainageCapacityPercent: 20 }
    ]
  },
  {
    id: 'stn-blr-heb-04',
    stationCode: 'STN-BLR-HEB-04',
    name: 'Hebbal Valley Stormwater Main Trunk',
    waterwayName: 'Hebbal Valley Canal',
    cityId: 'bengaluru',
    cityName: 'Bengaluru',
    coordinates: [13.0380, 77.5920], // Hebbal
    waterLevelM: 2.35,
    warningThresholdM: 2.80,
    dangerThresholdM: 3.60,
    flowRateM3s: 64.0,
    rainfallMmHr: 38.0,
    drainageCapacityPercent: 65.0,
    rateOfRiseMPerHr: 0.16,
    sensorStatus: 'online',
    batteryPercent: 97,
    solarCharging: true,
    signalRssi: -66,
    protocol: 'LoRaWAN',
    lastUpdated: '22s ago',
    currentRisk: 'moderate',
    confidenceScore: 88.5,
    contributingFactors: [
      'Normal flow retention across Hebbal lake catchment',
      'No critical blockage at airport flyover drainage outfalls'
    ],
    recommendedActions: [
      {
        id: 'act-blr-heb-01',
        actionType: 'drain_inspection',
        title: 'Monitor Airport Highway Storm Interceptors',
        description: 'Ensure smooth drainage discharge along Bellary Road.',
        targetEntity: 'NHAI Regional Unit',
        status: 'approved',
        timestamp: '30m ago',
        priority: 'moderate'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 1.70, flowRateM3s: 38, rainfallMmHr: 12, drainageCapacityPercent: 82 },
      { timestamp: '12:15', waterLevelM: 1.88, flowRateM3s: 45, rainfallMmHr: 20, drainageCapacityPercent: 76 },
      { timestamp: '12:30', waterLevelM: 2.05, flowRateM3s: 52, rainfallMmHr: 28, drainageCapacityPercent: 71 },
      { timestamp: '12:45', waterLevelM: 2.18, flowRateM3s: 58, rainfallMmHr: 34, drainageCapacityPercent: 68 },
      { timestamp: '13:00', waterLevelM: 2.28, flowRateM3s: 61, rainfallMmHr: 36, drainageCapacityPercent: 66 },
      { timestamp: '13:15', waterLevelM: 2.35, flowRateM3s: 64, rainfallMmHr: 38, drainageCapacityPercent: 65 }
    ]
  },

  // --- HYDERABAD STATIONS ---
  {
    id: 'stn-hyd-mus-01',
    stationCode: 'STN-HYD-MUS-01',
    name: 'Musi River Puranapul Historic Weir',
    waterwayName: 'Musi River',
    cityId: 'hyderabad',
    cityName: 'Hyderabad',
    coordinates: [17.3680, 78.4620], // Puranapul
    waterLevelM: 4.35,
    warningThresholdM: 3.60,
    dangerThresholdM: 4.50,
    flowRateM3s: 280.0,
    rainfallMmHr: 76.0,
    drainageCapacityPercent: 28.0,
    rateOfRiseMPerHr: 0.40,
    sensorStatus: 'warning',
    batteryPercent: 93,
    solarCharging: true,
    signalRssi: -69,
    protocol: 'LoRaWAN',
    lastUpdated: '7s ago',
    currentRisk: 'high',
    confidenceScore: 93.8,
    contributingFactors: [
      'Water level (4.35m) approaching danger threshold (4.50m)',
      'Heavy upstream discharge from Himayat Sagar and Osman Sagar reservoirs',
      'Low causeway bridges across Chaderghat and Moosarambagh submerged'
    ],
    recommendedActions: [
      {
        id: 'act-hyd-mus-01',
        actionType: 'road_closure',
        title: 'Close Moosarambagh & Chaderghat Causeways',
        description: 'Direct vehicular traffic to high-level elevated bridges.',
        targetEntity: 'Hyderabad Traffic Police',
        status: 'pending',
        timestamp: 'Just now',
        priority: 'high'
      },
      {
        id: 'act-hyd-mus-02',
        actionType: 'siren',
        title: 'Sound Evacuation Siren for Musi Riverfront Wards',
        description: 'Alert settlements along riverbank to relocate to GHMC relief centers.',
        targetEntity: 'GHMC Disaster Response Force (DRF)',
        status: 'pending',
        timestamp: '4m ago',
        priority: 'high'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 2.50, flowRateM3s: 120, rainfallMmHr: 25, drainageCapacityPercent: 70 },
      { timestamp: '12:15', waterLevelM: 2.95, flowRateM3s: 160, rainfallMmHr: 42, drainageCapacityPercent: 55 },
      { timestamp: '12:30', waterLevelM: 3.45, flowRateM3s: 205, rainfallMmHr: 58, drainageCapacityPercent: 44 },
      { timestamp: '12:45', waterLevelM: 3.88, flowRateM3s: 242, rainfallMmHr: 68, drainageCapacityPercent: 35 },
      { timestamp: '13:00', waterLevelM: 4.15, flowRateM3s: 265, rainfallMmHr: 72, drainageCapacityPercent: 30 },
      { timestamp: '13:15', waterLevelM: 4.35, flowRateM3s: 280, rainfallMmHr: 76, drainageCapacityPercent: 28 }
    ]
  },
  {
    id: 'stn-hyd-hus-02',
    stationCode: 'STN-HYD-HUS-02',
    name: 'Hussain Sagar Surplus Weir & Buddha Gate',
    waterwayName: 'Hussain Sagar Surplus Nullah',
    cityId: 'hyderabad',
    cityName: 'Hyderabad',
    coordinates: [17.4230, 78.4740], // Tank Bund
    waterLevelM: 3.05,
    warningThresholdM: 3.10,
    dangerThresholdM: 3.80,
    flowRateM3s: 110.0,
    rainfallMmHr: 48.0,
    drainageCapacityPercent: 48.0,
    rateOfRiseMPerHr: 0.20,
    sensorStatus: 'online',
    batteryPercent: 95,
    solarCharging: true,
    signalRssi: -64,
    protocol: 'NB-IoT',
    lastUpdated: '16s ago',
    currentRisk: 'moderate',
    confidenceScore: 91.2,
    contributingFactors: [
      'Lake surplus weir operating within safe hydrodynamic discharge envelope',
      'Downstream storm nullah flowing steadily towards Musi'
    ],
    recommendedActions: [
      {
        id: 'act-hyd-hus-01',
        actionType: 'sluice',
        title: 'Monitor Surplus Vent Gates',
        description: 'Maintain 4 sluice vents partially open to prevent Tank Bund level surge.',
        targetEntity: 'Irrigation & CAD Dept',
        status: 'approved',
        timestamp: '18m ago',
        priority: 'moderate'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 2.10, flowRateM3s: 60, rainfallMmHr: 16, drainageCapacityPercent: 75 },
      { timestamp: '12:15', waterLevelM: 2.35, flowRateM3s: 74, rainfallMmHr: 28, drainageCapacityPercent: 66 },
      { timestamp: '12:30', waterLevelM: 2.62, flowRateM3s: 88, rainfallMmHr: 36, drainageCapacityPercent: 58 },
      { timestamp: '12:45', waterLevelM: 2.84, flowRateM3s: 98, rainfallMmHr: 42, drainageCapacityPercent: 53 },
      { timestamp: '13:00', waterLevelM: 2.98, flowRateM3s: 105, rainfallMmHr: 46, drainageCapacityPercent: 50 },
      { timestamp: '13:15', waterLevelM: 3.05, flowRateM3s: 110, rainfallMmHr: 48, drainageCapacityPercent: 48 }
    ]
  },

  // --- GUWAHATI STATIONS ---
  {
    id: 'stn-ghy-brh-01',
    stationCode: 'STN-GHY-BRH-01',
    name: 'Brahmaputra River Pandu Port Hydro Gauge',
    waterwayName: 'Brahmaputra River',
    cityId: 'guwahati',
    cityName: 'Guwahati',
    coordinates: [26.1750, 91.6850], // Pandu Ghat
    waterLevelM: 50.15,
    warningThresholdM: 49.68,
    dangerThresholdM: 50.50,
    flowRateM3s: 18200.0,
    rainfallMmHr: 68.0,
    drainageCapacityPercent: 25.0,
    rateOfRiseMPerHr: 0.12,
    sensorStatus: 'warning',
    batteryPercent: 90,
    solarCharging: true,
    signalRssi: -75,
    protocol: 'SatCom',
    lastUpdated: '15s ago',
    currentRisk: 'high',
    confidenceScore: 94.7,
    contributingFactors: [
      'River level (50.15m MSL) well above Warning Level (49.68m MSL)',
      'Severe monsoon runoff from Upper Assam and Arunachal foothills',
      'Backwater pressure choking urban drainage sluice gates across Bharalu river'
    ],
    recommendedActions: [
      {
        id: 'act-ghy-brh-01',
        actionType: 'sluice',
        title: 'Operate Bharalu Sluice Anti-Backflow Gates',
        description: 'Close river gates to prevent Brahmaputra backwater inundation into downtown Guwahati.',
        targetEntity: 'Assam Water Resources Dept',
        status: 'pending',
        timestamp: 'Just now',
        priority: 'high'
      },
      {
        id: 'act-ghy-brh-02',
        actionType: 'responder_notify',
        title: 'Alert NDRF 1st Battalion at Patgaon',
        description: 'Pre-deploy 6 rescue boat squads along riverbank vulnerable settlements.',
        targetEntity: 'National Disaster Response Force (NDRF)',
        status: 'pending',
        timestamp: '5m ago',
        priority: 'high'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 49.30, flowRateM3s: 15400, rainfallMmHr: 30, drainageCapacityPercent: 60 },
      { timestamp: '12:15', waterLevelM: 49.52, flowRateM3s: 16100, rainfallMmHr: 44, drainageCapacityPercent: 50 },
      { timestamp: '12:30', waterLevelM: 49.75, flowRateM3s: 16900, rainfallMmHr: 54, drainageCapacityPercent: 40 },
      { timestamp: '12:45', waterLevelM: 49.92, flowRateM3s: 17400, rainfallMmHr: 60, drainageCapacityPercent: 32 },
      { timestamp: '13:00', waterLevelM: 50.05, flowRateM3s: 17850, rainfallMmHr: 65, drainageCapacityPercent: 28 },
      { timestamp: '13:15', waterLevelM: 50.15, flowRateM3s: 18200, rainfallMmHr: 68, drainageCapacityPercent: 25 }
    ]
  },
  {
    id: 'stn-ghy-bha-02',
    stationCode: 'STN-GHY-BHA-02',
    name: 'Bharalu River Inundation Sluice Gauge',
    waterwayName: 'Bharalu River Basin',
    cityId: 'guwahati',
    cityName: 'Guwahati',
    coordinates: [26.1620, 91.7350], // Athgaon
    waterLevelM: 4.60,
    warningThresholdM: 3.80,
    dangerThresholdM: 4.40,
    flowRateM3s: 92.0,
    rainfallMmHr: 74.0,
    drainageCapacityPercent: 15.0,
    rateOfRiseMPerHr: 0.48,
    sensorStatus: 'warning',
    batteryPercent: 87,
    solarCharging: false,
    signalRssi: -78,
    protocol: 'LoRaWAN',
    lastUpdated: '3s ago',
    currentRisk: 'critical',
    confidenceScore: 96.5,
    contributingFactors: [
      'CRITICAL DANGER: Water level (4.60m) surpasses danger mark (4.40m)',
      'Severe backflow pressure from high Brahmaputra level',
      'Athgaon and Anil Nagar commercial areas experiencing 0.75m flash flooding'
    ],
    recommendedActions: [
      {
        id: 'act-ghy-bha-01',
        actionType: 'pump',
        title: 'Run Heavy Duty Dewatering Pumps at Bharalu Mouth',
        description: 'Activate all 8 high-discharge pumps to lift inland stormwater over river floodwall.',
        targetEntity: 'Guwahati Municipal Corporation (GMC)',
        status: 'pending',
        timestamp: 'Just now',
        priority: 'critical'
      },
      {
        id: 'act-ghy-bha-02',
        actionType: 'siren',
        title: 'Evacuate Anil Nagar Low-Lying Residents',
        description: 'Deploy SDRF rubber dinghies to assist stranded ground-floor families.',
        targetEntity: 'Assam SDRF',
        status: 'pending',
        timestamp: '2m ago',
        priority: 'critical'
      }
    ],
    telemetryHistory: [
      { timestamp: '12:00', waterLevelM: 2.80, flowRateM3s: 42, rainfallMmHr: 25, drainageCapacityPercent: 70 },
      { timestamp: '12:15', waterLevelM: 3.25, flowRateM3s: 58, rainfallMmHr: 45, drainageCapacityPercent: 50 },
      { timestamp: '12:30', waterLevelM: 3.75, flowRateM3s: 72, rainfallMmHr: 60, drainageCapacityPercent: 35 },
      { timestamp: '12:45', waterLevelM: 4.15, flowRateM3s: 82, rainfallMmHr: 68, drainageCapacityPercent: 24 },
      { timestamp: '13:00', waterLevelM: 4.42, flowRateM3s: 88, rainfallMmHr: 72, drainageCapacityPercent: 18 },
      { timestamp: '13:15', waterLevelM: 4.60, flowRateM3s: 92, rainfallMmHr: 74, drainageCapacityPercent: 15 }
    ]
  }
];
