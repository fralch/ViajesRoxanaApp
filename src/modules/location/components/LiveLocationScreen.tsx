import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';

const LiveLocationScreen = ({ navigation }: { navigation?: any }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const locationData = {
    currentLocation: {
      latitude: -13.1631,
      longitude: -72.5450,
      address: "Hotel Imperial Cusco, Av. Imperial 345, Cusco",
      accuracy: 5,
      altitude: 3399
    },
    student: {
      name: "María José Rodríguez",
      tripCode: "VR-2025-001",
      group: "Grupo Aventura"
    },
    currentActivity: {
      name: "Descanso en el hotel",
      startTime: "20:00",
      endTime: "07:00",
      location: "Hotel Imperial Cusco",
      description: "Los estudiantes están descansando después de la cena. Próxima actividad mañana a las 7:00 AM."
    },
    liveStatus: {
      status: "safe", // safe, warning, emergency
      lastMovement: "5 min ago",
      batteryLevel: 78,
      signalStrength: 4
    },
    recentActivities: [
      {
        id: 1,
        time: "19:30",
        activity: "Llegada al hotel",
        location: "Hotel Imperial Cusco",
        status: "completed",
        notes: "Todos los estudiantes llegaron seguros"
      },
      {
        id: 2,
        time: "18:45",
        activity: "Traslado desde restaurante",
        location: "Restaurante Inka → Hotel Imperial",
        status: "completed",
        notes: "Viaje en bus sin incidentes"
      },
      {
        id: 3,
        time: "17:00",
        activity: "Cena grupal",
        location: "Restaurante Inka",
        status: "completed",
        notes: "Cena típica cusqueña"
      }
    ],
    emergencyContacts: [
      {
        id: 1,
        name: "Carlos Mendoza",
        role: "Responsable del viaje",
        phone: "+51 999 123 456",
        available: true
      },
      {
        id: 2,
        name: "Clínica San Pablo Cusco",
        role: "Centro médico",
        phone: "+51 84 240 000",
        available: true
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'emergency': return '#f44336';
      default: return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'safe': return 'Seguro';
      case 'warning': return 'Precaución';
      case 'emergency': return 'Emergencia';
      default: return 'Desconocido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return '✅';
      case 'warning': return '⚠️';
      case 'emergency': return '🚨';
      default: return '❓';
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  const handleEmergencyAlert = () => {
    Alert.alert(
      'Alerta de Emergencia',
      '¿Estás seguro de que quieres enviar una alerta de emergencia? Se notificará inmediatamente al responsable del viaje.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Enviar Alerta', 
          style: 'destructive',
          onPress: () => Alert.alert('Alerta Enviada', 'Se ha notificado a los responsables')
        }
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-PE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Ubicación en Vivo</Text>
        <Text style={styles.subtitle}>Seguimiento en tiempo real</Text>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusIcon}>{getStatusIcon(locationData.liveStatus.status)}</Text>
            <View>
              <Text style={styles.statusTitle}>Estado Actual</Text>
              <Text style={[styles.statusText, { color: getStatusColor(locationData.liveStatus.status) }]}>
                {getStatusText(locationData.liveStatus.status)}
              </Text>
            </View>
          </View>
          <View style={styles.lastUpdateContainer}>
            <Text style={styles.lastUpdateLabel}>Última actualización</Text>
            <Text style={styles.lastUpdateTime}>{formatTime(lastUpdate)}</Text>
          </View>
        </View>

        <View style={styles.statusDetails}>
          <View style={styles.statusDetailItem}>
            <Text style={styles.statusDetailIcon}>🔋</Text>
            <Text style={styles.statusDetailText}>Batería: {locationData.liveStatus.batteryLevel}%</Text>
          </View>
          <View style={styles.statusDetailItem}>
            <Text style={styles.statusDetailIcon}>📶</Text>
            <Text style={styles.statusDetailText}>Señal: {'●'.repeat(locationData.liveStatus.signalStrength)}{'○'.repeat(4-locationData.liveStatus.signalStrength)}</Text>
          </View>
          <View style={styles.statusDetailItem}>
            <Text style={styles.statusDetailIcon}>🚶</Text>
            <Text style={styles.statusDetailText}>Último movimiento: {locationData.liveStatus.lastMovement}</Text>
          </View>
        </View>
      </View>

      {/* Student Info */}
      <View style={styles.studentCard}>
        <Text style={styles.cardTitle}>Información del Estudiante</Text>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{locationData.student.name}</Text>
          <Text style={styles.studentDetails}>Código: {locationData.student.tripCode}</Text>
          <Text style={styles.studentDetails}>Grupo: {locationData.student.group}</Text>
        </View>
      </View>

      {/* Current Location */}
      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <Text style={styles.cardTitle}>Ubicación Actual</Text>
          <TouchableOpacity 
            style={styles.mapButton}
            onPress={() => {
              if (navigation) {
                navigation.navigate('MapScreen', {
                  latitude: locationData.currentLocation.latitude,
                  longitude: locationData.currentLocation.longitude,
                  studentName: locationData.student.name,
                  address: locationData.currentLocation.address
                });
              }
            }}
          >
            <Text style={styles.mapButtonText}>🗺️ Ver en Mapa</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.locationDetails}>
          <Text style={styles.locationAddress}>{locationData.currentLocation.address}</Text>
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesText}>
              📍 {locationData.currentLocation.latitude.toFixed(4)}, {locationData.currentLocation.longitude.toFixed(4)}
            </Text>
            <Text style={styles.accuracyText}>
              Precisión: {locationData.currentLocation.accuracy}m | Altitud: {locationData.currentLocation.altitude}m
            </Text>
          </View>
        </View>
      </View>

      {/* Current Activity */}
      <View style={styles.activityCard}>
        <Text style={styles.cardTitle}>Actividad Actual</Text>
        <View style={styles.currentActivity}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityName}>{locationData.currentActivity.name}</Text>
            <Text style={styles.activityTime}>
              {locationData.currentActivity.startTime} - {locationData.currentActivity.endTime}
            </Text>
          </View>
          <Text style={styles.activityLocation}>📍 {locationData.currentActivity.location}</Text>
          <Text style={styles.activityDescription}>{locationData.currentActivity.description}</Text>
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <Text style={styles.cardTitle}>Actividades Recientes</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Ver todo</Text>
          </TouchableOpacity>
        </View>

        {locationData.recentActivities.map((activity) => (
          <View key={activity.id} style={styles.historyItem}>
            <View style={styles.historyTime}>
              <Text style={styles.historyTimeText}>{activity.time}</Text>
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyActivityName}>{activity.activity}</Text>
              <Text style={styles.historyLocation}>{activity.location}</Text>
              {activity.notes && (
                <Text style={styles.historyNotes}>{activity.notes}</Text>
              )}
            </View>
            <View style={[styles.historyStatus, { backgroundColor: '#4CAF50' }]}>
              <Text style={styles.historyStatusText}>✓</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Emergency Section */}
      <View style={styles.emergencyCard}>
        <Text style={styles.cardTitle}>🚨 Contactos de Emergencia</Text>
        
        {locationData.emergencyContacts.map((contact) => (
          <View key={contact.id} style={styles.emergencyContact}>
            <View style={styles.emergencyContactInfo}>
              <Text style={styles.emergencyContactName}>{contact.name}</Text>
              <Text style={styles.emergencyContactRole}>{contact.role}</Text>
              <Text style={styles.emergencyContactPhone}>{contact.phone}</Text>
            </View>
            <View style={styles.emergencyContactActions}>
              <TouchableOpacity style={styles.callButton}>
                <Text style={styles.callButtonText}>📞 Llamar</Text>
              </TouchableOpacity>
              {contact.available && (
                <View style={styles.availableBadge}>
                  <Text style={styles.availableText}>Disponible</Text>
                </View>
              )}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyAlert}>
          <Text style={styles.emergencyButtonText}>🚨 ENVIAR ALERTA DE EMERGENCIA</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsCard}>
        <Text style={styles.cardTitle}>Acciones Rápidas</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📋</Text>
            <Text style={styles.quickActionText}>Historial Completo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📅</Text>
            <Text style={styles.quickActionText}>Horario de Hoy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>🔔</Text>
            <Text style={styles.quickActionText}>Configurar Alertas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📤</Text>
            <Text style={styles.quickActionText}>Compartir Ubicación</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statusCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  statusTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastUpdateContainer: {
    alignItems: 'flex-end',
  },
  lastUpdateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  lastUpdateTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statusDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statusDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDetailIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusDetailText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  studentCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  studentInfo: {
    alignItems: 'center',
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  studentDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapButton: {
    backgroundColor: '#d62d28',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  locationDetails: {
    marginTop: 8,
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  coordinatesContainer: {
    marginTop: 8,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  accuracyText: {
    fontSize: 12,
    color: '#999',
  },
  activityCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  currentActivity: {
    marginTop: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  activityTime: {
    fontSize: 14,
    color: '#d62d28',
    fontWeight: '600',
  },
  activityLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  historyCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#d62d28',
    fontWeight: '600',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyTime: {
    width: 60,
    marginRight: 12,
  },
  historyTimeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d62d28',
  },
  historyContent: {
    flex: 1,
  },
  historyActivityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  historyLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  historyNotes: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  historyStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emergencyCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emergencyContact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  emergencyContactInfo: {
    flex: 1,
  },
  emergencyContactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  emergencyContactRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  emergencyContactPhone: {
    fontSize: 14,
    color: '#d62d28',
    fontWeight: '600',
  },
  emergencyContactActions: {
    alignItems: 'flex-end',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  availableBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  availableText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
  emergencyButton: {
    backgroundColor: '#f44336',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActionsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default LiveLocationScreen;