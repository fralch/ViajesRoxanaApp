import { useState, useEffect } from 'react';
import { Notification } from '../types';
import { NotificationService } from '../services/notificationService';

export const useNotifications = (dni: string | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dni) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await NotificationService.getNotifications(dni);
        setNotifications(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching notifications.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [dni]);

  return { notifications, isLoading, error };
};
