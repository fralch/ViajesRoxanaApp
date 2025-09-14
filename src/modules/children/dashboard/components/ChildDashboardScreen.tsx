import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Card, StatusBadge, Avatar } from '../../../../shared/components';
import { useAuth } from '../../../../shared/hooks';

const ChildDashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();

  const quickActions = [
    {
      id: 1,
      title: 'Mi Ubicación',
      subtitle: 'Ver donde estoy',
      icon: 'location-on' as const,
      color: '#4CAF50',
      onPress: () => navigation.navigate('Location'),
    },
    {
      id: 2,
      title: 'Juegos',
      subtitle: 'Diversión durante el viaje',
      icon: 'games' as const,
      color: '#FF9800',
      onPress: () => navigation.navigate('Games'),
    },
    {
      id: 3,
      title: 'Mi Perfil',
      subtitle: 'Ver mi información',
      icon: 'person' as const,
      color: '#2196F3',
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeHeader}>
            <Avatar
              size={60}
              name={user?.name || 'Usuario'}
              backgroundColor="#FF6B6B"
            />
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTitle}>¡Hola!</Text>
              <Text style={styles.welcomeSubtitle}>
                {user?.name || 'Pequeño viajero'}
              </Text>
            </View>
          </View>
        </View>

        {/* Status Card */}
        <Card backgroundColor="#E8F5E8" margin={10}>
          <View style={styles.statusHeader}>
            <AntDesign name="safety" size={24} color="#4CAF50" />
            <Text style={styles.statusTitle}>Estado del Viaje</Text>
          </View>
          <View style={styles.statusContent}>
            <StatusBadge status="success" text="En viaje seguro" />
            <Text style={styles.statusDescription}>
              Tus papás pueden verte en el mapa
            </Text>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>¿Qué quieres hacer?</Text>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={action.onPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <MaterialIcons
                  name={action.icon}
                  size={28}
                  color="#fff"
                />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </View>
              <AntDesign name="right" size={16} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Safety Tips */}
        <Card backgroundColor="#FFF8E1" margin={10}>
          <View style={styles.tipsHeader}>
            <AntDesign name="bulb" size={20} color="#FF9800" />
            <Text style={styles.tipsTitle}>Consejo de Seguridad</Text>
          </View>
          <Text style={styles.tipsText}>
            Recuerda siempre mantener tu cinturón abrochado y avisar si necesitas algo.
          </Text>
        </Card>
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
    paddingHorizontal: 20,
  },
  welcomeSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    marginLeft: 15,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 2,
  },
  statusCard: {
    marginBottom: 25,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  statusContent: {
    alignItems: 'flex-start',
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  actionsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
    marginLeft: 15,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  tipsCard: {
    marginBottom: 30,
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F57C00',
    marginLeft: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#BF360C',
    lineHeight: 20,
  },
});

export default ChildDashboardScreen;