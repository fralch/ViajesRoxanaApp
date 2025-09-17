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
      console.log('🔄 Initializing GPS tracking for user:', {
        isAuthenticated,
        userRole: user?.role,
        userId: user?.id,
        hasToken: !!user?.token
      });

      if (isAuthenticated && user?.role === 'student' && user.token) {
        // Set auth token for API calls
        locationApiService.setAuthToken(user.token);

        // Check if tracking should be started
        const trackingState = await gpsTrackingService.getTrackingState();
        console.log('📊 Current tracking state:', trackingState);

        if (!trackingState.isActive || trackingState.userId !== user.dni) {
          // Start tracking for this child user
          console.log('🎯 Starting GPS tracking for child user');
          await startTracking();
        } else {
          // Update state to reflect active tracking
          console.log('✅ GPS tracking already active, updating state');
          setState(prev => ({
            ...prev,
            isTracking: true,
            hasPermissions: true,
          }));

          // Update queue size and location
          updateQueueSize();
          updateCurrentLocation();
        }
      } else if (!isAuthenticated || user?.role !== 'student') {
        // Stop tracking if user is not a child or not authenticated
        console.log('🛑 Stopping GPS tracking - user not child or not authenticated');
        await stopTracking();
        locationApiService.clearAuthToken();
      }
    };

    initializeForChildUser();
  }, [isAuthenticated, user]);

  const updateCurrentLocation = useCallback(async (): Promise<void> => {
    try {
      const location = await gpsTrackingService.getCurrentLocation();
      if (location) {
        console.log('📍 GPS Location Updated:', {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy ? `±${Math.round(location.accuracy)}m` : 'N/A',
          altitude: location.altitude ? `${Math.round(location.altitude)}m` : 'N/A',
          speed: location.speed ? `${Math.round(location.speed * 3.6)} km/h` : '0 km/h',
          timestamp: new Date(location.timestamp).toLocaleString(),
          userId: location.userId,
        });

        setState(prev => ({
          ...prev,
          currentLocation: {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
          },
          lastUpdate: location.timestamp,
        }));

        // Also trigger sending to API (which will show in console logs)
        await locationApiService.sendLocation(location);
      } else {
        console.log('⚠️ No location data available');
      }
    } catch (error) {
      console.error('❌ Error updating current location:', error);
      setState(prev => ({
        ...prev,
        error: 'Error getting location',
      }));
    }
  }, []);

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

  // Update queue size and location periodically
  useEffect(() => {
    if (state.isTracking) {
      console.log('⏰ Starting GPS update intervals - location every 20s, queue every 30s');

      const queueInterval = setInterval(updateQueueSize, 30000); // Every 30 seconds
      const locationInterval = setInterval(updateCurrentLocation, 20000); // Every 20 seconds

      // Get initial location immediately
      updateCurrentLocation();

      return () => {
        console.log('⏸️ Stopping GPS update intervals');
        clearInterval(queueInterval);
        clearInterval(locationInterval);
      };
    }
  }, [state.isTracking, updateQueueSize, updateCurrentLocation]);

  const startTracking = useCallback(async (): Promise<boolean> => {
    console.log('🎯 startTracking called with user:', {
      userId: user?.id,
      userRole: user?.role,
      userToken: user?.token ? 'present' : 'missing'
    });

    if (!user || user.role !== 'student') {
      console.log('🚫 GPS tracking denied - user not student:', {
        hasUser: !!user,
        userRole: user?.role
      });
      setState(prev => ({
        ...prev,
        error: 'GPS tracking is only available for child users',
      }));
      return false;
    }

    if (!user.dni) {
      console.log('🚫 GPS tracking denied - no user DNI');
      setState(prev => ({
        ...prev,
        error: 'No user DNI available for GPS tracking',
      }));
      return false;
    }

    setState(prev => ({
      ...prev,
      isInitializing: true,
      error: null,
    }));

    try {
      console.log('🔧 Initializing GPS tracking for user DNI:', user.dni);
      const success = await gpsTrackingService.initializeTracking(user.dni);

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

        console.log('🚀 GPS tracking started successfully from hook');
        console.log('⏰ Location updates every 20 seconds from hook');
        console.log('👤 Tracking for user DNI:', user.dni);
        return true;
      } else {
        console.log('❌ GPS tracking initialization failed');
        setState(prev => ({
          ...prev,
          isInitializing: false,
          hasPermissions: false,
          error: 'Failed to start GPS tracking. Please check permissions.',
        }));
        return false;
      }
    } catch (error) {
      console.error('❌ Error starting GPS tracking:', error);
      setState(prev => ({
        ...prev,
        isInitializing: false,
        error: 'Error starting GPS tracking',
      }));
      return false;
    }
  }, [user, updateCurrentLocation]);

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

  // Debug function to force GPS tracking with mock data
  const forceStartTrackingWithMockData = useCallback(async (): Promise<void> => {
    console.log('🧪 FORCE STARTING GPS TRACKING WITH MOCK DATA');

    const mockUserId = "71655501";

    try {
      // Force set the GPS service with mock data
      const success = await gpsTrackingService.initializeTracking(mockUserId);

      if (success) {
        setState(prev => ({
          ...prev,
          isTracking: true,
          hasPermissions: true,
          isInitializing: false,
          lastUpdate: Date.now(),
        }));

        console.log('🚀 Mock GPS tracking started');
        // Start the intervals immediately
        updateCurrentLocation();
      }
    } catch (error) {
      console.error('❌ Error starting mock GPS tracking:', error);
    }
  }, [updateCurrentLocation]);

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
    forceStartTrackingWithMockData,

    // Computed values
    canTrack: isAuthenticated && user?.role === 'student',
    isChildUser: user?.role === 'student',
  };
};