import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';

import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '../../../../shared/hooks';
import { formatDateRange } from '../../../../shared/utils';
import { GPSTrackingIndicator } from '../../../../shared/components';

// Types for API data
interface Child {
  id: number;
  user_id: number;
  nombres: string;
  doc_tipo: string;
  doc_numero: string;
  nums_emergencia: string[];
  fecha_nacimiento: string;
  foto: string | null;
  pasatiempos: string | null;
  deportes: string | null;
  plato_favorito: string | null;
  color_favorito: string | null;
  informacion_adicional: string | null;
  created_at: string;
  updated_at: string;
  inscripciones: Inscription[];
}

interface Inscription {
  id: number;
  hijo_id: number;
  paquete_id: number;
  grupo_id: number;
  usuario_id: number;
  created_at: string;
  updated_at: string;
  grupo: Group;
}

interface Group {
  id: number;
  paquete_id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  capacidad: number;
  tipo_encargado: string[];
  nombre_encargado: string[];
  celular_encargado: string[];
  tipo_encargado_agencia: string[];
  nombre_encargado_agencia: string[];
  celular_encargado_agencia: string[];
  activo: boolean;
  created_at: string;
  updated_at: string;
  paquete: Package;
}

interface Package {
  id: number;
  nombre: string;
  destino: string;
  descripcion: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}


// --- Child-Friendly Colors ---
const COLORS = {
  primary: '#e74c3c',      // Orange color as requested
  secondary: '#e74c3c',    // Orange color as requested 
  accent: '#FFE66D',       // Sunny yellow
  purple: '#B983FF',       // Soft purple
  pink: '#FF8A9B',         // Soft pink
  blue: '#6BB6FF',         // Sky blue
  green: '#68D391',        // Success green
  white: '#FFFFFF',
  background: '#F8F9FF',   // Very light blue-white
  surface: '#FFFFFF',
  textPrimary: '#2D3748',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  border: '#E2E8F0',
};

const DashboardScreen = ({ navigation }: { navigation?: any }) => {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    Alert.alert(
      "¿Te quieres ir? 😢",
      "Si sales de la app, tendrás que volver a ingresar tus datos. ¿Estás seguro?",
      [
        {
          text: "No, quedarme 😊",
          style: "cancel"
        },
        {
          text: "Sí, salir 👋",
          style: "destructive",
          onPress: () => logout()
        }
      ]
    );
  };

  // Get child data - since this is now a child-focused app
  const rawChildren: Child[] = (user?.hijos as Child[]) || [];
  const childData = rawChildren[0]; // Get first child for profile display
  
  // Child information for display
  const childName = childData?.nombres || "Pequeño Explorador";
  const childAge = childData?.fecha_nacimiento ? 
    new Date().getFullYear() - new Date(childData.fecha_nacimiento).getFullYear() : 8;
  const childInitials = childName.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  
  // Parent info for emergency purposes
  const parentName = user?.name || "Papá/Mamá";
  const isAdmin = user?.is_admin || false;

  // Transform child data for current trip info
  const currentTrip = childData ? {
    destination: childData.inscripciones?.[0]?.grupo?.paquete?.destino || "¡Aventura Especial!",
    dates: childData.inscripciones?.[0]?.grupo ? 
      formatDateRange(
        childData.inscripciones[0].grupo.fecha_inicio, 
        childData.inscripciones[0].grupo.fecha_fin
      ) : "Próximamente",
    group: childData.inscripciones?.[0]?.grupo?.nombre || "Grupo Aventurero",
    responsible: childData.inscripciones?.[0]?.grupo?.nombre_encargado?.[0] || 
                childData.inscripciones?.[0]?.grupo?.nombre_encargado_agencia?.[0] || "Guía Especial",
  } : {
    destination: "¡Tu próxima aventura!",
    dates: "Muy pronto",
    group: "Grupo Especial",
    responsible: "Tu Guía Favorito"
  };

  // Fun activities for kids
  const funActivities = [
    {
      id: 1,
      title: "¿Dónde estoy?",
      subtitle: "¡Ve tu ubicación! 📍",
      icon: <FontAwesome6 name="map-location-dot" size={24} color="#fff" />,
      color: COLORS.primary,
      action: () => {
        navigation?.navigate('Location');
      }
    },
    {
      id: 2,
      title: "Mi Perfil",
      subtitle: "¡Conóceme más! 👤",
      icon: <FontAwesome name="user" size={24} color="#fff" />,
      color: COLORS.secondary,
      action: () => {
        // Datos hardcodeados de ejemplo para el hijo
        const childDataExample = {
          id: 1,
          user_id: 1,
          nombres: "Sofía Valentina García López",
          doc_tipo: "DNI",
          doc_numero: "87654321",
          nums_emergencia: ["+51 987 654 321", "+51 912 345 678"],
          fecha_nacimiento: "2015-03-15",
          foto: null,
          pasatiempos: "Dibujar, leer cuentos, jugar con muñecas",
          deportes: "Natación, gimnasia",
          plato_favorito: "Pizza con piña y pollo a la plancha",
          color_favorito: "Rosa y morado",
          informacion_adicional: "Es muy sociable y le encanta hacer nuevos amigos. Le gusta ayudar a sus compañeros y es muy creativa. Tiene alergia leve a los mariscos.",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z",
          inscripciones: []
        };
        navigation?.navigate('ChildProfile', { childData: childDataExample });
      }
    },
    
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* GPS Tracking Indicator */}
        <GPSTrackingIndicator showDetails={true} />

        {/* Header with Child Profile */}
        <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
          <Animated.View 
            entering={FadeInDown.delay(100).springify()}
            style={styles.profileSection}
          >
            {/* Avatar and greeting */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{childInitials}</Text>
              </View>
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>¡Hola {childName.split(' ')[0]}! 👋</Text>
                <Text style={styles.subGreeting}>
                  {childAge} años • ¡Listo para la aventura! 🌟
                </Text>
              </View>
            </View>

            {/* Logout button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </Animated.View>

          {/* Fun Stats Cards */}
          <Animated.View 
            entering={FadeInUp.delay(200).springify()}
            style={styles.statsContainer}
          >
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>🎒</Text>
              <Text style={styles.statLabel}>Mi Viaje</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>⭐</Text>
              <Text style={styles.statLabel}>¡Genial!</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>🌍</Text>
              <Text style={styles.statLabel}>Explorador</Text>
            </View>
          </Animated.View>
        </View>

        {/* Current Adventure Card */}
        <Animated.View 
          entering={FadeInUp.delay(300).springify()}
          style={styles.adventureCard}
        >
          <View style={styles.adventureHeader}>
            <Text style={styles.adventureTitle}>Mi Aventura Actual ✨</Text>
            <Text style={styles.adventureEmoji}>🎯</Text>
          </View>
          
          <Text style={styles.destination}>{currentTrip.destination}</Text>
          <Text style={styles.dates}>{currentTrip.dates}</Text>
          
          <View style={styles.adventureDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="people" size={16} color={COLORS.secondary} />
              <Text style={styles.detailText}>{currentTrip.group}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="shield-checkmark" size={16} color={COLORS.accent} />
              <Text style={styles.detailText}>{currentTrip.responsible}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Fun Activities Grid */}
        <View style={styles.activitiesSection}>
          <Animated.Text 
            entering={FadeInUp.delay(400).springify()}
            style={styles.sectionTitle}
          >
            ¡Cosas Divertidas! 🎮
          </Animated.Text>
          
          <View style={styles.activitiesGrid}>
            {funActivities.map((activity, index) => (
              <Animated.View
                key={activity.id}
                entering={FadeInUp.delay(500 + index * 100).springify()}
                style={styles.activityCardContainer}
              >
                <TouchableOpacity
                  style={[styles.activityCard, { backgroundColor: activity.color }]}
                  onPress={activity.action}
                  activeOpacity={0.8}
                >
                  <View style={styles.activityIcon}>{activity.icon}</View>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Emergency Contact Info */}
        {childData?.nums_emergencia && childData.nums_emergencia.length > 0 && (
          <Animated.View 
            entering={FadeInUp.delay(800).springify()}
            style={styles.emergencyCard}
          >
            <View style={styles.emergencyHeader}>
              <Ionicons name="heart" size={20} color={COLORS.pink} />
              <Text style={styles.emergencyTitle}>Mis Personas de Confianza</Text>
            </View>
            <Text style={styles.emergencySubtitle}>
              {parentName} siempre está cuidándote ❤️
            </Text>
          </Animated.View>
        )}


      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
  },
  adventureCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  adventureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  adventureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  adventureEmoji: {
    fontSize: 24,
  },
  destination: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 6,
  },
  dates: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
    fontWeight: '500',
  },
  adventureDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activitiesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityCardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  activityCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  activityIcon: {
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  emergencyCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.pink,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default DashboardScreen;
