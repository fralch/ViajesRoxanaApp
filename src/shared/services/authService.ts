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
    // Campos adicionales para identificar si es un hijo
    is_child?: boolean;
    parent_id?: number;
  };
  token: string;
}

// Tipo para la respuesta del API de login de hijo
export interface ChildLoginApiResponse {
  success: boolean;
  message: string;
  hijo: {
    id: number;
    user_id: number;
    nombres: string;
    doc_tipo: string;
    doc_numero: string;
    password_hijo: string;
    nums_emergencia: string[];
    fecha_nacimiento: string | null;
    foto: string | null;
    pasatiempos: string | null;
    deportes: string | null;
    plato_favorito: string | null;
    color_favorito: string | null;
    informacion_adicional: string | null;
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      dni: string;
      email_verified_at: string | null;
      is_admin: boolean;
      created_at: string;
      updated_at: string;
    };
    inscripciones: Array<{
      id: number;
      hijo_id: number;
      paquete_id: number;
      grupo_id: number;
      usuario_id: number;
      created_at: string;
      updated_at: string;
      grupo: {
        id: number;
        paquete_id: number;
        nombre: string;
        fecha_inicio: string;
        fecha_fin: string;
        capacidad: number;
        tipo_encargado: string[];
        nombre_encargado: string[];
        celular_encargado: string[];
        tipo_encargado_agencia: string[];
        nombre_encargado_agencia: string[];
        celular_encargado_agencia: string[];
        activo: boolean;
        created_at: string;
        updated_at: string;
        paquete: {
          id: number;
          nombre: string;
          destino: string;
          descripcion: string;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
      };
    }>;
  };
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  user_type?: 'parent' | 'child'; // Nuevo parámetro para especificar el tipo de usuario
}

export interface ChildLoginRequest {
  doc_numero: string;
  password_hijo: string;
}

// Configuración del API
const API_BASE_URL = 'https://grupoviajesroxana.com/api/v1';

// Servicio de autenticación
export class AuthService {
  /**
   * Realiza el login con el endpoint real
   */
  static async login(credentials: LoginRequest): Promise<LoginApiResponse> {
    // Si es login de hijo, usar datos de prueba
    if (credentials.user_type === 'child') {
      return this.mockChildLogin(credentials);
    }

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
   * Realiza el login de hijo con el endpoint real
   */
  static async childLogin(credentials: ChildLoginRequest): Promise<LoginApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/endpoint/hijo-login?doc_numero=${credentials.doc_numero}&password_hijo=${credentials.password_hijo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data: ChildLoginApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Error en el login');
      }

      // Transform child login response to match the expected LoginApiResponse format
      const transformedResponse: LoginApiResponse = {
        success: data.success,
        message: data.message,
        user: {
          id: data.hijo.id,
          name: data.hijo.nombres,
          email: data.hijo.user.email,
          phone: data.hijo.user.phone,
          dni: data.hijo.doc_numero,
          email_verified_at: data.hijo.user.email_verified_at || '',
          is_admin: data.hijo.user.is_admin,
          created_at: data.hijo.created_at,
          updated_at: data.hijo.updated_at,
          hijos: [data.hijo], // Wrap the child data in hijos array for compatibility
          is_child: true,
          parent_id: data.hijo.user_id
        },
        token: data.token
      };

      return transformedResponse;
    } catch (error) {
      console.error('AuthService.childLogin error:', error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Error de conexión. Verifica tu internet e intenta nuevamente.');
    }
  }

  /**
   * Mock login para hijos (acepta cualquier credencial)
   */
  static async mockChildLogin(credentials: LoginRequest): Promise<LoginApiResponse> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generar datos de prueba basados en las credenciales ingresadas
    const childName = credentials.email === '12345678' ? 'Sofía García' :
                     credentials.email === '87654321' ? 'Diego López' :
                     `Niño ${credentials.email}`;

    return {
      success: true,
      message: "Login exitoso",
      user: {
        id: parseInt(credentials.email) || 12345,
        name: childName,
        email: `${credentials.email}@child.test`,
        phone: "000000000",
        dni: credentials.email,
        email_verified_at: new Date().toISOString(),
        is_admin: false,
        created_at: "2024-01-01T00:00:00.000000Z",
        updated_at: new Date().toISOString(),
        hijos: [{
          id: parseInt(credentials.email) || 12345,
          user_id: 1,
          nombres: childName,
          doc_tipo: "DNI",
          doc_numero: credentials.email,
          nums_emergencia: ["999888777", "987654321"],
          fecha_nacimiento: "2015-03-15T00:00:00.000000Z",
          foto: null,
          pasatiempos: "Dibujar, leer cuentos, jugar videojuegos",
          deportes: "Natación, fútbol",
          plato_favorito: "Pizza con piña",
          color_favorito: "Azul y rosa",
          informacion_adicional: "Le encanta explorar y hacer nuevos amigos. Es muy creativo y curioso.",
          created_at: "2024-01-01T00:00:00.000000Z",
          updated_at: new Date().toISOString(),
          inscripciones: [{
            id: 1,
            hijo_id: parseInt(credentials.email) || 12345,
            paquete_id: 1,
            grupo_id: 1,
            usuario_id: 1,
            created_at: "2024-01-01T00:00:00.000000Z",
            updated_at: new Date().toISOString(),
            grupo: {
              id: 1,
              paquete_id: 1,
              nombre: "Aventureros Espaciales",
              fecha_inicio: "2025-10-01",
              fecha_fin: "2025-10-07",
              capacidad: 25,
              tipo_encargado: ["Profesor"],
              nombre_encargado: ["María González"],
              celular_encargado: ["999888777"],
              tipo_encargado_agencia: ["Guía Turístico"],
              nombre_encargado_agencia: ["Carlos Adventure"],
              celular_encargado_agencia: ["987654321"],
              activo: true,
              created_at: "2024-01-01T00:00:00.000000Z",
              updated_at: new Date().toISOString(),
              paquete: {
                id: 1,
                nombre: "Aventura Espacial",
                destino: "Planetario y Centro de Ciencias",
                descripcion: "¡Explora el espacio y las estrellas!",
                activo: true,
                created_at: "2024-01-01T00:00:00.000000Z",
                updated_at: new Date().toISOString()
              }
            }
          }]
        }], // Para mantener compatibilidad con el dashboard
        is_child: true,
        parent_id: 1
      },
      token: `child_token_${credentials.email}_${Date.now()}`
    };
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

    // Para hijos en desarrollo, validación muy permisiva
    if (credentials.user_type === 'child') {
      if (!credentials.email || credentials.email.trim() === '') {
        errors.push('Ingresa cualquier número para probar');
      }
      if (!credentials.password || credentials.password.trim() === '') {
        errors.push('Ingresa cualquier contraseña para probar');
      }
      return {
        isValid: errors.length === 0,
        errors
      };
    }

    // Validación normal para padres
    if (!credentials.email || credentials.email.trim() === '') {
      errors.push('El email es requerido');
    } else if (!this.validateEmail(credentials.email)) {
      errors.push('El formato del email no es válido');
    }

    if (!credentials.password || credentials.password.trim() === '') {
      errors.push('La contraseña es requerida');
    } else if (credentials.password.length < 4) {
      errors.push('La contraseña debe tener al menos 4 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default AuthService;