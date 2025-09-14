import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Card, LoadingSpinner } from '../../../../shared/components';
import { useLocation } from '../../../../shared/hooks';
import { Map } from './Map';

const ChildLocationScreen = ({ navigation }: any) => {
  const [isSharing, setIsSharing] = useState(true);
  const { location, isLoading, error } = useLocation();

  const handleToggleSharing = () => {
    Alert.alert(
      'Compartir Ubicación',
      'Para tu seguridad, tu ubicación siempre se comparte con tus papás',
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
          <Text style={styles.loadingText}>Obteniendo tu ubicación...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="location-on" size={40} color="#4CAF50" />
          <Text style={styles.title}>Mi Ubicación</Text>
          <Text style={styles.subtitle}>
            Tus papás siempre pueden verte en el mapa
          </Text>
        </View>

        {/* Status Card */}
        <Card backgroundColor="#E8F5E8" margin={10}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.statusTitle}>Ubicación Compartida</Text>
          </View>
          <Text style={styles.statusDescription}>
            Tu ubicación se está compartiendo de forma segura
          </Text>
        </Card>

        {/* Location Map */}
        {location && (
          <View style={styles.mapContainer}>
            <Map
              latitude={location.coords.latitude}
              longitude={location.coords.longitude}
              studentName="Mi ubicación"
              address="Ubicación actual"
            />
          </View>
        )}

        {/* Safety Info */}
        <Card backgroundColor="#FFF8E1" margin={10}>
          <View style={styles.safetyHeader}>
            <AntDesign name="safety" size={24} color="#e74c3c" />
            <Text style={styles.safetyTitle}>Información de Seguridad</Text>
          </View>
          <Text style={styles.safetyText}>
            • Tu ubicación se actualiza automáticamente{'\n'}
            • Solo tus papás pueden ver donde estás{'\n'}
            • Esta información los ayuda a mantenerte seguro
          </Text>
        </Card>

        {/* Action Button */}
        {/* <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Games')}
        >
          <MaterialIcons name="games" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Ir a Juegos</Text>
        </TouchableOpacity> */}

        {/* Error State */}
        {error && (
          <Card backgroundColor="#FFEBEE" margin={10}>
            <View style={styles.errorHeader}>
              <AntDesign name="warning" size={20} color="#f44336" />
              <Text style={styles.errorTitle}>Error de Ubicación</Text>
            </View>
            <Text style={styles.errorText}>{error}</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  statusCard: {
    marginBottom: 20,
    backgroundColor: '#E8F5E8',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  statusDescription: {
    fontSize: 14,
    color: '#388E3C',
  },
  locationCard: {
    marginBottom: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 10,
    marginVertical: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  locationValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  safetyCard: {
    marginBottom: 30,
    backgroundColor: '#FFF8E1',
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F57C00',
    marginLeft: 8,
  },
  safetyText: {
    fontSize: 14,
    color: '#BF360C',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  errorCard: {
    marginTop: 20,
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c62828',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
  },
});

export default ChildLocationScreen;
