import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNotifications } from '../../../shared/hooks';
import { timeAgo } from '../../../shared/utils';

const getNotificationColor = (type: string) => {
  // Simplified logic, as the API response doesn't have a type
  // We can enhance this later if needed
  if (type.includes('bus')) return '#4CAF50';
  if (type.includes('camino')) return '#FF9800';
  return '#757575';
};

const NotificationsScreen = ({ dni }: { dni: string | null }) => {
  const { notifications, isLoading, error } = useNotifications(dni);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#d62d28" />
        <Text>Cargando notificaciones...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No hay notificaciones recientes.</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Notificaciones Recientes</Text>
      {notifications.map(notification => (
        <TouchableOpacity key={notification.id} style={styles.notificationItem}>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationMessage}>{notification.mensaje}</Text>
            <Text style={styles.notificationTime}>{timeAgo(notification.created_at)}</Text>
          </View>
          <View style={[styles.notificationDot, { backgroundColor: getNotificationColor(notification.mensaje) }]} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  section: { marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  notificationItem: {
    backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 8, flexDirection: 'row', alignItems: 'center',
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  notificationContent: { flex: 1 },
  notificationMessage: { fontSize: 14, color: '#333', marginBottom: 4 },
  notificationTime: { fontSize: 12, color: '#999' },
  notificationDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 12 },
});

export default NotificationsScreen;