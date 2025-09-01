// Location module exports
export { default as LiveLocationScreen } from './components/LiveLocationScreen';
export { default as MapScreen } from './components/MapScreen';
export { default as Map } from './components/Map';

// Types
export interface LocationData {
  id: string;
  user_id: string;
  trip_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  activity: string;
  accuracy: number;
  altitude?: number;
  address?: string;
}

export interface LiveLocationData {
  currentLocation: LocationData & {
    address: string;
    accuracy: number;
    altitude: number;
  };
  student: {
    name: string;
    tripCode: string;
    group: string;
  };
  currentActivity: {
    name: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
  };
  liveStatus: {
    status: 'safe' | 'warning' | 'emergency';
    lastMovement: string;
    batteryLevel: number;
    signalStrength: number;
  };
  recentActivities: RecentActivity[];
  emergencyContacts: EmergencyContact[];
}

export interface RecentActivity {
  id: number;
  time: string;
  activity: string;
  location: string;
  status: 'completed' | 'in_progress' | 'pending';
  notes?: string;
}

export interface EmergencyContact {
  id: number;
  name: string;
  role: string;
  phone: string;
  available: boolean;
}