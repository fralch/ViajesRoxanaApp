import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { AuthService, LoginRequest, ChildLoginRequest } from '../services';

// Tipos para el hook de autenticación
export interface AuthUserData {
  id: string;
  email: string;
  phone: string;
  dni: string;
  role: 'student' | 'guardian' | 'admin';
  name: string;
  lastname: string;
  is_active: boolean;
  is_admin: boolean;
  token: string;
  created_at: string;
  updated_at: string;
  hijos?: any[]; // Include children data from API
}

export interface AuthLoginCredentials {
  emailPhone: string;
  password: string;
  remember?: boolean;
  userType?: 'parent' | 'child';
}

export interface AuthChildLoginCredentials {
  docNumber: string;
  password: string;
  remember?: boolean;
}

// Constantes para las keys del storage
const STORAGE_KEYS = {
  USER_DATA: '@ViajesRoxana:userData',
  AUTH_TOKEN: '@ViajesRoxana:authToken',
  REMEMBER_ME: '@ViajesRoxana:rememberMe',
} as const;

// Hook interno de autenticación
const useAuthInternal = () => {
  const [user, setUser] = useState<AuthUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Funciones de storage
  const saveToStorage = useCallback(async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  }, []);

  const getFromStorage = useCallback(async (key: string): Promise<any> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return null;
    }
  }, []);

  const removeFromStorage = useCallback(async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  }, []);

  // Función para limpiar todos los datos de autenticación
  const clearAuthData = useCallback(async (): Promise<void> => {
    try {
      await Promise.all([
        removeFromStorage(STORAGE_KEYS.USER_DATA),
        removeFromStorage(STORAGE_KEYS.AUTH_TOKEN),
        removeFromStorage(STORAGE_KEYS.REMEMBER_ME),
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }, [removeFromStorage]);

  // Función para cargar datos del usuario al iniciar la app
  const loadUserData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const userData = await getFromStorage(STORAGE_KEYS.USER_DATA);
      const authToken = await getFromStorage(STORAGE_KEYS.AUTH_TOKEN);
      const rememberMe = await getFromStorage(STORAGE_KEYS.REMEMBER_ME);

      if (userData && authToken && rememberMe) {
        setUser({ ...userData, token: authToken });
        setIsAuthenticated(true);
      } else {
        // Si no hay datos o el usuario no eligió recordar, limpiar todo
        await clearAuthData();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, [getFromStorage, clearAuthData]);

  // Función de login
  const login = useCallback(async (credentials: AuthLoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);

      // Validar credenciales antes de enviar
      const loginRequest: LoginRequest = {
        email: credentials.emailPhone,
        password: credentials.password,
        user_type: credentials.userType || 'parent'
      };

      const validation = AuthService.validateCredentials(loginRequest);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Llamada real al API
      const apiResponse = await AuthService.login(loginRequest);

      // Determinar el rol basado en el tipo de usuario enviado
      let userRole: 'student' | 'guardian' | 'admin' = 'guardian';

      if (credentials.userType === 'child') {
        userRole = 'student';
      } else if (apiResponse.user.is_admin) {
        userRole = 'admin';
      }

      // Mapear la respuesta del API a nuestro formato interno
      const userData: AuthUserData = {
        id: apiResponse.user.id.toString(),
        email: apiResponse.user.email,
        phone: apiResponse.user.phone,
        dni: apiResponse.user.dni,
        role: userRole,
        name: apiResponse.user.name,
        lastname: '', // El API no devuelve lastname separado
        is_active: true,
        is_admin: apiResponse.user.is_admin,
        token: apiResponse.token,
        created_at: apiResponse.user.created_at,
        updated_at: apiResponse.user.updated_at,
        hijos: apiResponse.user.hijos || [], // Include children data
      };

      // Guardar datos del usuario
      const { token, ...userDataWithoutToken } = userData;
      await saveToStorage(STORAGE_KEYS.USER_DATA, userDataWithoutToken);
      await saveToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
      await saveToStorage(STORAGE_KEYS.REMEMBER_ME, credentials.remember ?? true);

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  }, [saveToStorage]);

  // Función de login para hijos usando el nuevo API
  const childLogin = useCallback(async (credentials: AuthChildLoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);

      // Preparar la petición para el API de hijos
      const childLoginRequest: ChildLoginRequest = {
        doc_numero: credentials.docNumber,
        password_hijo: credentials.password
      };

      // Llamada real al API de hijos
      const apiResponse = await AuthService.childLogin(childLoginRequest);

      // El rol para un hijo siempre será 'student'
      const userRole: 'student' | 'guardian' | 'admin' = 'student';

      // Mapear la respuesta del API a nuestro formato interno
      const userData: AuthUserData = {
        id: apiResponse.user.id.toString(),
        email: apiResponse.user.email,
        phone: apiResponse.user.phone,
        dni: apiResponse.user.dni,
        role: userRole,
        name: apiResponse.user.name,
        lastname: '', // El API no devuelve lastname separado
        is_active: true,
        is_admin: apiResponse.user.is_admin,
        token: apiResponse.token,
        created_at: apiResponse.user.created_at,
        updated_at: apiResponse.user.updated_at,
        hijos: apiResponse.user.hijos || [], // Include children data
      };

      // Guardar datos del usuario
      const { token, ...userDataWithoutToken } = userData;
      await saveToStorage(STORAGE_KEYS.USER_DATA, userDataWithoutToken);
      await saveToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
      await saveToStorage(STORAGE_KEYS.REMEMBER_ME, credentials.remember ?? true);

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Child login error:', error);
      throw new Error('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  }, [saveToStorage]);

  // Función de logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthData]);

  // Función para actualizar datos del usuario
  const updateUser = useCallback(async (userData: Partial<AuthUserData>): Promise<void> => {
    try {
      if (!user) return;

      const updatedUser = {
        ...user,
        ...userData,
        updated_at: new Date().toISOString(),
      };

      const { token, ...userDataWithoutToken } = updatedUser;
      await saveToStorage(STORAGE_KEYS.USER_DATA, userDataWithoutToken);
      
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      throw new Error('Error al actualizar los datos del usuario.');
    }
  }, [user, saveToStorage]);

  // Funciones adicionales de storage
  const getAuthToken = useCallback(async (): Promise<string | null> => {
    try {
      return await getFromStorage(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }, [getFromStorage]);

  const isUserRemembered = useCallback(async (): Promise<boolean> => {
    try {
      const remembered = await getFromStorage(STORAGE_KEYS.REMEMBER_ME);
      return remembered === true;
    } catch (error) {
      console.error('Error checking remember me:', error);
      return false;
    }
  }, [getFromStorage]);

  const getUserFromStorage = useCallback(async () => {
    try {
      return await getFromStorage(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error getting user from storage:', error);
      return null;
    }
  }, [getFromStorage]);

  const clearStorageData = useCallback(async (keys: string[]) => {
    try {
      await Promise.all(keys.map(key => removeFromStorage(key)));
    } catch (error) {
      console.error('Error clearing storage data:', error);
    }
  }, [removeFromStorage]);

  const isTokenExpired = useCallback(async (): Promise<boolean> => {
    try {
      const token = await getAuthToken();
      if (!token) return true;
      
      // Aquí podrías implementar la lógica real de verificación de expiración
      // Por ejemplo, decodificar un JWT y verificar la fecha de expiración
      // Por ahora, retornamos false (token válido)
      return false;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }, [getAuthToken]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      // Aquí iría la lógica para refrescar el token con el backend
      // Por ahora, simulamos una respuesta exitosa
      const newToken = 'refreshed-token-' + Date.now();
      await saveToStorage(STORAGE_KEYS.AUTH_TOKEN, newToken);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }, [saveToStorage]);

  const logoutAndClear = useCallback(async () => {
    try {
      await logout();
      await clearStorageData([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REMEMBER_ME,
      ]);
    } catch (error) {
      console.error('Error during logout and clear:', error);
    }
  }, [logout, clearStorageData]);

  // Cargar datos del usuario al montar el hook
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return {
    // Estados principales
    user,
    isLoading,
    isAuthenticated,

    // Funciones principales
    login,
    childLogin,
    logout,
    updateUser,
    clearAuthData,

    // Funciones adicionales de storage
    getAuthToken,
    isUserRemembered,
    getUserFromStorage,
    clearStorageData,
    isTokenExpired,
    refreshToken,
    logoutAndClear,
  };
};

// Crear el contexto
type AuthContextType = ReturnType<typeof useAuthInternal>;
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authValue = useAuthInternal();
  
  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Exportar useAuth como el hook principal (que ahora usa el contexto)
export { useAuthContext as useAuth };
export default useAuthContext;