import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';

const TripsListScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('active');

  const trips = [
    {
      id: 1,
      destination: "Cusco - Machu Picchu",
      group: "Grupo Aventura",
      responsible: "Carlos Mendoza",
      phone: "+51 999 123 456",
      dates: "15-18 Marzo 2025",
      code: "VR-2025-001",
      status: "active",
      category: "current",
      progress: 75,
      image: "🏔️",
      participants: 24,
      nextActivity: "Salida del hotel - 7:00 AM"
    },
    {
      id: 2,
      destination: "Iquitos - Amazonia",
      group: "Exploradores",
      responsible: "Ana Torres",
      phone: "+51 999 789 123",
      dates: "22-25 Abril 2025",
      code: "VR-2025-002",
      status: "upcoming",
      category: "current",
      progress: 0,
      image: "🌳",
      participants: 18,
      nextActivity: "Confirmación de equipaje"
    },
    {
      id: 3,
      destination: "Arequipa - Colca",
      group: "Aventureros",
      responsible: "Luis Vargas",
      phone: "+51 999 456 789",
      dates: "10-13 Enero 2025",
      code: "VR-2025-003",
      status: "completed",
      category: "past",
      progress: 100,
      image: "🦙",
      participants: 20,
      nextActivity: "Viaje finalizado"
    },
    {
      id: 4,
      destination: "Huacachina - Nasca",
      group: "Aventura Extrema",
      responsible: "María López",
      phone: "+51 999 321 654",
      dates: "05-08 Febrero 2025",
      code: "VR-2025-004",
      status: "completed",
      category: "past",
      progress: 100,
      image: "🏜️",
      participants: 15,
      nextActivity: "Viaje finalizado"
    }
  ];

  const filters = [
    { key: 'active', label: 'Activos', count: trips.filter(t => t.status === 'active').length },
    { key: 'upcoming', label: 'Próximos', count: trips.filter(t => t.status === 'upcoming').length },
    { key: 'completed', label: 'Completados', count: trips.filter(t => t.status === 'completed').length }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'upcoming': return '#e74c3c';
      case 'completed': return '#757575';
      default: return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'En curso';
      case 'upcoming': return 'Próximo';
      case 'completed': return 'Completado';
      default: return status;
    }
  };

  const filteredTrips = selectedFilter === 'all' 
    ? trips 
    : trips.filter(trip => trip.status === selectedFilter);

  const renderTripCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.tripCard}>
      {/* Header */}
      <View style={styles.tripHeader}>
        <View style={styles.tripIconContainer}>
          <Text style={styles.tripIcon}>{item.image}</Text>
        </View>
        <View style={styles.tripMainInfo}>
          <Text style={styles.tripDestination}>{item.destination}</Text>
          <Text style={styles.tripDates}>{item.dates}</Text>
          <Text style={styles.tripCode}>Código: {item.code}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      {/* Progress Bar (only for active/upcoming trips) */}
      {item.status !== 'completed' && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progreso del viaje</Text>
            <Text style={styles.progressPercentage}>{item.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${item.progress}%`, backgroundColor: getStatusColor(item.status) }
              ]} 
            />
          </View>
        </View>
      )}

      {/* Trip Details */}
      <View style={styles.tripDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Grupo:</Text>
          <Text style={styles.detailValue}>{item.group}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Responsable:</Text>
          <Text style={styles.detailValue}>{item.responsible}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Teléfono:</Text>
          <Text style={styles.detailValue}>{item.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Participantes:</Text>
          <Text style={styles.detailValue}>{item.participants} estudiantes</Text>
        </View>
      </View>

      {/* Next Activity */}
      {item.status === 'active' && (
        <View style={styles.nextActivitySection}>
          <Text style={styles.nextActivityLabel}>Próxima actividad:</Text>
          <Text style={styles.nextActivityText}>{item.nextActivity}</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
          <Text style={styles.primaryButtonText}>Ver Detalles</Text>
        </TouchableOpacity>
        
        {item.status === 'active' && (
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Ubicación Live</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'upcoming' && (
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Preparativos</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mis Viajes</Text>
        <Text style={styles.subtitle}>Gestiona todos tus viajes escolares</Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.activeFilterButton
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.key && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
              <View style={[
                styles.filterCount,
                selectedFilter === filter.key && styles.activeFilterCount
              ]}>
                <Text style={[
                  styles.filterCountText,
                  selectedFilter === filter.key && styles.activeFilterCountText
                ]}>
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trips List */}
      <FlatList
        data={filteredTrips}
        renderItem={renderTripCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.tripsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>✈️</Text>
            <Text style={styles.emptyStateTitle}>No hay viajes</Text>
            <Text style={styles.emptyStateText}>
              No tienes viajes {selectedFilter === 'active' ? 'activos' : 
                               selectedFilter === 'upcoming' ? 'próximos' : 'completados'} por el momento
            </Text>
          </View>
        }
      />
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
  filtersContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeFilterButton: {
    backgroundColor: '#d62d28',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  activeFilterText: {
    color: '#fff',
  },
  filterCount: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  activeFilterCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  activeFilterCountText: {
    color: '#fff',
  },
  tripsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tripCard: {
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
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tripIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tripIcon: {
    fontSize: 24,
  },
  tripMainInfo: {
    flex: 1,
  },
  tripDestination: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tripDates: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  tripCode: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  tripDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  nextActivitySection: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  nextActivityLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  nextActivityText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#d62d28',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },
});

export default TripsListScreen;