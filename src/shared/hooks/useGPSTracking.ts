import { useState, useEffect, useCallback } from 'react';
import { gpsTrackingService, locationApiService } from '../services';
import { useAuth } from './useAuth';

export interface GPSTrackingState {
  isTracking: boolean;
  isInitializing: boolean;
  hasPermissions: boolean;
  currentLocation: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null;
  queueSize: number;
  lastUpdate: number | null;
  error: string | null;
}

export const useGPSTracking = () => {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<GPSTrackingState>({
    isTracking: false,
    isInitializing: false,
    hasPermissions: false,
    currentLocation: null,
    queueSize: 0,
    lastUpdate: null,
    error: null,
  });

  // Initialize tracking when child user logs in
  useEffect(() => {
    const initializeForChildUser = async () => {
      if (isAuthenticated && user?.role === 'student' && user.token) {
        // Set auth token for API calls
        locationApiService.setAuthToken(user.token);

        // Check if tracking should be started
        const trackingState = await gpsTrackingService.getTrackingState();

        if (!trackingState.isActive || trackingState.userId !== user.id) {
          // Start tracking for this child user
          await startTracking();
        } else {
          // Update state to reflect active tracking
          setState(prev => ({
            ...prev,
            isTracking: true,
            hasPermissions: true,
          }));

          // Update queue size
          updateQueueSize();
        }
      } else if (!isAuthenticated || user?.role !== 'student') {
        // Stop tracking if user is not a child or not authenticated
        await stopTracking();
        locationApiService.clearAuthToken();
      }
    };

    initializeForChildUser();
  }, [isAuthenticated, user]);

  // Update queue size periodically
  useEffect(() => {
    if (state.isTracking) {
      const interval = setInterval(updateQueueSize, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [state.isTracking]);

  const updateQueueSize = useCallback(async () => {
    try {
      const queueSize = await gpsTrackingService.getQueueSize();
      setState(prev => ({
        ...prev,
        queueSize,
      }));
    } catch (error) {
      console.error('Error updating queue size:', error);
    }
  }, []);

  const startTracking = useCallback(async (): Promise<boolean> => {
    if (!user || user.role !== 'student') {
      setState(prev => ({
        ...prev,
        error: 'GPS tracking is only available for child users',
      }));
      return false;
    }

    setState(prev => ({
      ...prev,
      isInitializing: true,
      error: null,
    }));

    try {
      const success = await gpsTrackingService.initializeTracking(user.id);

      if (success) {
        setState(prev => ({
          ...prev,
          isTracking: true,
          hasPermissions: true,
          isInitializing: false,
          lastUpdate: Date.now(),
        }));

        // Get initial location
        await updateCurrentLocation();

        console.log('GPS tracking started successfully');
        return true;
      } else {
        setState(prev => ({
          ...prev,
          isInitializing: false,
          hasPermissions: false,
          error: 'Failed to start GPS tracking. Please check permissions.',
        }));
        return false;
      }
    } catch (error) {
      console.error('Error starting GPS tracking:', error);
      setState(prev => ({
        ...prev,
        isInitializing: false,
        error: 'Error starting GPS tracking',
      }));
      return false;
    }
  }, [user]);

  const stopTracking = useCallback(async (): Promise<void> => {
    try {
      await gpsTrackingService.stopTracking();
      setState({
        isTracking: false,
        isInitializing: false,
        hasPermissions: false,
        currentLocation: null,
        queueSize: 0,
        lastUpdate: null,
        error: null,
      });
      console.log('GPS tracking stopped');
    } catch (error) {
      console.error('Error stopping GPS tracking:', error);
      setState(prev => ({
        ...prev,
        error: 'Error stopping GPS tracking',
      }));
    }
  }, []);

  const updateCurrentLocation = useCallback(async (): Promise<void> => {
    try {
      const location = await gpsTrackingService.getCurrentLocation();
      if (location) {
        setState(prev => ({
          ...prev,
          currentLocation: {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
          },
          lastUpdate: location.timestamp,
        }));
      }
    } catch (error) {
      console.error('Error updating current location:', error);
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  const getTrackingStatus = useCallback(() => {
    return {
      isActive: gpsTrackingService.getIsTracking(),
      userId: gpsTrackingService.getUserId(),
      hasPermissions: state.hasPermissions,
    };
  }, [state.hasPermissions]);

  const testApiConnection = useCallback(async (): Promise<boolean> => {
    try {
      return await locationApiService.testConnection();
    } catch (error) {
      console.error('Error testing API connection:', error);
      return false;
    }
  }, []);

  return {
    // State
    ...state,

    // Actions
    startTracking,
    stopTracking,
    updateCurrentLocation,
    clearError,

    // Utilities
    getTrackingStatus,
    testApiConnection,

    // Computed values
    canTrack: isAuthenticated && user?.role === 'student',
    isChildUser: user?.role === 'student',
  };
};