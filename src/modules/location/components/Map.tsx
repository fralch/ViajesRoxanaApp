import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  Linking,
  Animated,
  ActivityIndicator,
  StatusBar,
  Modal,
  Share,
  Vibration,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, FontAwesome5, AntDesign, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LocationService } from '../../../shared/services';


// --- Design System refinado ---
const COLORS = {
  primary: '#d62d28',
  primaryDark: '#b91c1c',
  primaryLight: '#fef2f2',
  white: '#ffffff',
  black: '#000000',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  background: '#f9fafb',
  surface: '#ffffff',
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  success: '#10b981',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

const SPACING = {
  xs: 4,
  small: 8,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
};

const FONT_SIZES = {
  xs: 10,
  small: 12,
  medium: 14,
  large: 16,
  xlarge: 18,
  xxlarge: 20,
  xxxlarge: 24,
};

const BORDER_RADIUS = {
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 20,
};

// Función helper para detectar URLs en texto
const detectURL = (text: string | null | undefined): string | null => {
  if (!text) return null;
  
  const urlRegex = /(https?:\/\/[^\s<>"'()]+)/gi;
  let match = text.match(urlRegex);
  
  if (match) {
    return match[0];
  }

  const domainRegex = /([a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s<>"'()]*)/gi;
  match = text.match(domainRegex);
  if (match && !match[0].startsWith('http')) {
    if (match[0].includes('/') || match[0].split('.').length > 2) {
       return 'https://' + match[0];
    }
  }
  
  return null;
};

// Función helper para extraer texto sin URL
const getTextWithoutURL = (text: string | null | undefined): string => {
  if (!text) return '';
  const url = detectURL(text);
  if (!url) return text;
  return text.replace(url.replace('https://', ''), '').trim();
};

interface MapProps {
  latitude?: number;
  longitude?: number;
  studentName?: string;
  address?: string;
  docNumber?: string;
  onClose?: () => void;
}

const { width, height } = Dimensions.get('window');

export const Map: React.FC<MapProps> = ({
  latitude: propLatitude,
  longitude: propLongitude,
  studentName: propStudentName,
  address: propAddress,
  docNumber,
}) => {
  const insets = useSafeAreaInsets();
  const [mapHtml, setMapHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [modalScale] = useState(new Animated.Value(0));
  const [shareModalScale] = useState(new Animated.Value(0));
  const [labelOpacity] = useState(new Animated.Value(0));
  const [activeTab, setActiveTab] = useState('map');
  
  // State for API data
  const [apiData, setApiData] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Use API data when available, otherwise use props, then fallback to defaults
  const latitude = apiData?.currentLocation?.latitude || propLatitude || 4.6097;
  const longitude = apiData?.currentLocation?.longitude || propLongitude || -74.0817;
  const studentName = apiData?.student?.name || propStudentName || 'Estudiante';
  const address = apiData?.currentLocation?.address || propAddress || 'Ubicación no disponible';

  const liveUrl = useMemo(() => detectURL(apiData?.currentLocation?.description || address), [apiData, address]);
  const cleanAddress = useMemo(() => getTextWithoutURL(apiData?.currentLocation?.description || address), [apiData, address]);
  const showTabs = !!liveUrl;

  // Fetch API data when docNumber is provided
  useEffect(() => {
    const fetchLocationData = async () => {
      if (docNumber) {
        try {
          setApiError(null);
          const apiResponse = await LocationService.getLastLocation(docNumber);
          const transformedData = LocationService.transformLocationData(apiResponse);
          setApiData(transformedData);
        } catch (err) {
          console.error('Error fetching location data for map:', err);
          setApiError(err instanceof Error ? err.message : 'Error desconocido');
        }
      }
    };

    fetchLocationData();
  }, [docNumber]);

  useEffect(() => {
    // HTML de Leaflet sin mostrar lat/long en el popup
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Mapa de Ubicación</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          #map { height: 100vh; width: 100vw; background: #fff; }
          .leaflet-control-zoom a {
            width: 34px; height: 34px; line-height: 34px; border-radius: 10px; font-weight: 700;
          }
          .leaflet-popup-content-wrapper {
            border-radius: 14px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          }
          .leaflet-popup-content { margin: 12px 14px; }
          .custom-popup { text-align: left; }
          .popup-title { font-weight: 800; font-size: 16px; color: #111827; margin-bottom: 6px; }
          .popup-address { font-size: 13px; color: #4b5563; line-height: 1.4; }
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
            dragging: true
          }).setView([${latitude}, ${longitude}], 18);

          var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(map);

          var customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: '<div style="background: linear-gradient(135deg, #d62d28 0%, #b91c1c 100%); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 4px solid white; box-shadow: 0 4px 12px rgba(214, 45, 40, 0.35); animation: pulse 2s infinite;"><span style="color: white; font-size: 18px;">📍</span></div><style>@keyframes pulse {0%{transform:scale(1);}50%{transform:scale(1.1);}100%{transform:scale(1);}}</style>',
            iconSize: [36, 36],
            iconAnchor: [18, 18]
          });

          var marker = L.marker([${latitude}, ${longitude}], {icon: customIcon}).addTo(map);

          var popupContent =
            '<div class="custom-popup"'+ 
              '<div class="popup-title">${studentName}</div>'+ 
              ${cleanAddress ? `'<div class="popup-address">${cleanAddress.replace(/'/g, "\'" )}</div>' +` : "'' +"}
            '</div>';

          marker.bindPopup(popupContent, { maxWidth: 260 });
          L.circle([${latitude}, ${longitude}], {
            radius: 50, fillColor: '#d62d28', fillOpacity: 0.08, stroke: true, color: '#d62d28', weight: 2, opacity: 0.35
          }).addTo(map);

          map.doubleClickZoom.disable();
        </script>
      </body>
      </html>
    `;
    setMapHtml(html);
  }, [latitude, longitude, studentName, cleanAddress]);



  const animateModal = (show: boolean, scaleValue: Animated.Value) => {
    Animated.spring(scaleValue, {
      toValue: show ? 1 : 0,
      useNativeDriver: true,
      tension: 120,
      friction: 10,
    }).start();
  };

  const handleMapLoad = () => {
    setIsLoading(false);
    // Anima la aparición del label
    setTimeout(() => {
      Animated.timing(labelOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 250);
  };

  const handleShareLocation = () => {
    setShowShareModal(true);
    animateModal(true, shareModalScale);
  };

  const handleGetDirections = () => {
    setShowDirectionsModal(true);
    animateModal(true, modalScale);
  };

  const closeDirectionsModal = () => {
    animateModal(false, modalScale);
    setTimeout(() => setShowDirectionsModal(false), 200);
  };

  const closeShareModal = () => {
    animateModal(false, shareModalScale);
    setTimeout(() => setShowShareModal(false), 200);
  };

  const openNavigationApp = (appType: 'apple' | 'google' | 'waze') => {
    let url = '';
    switch (appType) {
      case 'apple':
        url = `http://maps.apple.com/?daddr=${latitude},${longitude}`;
        break;
      case 'google':
        url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        break;
      case 'waze':
        url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
        break;
    }
    Linking.openURL(url).catch(() => {
      const appNames = { apple: 'Apple Maps', google: 'Google Maps', waze: 'Waze' } as const;
      Alert.alert('❌ Error', `No se pudo abrir ${appNames[appType]}`);
    });
    closeDirectionsModal();
  };

  // Compartir SIN mostrar lat/long en el texto. Solo texto + link.
  const shareViaApp = async (method: 'native' | 'copy' | 'whatsapp') => {
    const title = `Ubicación de ${studentName}`;
    // Si hay dirección, la usamos; de lo contrario, un texto genérico sin números
    const prettyAddress = cleanAddress ? `📮 ${cleanAddress}` : 'Toca el enlace para abrir la ubicación en el mapa.';
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const message = `📍 ${title}\n${prettyAddress}\n🔗 ${mapsUrl}`;

    try {
      switch (method) {
        case 'native':
          await Share.share({ message, title });
          break;
        case 'copy':
          await Share.share({ message, title }); // En iOS copiar requiere Clipboard; evitamos mostrar coords directas
          // Si prefieres copiar directo al portapapeles, usa Clipboard.setString(message)
          break;
        case 'whatsapp':
          const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
          await Linking.openURL(whatsappUrl);
          break;
      }
      closeShareModal();
    } catch (error) {
      if (method === 'whatsapp') {
        Alert.alert('❌ Error', 'WhatsApp no está instalado');
      } else {
        Alert.alert('❌ Error', 'No se pudo compartir la ubicación');
      }
    }
  };

  const renderDirectionsModal = () => (
    <Modal animationType="fade" transparent visible={showDirectionsModal} onRequestClose={closeDirectionsModal}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: modalScale }] }]}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="navigate" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.modalTitle}>Obtener direcciones</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeDirectionsModal} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>
            Elige tu aplicación de navegación favorita
          </Text>

          <View style={styles.navigationOptions}>
            <TouchableOpacity style={styles.navigationOption} onPress={() => openNavigationApp('apple')} activeOpacity={0.85}>
              <LinearGradient colors={['#007AFF', '#0051D5']} style={styles.navIconGradient}>
                <FontAwesome name="apple" size={20} color="white" />
              </LinearGradient>
              <View style={styles.navTextContainer}>
                <Text style={styles.navigationText}>Apple Maps</Text>
                <Text style={styles.navigationSubtext}>Navegación integrada</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navigationOption} onPress={() => openNavigationApp('google')} activeOpacity={0.85}>
              <LinearGradient colors={['#4285f4', '#1a73e8']} style={styles.navIconGradient}>
                <AntDesign name="google" size={20} color="white" />
              </LinearGradient>
              <View style={styles.navTextContainer}>
                <Text style={styles.navigationText}>Google Maps</Text>
                <Text style={styles.navigationSubtext}>Rutas en tiempo real</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navigationOption} onPress={() => openNavigationApp('waze')} activeOpacity={0.85}>
              <LinearGradient colors={['#33CCFF', '#00B4D8']} style={styles.navIconGradient}>
                <FontAwesome5 name="waze" size={18} color="white" />
              </LinearGradient>
              <View style={styles.navTextContainer}>
                <Text style={styles.navigationText}>Waze</Text>
                <Text style={styles.navigationSubtext}>Tráfico y alertas</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={closeDirectionsModal} activeOpacity={0.85}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const renderShareModal = () => (
    <Modal animationType="fade" transparent visible={showShareModal} onRequestClose={closeShareModal}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.shareModalContainer, { transform: [{ scale: shareModalScale }] }]}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <View style={[styles.modalIconContainer, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="share-outline" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.modalTitle}>Compartir ubicación</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeShareModal} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Vista previa sin mostrar coordenadas */}
          <View style={styles.locationPreview}>
            <View style={styles.locationPreviewHeader}>
              <Ionicons name="location" size={16} color={COLORS.primary} />
              <Text style={styles.locationPreviewTitle}>{studentName}</Text>
            </View>
            {cleanAddress ? (
              <Text style={styles.locationPreviewAddress}>{cleanAddress}</Text>
            ) : (
              <Text style={styles.locationPreviewAddress}>
                La ubicación se abrirá en el mapa.
              </Text>
            )}
          </View>

          <View style={styles.shareOptions}>
            <TouchableOpacity style={styles.shareOption} onPress={() => shareViaApp('native')} activeOpacity={0.85}>
              <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.shareIconGradient}>
                <Ionicons name="share-outline" size={20} color="white" />
              </LinearGradient>
              <View style={styles.shareTextContainer}>
                <Text style={styles.shareText}>Compartir</Text>
                <Text style={styles.shareSubtext}>Usar menú del sistema</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareOption} onPress={() => shareViaApp('whatsapp')} activeOpacity={0.85}>
              <LinearGradient colors={['#25D366', '#1DA851']} style={styles.shareIconGradient}>
                <FontAwesome name="whatsapp" size={20} color="white" />
              </LinearGradient>
              <View style={styles.shareTextContainer}>
                <Text style={styles.shareText}>WhatsApp</Text>
                <Text style={styles.shareSubtext}>Enviar por WhatsApp</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={closeShareModal} activeOpacity={0.85}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const renderTabs = () => {
    if (!showTabs) return null;
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'map' && styles.activeTabButton]}
          onPress={() => setActiveTab('map')}
          activeOpacity={0.8}
        >
          <Ionicons name="map-outline" size={16} color={activeTab === 'map' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabButtonText, activeTab === 'map' && styles.activeTabButtonText]}>Mapa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'live' && styles.activeTabButton]}
          onPress={() => setActiveTab('live')}
          activeOpacity={0.8}
        >
          <View style={styles.liveIconContainer}>
            <View style={styles.liveIconDot} />
            <Ionicons name="radio-outline" size={16} color={activeTab === 'live' ? COLORS.primary : COLORS.textSecondary} />
          </View>
          <Text style={[styles.tabButtonText, activeTab === 'live' && styles.activeTabButtonText]}>Tiempo Real</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Show error state if API failed when docNumber is provided
  if (apiError && docNumber) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color={COLORS.primary} />
          <Text style={styles.errorTitle}>Error al cargar ubicación</Text>
          <Text style={styles.errorMessage}>{apiError}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              const fetchLocationData = async () => {
                try {
                  setApiError(null);
                  const apiResponse = await LocationService.getLastLocation(docNumber);
                  const transformedData = LocationService.transformLocationData(apiResponse);
                  setApiData(transformedData);
                } catch (err) {
                  setApiError(err instanceof Error ? err.message : 'Error desconocido');
                }
              };
              fetchLocationData();
            }}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />
      {renderDirectionsModal()}
      {renderShareModal()}

      {renderTabs()}

      {/* MAPA */}
      <View style={styles.mapContainer}>
        {activeTab === 'map' && (
          <>
            {mapHtml ? (
              <WebView
                source={{ html: mapHtml }}
                style={styles.webView}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState={false}
                scalesPageToFit={Platform.OS === 'android'}
                onLoadEnd={handleMapLoad}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              />
            ) : null}

            {isLoading && (
              <View style={styles.loadingOverlay}>
                <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.loadingGradient}>
                  <ActivityIndicator size="large" color="white" />
                  <Text style={styles.loadingText}>Cargando mapa...</Text>
                  <Text style={styles.loadingSubtext}>Preparando ubicación</Text>
                </LinearGradient>
              </View>
            )}
          </>
        )}

        {activeTab === 'live' && liveUrl && (
          <WebView
            source={{ uri: liveUrl }}
            style={styles.webView}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingOverlay}>
                <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.loadingGradient}>
                  <ActivityIndicator size="large" color="white" />
                  <Text style={styles.loadingText}>Cargando mapa en vivo...</Text>
                  <Text style={styles.loadingSubtext}>Conectando con el servidor</Text>
                </LinearGradient>
              </View>
            )}
          />
        )}
      </View>

      {/* Label superpuesto en el mapa */}
      {activeTab === 'map' && (
        <Animated.View style={[styles.mapLabel, { opacity: labelOpacity }]}>
          <LinearGradient colors={[COLORS.white, COLORS.background]} style={styles.labelGradient}>
            <View style={styles.labelContent}>
              <View style={styles.studentInfo}>
                <View style={styles.studentNameContainer}>
                  <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={18} color={COLORS.primary} />
                  </View>
                  <Text style={styles.studentName}>{studentName}</Text>
                </View>

                {cleanAddress && (
                  <View style={styles.addressContainer}>
                    <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.addressText}>{cleanAddress}</Text>
                  </View>
                )}
              </View>
              
              {/* Botones de acción */}
              <View style={styles.labelActions}>
                <TouchableOpacity
                  style={styles.labelActionButton}
                  onPress={handleGetDirections}
                  activeOpacity={0.85}
                >
                  <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.labelButtonGradient}>
                    <Ionicons name="navigate" size={18} color="white" />
                    <Text style={styles.labelButtonText}>Direcciones</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.labelActionButton}
                  onPress={handleShareLocation}
                  activeOpacity={0.85}
                >
                  <View style={styles.labelSecondaryButton}>
                    <Ionicons name="share-outline" size={18} color={COLORS.primary} />
                    <Text style={styles.labelSecondaryButtonText}>Compartir</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  mapContainer: { flex: 1, position: 'relative' },
  webView: { flex: 1 },

  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
  },
  loadingGradient: {
    paddingVertical: SPACING.xxlarge, paddingHorizontal: SPACING.xlarge,
    borderRadius: BORDER_RADIUS.large, alignItems: 'center', gap: SPACING.medium,
  },
  loadingText: { fontSize: FONT_SIZES.xlarge, fontWeight: '700', color: COLORS.white },
  loadingSubtext: { fontSize: FONT_SIZES.medium, color: COLORS.white, marginTop: SPACING.small, opacity: 0.85 },

  mapLabel: {
    position: 'absolute',
    bottom: SPACING.large,
    left: SPACING.medium,
    right: SPACING.medium,
    borderRadius: BORDER_RADIUS.large,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  labelGradient: { width: '100%' },
  labelContent: {
    padding: SPACING.large,
  },
  studentInfo: { gap: SPACING.small },
  studentNameContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.medium },
  avatarContainer: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  studentName: { fontSize: FONT_SIZES.xlarge, fontWeight: '800', color: COLORS.textPrimary, flex: 1 },

  addressContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.small },
  addressText: { fontSize: FONT_SIZES.small, color: COLORS.textSecondary, lineHeight: 18, flex: 1 },

  labelActions: { flexDirection: 'row', gap: SPACING.small, marginTop: SPACING.medium },
  labelActionButton: { flex: 1, borderRadius: BORDER_RADIUS.small, overflow: 'hidden' },
  labelButtonGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: SPACING.medium, paddingHorizontal: SPACING.large, gap: SPACING.xs,
  },
  labelSecondaryButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: SPACING.medium, paddingHorizontal: SPACING.large, gap: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
  },
  labelButtonText: { fontSize: FONT_SIZES.medium, fontWeight: '600', color: COLORS.white },
  labelSecondaryButtonText: { fontSize: FONT_SIZES.medium, fontWeight: '600', color: COLORS.primary },

  // Modales
  modalOverlay: {
    flex: 1, backgroundColor: COLORS.overlay,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.xlarge,
  },
  modalContainer: {
    backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.large,
    padding: SPACING.xxlarge, width: '100%', maxWidth: 420,
    shadowColor: COLORS.black, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 16,
  },
  shareModalContainer: {
    backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.large,
    padding: SPACING.xxlarge, width: '100%', maxWidth: 380,
    shadowColor: COLORS.black, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 16,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.large },
  modalTitleContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  modalIconContainer: {
    width: 40, height: 40, borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.medium,
  },
  modalTitle: { fontSize: FONT_SIZES.xlarge, fontWeight: '800', color: COLORS.textPrimary, flex: 1 },
  closeButton: { width: 40, height: 40, borderRadius: BORDER_RADIUS.medium, backgroundColor: COLORS.borderLight, justifyContent: 'center', alignItems: 'center' },
  modalSubtitle: { fontSize: FONT_SIZES.medium, color: COLORS.textSecondary, marginBottom: SPACING.xlarge, textAlign: 'center', lineHeight: 22 },

  navigationOptions: { gap: SPACING.medium, marginBottom: SPACING.xlarge },
  navigationOption: { flexDirection: 'row', alignItems: 'center', padding: SPACING.large, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.medium, borderWidth: 1, borderColor: COLORS.borderLight },
  navIconGradient: { width: 44, height: 44, borderRadius: BORDER_RADIUS.medium, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.medium },
  navTextContainer: { flex: 1 },
  navigationText: { fontSize: FONT_SIZES.large, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  navigationSubtext: { fontSize: FONT_SIZES.small, color: COLORS.textMuted },

  // Compartir
  locationPreview: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.medium, padding: SPACING.large, marginBottom: SPACING.xlarge, borderWidth: 1, borderColor: COLORS.borderLight },
  locationPreviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.small },
  locationPreviewTitle: { fontSize: FONT_SIZES.large, fontWeight: '700', color: COLORS.textPrimary, marginLeft: SPACING.small },
  locationPreviewAddress: { fontSize: FONT_SIZES.small, color: COLORS.textSecondary },

  shareOptions: { gap: SPACING.medium, marginBottom: SPACING.xlarge },
  shareOption: { flexDirection: 'row', alignItems: 'center', padding: SPACING.large, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.medium, borderWidth: 1, borderColor: COLORS.borderLight },
  shareIconGradient: { width: 40, height: 40, borderRadius: BORDER_RADIUS.medium, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.medium },
  shareTextContainer: { flex: 1 },
  shareText: { fontSize: FONT_SIZES.large, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  shareSubtext: { fontSize: FONT_SIZES.small, color: COLORS.textMuted },

  cancelButton: { padding: SPACING.large, backgroundColor: COLORS.borderLight, borderRadius: BORDER_RADIUS.medium, alignItems: 'center' },
  cancelButtonText: { fontSize: FONT_SIZES.large, fontWeight: '700', color: COLORS.textSecondary },

  // Error states
  centerContent: { justifyContent: 'center', alignItems: 'center', padding: SPACING.xlarge },
  errorContainer: { alignItems: 'center', maxWidth: 280 },
  errorTitle: { fontSize: FONT_SIZES.xlarge, fontWeight: '700', color: COLORS.textPrimary, marginTop: SPACING.medium, marginBottom: SPACING.small, textAlign: 'center' },
  errorMessage: { fontSize: FONT_SIZES.medium, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xlarge, lineHeight: 20 },
  retryButton: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xlarge, paddingVertical: SPACING.medium, borderRadius: BORDER_RADIUS.medium },
  retryButtonText: { fontSize: FONT_SIZES.medium, fontWeight: '600', color: COLORS.white },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    padding: SPACING.xs,
    marginHorizontal: SPACING.medium,
    marginTop: SPACING.small,
    backgroundColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.medium,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.small,
    gap: SPACING.small,
  },
  activeTabButton: {
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  tabButtonText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabButtonText: {
    color: COLORS.primary,
  },
  liveIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  liveIconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 2,
  },
});

export default Map;