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
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, FontAwesome5, AntDesign, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


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
  const [isLoading, setIsLoading] = useState(true);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [modalScale] = useState(new Animated.Value(0));
  const [shareModalScale] = useState(new Animated.Value(0));
  const [labelOpacity] = useState(new Animated.Value(0));

  const initialRegion = {
    latitude,
    longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  useEffect(() => {
    // Timeout para evitar loading infinito
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        Animated.timing(labelOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    }, 5000); // 5 segundos de timeout

    return () => clearTimeout(timeout);
  }, [isLoading, labelOpacity]);



  const animateModal = (show: boolean, scaleValue: Animated.Value) => {
    Animated.spring(scaleValue, {
      toValue: show ? 1 : 0,
      useNativeDriver: true,
      tension: 120,
      friction: 10,
    }).start();
  };

  const handleMapReady = () => {
    setIsLoading(false);
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
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          onMapReady={handleMapReady}
          onRegionChangeComplete={() => {
            if (isLoading) {
              setIsLoading(false);
              setTimeout(() => {
                Animated.timing(labelOpacity, {
                  toValue: 1,
                  duration: 500,
                  useNativeDriver: true,
                }).start();
              }, 100);
            }
          }}
          mapType="standard"
        >
          <Marker
            coordinate={{ latitude, longitude }}
            title={studentName}
            description={address}
          >
            <View style={styles.customMarker}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.markerGradient}
              >
                <Ionicons name="location" size={20} color="white" />
              </LinearGradient>
            </View>
          </Marker>

          <Circle
            center={{ latitude, longitude }}
            radius={50}
            fillColor={`${COLORS.primary}20`}
            strokeColor={COLORS.primary}
            strokeWidth={2}
          />
        </MapView>

        {/* Loading overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.loadingGradient}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.loadingText}>Cargando Google Maps...</Text>
              <Text style={styles.loadingSubtext}>Configurando ubicación</Text>
            </LinearGradient>
          </View>
        )}
      </View>

      {/* Label superpuesto en el mapa */}
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

              {address && (
                <View style={styles.addressContainer}>
                  <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.addressText}>{address}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  mapContainer: { flex: 1, position: 'relative' },
  map: { flex: 1 },

  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

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
});

export default Map;
