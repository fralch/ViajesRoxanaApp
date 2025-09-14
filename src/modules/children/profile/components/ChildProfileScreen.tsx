import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Card, Avatar } from '../../../../shared/components';
import { useAuth } from '../../../../shared/hooks';

const ChildProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();

  const profileItems = [
    {
      id: 1,
      title: 'Mi Información',
      subtitle: 'Nombre y datos básicos',
      icon: 'person',
      color: '#2196F3',
      onPress: () => {},
    },
    {
      id: 2,
      title: 'Mi Ubicación',
      subtitle: 'Ver donde estoy ahora',
      icon: 'location-on',
      color: '#4CAF50',
      onPress: () => navigation.navigate('Location'),
    },
    {
      id: 3,
      title: 'Mis Juegos',
      subtitle: 'Diversión durante el viaje',
      icon: 'games',
      color: '#FF9800',
      onPress: () => navigation.navigate('Games'),
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar
            size={100}
            name={user?.name || 'Usuario'}
            backgroundColor="#FF6B6B"
          />
          <Text style={styles.userName}>{user?.name || 'Pequeño Viajero'}</Text>
          <Text style={styles.userRole}>Usuario Infantil</Text>
        </View>

        {/* Profile Info Card */}
        <Card margin={10}>
          <View style={styles.infoHeader}>
            <AntDesign name="user" size={24} color="#2196F3" />
            <Text style={styles.infoTitle}>Información Personal</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>{user?.name || 'No disponible'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado:</Text>
            <Text style={styles.infoValue}>En viaje seguro</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ubicación:</Text>
            <Text style={styles.infoValue}>Compartida con padres</Text>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          {profileItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.actionItem}
              onPress={item.onPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: item.color }]}>
                <MaterialIcons
                  name={item.icon as any}
                  size={24}
                  color="#fff"
                />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
              </View>
              <AntDesign name="right" size={16} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Safety Information */}
        <Card backgroundColor="#E8F5E8" margin={10}>
          <View style={styles.safetyHeader}>
            <AntDesign name="safety" size={20} color="#4CAF50" />
            <Text style={styles.safetyTitle}>Información de Seguridad</Text>
          </View>
          <Text style={styles.safetyText}>
            • Tu ubicación se comparte automáticamente con tus papás{'\n'}
            • Solo personas autorizadas pueden ver tu información{'\n'}
            • Si necesitas ayuda, avisa a un adulto de inmediato
          </Text>
        </Card>

        {/* Fun Facts */}
        <Card backgroundColor="#FFF8E1" margin={10}>
          <View style={styles.funHeader}>
            <MaterialIcons name="emoji-emotions" size={20} color="#FF9800" />
            <Text style={styles.funTitle}>¿Sabías que...?</Text>
          </View>
          <Text style={styles.funText}>
            Los viajes son más divertidos cuando todos estamos seguros y nos cuidamos mutuamente. ¡Disfruta tu aventura!
          </Text>
        </Card>

        {/* Navigation Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <AntDesign name="home" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Ir al Inicio</Text>
        </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  userRole: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  infoCard: {
    marginBottom: 25,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
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
  actionItem: {
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
    width: 45,
    height: 45,
    borderRadius: 22.5,
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
  safetyCard: {
    marginBottom: 20,
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 8,
  },
  safetyText: {
    fontSize: 14,
    color: '#388E3C',
    lineHeight: 18,
  },
  funCard: {
    marginBottom: 25,
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  funHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  funTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F57C00',
    marginLeft: 8,
  },
  funText: {
    fontSize: 14,
    color: '#BF360C',
    lineHeight: 18,
  },
  backButton: {
    backgroundColor: '#d62d28',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default ChildProfileScreen;