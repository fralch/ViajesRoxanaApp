import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const watchSubscription = useRef<Location.LocationSubscription | null>(null);

  const requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status !== 'granted') {
        setError('Permiso de ubicación denegado. Necesitamos acceso a tu ubicación para tu seguridad.');
        return false;
      }
      return true;
    } catch (err) {
      setError('Error al solicitar permisos de ubicación');
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const permissionGranted = await requestPermission();
      if (!permissionGranted) return;

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);
    } catch (err) {
      setError('Error al obtener la ubicación actual');
      console.error('Location error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startWatchingLocation = async () => {
    try {
      const permissionGranted = await requestPermission();
      if (!permissionGranted) return;

      // Detener cualquier suscripción previa
      if (watchSubscription.current) {
        watchSubscription.current.remove();
      }

      watchSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Actualizar cada 10 segundos
          distanceInterval: 10, // O cuando se mueva 10 metros
        },
        (newLocation) => {
          setLocation(newLocation);
          setError(null);
        }
      );
    } catch (err) {
      setError('Error al iniciar el seguimiento de ubicación');
      console.error('Watch location error:', err);
    }
  };

  const stopWatchingLocation = () => {
    if (watchSubscription.current) {
      watchSubscription.current.remove();
      watchSubscription.current = null;
    }
  };

  useEffect(() => {
    getCurrentLocation();

    return () => {
      stopWatchingLocation();
    };
  }, []);

  return {
    location,
    isLoading,
    error,
    hasPermission,
    getCurrentLocation,
    startWatchingLocation,
    stopWatchingLocation,
  };
};