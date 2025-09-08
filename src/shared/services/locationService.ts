// Location API service

// Types for API response
export interface LocationApiResponse {
  success: boolean;
  location: {
    latitude: number;
    longitude: number;
    descripcion: string;
    timestamp: string;
    formatted_time: string;
    minutes_ago: number;
    human_time: string;
  };
  hijo: {
    id: number;
    nombres: string;
    doc_tipo: string;
    doc_numero: string;
  };
  paquete: {
    id: number;
    nombre: string;
    destino: string;
  };
}

// API Configuration - using the correct domain
const API_BASE_URL = 'https://grupoviajesroxana.com/api/v1';

// Location service
export class LocationService {
  /**
   * Gets the last location for a specific child by document number
   */
  static async getLastLocation(docNumber: string): Promise<LocationApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/endpoint/hijo-location/${docNumber}/last`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `Error HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          // Handle Laravel error format
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.descripcion) {
            errorMessage = errorData.descripcion;
          }
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = `Error HTTP ${response.status}: ${response.statusText}`;
        }
        
        if (response.status === 404) {
          throw new Error(`No se encontraron datos de ubicación para el documento: ${docNumber}`);
        }
        
        throw new Error(errorMessage);
      }

      const data: LocationApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error('Error al obtener datos de ubicación');
      }

      return data;
    } catch (error) {
      console.error('LocationService.getLastLocation error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Error de conexión. Verifica tu internet e intenta nuevamente.');
    }
  }

  /**
   * Transforms API response to the format expected by the UI components
   */
  static transformLocationData(apiData: LocationApiResponse) {
    return {
      currentLocation: {
        latitude: apiData.location.latitude,
        longitude: apiData.location.longitude,
        address: apiData.location.descripcion,
        accuracy: 5, // Default value as API doesn't provide this
        altitude: 0, // Default value as API doesn't provide this
      },
      student: {
        name: apiData.hijo.nombres,
        tripCode: `${apiData.hijo.doc_tipo}-${apiData.hijo.doc_numero}`,
        group: apiData.paquete.nombre,
      },
      currentActivity: {
        name: "Actividad en curso",
        startTime: "En tiempo real",
        endTime: "Continuo",
        location: apiData.location.descripcion,
        description: `Ubicación actualizada ${apiData.location.human_time}. Destino: ${apiData.paquete.destino}`,
      },
      liveStatus: {
        status: 'safe' as const,
        lastMovement: apiData.location.human_time,
        batteryLevel: 85, // Default value as API doesn't provide this
        signalStrength: 4, // Default value as API doesn't provide this
      },
      recentActivities: [
        {
          id: 1,
          time: apiData.location.formatted_time.split(' ')[1],
          activity: "Ubicación registrada",
          location: apiData.location.descripcion,
          status: "completed" as const,
          notes: `Última actualización: ${apiData.location.human_time}`,
        },
      ],
      emergencyContacts: [
        {
          id: 1,
          name: "Responsable del viaje",
          role: "Coordinador",
          phone: "+51 999 123 456",
          available: true,
        },
      ],
      lastUpdate: new Date(apiData.location.timestamp),
    };
  }
}

export default LocationService;