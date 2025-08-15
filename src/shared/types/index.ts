// Shared types across the application

// Base types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// User types
export interface User extends BaseEntity {
  email: string;
  phone: string;
  role: 'student' | 'guardian' | 'admin';
  name: string;
  lastname: string;
  is_active: boolean;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetConfirmation: undefined;
};

export type MainDrawerParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Trips: undefined;
  Payments: undefined;
  Location: undefined;
  Luggage: undefined;
  Notifications: undefined;
  Contact: undefined;
  FAQ: undefined;
  Tutorials: undefined;
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common component props
export interface ScreenProps {
  navigation: any;
  route: any;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  values: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// Notification types
export interface PushNotification {
  id: string;
  user_id: string;
  type: 'location' | 'medical' | 'activity' | 'payment' | 'emergency';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  timestamp: string;
}

// File upload types
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploaded_at: string;
}

// Settings types
export interface AppSettings {
  notifications: {
    push_enabled: boolean;
    location_alerts: boolean;
    medical_alerts: boolean;
    payment_reminders: boolean;
  };
  privacy: {
    location_sharing: boolean;
    profile_visibility: 'public' | 'private' | 'contacts_only';
  };
  preferences: {
    language: 'es' | 'en';
    theme: 'light' | 'dark' | 'auto';
    auto_sync: boolean;
  };
}