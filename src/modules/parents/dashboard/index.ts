// Dashboard module exports
export { default as DashboardScreen } from './components/DashboardScreen';

// Types
export interface DashboardData {
  userName: string;
  currentTrip?: {
    destination: string;
    dates: string;
    group: string;
    responsible: string;
  };
  notifications: Notification[];
  quickActions: QuickAction[];
}

export interface Notification {
  id: number;
  type: 'location' | 'medical' | 'activity' | 'payment' | 'general';
  message: string;
  time: string;
  read: boolean;
}

export interface QuickAction {
  id: number;
  title: string;
  icon: string;
  screen: string;
}