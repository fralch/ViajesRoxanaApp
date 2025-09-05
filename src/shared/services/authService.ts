// Authentication API service

// Tipos para la respuesta del API
export interface LoginApiResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    dni: string;
    email_verified_at: string;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
    hijos: any[];
  };
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Configuración del API
const API_BASE_URL = 'https://grupoviajesroxana.com/api/v1';

// Servicio de autenticación
export class AuthService {
  /**
   * Realiza el login con el endpoint real
   */
  static async login(credentials: LoginRequest): Promise<LoginApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/endpoint/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data: LoginApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error en el login');
      }

      return data;
    } catch (error) {
      console.error('AuthService.login error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Error de conexión. Verifica tu internet e intenta nuevamente.');
    }
  }

  /**
   * Valida el formato del email
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida las credenciales antes de enviarlas
   */
  static validateCredentials(credentials: LoginRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!credentials.email || credentials.email.trim() === '') {
      errors.push('El email es requerido');
    } else if (!this.validateEmail(credentials.email)) {
      errors.push('El formato del email no es válido');
    }

    if (!credentials.password || credentials.password.trim() === '') {
      errors.push('La contraseña es requerida');
    } else if (credentials.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default AuthService;