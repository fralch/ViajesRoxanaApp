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

// Types for the new geolocation API response
export interface ChildGeolocationResponse {
  success: boolean;
  data: {
    geolocalizacion: {
      hijo_id: number;
      paquete_id: number;
      latitud: number;
      longitud: number;
      timestamp: string;
      unix_timestamp: number;
      is_recent: boolean;
      minutes_ago: number;
      last_update: string;
    };
    is_recent: boolean;
    last_update: string;
    minutes_ago: number;
    source: string;
  };
}

// API Configuration - using the correct domain
const API_BASE_URL = 'https://grupoviajesroxana.com/api/v1';

// Location service
export class LocationService {
  /**
   * Gets the last location for a specific child by document number
   */
  static async getLastLocation(docNumber: string): Promise<ChildGeolocationResponse> {
    try {
      const response = await fetch(`https://grupoviajesroxana.com/api/v1/endpoint/geolocalizacion/hijo/location?hijo_id=${docNumber}`, {
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
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          errorMessage = `Error HTTP ${response.status}: ${response.statusText}`;
        }

        if (response.status === 404) {
          throw new Error(`No se encontraron datos de geolocalización para el documento: ${docNumber}`);
        }

        throw new Error(errorMessage);
      }

      const data: ChildGeolocationResponse = await response.json();

      if (!data.success) {
        throw new Error('Error al obtener datos de geolocalización');
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
   * Gets the live geolocation for a specific child by ID
   */
  static async getChildGeolocation(hijoId: string): Promise<ChildGeolocationResponse> {
    try {
      const response = await fetch(`https://grupoviajesroxana.com/api/v1/endpoint/geolocalizacion/hijo/location?hijo_id=${hijoId}`, {
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
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          errorMessage = `Error HTTP ${response.status}: ${response.statusText}`;
        }

        if (response.status === 404) {
          throw new Error(`No se encontraron datos de geolocalización para el hijo ID: ${hijoId}`);
        }

        throw new Error(errorMessage);
      }

      const data: ChildGeolocationResponse = await response.json();

      if (!data.success) {
        throw new Error('Error al obtener datos de geolocalización');
      }

      return data;
    } catch (error) {
      console.error('LocationService.getChildGeolocation error:', error);

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

  /**
   * Transforms geolocation API response to the format expected by the UI components
   */
  static transformGeolocationData(apiData: ChildGeolocationResponse) {
    const { geolocalizacion } = apiData.data;

    return {
      currentLocation: {
        latitude: geolocalizacion.latitud,
        longitude: geolocalizacion.longitud,
        address: `Lat: ${geolocalizacion.latitud.toFixed(4)}, Lng: ${geolocalizacion.longitud.toFixed(4)}`,
        accuracy: 5,
        altitude: 0,
      },
      student: {
        name: `Estudiante ${geolocalizacion.hijo_id}`,
        tripCode: `ID-${geolocalizacion.hijo_id}`,
        group: `Paquete ${geolocalizacion.paquete_id}`,
      },
      currentActivity: {
        name: "Geolocalización activa",
        startTime: "En tiempo real",
        endTime: "Continuo",
        location: `Ubicación actual`,
        description: `Última actualización hace ${geolocalizacion.minutes_ago.toFixed(1)} minutos`,
      },
      liveStatus: {
        status: geolocalizacion.is_recent ? 'safe' : 'warning' as const,
        lastMovement: `Hace ${geolocalizacion.minutes_ago.toFixed(1)} minutos`,
        batteryLevel: 85,
        signalStrength: geolocalizacion.is_recent ? 4 : 2,
      },
      recentActivities: [
        {
          id: 1,
          time: new Date(geolocalizacion.timestamp).toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          activity: "Posición actualizada",
          location: `Lat: ${geolocalizacion.latitud.toFixed(4)}, Lng: ${geolocalizacion.longitud.toFixed(4)}`,
          status: "completed" as const,
          notes: `Fuente: ${apiData.data.source}`,
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
      lastUpdate: new Date(geolocalizacion.timestamp),
    };
  }
}

export default LocationService;