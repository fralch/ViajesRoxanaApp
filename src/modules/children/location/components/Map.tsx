import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';

interface MapProps {
  latitude: number;
  longitude: number;
  studentName?: string;
  address?: string;
}

const COLORS = {
  primary: '#4CAF50',
  primaryDark: '#2E7D32',
  white: '#ffffff',
  background: '#f8f9fa',
};

export const Map: React.FC<MapProps> = ({
  latitude,
  longitude,
  studentName = 'Mi ubicación',
  address = 'Ubicación actual',
}) => {
  const [mapHtml, setMapHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Mi Ubicación</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          #map { height: 100vh; width: 100vw; background: #f8f9fa; }
          .leaflet-control-zoom a {
            width: 30px; height: 30px; line-height: 30px; border-radius: 8px; font-weight: 600;
          }
          .leaflet-popup-content-wrapper {
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          }
          .leaflet-popup-content { margin: 10px 12px; }
          .custom-popup { text-align: center; }
          .popup-title {
            font-weight: 700;
            font-size: 15px;
            color: #2E7D32;
            margin-bottom: 4px;
          }
          .popup-address {
            font-size: 12px;
            color: #666;
            line-height: 1.3;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', {
            zoomControl: true,
            attributionControl: false,
            tap: true,
            touchZoom: true,
            dragging: true,
            scrollWheelZoom: false
          }).setView([${latitude}, ${longitude}], 16);

          var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18
          }).addTo(map);

          var customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: '<div style="background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 3px 10px rgba(76, 175, 80, 0.4); animation: pulse 2s infinite;"><span style="color: white; font-size: 14px;">📍</span></div><style>@keyframes pulse {0%{transform:scale(1);}50%{transform:scale(1.1);}100%{transform:scale(1);}}</style>',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          var marker = L.marker([${latitude}, ${longitude}], {icon: customIcon}).addTo(map);

          var popupContent =
            '<div class="custom-popup">' +
              '<div class="popup-title">${studentName}</div>' +
              '<div class="popup-address">${address}</div>' +
            '</div>';

          marker.bindPopup(popupContent, { maxWidth: 200 });

          L.circle([${latitude}, ${longitude}], {
            radius: 30,
            fillColor: '#4CAF50',
            fillOpacity: 0.1,
            stroke: true,
            color: '#4CAF50',
            weight: 2,
            opacity: 0.4
          }).addTo(map);

          map.doubleClickZoom.disable();
        </script>
      </body>
      </html>
    `;
    setMapHtml(html);
  }, [latitude, longitude, studentName, address]);

  const handleMapLoad = () => {
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {mapHtml ? (
        <WebView
          source={{ html: mapHtml }}
          style={styles.webView}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
          onLoadEnd={handleMapLoad}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      ) : null}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.loadingGradient}
          >
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.loadingText}>Cargando mapa...</Text>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    overflow: 'hidden',
  },
  webView: {
    flex: 1
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default Map;