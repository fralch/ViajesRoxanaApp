import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRIVACY_POLICY_KEY = '@privacy_policy_accepted';

interface UsePrivacyPolicyReturn {
  isAccepted: boolean;
  isLoading: boolean;
  acceptPrivacyPolicy: () => Promise<void>;
  resetPrivacyPolicy: () => Promise<void>;
}

export const usePrivacyPolicy = (): UsePrivacyPolicyReturn => {
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verificar si las políticas ya fueron aceptadas al cargar el hook
  useEffect(() => {
    checkPrivacyPolicyStatus();
  }, []);

  const checkPrivacyPolicyStatus = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const value = await AsyncStorage.getItem(PRIVACY_POLICY_KEY);
      setIsAccepted(value === 'true');
    } catch (error) {
      console.error('Error al verificar el estado de las políticas de privacidad:', error);
      setIsAccepted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptPrivacyPolicy = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(PRIVACY_POLICY_KEY, 'true');
      setIsAccepted(true);
    } catch (error) {
      console.error('Error al guardar la aceptación de las políticas de privacidad:', error);
      throw error;
    }
  };

  const resetPrivacyPolicy = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(PRIVACY_POLICY_KEY);
      setIsAccepted(false);
    } catch (error) {
      console.error('Error al resetear las políticas de privacidad:', error);
      throw error;
    }
  };

  return {
    isAccepted,
    isLoading,
    acceptPrivacyPolicy,
    resetPrivacyPolicy,
  };
};

export default usePrivacyPolicy;