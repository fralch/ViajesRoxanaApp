// Profile module exports
export { default as ProfileMainScreen } from './components/ProfileMainScreen';
export { default as PersonalDataScreen } from './components/PersonalDataScreen';

// Types
export interface ProfileData {
  user_id: string;
  personal_data: PersonalData;
  medical_data: MedicalData;
  nutritional_data: NutritionalData;
  completion_percentage: number;
}

export interface PersonalData {
  name: string;
  lastname: string;
  photo?: string;
  document_type: string;
  document_number: string;
  age: string;
  birth_date: string;
  gender: string;
  address: string;
  email: string;
  phone: string;
  country: string;
}

export interface EmergencyContact {
  id: number;
  contact_name: string;
  contact_lastname: string;
  contact_phone: string;
  relationship: string;
}

export interface AboutMe {
  hobbies: string;
  sports: string;
  relational_attitude: string;
  additional_info: string;
}

export interface MedicalData {
  blood_type: string;
  rh_factor: string;
  current_treatment: string;
  preexisting_conditions: string;
  medication_allergies: string;
  additional_allergies: string;
  treatment_observations: string;
  medication_name: string;
  medication_provider: string;
  daily_dose: string;
}

export interface NutritionalData {
  weight: string;
  height: string;
  physical_activity: string;
  diet_type: string;
  food_allergies: string;
  eating_habits: string;
  special_diet: string;
  foods_not_consumed: string;
  allergy_details: string;
  habit_details: string;
  diet_details: string;
  nutrition_details: string;
  foods_avoided_details: string;
}