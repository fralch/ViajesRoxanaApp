
import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNotifications, useAuth } from '../../../shared/hooks';
import { timeAgo } from '../../../shared/utils';

const NotificationDetailsScreen = () => {
  const { user } = useAuth();
  const { notifications, isLoading, error, refresh } = useNotifications(user?.dni || null);

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
        <Text>No hay notificaciones.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.notificationItem}>
          <View style={[styles.iconWrap]}>
            <Feather name="bell" size={18} color="#d62d28" />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.notificationMessage}>{item.mensaje}</Text>
            <Text style={styles.notificationTime}>{timeAgo(item.created_at)}</Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.container}
      onRefresh={refresh}
      refreshing={isLoading}
      ListFooterComponent={<View style={{ height: 8 }} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
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
  notificationItem: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#fde3e3', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemContent: { flex: 1 },
  notificationMessage: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});

export default NotificationDetailsScreen;
