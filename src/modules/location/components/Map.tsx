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
import { PanResponder, PanResponderInstance } from 'react-native';

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
}) => {
  const insets = useSafeAreaInsets();
  const [mapHtml, setMapHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [panelHeight] = useState(new Animated.Value(0));
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [modalScale] = useState(new Animated.Value(0));
  const [shareModalScale] = useState(new Animated.Value(0));
  const [scrolled, setScrolled] = useState(false);
  const [panelHeightValue, setPanelHeightValue] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const PEEK_HEIGHT = Math.round(Math.max(height * 0.20, 120));
  const MID_HEIGHT = Math.round(Math.max(height * 0.40, 220));
  const MAX65 = Math.round(height * 0.65);
  const TALL_MAX = Math.round(Math.min(height * 0.70, 560));
  const SNAP_POINTS_BASE = [0, PEEK_HEIGHT, MID_HEIGHT, MAX65];
  const SNAP_POINTS = height >= 780 ? [...SNAP_POINTS_BASE, TALL_MAX] : SNAP_POINTS_BASE;
  const MAX_HEIGHT = SNAP_POINTS[SNAP_POINTS.length - 1];
  const heightRef = useRef(0);
  useEffect(() => {
    const id = panelHeight.addListener(({ value }) => {
      heightRef.current = value;
      setPanelHeightValue(value);
    });
    return () => panelHeight.removeListener(id);
  }, [panelHeight]);

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
            '<div class="custom-popup">'+
              '<div class="popup-title">${studentName}</div>'+
              ${address ? `'<div class="popup-address">${address.replace(/'/g, "\\'")}</div>' +` : "'' +"}
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
  }, [latitude, longitude, studentName, address]);

  const animateTo = (toValue: number) => {
    setIsPanelExpanded(toValue === MAX_HEIGHT);
    setIsPanelOpen(toValue > 0);
    Animated.spring(panelHeight, {
      toValue,
      useNativeDriver: false,
      tension: 120,
      friction: 12,
    }).start();
  };

  const animatePanel = (expand: boolean) => {
    const toValue = expand ? MAX_HEIGHT : 0;
    animateTo(toValue);
  };

  const nearestSnap = (val: number) => {
    let nearest = SNAP_POINTS[0];
    let minDiff = Math.abs(val - nearest);
    for (const p of SNAP_POINTS) {
      const d = Math.abs(val - p);
      if (d < minDiff) {
        minDiff = d;
        nearest = p;
      }
    }
    return nearest;
  };

  const startHeightRef = useRef(0);
  const panResponder = useRef<PanResponderInstance>(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 6,
      onPanResponderGrant: () => {
        startHeightRef.current = heightRef.current;
      },
      onPanResponderMove: (_, gesture) => {
        const next = Math.max(0, Math.min(MAX_HEIGHT, startHeightRef.current - gesture.dy));
        panelHeight.setValue(next);
      },
      onPanResponderRelease: (_, gesture) => {
        const current = heightRef.current;
        const velocity = gesture.vy; // + down, - up
        let target = nearestSnap(current);
        const idx = SNAP_POINTS.indexOf(target);
        if (velocity < -0.6 && idx < SNAP_POINTS.length - 1) {
          target = SNAP_POINTS[idx + 1];
        } else if (velocity > 0.6 && idx > 0) {
          target = SNAP_POINTS[idx - 1];
        }
        animateTo(target);
      },
    })
  ).current;

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
    // Abre el panel automáticamente la primera vez
    setTimeout(() => animateTo(MID_HEIGHT), 250);
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
    const prettyAddress = address ? `📮 ${address}` : 'Toca el enlace para abrir la ubicación en el mapa.';
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
            {address ? (
              <Text style={styles.locationPreviewAddress}>{address}</Text>
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />
      {renderDirectionsModal()}
      {renderShareModal()}

      {/* Mapa */}
      <View style={styles.mapContainer}>
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

        {/* Loading overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.loadingGradient}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.loadingText}>Cargando mapa...</Text>
              <Text style={styles.loadingSubtext}>Preparando ubicación</Text>
            </LinearGradient>
          </View>
        )}
      </View>

      {/* Panel flotante */}
      <Animated.View style={[styles.floatingPanel, isPanelOpen ? styles.floatingPanelOpen : null, { height: panelHeight }]}>
        <LinearGradient colors={[COLORS.white, COLORS.background]} style={styles.panelGradient}>
          <ScrollView
            style={styles.panelContainer}
            contentContainerStyle={[
              styles.panelContent,
              { paddingBottom: Math.max(insets.bottom, SPACING.large) },
            ]}
            stickyHeaderIndices={[1]}
            showsVerticalScrollIndicator={true}
            indicatorStyle={Platform.OS === 'ios' ? 'black' : undefined}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            scrollEventThrottle={16}
            onScroll={(e) => {
              const y = e.nativeEvent.contentOffset.y;
              if (y > 2 && !scrolled) setScrolled(true);
              if (y <= 2 && scrolled) setScrolled(false);
            }}
            bounces
          >
            {/* Handle tocable para expandir/contraer */}
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={isPanelExpanded ? 'Contraer panel' : 'Expandir panel'}
              hitSlop={{ top: 12, bottom: 12, left: 24, right: 24 }}
              style={styles.dragHandle}
              activeOpacity={0.7}
              onPress={() => animatePanel(!isPanelExpanded)}
              {...panResponder.panHandlers}
            />

            <View style={[styles.panelHeader, scrolled && styles.panelHeaderScrolled]} {...panResponder.panHandlers}> 
              <View style={styles.studentInfo}>
                <View style={styles.studentNameContainer}>
                  <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={18} color={COLORS.primary} />
                  </View>
                  <Text style={styles.studentName}>{studentName}</Text>
                </View>

                {address && (
                  <View style={styles.addressContainer}>
                    <Ionicons name="home" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.address}>{address}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Hint de gesto */}
            {panelHeightValue < MAX_HEIGHT && !scrolled && (
              <View style={styles.gestureHint}>
                <Ionicons name="swap-vertical" size={16} color={COLORS.textMuted} />
                <Text style={styles.gestureHintText}>Desliza para expandir</Text>
              </View>
            )}

            {/* Acciones */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={handleGetDirections} activeOpacity={0.9}>
                <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.buttonGradient}>
                  <Ionicons name="navigate" size={18} color="white" />
                  <Text style={styles.primaryButtonText}>Direcciones</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleShareLocation} activeOpacity={0.9}>
                <Ionicons name="share-outline" size={18} color={COLORS.primary} />
                <Text style={styles.secondaryButtonText}>Compartir</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  mapContainer: { flex: 1 },
  webView: { flex: 1, backgroundColor: 'transparent' },

  loadingOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  loadingGradient: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: FONT_SIZES.xlarge, color: COLORS.white, marginTop: SPACING.medium, fontWeight: '700' },
  loadingSubtext: { fontSize: FONT_SIZES.medium, color: COLORS.white, marginTop: SPACING.small, opacity: 0.85 },

  floatingPanel: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: BORDER_RADIUS.xlarge,
    borderTopRightRadius: BORDER_RADIUS.xlarge,
    overflow: 'hidden',
    elevation: 18,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  floatingPanelOpen: {
    elevation: 25,
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  panelGradient: { width: '100%', height: '100%' },
  panelContainer: { flex: 1 },
  panelContent: {
    paddingHorizontal: SPACING.xlarge,
    paddingTop: SPACING.medium,
    minHeight: 220,
  },
  dragHandle: {
    width: 46, height: 6, borderRadius: 999,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginVertical: SPACING.medium,
  },

  panelHeader: { marginBottom: SPACING.large, backgroundColor: COLORS.white },
  panelHeaderScrolled: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  gestureHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    alignSelf: 'center',
    marginTop: -SPACING.small,
    marginBottom: SPACING.small,
  },
  gestureHintText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
  },
  studentInfo: { gap: SPACING.medium },
  studentNameContainer: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: {
    width: 36, height: 36, borderRadius: 999,
    backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center',
    marginRight: SPACING.medium,
  },
  studentName: { fontSize: FONT_SIZES.xxxlarge, fontWeight: '800', color: COLORS.textPrimary },

  addressContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.small },
  address: { fontSize: FONT_SIZES.medium, color: COLORS.textSecondary, lineHeight: 20, flex: 1 },

  actionButtons: { flexDirection: 'row', gap: SPACING.medium, marginTop: SPACING.medium, paddingTop: SPACING.small },
  actionButton: { flex: 1, borderRadius: BORDER_RADIUS.medium, overflow: 'hidden' },

  primaryButton: {
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  buttonGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: SPACING.large, paddingHorizontal: SPACING.xlarge, gap: SPACING.small,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 2, borderColor: COLORS.borderLight,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: SPACING.large, paddingHorizontal: SPACING.xlarge, gap: SPACING.small,
  },
  primaryButtonText: { fontSize: FONT_SIZES.large, fontWeight: '700', color: COLORS.white },
  secondaryButtonText: { fontSize: FONT_SIZES.large, fontWeight: '700', color: COLORS.primary },

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
});

export default Map;
