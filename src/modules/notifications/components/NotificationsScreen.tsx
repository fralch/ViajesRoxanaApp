import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useNotifications, useAuth } from '../../../shared/hooks';
import { timeAgo, extractUrls } from '../../../shared/utils';
import { ExpandableText } from '../../../shared/components';

const getNotificationColor = (type: string) => {
  // Simplified logic, as the API response doesn't have a type
  // We can enhance this later if needed
  if (type.includes('bus')) return '#4CAF50';
  if (type.includes('camino')) return '#FF9800';
  return '#757575';
};

const NotificationsScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { notifications, isLoading, error } = useNotifications(user?.dni || null);

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

  const notificationsToShow = notifications.slice(0, 3);

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={() => navigation.navigate('NotificationDetails')}>
            <Text style={styles.seeAll}>Ver todas</Text>
          </TouchableOpacity>
        )}
      </View>

      <View>
        {notificationsToShow.map((item) => {
          const urls = extractUrls(item.mensaje);
          const openFirstUrl = async () => {
            if (urls.length === 0) return;
            const url = urls[0];
            try {
              const supported = await Linking.canOpenURL(url);
              if (supported) {
                await Linking.openURL(url);
              } else {
                Alert.alert('No se puede abrir el enlace', url);
              }
            } catch (e) {
              Alert.alert('Error al abrir el enlace');
            }
          };
          return (
            <TouchableOpacity key={item.id} style={styles.notificationItem} onPress={() => navigation.navigate('NotificationDetails')}>
              <View style={[styles.iconWrap, { backgroundColor: getNotificationColor(item.mensaje) + '22' }]}>
                <Feather name="bell" size={18} color={getNotificationColor(item.mensaje)} />
              </View>
              <View style={styles.notificationContent}>
                <ExpandableText text={item.mensaje} maxLength={70} />
                <View style={styles.rowBetween}>
                  <Text style={styles.notificationTime}>{timeAgo(item.created_at)}</Text>
                  {urls.length > 0 && (
                    <TouchableOpacity onPress={openFirstUrl} style={styles.linkButton}>
                      <Feather name="external-link" size={14} color="#d62d28" />
                      <Text style={styles.linkButtonText}>Abrir enlace</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
       
      </View>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  seeAll: { color: '#d62d28', fontWeight: '600' },
  notificationItem: {
    backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center',
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4,
    borderLeftWidth: 3, borderLeftColor: '#eee'
  },
  iconWrap: {
    width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  notificationContent: { flex: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  notificationTime: { fontSize: 12, color: '#999', marginTop: 4 },
  notificationDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 12 },
  linkButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, backgroundColor: '#fde3e3' },
  linkButtonText: { color: '#d62d28', fontWeight: '600', fontSize: 12 },
  footerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8 },
  footerButtonText: { color: '#d62d28', fontWeight: '600' },
});

export default NotificationsScreen;
