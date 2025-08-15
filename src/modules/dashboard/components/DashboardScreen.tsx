import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

const DashboardScreen = () => {
  const userName = "Ana García";
  const currentTrip = {
    destination: "Cusco - Machu Picchu",
    dates: "15-18 Marzo 2025",
    group: "Grupo Aventura",
    responsible: "Carlos Mendoza"
  };

  const notifications = [
    { id: 1, type: "location", message: "Tu hijo llegó seguro al hotel", time: "2 min" },
    { id: 2, type: "medical", message: "Recordatorio: Medicamento a las 8 PM", time: "1 hora" },
    { id: 3, type: "payment", message: "Próximo pago vence en 3 días", time: "2 horas" }
  ];

  const quickActions = [
    { id: 1, title: "Ver Ubicación", icon: "📍", screen: "Location" },
    { id: 2, title: "Perfil Médico", icon: "🏥", screen: "Profile" },
    { id: 3, title: "Pagos", icon: "💳", screen: "Payments" },
    { id: 4, title: "Equipaje", icon: "🧳", screen: "Luggage" }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Hola, {userName}!</Text>
          <Text style={styles.subGreeting}>Bienvenida de vuelta</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Current Trip Card */}
      <View style={styles.tripCard}>
        <Text style={styles.tripTitle}>Viaje Actual</Text>
        <View style={styles.tripInfo}>
          <Text style={styles.tripDestination}>{currentTrip.destination}</Text>
          <Text style={styles.tripDates}>{currentTrip.dates}</Text>
          <View style={styles.tripDetails}>
            <Text style={styles.tripDetail}>Grupo: {currentTrip.group}</Text>
            <Text style={styles.tripDetail}>Responsable: {currentTrip.responsible}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.tripButton}>
          <Text style={styles.tripButtonText}>Ver Detalles</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acceso Rápido</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map(action => (
            <TouchableOpacity key={action.id} style={styles.actionButton}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones Recientes</Text>
        {notifications.map(notification => (
          <TouchableOpacity key={notification.id} style={styles.notificationItem}>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>hace {notification.time}</Text>
            </View>
            <View style={[styles.notificationDot, { backgroundColor: getNotificationColor(notification.type) }]} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Ver todas las notificaciones</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'location': return '#4CAF50';
    case 'medical': return '#FF9800';
    case 'payment': return '#2196F3';
    default: return '#757575';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 24,
  },
  tripCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tripInfo: {
    marginBottom: 16,
  },
  tripDestination: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  tripDates: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  tripDetails: {
    marginTop: 8,
  },
  tripDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  tripButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  tripButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 12,
  },
  seeAllButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  seeAllText: {
    color: '#2196F3',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default DashboardScreen;