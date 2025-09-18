import * as TaskManager from 'expo-task-manager';
import { LocationService, ChildGeolocationResponse } from './locationService';

// Task name for background location fetching
const BACKGROUND_LOCATION_TASK = 'CHILD_LOCATION_TRACKING';

// Interface for location tracking state
export interface LocationTrackingState {
  isTracking: boolean;
  childId: string | null;
  lastUpdate: Date | null;
  error: string | null;
}

// Interface for location update callback
export interface LocationUpdateCallback {
  (location: ChildGeolocationResponse | null, error: string | null): void;
}

class BackgroundLocationService {
  private static instance: BackgroundLocationService;
  private trackingState: LocationTrackingState = {
    isTracking: false,
    childId: null,
    lastUpdate: null,
    error: null,
  };
  private updateCallback: LocationUpdateCallback | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  static getInstance(): BackgroundLocationService {
    if (!BackgroundLocationService.instance) {
      BackgroundLocationService.instance = new BackgroundLocationService();
    }
    return BackgroundLocationService.instance;
  }

  /**
   * Starts background location tracking for a specific child
   */
  async startTracking(childId: string, callback: LocationUpdateCallback): Promise<void> {
    try {
      if (this.trackingState.isTracking) {
        await this.stopTracking();
      }

      this.trackingState.childId = childId;
      this.trackingState.isTracking = true;
      this.trackingState.error = null;
      this.updateCallback = callback;

      // Start periodic location fetching every 20 seconds
      this.intervalId = setInterval(async () => {
        await this.fetchChildLocation();
      }, 20000);

      // Fetch initial location immediately
      await this.fetchChildLocation();

      console.log(`Background location tracking started for child: ${childId}`);
    } catch (error) {
      console.error('Error starting background location tracking:', error);
      this.trackingState.error = error instanceof Error ? error.message : 'Error desconocido';
      this.trackingState.isTracking = false;

      if (this.updateCallback) {
        this.updateCallback(null, this.trackingState.error);
      }
    }
  }

  /**
   * Stops background location tracking
   */
  async stopTracking(): Promise<void> {
    try {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }

      this.trackingState.isTracking = false;
      this.trackingState.childId = null;
      this.trackingState.error = null;
      this.updateCallback = null;

      console.log('Background location tracking stopped');
    } catch (error) {
      console.error('Error stopping background location tracking:', error);
    }
  }

  /**
   * Fetches child location from the API using real-time Redis endpoint
   */
  private async fetchChildLocation(): Promise<void> {
    if (!this.trackingState.childId || !this.trackingState.isTracking) {
      return;
    }

    try {
      const locationData = await LocationService.getRealTimeLocation(this.trackingState.childId);

      this.trackingState.lastUpdate = new Date();
      this.trackingState.error = null;

      if (this.updateCallback) {
        this.updateCallback(locationData, null);
      }

      console.log(`Location updated for child ${this.trackingState.childId}:`, {
        lat: locationData.data.geolocalizacion.latitud,
        lng: locationData.data.geolocalizacion.longitud,
        timestamp: locationData.data.geolocalizacion.timestamp,
        minutesAgo: locationData.data.geolocalizacion.minutes_ago
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al obtener ubicación';
      this.trackingState.error = errorMessage;

      console.error(`Error fetching location for child ${this.trackingState.childId}:`, error);

      if (this.updateCallback) {
        this.updateCallback(null, errorMessage);
      }
    }
  }

  /**
   * Gets current tracking state
   */
  getTrackingState(): LocationTrackingState {
    return { ...this.trackingState };
  }

  /**
   * Checks if tracking is active for a specific child
   */
  isTrackingChild(childId: string): boolean {
    return this.trackingState.isTracking && this.trackingState.childId === childId;
  }

  /**
   * Forces an immediate location update
   */
  async forceUpdate(): Promise<void> {
    if (this.trackingState.isTracking && this.trackingState.childId) {
      await this.fetchChildLocation();
    }
  }
}

// Define the background task for TaskManager (for future use with actual background execution)
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }

  // This task would be executed when the app is in background
  // For now, we're using the interval-based approach which works when app is active
  const service = BackgroundLocationService.getInstance();
  await service.forceUpdate();
});

export { BackgroundLocationService, BACKGROUND_LOCATION_TASK };
export default BackgroundLocationService;