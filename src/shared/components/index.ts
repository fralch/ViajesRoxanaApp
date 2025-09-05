// Shared components exports

// Common UI components that can be used across modules
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as EmptyState } from './EmptyState';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as CustomButton } from './CustomButton';
export { default as CustomInput } from './CustomInput';
export { default as StatusBadge } from './StatusBadge';
export { default as ProgressBar } from './ProgressBar';
export { default as Card } from './Card';
export { default as Avatar } from './Avatar';
export { default as TabBar } from './TabBar';
// UserProfile moved to hooks as useUserProfile
// AuthExample removed - functionality integrated into useAuth hook

// Component prop types
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  required?: boolean;
  icon?: string;
}

export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info';
  text: string;
  size?: 'small' | 'medium' | 'large';
}

export interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: number;
  showPercentage?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  padding?: number;
  margin?: number;
  elevation?: number;
  borderRadius?: number;
  backgroundColor?: string;
}

export interface AvatarProps {
  source?: { uri: string } | number;
  size: number;
  name?: string; // For fallback initials
  backgroundColor?: string;
  textColor?: string;
}

export interface TabItem {
  key: string;
  label: string;
  icon?: string;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  style?: any;
}

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionText?: string;
  onActionPress?: () => void;
}