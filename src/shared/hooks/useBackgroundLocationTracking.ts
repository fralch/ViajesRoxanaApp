import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { BackgroundLocationService, LocationTrackingState } from '../services/backgroundLocationService';
import { ChildGeolocationResponse } from '../services/locationService';

interface UseBackgroundLocationTrackingResult {
  // State
  isTracking: boolean;
  currentLocation: ChildGeolocationResponse | null;
  error: string | null;
  lastUpdate: Date | null;

  // Actions
  startTracking: (childId: string) => Promise<void>;
  stopTracking: () => Promise<void>;
  forceUpdate: () => Promise<void>;

  // Helpers
  isTrackingChild: (childId: string) => boolean;
}

export const useBackgroundLocationTracking = (): UseBackgroundLocationTrackingResult => {
  const [trackingState, setTrackingState] = useState<LocationTrackingState>({
    isTracking: false,
    childId: null,
    lastUpdate: null,
    error: null,
  });

  const [currentLocation, setCurrentLocation] = useState<ChildGeolocationResponse | null>(null);
  const serviceRef = useRef(BackgroundLocationService.getInstance());
  const appStateRef = useRef(AppState.currentState);

  // Handle location updates from the background service
  const handleLocationUpdate = useCallback((
    location: ChildGeolocationResponse | null,
    error: string | null
  ) => {
    setCurrentLocation(location);
    setTrackingState(prev => ({
      ...prev,
      error,
      lastUpdate: location ? new Date() : prev.lastUpdate,
    }));
  }, []);

  // Start tracking function
  const startTracking = useCallback(async (childId: string) => {
    try {
      await serviceRef.current.startTracking(childId, handleLocationUpdate);
      setTrackingState(serviceRef.current.getTrackingState());
    } catch (error) {
      console.error('Error starting location tracking:', error);
      setTrackingState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al iniciar seguimiento',
      }));
    }
  }, [handleLocationUpdate]);

  // Stop tracking function
  const stopTracking = useCallback(async () => {
    try {
      await serviceRef.current.stopTracking();
      setTrackingState(serviceRef.current.getTrackingState());
      setCurrentLocation(null);
    } catch (error) {
      console.error('Error stopping location tracking:', error);
    }
  }, []);

  // Force update function
  const forceUpdate = useCallback(async () => {
    try {
      await serviceRef.current.forceUpdate();
    } catch (error) {
      console.error('Error forcing location update:', error);
    }
  }, []);

  // Check if tracking specific child
  const isTrackingChild = useCallback((childId: string) => {
    return serviceRef.current.isTrackingChild(childId);
  }, []);

  // Handle app state changes to manage tracking lifecycle
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const previousAppState = appStateRef.current;
      appStateRef.current = nextAppState;

      // When app comes to foreground, sync the state
      if (previousAppState.match(/inactive|background/) && nextAppState === 'active') {
        setTrackingState(serviceRef.current.getTrackingState());

        // Force an update when app becomes active
        if (serviceRef.current.getTrackingState().isTracking) {
          forceUpdate();
        }
      }

      // When app goes to background, we could implement background task registration here
      if (previousAppState === 'active' && nextAppState.match(/inactive|background/)) {
        // The tracking will continue via the interval while app is backgrounded briefly
        // For true background execution, you'd register the TaskManager task here
        console.log('App going to background, location tracking continues...');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription?.remove();
  }, [forceUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't automatically stop tracking on unmount - let the user control it
      // This allows tracking to persist across screen changes
    };
  }, []);

  // Sync state periodically
  useEffect(() => {
    const syncInterval = setInterval(() => {
      const currentState = serviceRef.current.getTrackingState();
      setTrackingState(currentState);
    }, 5000); // Sync every 5 seconds

    return () => clearInterval(syncInterval);
  }, []);

  return {
    // State
    isTracking: trackingState.isTracking,
    currentLocation,
    error: trackingState.error,
    lastUpdate: trackingState.lastUpdate,

    // Actions
    startTracking,
    stopTracking,
    forceUpdate,

    // Helpers
    isTrackingChild,
  };
};