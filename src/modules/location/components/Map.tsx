import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Platform, Linking } from 'react-native';

interface MapProps {
  latitude: number;
  longitude: number;
  studentName: string;
  address?: string;
  onClose?: () => void;
}

const { width, height } = Dimensions.get('window');

export const Map: React.FC<MapProps> = ({
  latitude,
  longitude,
  studentName,
  address,
  onClose
}) => {
  const handleCenterLocation = () => {
    const url = `https://www.google.com/maps/@${latitude},${longitude},15z`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir Google Maps');
    });
  };

  const handleShareLocation = () => {
    Alert.alert(
      'Compartir Ubicación',
      `Ubicación de ${studentName}:\nLatitud: ${latitude.toFixed(6)}\nLongitud: ${longitude.toFixed(6)}${address ? `\nDirección: ${address}` : ''}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Copiar', onPress: () => Alert.alert('Copiado', 'Ubicación copiada al portapapeles') }
      ]
    );
  };

  const handleGetDirections = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
    
    Alert.alert(
      'Direcciones',
      '¿Cómo te gustaría obtener direcciones?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Google Maps', 
          onPress: () => Linking.openURL(googleMapsUrl).catch(() => 
            Alert.alert('Error', 'No se pudo abrir Google Maps')
          )
        },
        { 
          text: 'Waze', 
          onPress: () => Linking.openURL(wazeUrl).catch(() => 
            Alert.alert('Error', 'No se pudo abrir Waze')
          )
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Map placeholder with location info */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.locationDisplay}>
          <View style={styles.markerContainer}>
            <View style={styles.marker}>
              <Text style={styles.markerText}>📍</Text>
            </View>
            <View style={styles.markerLabel}>
              <Text style={styles.markerLabelText}>{studentName}</Text>
            </View>
          </View>
          
          <View style={styles.coordinatesDisplay}>
            <Text style={styles.coordinatesTitle}>Ubicación Actual</Text>
            <Text style={styles.coordinatesText}>
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Text>
            {address && (
              <Text style={styles.addressText}>{address}</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.openMapButton} 
            onPress={handleCenterLocation}
          >
            <Text style={styles.openMapButtonText}>🗺️ Ver en Google Maps</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location info panel */}
      <View style={styles.infoPanel}>
        <View style={styles.infoHeader}>
          <Text style={styles.studentName}>{studentName}</Text>
          <Text style={styles.coordinates}>
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Text>
          {address && (
            <Text style={styles.address}>{address}</Text>
          )}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCenterLocation}>
            <Text style={styles.actionButtonText}>🎯 Centrar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShareLocation}>
            <Text style={styles.actionButtonText}>📤 Compartir</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleGetDirections}>
            <Text style={styles.actionButtonText}>🗺️ Direcciones</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Close button */}
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  locationDisplay: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minWidth: width * 0.8,
  },
  coordinatesDisplay: {
    alignItems: 'center',
    marginVertical: 20,
  },
  coordinatesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  coordinatesText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  openMapButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  openMapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  markerText: {
    fontSize: 20,
    color: '#fff',
  },
  markerLabel: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  markerLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoHeader: {
    marginBottom: 16,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#374151',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: 'bold',
  },
});

export default Map;