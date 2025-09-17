import axios, { AxiosInstance, AxiosError } from 'axios';
import { LocationData } from './gpsTrackingService';

const API_BASE_URL = 'https://grupoviajesroxana.com';
const LOCATION_ENDPOINT = '/api/v1/endpoint/geolocalizacion';
const REQUEST_TIMEOUT = 10000; // 10 seconds

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LocationPayload {
  hijo_id: string;
  latitud: number;
  longitud: number;
}

class LocationApiService {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': 'viajesroxana-session=Y9V2zamYDmo7wPM5tgxg93dfGj3P1XfuyfvEkExD'
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = null;
  }

  async sendLocation(locationData: LocationData): Promise<boolean> {
    try {
      const payload: LocationPayload = {
        hijo_id: locationData.userId,
        latitud: locationData.latitude,
        longitud: locationData.longitude,
      };

      console.log('🌍 Sending GPS Coordinates to API:', {
        hijo_id: payload.hijo_id,
        latitud: payload.latitud,
        longitud: payload.longitud,
        timestamp: new Date(locationData.timestamp).toLocaleString(),
      });

      const response = await this.client.post<ApiResponse<any>>(
        LOCATION_ENDPOINT,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        console.log('✅ Location sent successfully:', locationData.timestamp);
        return true;
      } else {
        console.error('Unexpected response status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error sending location:', error);
      return false;
    }
  }

  async sendLocationBatch(locations: LocationData[]): Promise<{ success: boolean; failedCount: number }> {
    let failedCount = 0;

    for (const location of locations) {
      const success = await this.sendLocation(location);
      if (!success) {
        failedCount++;
      }

      // Small delay between requests to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const successCount = locations.length - failedCount;
    console.log(`📦 Batch complete: ${successCount}/${locations.length} locations sent successfully`);

    return {
      success: failedCount === 0,
      failedCount
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log('🔧 Testing API connection...');

      // Test with a dummy location to check if the endpoint is working
      const testPayload: LocationPayload = {
        hijo_id: "test",
        latitud: 0,
        longitud: 0
      };

      const response = await this.client.post(LOCATION_ENDPOINT, testPayload);
      console.log('✅ API connection test passed');
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  private handleApiError(error: AxiosError): void {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 401:
          console.error('Authentication failed - token may be expired');
          break;
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
        case 429:
          console.error('Rate limit exceeded');
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          console.error(`API error ${status}:`, data?.message || 'Unknown error');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - request made but no response received');
    } else {
      // Request setup error
      console.error('Request setup error:', error.message);
    }
  }

  async validateLocationData(locationData: LocationData): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Validate latitude
    if (typeof locationData.latitude !== 'number' ||
        locationData.latitude < -90 ||
        locationData.latitude > 90) {
      errors.push('Invalid latitude: must be between -90 and 90');
    }

    // Validate longitude
    if (typeof locationData.longitude !== 'number' ||
        locationData.longitude < -180 ||
        locationData.longitude > 180) {
      errors.push('Invalid longitude: must be between -180 and 180');
    }

    // Validate timestamp
    if (!locationData.timestamp ||
        typeof locationData.timestamp !== 'number' ||
        locationData.timestamp <= 0) {
      errors.push('Invalid timestamp');
    }

    // Validate user ID
    if (!locationData.userId || typeof locationData.userId !== 'string') {
      errors.push('Invalid user ID');
    }

    // Validate accuracy (if provided)
    if (locationData.accuracy !== undefined &&
        (typeof locationData.accuracy !== 'number' || locationData.accuracy < 0)) {
      errors.push('Invalid accuracy: must be a positive number');
    }

    // Validate speed (if provided)
    if (locationData.speed !== undefined &&
        typeof locationData.speed !== 'number') {
      errors.push('Invalid speed: must be a number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async sendLocationWithRetry(
    locationData: LocationData,
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<boolean> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const success = await this.sendLocation(locationData);
        if (success) {
          return true;
        }
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.error(`Failed to send location after ${maxRetries} attempts`);
    return false;
  }

  getApiStatus(): {
    baseUrl: string;
    hasAuthToken: boolean;
    timeout: number;
  } {
    return {
      baseUrl: API_BASE_URL,
      hasAuthToken: !!this.authToken,
      timeout: REQUEST_TIMEOUT,
    };
  }
}

export const locationApiService = new LocationApiService();