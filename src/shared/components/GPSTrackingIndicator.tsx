import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useGPSTracking } from '../hooks';

interface GPSTrackingIndicatorProps {
  onPress?: () => void;
  showDetails?: boolean;
}

const GPSTrackingIndicator: React.FC<GPSTrackingIndicatorProps> = ({
  onPress,
  showDetails = false,
}) => {
  const {
    isTracking,
    isInitializing,
    hasPermissions,
    currentLocation,
    queueSize,
    lastUpdate,
    error,
    isChildUser,
    forceStartTrackingWithMockData,
  } = useGPSTracking();

  if (!isChildUser) return null; // Solo para usuarios hijo

  const getStatusConfig = () => {
    if (error) {
      return {
        color: '#e74c3c',
        bgColor: '#fdecea', // rojo muy claro
        icon: 'error-outline',
      };
    }
    if (isInitializing) {
      return {
        color: '#e74c3c',
        bgColor: '#fdecea',
        icon: 'hourglass-empty',
      };
    }
    if (isTracking && hasPermissions) {
      return {
        color: '#e74c3c',
        bgColor: '#fdecea',
        icon: 'gps-fixed',
      };
    }
    return {
      color: '#e74c3c',
      bgColor: '#fdecea',
      icon: 'gps-off',
    };
  };

  const getStatusText = () => {
    if (error) return '¡Ups! Problema con mi ubicación 😅';
    if (isInitializing) return '¡Buscando dónde estoy! 🔍';
    if (isTracking && hasPermissions) return '¡Ya sé dónde estoy!';
    return 'No puedo ver dónde estoy 😴';
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Nunca he visto mi ubicación';
    const now = Date.now();
    const diff = now - lastUpdate;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    }
    return `Hace ${seconds} segundo${seconds > 1 ? 's' : ''}`;
  };

  const statusConfig = getStatusConfig();
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View
        style={[
          styles.cardContainer,
          { backgroundColor: statusConfig.bgColor, borderLeftColor: statusConfig.color },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: statusConfig.color }]}>
            <MaterialIcons
              name={statusConfig.icon as 'error-outline' | 'hourglass-empty' | 'gps-fixed' | 'gps-off'}
              size={20}
              color="#ffffff"
            />
          </View>

          <View style={styles.statusContent}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
            <Text style={[styles.statusSubtext, { color: statusConfig.color }]}>
              Estado del GPS
            </Text>
          </View>

          {queueSize > 0 && (
            <View style={styles.queueBadge}>
              <Text style={styles.queueText}>{queueSize}</Text>
            </View>
          )}
        </View>

        {/* Detalles */}
        {showDetails && (
          <View style={styles.details}>
            <View style={styles.divider} />

            {currentLocation && (
              <View style={styles.detailRow}>
                <MaterialIcons name="place" size={16} color="#222" />
                <Text style={styles.detailText}>
                  Ubicación: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                </Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <MaterialIcons name="schedule" size={16} color="#222" />
              <Text style={styles.detailText}>{formatLastUpdate()}</Text>
            </View>

            {currentLocation?.accuracy && (
              <View style={styles.detailRow}>
                <MaterialIcons name="my-location" size={16} color="#222" />
                <Text style={styles.detailText}>Precisión: ±{Math.round(currentLocation.accuracy)}m</Text>
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <MaterialIcons name="warning" size={16} color="#222" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        )}

        {/* Debug - Solo dev */}
        {showDetails && (
          <TouchableOpacity
            style={styles.debugButton}
            onPress={forceStartTrackingWithMockData}
            activeOpacity={0.8}
          >
            <MaterialIcons name="bug-report" size={16} color="#ffffff" />
            <Text style={styles.debugButtonText}>Probar ubicación</Text>
          </TouchableOpacity>
        )}
      </View>
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardContainer: {
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusContent: { flex: 1 },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e74c3c',
    marginBottom: 2,
  },
  statusSubtext: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  queueBadge: {
    backgroundColor: '#e74c3c',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 28,
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  queueText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  details: { marginTop: 16 },
  divider: {
    height: 1,
    backgroundColor: '#fadbd8',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#222', // rojo un poco más oscuro para contraste
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdecea',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#e74c3c',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  debugButton: {
    marginTop: 16,
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  debugButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default GPSTrackingIndicator;
