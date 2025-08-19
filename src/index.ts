// Main application exports

// Module exports
export * from './modules/authentication';
export * from './modules/dashboard';
export * from './modules/profile';
export * from './modules/trips';
export * from './modules/payments';
export * from './modules/location';

// Shared exports
export * from './shared/types';
export * from './shared/utils';
export * from './shared/components';

// Navigation
export * from './navigation';

// Re-export commonly used components
export { default as DashboardScreen } from './modules/dashboard/components/DashboardScreen';
export { default as ProfileMainScreen } from './modules/profile/components/ProfileMainScreen';
export { default as TripsListScreen } from './modules/trips/components/TripsListScreen';
export { default as PaymentsListScreen } from './modules/payments/components/PaymentsListScreen';
export { default as LiveLocationScreen } from './modules/location/components/LiveLocationScreen';
export { default as WelcomeScreen } from './modules/authentication/components/WelcomeScreen';