import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import { formatDate } from '../utils';

export interface UserProfileData {
  name: string;
  email: string;
  role: string;
  phone: string;
  registrationDate: string;
  isActive: boolean;
  fullName: string;
}

export const useUserProfile = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const getUserProfileData = useCallback((): UserProfileData | null => {
    if (!user || !isAuthenticated) {
      return null;
    }

    return {
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      registrationDate: formatDate(user.created_at),
      isActive: user.is_active,
      fullName: `${user.name} ${user.lastname}`.trim(),
    };
  }, [user, isAuthenticated]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  }, [logout]);

  const getRoleDisplayName = useCallback((role: string): string => {
    const roleMap: Record<string, string> = {
      student: 'Estudiante',
      guardian: 'Apoderado',
      admin: 'Administrador',
    };
    return roleMap[role] || role;
  }, []);

  const getStatusDisplayName = useCallback((isActive: boolean): string => {
    return isActive ? 'Activo' : 'Inactivo';
  }, []);

  const getStatusColor = useCallback((isActive: boolean): string => {
    return isActive ? '#4CAF50' : '#F44336';
  }, []);

  return {
    user,
    isAuthenticated,
    getUserProfileData,
    handleLogout,
    getRoleDisplayName,
    getStatusDisplayName,
    getStatusColor,
  };
};

export default useUserProfile;