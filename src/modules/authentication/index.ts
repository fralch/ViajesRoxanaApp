// Authentication module exports
export { default as WelcomeScreen } from './components/WelcomeScreen';
export { default as RegisterForm } from './components/RegisterForm';
export { default as LoginForm } from './components/LoginForm';
export { default as ModalAccess } from './components/ModalAccess';

// Types
export interface AuthUser {
  id: string;
  email: string;
  phone: string;
  role: 'student' | 'guardian';
  name: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  emailPhone: string;
  password: string;
}

export interface RegisterData {
  guardian_name: string;
  guardian_lastname: string;
  address: string;
  district: string;
  province: string;
  department: string;
  phone: string;
  student_name: string;
  student_lastname: string;
  document_type: string;
  document_number: string;
  email: string;
  password: string;
  confirm_password: string;
  accept_terms: boolean;
  accept_privacy: boolean;
  accept_promotions: boolean;
}