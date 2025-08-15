import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

const TripDetailsScreen = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const tripData = {
    id: 1,
    destination: "Cusco - Machu Picchu",
    group: "Grupo Aventura",
    responsible: "Carlos Mendoza",
    phone: "+51 999 123 456",
    dates: "15-18 Marzo 2025",
    code: "VR-2025-001",
    status: "active",
    progress: 75,
    image: "🏔️",
    participants: 24,
    description: "Viaje educativo y cultural a la ciudadela de Machu Picchu, una de las maravillas del mundo. Los estudiantes explorarán la historia inca y disfrutarán de paisajes espectaculares.",
    itinerary: [
      {
        day: 1,
        date: "15 Marzo",
        activities: [
          { time: "06:00", activity: "Concentración en el colegio", location: "Colegio" },
          { time: "07:00", activity: "Salida en bus hacia Cusco", location: "Terminal" },
          { time: "19:00", activity: "Llegada a Cusco", location: "Hotel Imperial" },
          { time: "20:00", activity: "Cena y descanso", location: "Hotel Imperial" }
        ]
      },
      {
        day: 2,
        date: "16 Marzo",
        activities: [
          { time: "07:00", activity: "Desayuno", location: "Hotel Imperial" },
          { time: "08:30", activity: "City Tour Cusco", location: "Centro Histórico" },
          { time: "13:00", activity: "Almuerzo típico", location: "Restaurante Inka" },
          { time: "15:00", activity: "Visita a Qorikancha", location: "Templo del Sol" },
          { time: "19:00", activity: "Cena y actividad cultural", location: "Hotel Imperial" }
        ]
      }
    ],
    documents: [
      { type: "medical_assistance_card", name: "Tarjeta de Asistencia Médica", available: true },
      { type: "recommendations", name: "Recomendaciones del Viaje", available: true },
      { type: "clothing_list", name: "Lista de Vestimenta", available: true },
      { type: "notarial_permission", name: "Permiso Notarial", available: false },
      { type: "medical_voucher", name: "Voucher Médico", available: true },
      { type: "nearby_clinics", name: "Clínicas Cercanas", available: true }
    ],
    photos: [
      { id: 1, type: "image", url: "photo1.jpg", caption: "Preparativos del viaje" },
      { id: 2, type: "image", url: "photo2.jpg", caption: "En el bus hacia Cusco" },
      { id: 3, type: "video", url: "video1.mp4", caption: "Video del grupo" }
    ],
    recommendations: {
      general: [
        "Llevar documentos de identidad",
        "Mantenerse hidratado",
        "Seguir las indicaciones del guía"
      ],
      clothing: [
        "Ropa abrigadora para la noche",
        "Zapatos cómodos para caminar",
        "Sombrero y protector solar"
      ],
      health: [
        "Medicamentos personales",
        "Pastillas para el mareo",
        "Repelente de insectos"
      ],
      documentation: [
        "DNI o documento de identidad",
        "Tarjeta de seguro médico",
        "Permiso notarial si es menor de edad"
      ]
    }
  };

  const sections = [
    { key: 'overview', label: 'Resumen', icon: '📋' },
    { key: 'itinerary', label: 'Itinerario', icon: '📅' },
    { key: 'documents', label: 'Documentos', icon: '📄' },
    { key: 'photos_videos', label: 'Fotos/Videos', icon: '📷' },
    { key: 'recommendations', label: 'Recomendaciones', icon: '💡' }
  ];

  const renderOverview = () => (
    <View style={styles.sectionContent}>
      {/* Trip Header Card */}
      <View style={styles.tripHeaderCard}>
        <View style={styles.tripImageContainer}>
          <Text style={styles.tripImageIcon}>{tripData.image}</Text>
        </View>
        <View style={styles.tripHeaderInfo}>
          <Text style={styles.tripHeaderTitle}>{tripData.destination}</Text>
          <Text style={styles.tripHeaderDates}>{tripData.dates}</Text>
          <Text style={styles.tripHeaderCode}>Código: {tripData.code}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: '#4CAF50' }]}>
            <Text style={styles.statusText}>En Curso</Text>
          </View>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressCard}>
        <Text style={styles.cardTitle}>Progreso del Viaje</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${tripData.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{tripData.progress}%</Text>
        </View>
        <Text style={styles.progressDescription}>
          El viaje va según lo planificado. Próxima actividad: Visita a Machu Picchu.
        </Text>
      </View>

      {/* Trip Info */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Información del Viaje</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Grupo:</Text>
            <Text style={styles.infoValue}>{tripData.group}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Responsable:</Text>
            <Text style={styles.infoValue}>{tripData.responsible}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Teléfono:</Text>
            <Text style={styles.infoValue}>{tripData.phone}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Participantes:</Text>
            <Text style={styles.infoValue}>{tripData.participants} estudiantes</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionCard}>
        <Text style={styles.cardTitle}>Descripción</Text>
        <Text style={styles.descriptionText}>{tripData.description}</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsCard}>
        <Text style={styles.cardTitle}>Acciones Rápidas</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📍</Text>
            <Text style={styles.quickActionText}>Ubicación Live</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📞</Text>
            <Text style={styles.quickActionText}>Llamar Responsable</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📋</Text>
            <Text style={styles.quickActionText}>Lista de Participantes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>🚨</Text>
            <Text style={styles.quickActionText}>Emergencia</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderItinerary = () => (
    <View style={styles.sectionContent}>
      <View style={styles.itineraryHeader}>
        <Text style={styles.cardTitle}>Itinerario Detallado</Text>
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>📥 Descargar PDF</Text>
        </TouchableOpacity>
      </View>

      {tripData.itinerary.map((day, index) => (
        <View key={index} style={styles.dayCard}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>Día {day.day}</Text>
            <Text style={styles.dayDate}>{day.date}</Text>
          </View>
          
          <View style={styles.activitiesList}>
            {day.activities.map((activity, actIndex) => (
              <View key={actIndex} style={styles.activityItem}>
                <View style={styles.timeContainer}>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityName}>{activity.activity}</Text>
                  <Text style={styles.activityLocation}>📍 {activity.location}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderDocuments = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.cardTitle}>Documentos del Viaje</Text>
      <Text style={styles.sectionSubtitle}>
        Documentos importantes para tu viaje. Algunos pueden estar disponibles durante el viaje.
      </Text>

      {tripData.documents.map((doc, index) => (
        <View key={index} style={styles.documentItem}>
          <View style={styles.documentInfo}>
            <Text style={styles.documentIcon}>📄</Text>
            <View style={styles.documentDetails}>
              <Text style={styles.documentName}>{doc.name}</Text>
              <Text style={[
                styles.documentStatus,
                { color: doc.available ? '#4CAF50' : '#FF9800' }
              ]}>
                {doc.available ? '✅ Disponible' : '⏳ Disponible durante el viaje'}
              </Text>
            </View>
          </View>
          {doc.available && (
            <TouchableOpacity style={styles.documentButton}>
              <Text style={styles.documentButtonText}>Ver</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderPhotosVideos = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.cardTitle}>Fotos y Videos</Text>
      <Text style={styles.sectionSubtitle}>
        Galería de momentos especiales del viaje
      </Text>

      <View style={styles.mediaGrid}>
        {tripData.photos.map((media, index) => (
          <TouchableOpacity key={media.id} style={styles.mediaItem}>
            <View style={styles.mediaPlaceholder}>
              <Text style={styles.mediaIcon}>
                {media.type === 'video' ? '🎥' : '📷'}
              </Text>
            </View>
            <Text style={styles.mediaCaption}>{media.caption}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>📤 Subir Foto/Video</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRecommendations = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.cardTitle}>Recomendaciones</Text>

      {Object.entries(tripData.recommendations).map(([category, items]) => (
        <View key={category} style={styles.recommendationCategory}>
          <Text style={styles.categoryTitle}>
            {category === 'general' ? '📋 Generales' :
             category === 'clothing' ? '👕 Vestimenta' :
             category === 'health' ? '🏥 Salud' :
             '📄 Documentación'}
          </Text>
          
          {items.map((item, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.recommendationText}>{item}</Text>
            </View>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.downloadRecommendationsButton}>
        <Text style={styles.downloadRecommendationsText}>📥 Descargar Todas las Recomendaciones</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'itinerary':
        return renderItinerary();
      case 'documents':
        return renderDocuments();
      case 'photos_videos':
        return renderPhotosVideos();
      case 'recommendations':
        return renderRecommendations();
      default:
        return renderOverview();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalles del Viaje</Text>
      </View>

      {/* Section Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sections.map(section => (
            <TouchableOpacity
              key={section.key}
              style={[styles.tab, activeSection === section.key && styles.activeTab]}
              onPress={() => setActiveSection(section.key)}
            >
              <Text style={styles.tabIcon}>{section.icon}</Text>
              <Text style={[styles.tabText, activeSection === section.key && styles.activeTabText]}>
                {section.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  tabsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f8f9fa',
  },
  activeTab: {
    backgroundColor: '#2196F3',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  sectionContent: {
    padding: 20,
  },
  tripHeaderCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tripImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tripImageIcon: {
    fontSize: 32,
  },
  tripHeaderInfo: {
    flex: 1,
  },
  tripHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tripHeaderDates: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  tripHeaderCode: {
    fontSize: 12,
    color: '#999',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    minWidth: 40,
  },
  progressDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flex: 1,
    textAlign: 'right',
  },
  descriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  quickActionsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
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
  itineraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  downloadButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dayDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activitiesList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeContainer: {
    width: 60,
    marginRight: 16,
  },
  activityTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  activityContent: {
    flex: 1,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityLocation: {
    fontSize: 12,
    color: '#666',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  documentDetails: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  documentStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  documentButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  documentButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  mediaItem: {
    width: '48%',
    alignItems: 'center',
  },
  mediaPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  mediaIcon: {
    fontSize: 32,
  },
  mediaCaption: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendationCategory: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#2196F3',
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  downloadRecommendationsButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  downloadRecommendationsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TripDetailsScreen;