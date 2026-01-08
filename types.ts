
export enum TravelMode {
  BIKE = 'Two Wheeler (Bike/Scooter)',
  CAR = 'Four Wheeler (Car/Jeep)',
  AUTO = 'Auto-Rickshaw',
  PUBLIC_TRANSPORT = 'Public Transport (Bus/Train)',
  WALKING = 'Walking/On Foot'
}

export enum TimeOfDay {
  EARLY_MORNING = 'Early Morning (4 AM - 7 AM)',
  DAYTIME = 'Daytime (7 AM - 6 PM)',
  EVENING = 'Evening (6 PM - 9 PM)',
  NIGHT = 'Night (9 PM - 12 AM)',
  LATE_NIGHT = 'Late Night (12 AM - 4 AM)'
}

export interface StaffLocation {
  latitude: number;
  longitude: number;
}

export interface SafetyChecklist {
  staffName: string;
  staffPhone: string;
  selfie?: string; // base64
  location?: StaffLocation;
  mode: TravelMode;
  distance: number;
  time: TimeOfDay;
  hasValidLicense: boolean;
  isWearingPPE: boolean;
  ppeDetails: string[];
  performedVehicleCheck: boolean;
  weatherCondition: string;
  isFatigued: boolean;
}

export interface SafetyVerdict {
  verdict: 'SAFE' | 'UNSAFE' | 'CAUTION';
  score: number;
  reasoning: string;
  riskFactors: string[];
  recommendations: string[];
}
