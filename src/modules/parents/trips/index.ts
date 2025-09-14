// Trips module exports
export { default as TripsListScreen } from './components/TripsListScreen';
export { default as TripDetailsScreen } from './components/TripDetailsScreen';

// Types
export interface Trip {
  id: number;
  tripCode: string;
  destination: string;
  group: string;
  responsible: string;
  phone: string;
  dates: string;
  code: string;
  status: 'active' | 'upcoming' | 'completed';
  category: 'current' | 'past';
  progress: number;
  image: string;
  participants: number;
  nextActivity?: string;
  description?: string;
  itinerary?: TripDay[];
  documents?: TripDocument[];
  photos?: TripMedia[];
  recommendations?: TripRecommendations;
}

export interface TripDay {
  day: number;
  date: string;
  activities: TripActivity[];
}

export interface TripActivity {
  time: string;
  activity: string;
  location: string;
}

export interface TripDocument {
  type: string;
  name: string;
  available: boolean;
}

export interface TripMedia {
  id: number;
  type: 'image' | 'video';
  url: string;
  caption: string;
}

export interface TripRecommendations {
  general: string[];
  clothing: string[];
  health: string[];
  documentation: string[];
}