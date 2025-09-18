// Shared services exports
export { AuthService } from './authService';
export type { LoginApiResponse, LoginRequest, ChildLoginRequest, ChildLoginApiResponse } from './authService';
export { LocationService } from './locationService';
export type { LocationApiResponse, ChildGeolocationResponse } from './locationService';
export { NotificationService } from './notificationService';
export { gpsTrackingService } from './gpsTrackingService';
export type { LocationData, QueuedLocationData } from './gpsTrackingService';
export { locationApiService } from './locationApiService';
export type { ApiResponse, LocationPayload } from './locationApiService';
export { BackgroundLocationService } from './backgroundLocationService';
export type { LocationTrackingState, LocationUpdateCallback } from './backgroundLocationService';