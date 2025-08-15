import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

const ProfileMainScreen = () => {
  const profileData = {
    name: "María José Rodríguez",
    age: 16,
    photo: null,
    completionPercentage: 85,
    nfcEnabled: true,
    lastUpdate: "Actualizado hace 2 días"
  };

  const sections = [
    {
      id: 'personal_data',
      title: 'Datos Personales',
      icon: '👤',
      progress: 95,
      color: '#4CAF50',
      navigation: 'PersonalData',
      description: 'Información personal y contactos de emergencia'
    },
    {
      id: 'medical_record',
      title: 'Ficha Médica',
      icon: '🏥',
      progress: 80,
      color: '#FF9800',
      navigation: 'MedicalRecord',
      description: 'Historial médico, alergias y medicamentos'
    },
    {
      id: 'nutritional_record',
      title: 'Ficha Nutricional',
      icon: '🍎',
      progress: 75,
      color: '#d62d28',
      navigation: 'NutritionalRecord',
      description: 'Información alimentaria y restricciones dietéticas'
    }
  ];

  const renderProgressBar = (percentage: number, color: string) => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.progressText}>{percentage}%</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {profileData.photo ? (
            <Image source={{ uri: profileData.photo }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>MJ</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editPhotoButton}>
            <Text style={styles.editPhotoIcon}>📷</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.profileAge}>{profileData.age} años</Text>
          <Text style={styles.lastUpdate}>{profileData.lastUpdate}</Text>
        </View>
      </View>

      {/* Overall Completion */}
      <View style={styles.completionCard}>
        <View style={styles.completionHeader}>
          <Text style={styles.completionTitle}>Completitud del Perfil</Text>
          <Text style={styles.completionPercentage}>{profileData.completionPercentage}%</Text>
        </View>
        {renderProgressBar(profileData.completionPercentage, '#4CAF50')}
        <Text style={styles.completionMessage}>
          ¡Excelente! Tu perfil está casi completo. Completa la información restante para mejorar tu experiencia.
        </Text>
      </View>

      {/* NFC Integration */}
      <View style={styles.nfcCard}>
        <View style={styles.nfcHeader}>
          <Text style={styles.nfcIcon}>📱</Text>
          <View style={styles.nfcInfo}>
            <Text style={styles.nfcTitle}>Integración NFC</Text>
            <Text style={styles.nfcSubtitle}>Sincronización automática habilitada</Text>
          </View>
          <View style={[styles.nfcStatus, { backgroundColor: profileData.nfcEnabled ? '#4CAF50' : '#757575' }]}>
            <Text style={styles.nfcStatusText}>{profileData.nfcEnabled ? 'Activo' : 'Inactivo'}</Text>
          </View>
        </View>
        <Text style={styles.nfcDescription}>
          Tu información se sincroniza automáticamente con dispositivos NFC para acceso rápido en emergencias.
        </Text>
      </View>

      {/* Profile Sections */}
      <View style={styles.sectionsContainer}>
        <Text style={styles.sectionsTitle}>Secciones del Perfil</Text>
        
        {sections.map(section => (
          <TouchableOpacity key={section.id} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Text style={styles.sectionIconText}>{section.icon}</Text>
              </View>
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionDescription}>{section.description}</Text>
              </View>
              <Text style={styles.sectionArrow}>›</Text>
            </View>
            
            {renderProgressBar(section.progress, section.color)}
            
            <View style={styles.sectionFooter}>
              <Text style={styles.sectionStatus}>
                {section.progress === 100 ? 'Completo' : 'Pendiente información'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.actionsTitle}>Acciones Rápidas</Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📄</Text>
            <Text style={styles.actionText}>Exportar PDF</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🔄</Text>
            <Text style={styles.actionText}>Sincronizar NFC</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>Resumen Completo</Text>
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
  profileHeader: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d62d28',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  editPhotoIcon: {
    fontSize: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileAge: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  lastUpdate: {
    fontSize: 12,
    color: '#999',
  },
  completionCard: {
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
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  completionPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  completionMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    lineHeight: 20,
  },
  nfcCard: {
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
  nfcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nfcIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  nfcInfo: {
    flex: 1,
  },
  nfcTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  nfcSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  nfcStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nfcStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  nfcDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  sectionsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionIconText: {
    fontSize: 20,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 12,
    color: '#666',
  },
  sectionArrow: {
    fontSize: 24,
    color: '#ccc',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    minWidth: 32,
  },
  sectionFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  sectionStatus: {
    fontSize: 12,
    color: '#999',
  },
  actionsContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default ProfileMainScreen;