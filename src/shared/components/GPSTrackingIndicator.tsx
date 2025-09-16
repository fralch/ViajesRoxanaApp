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
  } = useGPSTracking();

  if (!isChildUser) {
    return null; // Only show for child users
  }

  const getStatusColor = () => {
    if (error) return '#e74c3c';
    if (isInitializing) return '#f39c12';
    if (isTracking && hasPermissions) return '#27ae60';
    return '#95a5a6';
  };

  const getStatusIcon = () => {
    if (error) return 'error';
    if (isInitializing) return 'hourglass-empty';
    if (isTracking && hasPermissions) return 'gps-fixed';
    return 'gps-off';
  };

  const getStatusText = () => {
    if (error) return 'Error GPS';
    if (isInitializing) return 'Iniciando GPS...';
    if (isTracking && hasPermissions) return 'GPS Activo';
    return 'GPS Inactivo';
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Nunca';
    const now = Date.now();
    const diff = now - lastUpdate;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `hace ${minutes}m`;
    }
    return `hace ${seconds}s`;
  };

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={[styles.container, { borderColor: getStatusColor() }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <MaterialIcons
          name={getStatusIcon()}
          size={16}
          color={getStatusColor()}
          style={styles.icon}
        />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
        {queueSize > 0 && (
          <View style={styles.queueBadge}>
            <Text style={styles.queueText}>{queueSize}</Text>
          </View>
        )}
      </View>

      {showDetails && (
        <View style={styles.details}>
          {currentLocation && (
            <Text style={styles.detailText}>
              📍 {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </Text>
          )}
          <Text style={styles.detailText}>
            🕒 Última actualización: {formatLastUpdate()}
          </Text>
          {currentLocation?.accuracy && (
            <Text style={styles.detailText}>
              🎯 Precisión: ±{Math.round(currentLocation.accuracy)}m
            </Text>
          )}
          {error && (
            <Text style={styles.errorText}>
              ⚠️ {error}
            </Text>
          )}
        </View>
      )}
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 12,
    margin: 8,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  queueBadge: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  queueText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  details: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 4,
  },
});

export default GPSTrackingIndicator;