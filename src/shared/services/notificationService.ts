
import { Notification } from '../types';

// Notification API service

// API Configuration
const API_BASE_URL = 'https://grupoviajesroxana.com/api/v1';

// Notification service
export class NotificationService {
  /**
   * Gets notifications for a specific child by document number
   */
  static async getNotifications(dni: string): Promise<Notification[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/endpoint/user/notificaciones/${dni}`, {
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
          throw new Error(`No se encontraron notificaciones para el DNI: ${dni}`);
        }
        
        throw new Error(errorMessage);
      }

      const data: Notification[] = await response.json();
      return data;
    } catch (error) {
      console.error('NotificationService.getNotifications error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Error de conexión. Verifica tu internet e intenta nuevamente.');
    }
  }
}

export default NotificationService;
