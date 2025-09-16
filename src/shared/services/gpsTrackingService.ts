import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { locationApiService } from './locationApiService';

const LOCATION_TASK_NAME = 'background-location-task';
const GPS_STORAGE_KEY = '@ViajesRoxana:gpsTracking';
const LOCATION_QUEUE_KEY = '@ViajesRoxana:locationQueue';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  speed?: number;
  timestamp: number;
  userId: string;
}

export interface QueuedLocationData extends LocationData {
  id: string;
  retryCount: number;
  createdAt: number;
}

class GPSTrackingService {
  private isTracking = false;
  private userId: string | null = null;
  private queueProcessingInterval: NodeJS.Timeout | null = null;

  async initializeTracking(userId: string): Promise<boolean> {
    try {
      console.log('🔧 GPS Service - initializeTracking called with userId:', userId);

      if (!userId) {
        console.error('🚫 GPS Service - No userId provided to initializeTracking');
        return false;
      }

      this.userId = userId;
      console.log('✅ GPS Service - userId set to:', this.userId);

      // Request permissions
      console.log('📱 GPS Service - Requesting foreground permissions...');
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      console.log('📱 Foreground permission status:', foregroundStatus);

      if (foregroundStatus !== 'granted') {
        console.error('🚫 Foreground location permission not granted');
        return false;
      }

      // Request background permissions for iOS and Android
      if (Platform.OS === 'android') {
        console.log('🤖 GPS Service - Requesting background permissions for Android...');
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        console.log('🤖 Background permission status:', backgroundStatus);

        if (backgroundStatus !== 'granted') {
          console.error('🚫 Background location permission not granted');
          return false;
        }
      }

      // Define background task
      TaskManager.defineTask(LOCATION_TASK_NAME, this.handleLocationUpdate);

      // Start location tracking
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 15000, // 15 seconds
        distanceInterval: 10, // 10 meters
        foregroundService: {
          notificationTitle: 'ViajesRoxana - Seguimiento activo',
          notificationBody: 'Seguimiento de ubicación para tu seguridad',
          notificationColor: '#e74c3c',
        },
        deferredUpdatesInterval: 15000,
        deferredUpdatesDistance: 10,
        pausesUpdatesAutomatically: false,
      });

      this.isTracking = true;
      await this.saveTrackingState(true);

      // Start queue processing
      this.startQueueProcessing();

      console.log('🚀 GPS tracking started successfully');
      console.log('📡 Background location updates every 15 seconds or 10 meters');
      console.log('🔧 Queue processing every 30 seconds');
      return true;
    } catch (error) {
      console.error('Error initializing GPS tracking:', error);
      return false;
    }
  }

  async stopTracking(): Promise<void> {
    try {
      if (this.isTracking) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        this.isTracking = false;
        this.userId = null;
        await this.saveTrackingState(false);

        // Stop queue processing
        this.stopQueueProcessing();

        console.log('GPS tracking stopped');
      }
    } catch (error) {
      console.error('Error stopping GPS tracking:', error);
    }
  }

  private handleLocationUpdate = async (body: any) => {
    try {
      const { locations, error } = body.data;

      if (error) {
        console.error('🚫 Background location update error:', error);
        return;
      }

      if (!this.userId) {
        console.error('🚫 No user ID available for background location update');
        return;
      }

      console.log(`🛰️ Background GPS received ${locations?.length || 0} location(s)`);

      for (const location of locations) {
        const locationData: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          altitude: location.coords.altitude,
          speed: location.coords.speed,
          timestamp: location.timestamp || Date.now(),
          userId: this.userId,
        };

        console.log('🌍 Background GPS Location:', {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          accuracy: locationData.accuracy ? `±${Math.round(locationData.accuracy)}m` : 'N/A',
          timestamp: new Date(locationData.timestamp).toLocaleString(),
        });

        // Try to send immediately
        const success = await locationApiService.sendLocation(locationData);

        if (!success) {
          // If failed, add to queue
          console.log('📦 Adding location to queue for later retry');
          await this.addToQueue(locationData);
        }
      }
    } catch (error) {
      console.error('❌ Error handling background location update:', error);
    }
  };

  private async addToQueue(locationData: LocationData): Promise<void> {
    try {
      const queuedLocation: QueuedLocationData = {
        ...locationData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        retryCount: 0,
        createdAt: Date.now(),
      };

      const queue = await this.getLocationQueue();
      queue.push(queuedLocation);

      // Keep only last 100 locations to prevent storage overflow
      if (queue.length > 100) {
        queue.splice(0, queue.length - 100);
      }

      await AsyncStorage.setItem(LOCATION_QUEUE_KEY, JSON.stringify(queue));
      console.log('Location added to queue:', queuedLocation.id);
    } catch (error) {
      console.error('Error adding location to queue:', error);
    }
  }

  private async getLocationQueue(): Promise<QueuedLocationData[]> {
    try {
      const queueJson = await AsyncStorage.getItem(LOCATION_QUEUE_KEY);
      return queueJson ? JSON.parse(queueJson) : [];
    } catch (error) {
      console.error('Error getting location queue:', error);
      return [];
    }
  }

  private startQueueProcessing(): void {
    if (this.queueProcessingInterval) {
      clearInterval(this.queueProcessingInterval);
    }

    this.queueProcessingInterval = setInterval(async () => {
      await this.processLocationQueue();
    }, 30000); // Process queue every 30 seconds
  }

  private stopQueueProcessing(): void {
    if (this.queueProcessingInterval) {
      clearInterval(this.queueProcessingInterval);
      this.queueProcessingInterval = null;
    }
  }

  private async processLocationQueue(): Promise<void> {
    try {
      const queue = await this.getLocationQueue();
      if (queue.length === 0) return;

      const processedIds: string[] = [];
      const maxRetries = 3;
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      for (const queuedLocation of queue) {
        // Remove old locations
        if (now - queuedLocation.createdAt > maxAge) {
          processedIds.push(queuedLocation.id);
          continue;
        }

        // Skip if too many retries
        if (queuedLocation.retryCount >= maxRetries) {
          processedIds.push(queuedLocation.id);
          continue;
        }

        // Try to send
        const success = await locationApiService.sendLocation(queuedLocation);

        if (success) {
          processedIds.push(queuedLocation.id);
          console.log('Successfully sent queued location:', queuedLocation.id);
        } else {
          // Increment retry count
          queuedLocation.retryCount++;
        }
      }

      // Remove processed locations from queue
      if (processedIds.length > 0) {
        const updatedQueue = queue.filter(item => !processedIds.includes(item.id));
        await AsyncStorage.setItem(LOCATION_QUEUE_KEY, JSON.stringify(updatedQueue));
        console.log(`Processed ${processedIds.length} queued locations`);
      }
    } catch (error) {
      console.error('Error processing location queue:', error);
    }
  }

  private async saveTrackingState(isActive: boolean): Promise<void> {
    try {
      const trackingData = {
        isActive,
        userId: this.userId,
        lastUpdated: Date.now(),
      };
      await AsyncStorage.setItem(GPS_STORAGE_KEY, JSON.stringify(trackingData));
    } catch (error) {
      console.error('Error saving tracking state:', error);
    }
  }

  async getTrackingState(): Promise<{ isActive: boolean; userId: string | null }> {
    try {
      const trackingJson = await AsyncStorage.getItem(GPS_STORAGE_KEY);
      if (trackingJson) {
        const trackingData = JSON.parse(trackingJson);
        return {
          isActive: trackingData.isActive || false,
          userId: trackingData.userId || null,
        };
      }
    } catch (error) {
      console.error('Error getting tracking state:', error);
    }
    return { isActive: false, userId: null };
  }

  async clearTrackingData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([GPS_STORAGE_KEY, LOCATION_QUEUE_KEY]);
    } catch (error) {
      console.error('Error clearing tracking data:', error);
    }
  }

  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      console.log('🔍 GPS Service - getCurrentLocation called');
      console.log('👤 GPS Service - Current userId:', this.userId);
      console.log('📊 GPS Service - Is tracking:', this.isTracking);

      if (!this.userId) {
        console.log('🚫 GPS Service - No user ID available for location tracking');
        console.log('🔍 GPS Service - Debugging userId state:', {
          userId: this.userId,
          typeOf: typeof this.userId,
          length: this.userId?.length || 'undefined'
        });
        return null;
      }

      // Use cached permissions status to avoid repeated permission checks
      console.log('📱 GPS Service - Checking permissions...');
      const { status } = await Location.getForegroundPermissionsAsync();
      console.log('📱 GPS Service - Permission status:', status);

      if (status !== 'granted') {
        console.log('🚫 GPS Service - Location permissions not granted');
        return null;
      }

      console.log('🔍 GPS Service - Getting current GPS location...');

      // Use balanced accuracy for better performance and battery life
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        maximumAge: 10000, // Accept location up to 10 seconds old
        timeout: 15000, // 15 second timeout
      });

      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        altitude: location.coords.altitude,
        speed: location.coords.speed,
        timestamp: location.timestamp || Date.now(),
        userId: this.userId,
      };

      console.log('✅ GPS Service - GPS location obtained successfully');
      console.log('📍 GPS Service - Location data:', {
        lat: locationData.latitude,
        lng: locationData.longitude,
        userId: locationData.userId
      });
      return locationData;
    } catch (error) {
      console.error('❌ GPS Service - Error getting current location:', error);
      return null;
    }
  }

  getIsTracking(): boolean {
    return this.isTracking;
  }

  getUserId(): string | null {
    return this.userId;
  }

  async getQueueSize(): Promise<number> {
    try {
      const queue = await this.getLocationQueue();
      return queue.length;
    } catch (error) {
      console.error('Error getting queue size:', error);
      return 0;
    }
  }
}

export const gpsTrackingService = new GPSTrackingService();