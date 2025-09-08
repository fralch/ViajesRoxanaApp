import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'location': return '#4CAF50';
    case 'medical': return '#FF9800';
    case 'payment': return '#d62d28';
    default: return '#757575';
  }
};

const NotificationsScreen = ({ notifications }: { notifications: any[] }) => {
  return (
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
    </View>
  );
};

const styles = StyleSheet.create({
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
