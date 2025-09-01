import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';

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
  const [mapHtml, setMapHtml] = useState<string>('');

  useEffect(() => {
    // Generar HTML con Leaflet para mostrar el mapa
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mapa de Ubicación</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossorigin=""/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossorigin=""></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { height: 100vh; width: 100vw; }
          .custom-popup {
            font-family: Arial, sans-serif;
            text-align: center;
          }
          .popup-title {
            font-weight: bold;
            font-size: 16px;
            color: #1F2937;
            margin-bottom: 8px;
          }
          .popup-coords {
            font-size: 12px;
            color: #6B7280;
            font-family: monospace;
            margin-bottom: 4px;
          }
          .popup-address {
            font-size: 14px;
            color: #374151;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Inicializar el mapa
          var map = L.map('map').setView([${latitude}, ${longitude}], 15);
          
          // Agregar capa de tiles de OpenStreetMap
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          
          // Crear icono personalizado
          var customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: '<div style="background-color: #3B82F6; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="color: white; font-size: 16px;">📍</span></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });
          
          // Agregar marcador
          var marker = L.marker([${latitude}, ${longitude}], {icon: customIcon}).addTo(map);
          
          // Contenido del popup
          var popupContent = '<div class="custom-popup">' +
            '<div class="popup-title">${studentName}</div>' +
            '<div class="popup-coords">Lat: ${latitude.toFixed(6)}</div>' +
            '<div class="popup-coords">Lng: ${longitude.toFixed(6)}</div>' +
            ${address ? `'<div class="popup-address">${address}</div>' +` : ''}
            '</div>';
          
          marker.bindPopup(popupContent).openPopup();
          
          // Centrar el mapa en la ubicación
          map.setView([${latitude}, ${longitude}], 15);
        </script>
      </body>
      </html>
    `;
    setMapHtml(html);
  }, [latitude, longitude, studentName, address]);

  const handleCenterLocation = () => {
    Alert.alert(
      'Centrar Ubicación',
      `Ubicación centrada en:\nLatitud: ${latitude.toFixed(6)}\nLongitud: ${longitude.toFixed(6)}`
    );
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
    Alert.alert(
      'Obtener Direcciones',
      'Selecciona la aplicación de mapas:',
      [
        {
          text: 'Google Maps',
          onPress: () => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
            Linking.openURL(url).catch(() => {
              Alert.alert('Error', 'No se pudo abrir Google Maps');
            });
          },
        },
        {
          text: 'Waze',
          onPress: () => {
            const url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
            Linking.openURL(url).catch(() => {
              Alert.alert('Error', 'No se pudo abrir Waze');
            });
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Mapa real usando WebView con Leaflet */}
      <View style={styles.mapContainer}>
        {mapHtml ? (
          <WebView
            source={{ html: mapHtml }}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando mapa...</Text>
          </View>
        )}
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
  mapContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
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