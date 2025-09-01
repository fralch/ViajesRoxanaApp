import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, StatusBar } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';

// --- Dropdown simple sin librerías ---
const Dropdown = ({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <>
      {label ? <Text style={dropdownStyles.label}>{label}</Text> : null}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        style={dropdownStyles.trigger}
      >
        <Text style={dropdownStyles.triggerText}>{selected?.label ?? 'Seleccionar'}</Text>
        <FontAwesome name="chevron-down" size={14} color="#666" />
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={dropdownStyles.backdrop} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={dropdownStyles.sheet}>
            <Text style={dropdownStyles.sheetTitle}>Selecciona al hijo</Text>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={dropdownStyles.option}
                  activeOpacity={0.7}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Text style={dropdownStyles.optionText}>{item.label}</Text>
                  {item.value === value ? <FontAwesome name="check" size={16} color="#d62d28" /> : null}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={dropdownStyles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const dropdownStyles = StyleSheet.create({
  label: { fontSize: 12, color: '#888', marginBottom: 6 },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#eee',
    alignSelf: 'flex-start',
  },
  triggerText: { fontSize: 14, color: '#333', fontWeight: '600' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', padding: 20 },
  sheet: { backgroundColor: '#fff', borderRadius: 12, padding: 16, maxHeight: '70%' },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 10 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  optionText: { fontSize: 14, color: '#333' },
  separator: { height: 1, backgroundColor: '#eee' },
});

const DashboardScreen = ({ navigation }: { navigation?: any }) => {
  const userName = "Ana García";

  // === Datos por hijo ===
  const children = [
    {
      id: 'h1',
      name: 'Diego García',
      trip: {
        destination: "Cusco - Machu Picchu",
        dates: "15-18 Marzo 2025",
        group: "Grupo Aventura",
        responsible: "Carlos Mendoza",
      },
      location: {
        latitude: -13.1631,
        longitude: -72.5450,
        address: "Hotel Imperial Cusco, Av. Imperial 345, Cusco"
      },
      notifications: [
        { id: 'd1', type: "location", message: "Llegó seguro al hotel", time: "2 min" },
        { id: 'd2', type: "medical", message: "Recordatorio: Medicamento 8 PM", time: "1 hora" },
        { id: 'd3', type: "payment", message: "Próximo pago vence en 3 días", time: "2 horas" },
      ],
    },
    {
      id: 'h2',
      name: 'Lucía García',
      trip: {
        destination: "Huaraz - Laguna 69",
        dates: "16-19 Marzo 2025",
        group: "Exploradores Norte",
        responsible: "María Torres",
      },
      location: {
        latitude: -9.0215,
        longitude: -77.6283,
        address: "Laguna 69, Huascarán National Park, Huaraz"
      },
      notifications: [
        { id: 'l1', type: "location", message: "Inició caminata al mirador", time: "10 min" },
        { id: 'l2', type: "payment", message: "Pago de excursión confirmado", time: "30 min" },
      ],
    },
  ];

  // Hijo seleccionado
  const [selectedChildId, setSelectedChildId] = useState(children[0].id);
  const selectedChild = useMemo(
    () => children.find(c => c.id === selectedChildId) ?? children[0],
    [selectedChildId]
  );

  // Función para navegar al mapa
  const handleViewLocation = () => {
    if (navigation) {
      navigation.navigate('MapScreen', {
        latitude: selectedChild.location.latitude,
        longitude: selectedChild.location.longitude,
        studentName: selectedChild.name,
        address: selectedChild.location.address
      });
    }
  };

  // Acciones rápidas (se mantienen, pero puedes usarlas con el contexto del hijo seleccionado)
  const quickActions = [
    { id: 1, title: "Ver Ubicación", icon: <FontAwesome6 name="map-location-dot" size={28} color="#d62d28" />, action: handleViewLocation },
    { id: 2, title: "Perfil", icon: <FontAwesome  name="user" size={28} color="#d62d28" />, screen: "Profile" },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#d62d28" />
      <ScrollView style={styles.container}>
      {/* Header (DISEÑO ORIGINAL, solo se agrega el selector debajo del nombre) */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Hola, {userName}!</Text>
          <Text style={styles.subGreeting}>Bienvenido</Text>

          {/* Select de hijo */}
          <View style={{ marginTop: 10 }}>
            <Dropdown
              label="Hijo/a"
              options={children.map(c => ({ label: c.name, value: c.id }))}
              value={selectedChildId}
              onChange={setSelectedChildId}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <FontAwesome name="user" size={25} color="#d62d28" />
        </TouchableOpacity>
      </View>

      {/* Viaje Actual (usa datos del hijo seleccionado) */}
      <View style={styles.tripCard}>
        <Text style={styles.tripTitle}>
          Viaje Actual de <Text style={styles.tripChild}>{selectedChild.name.split(' ')[0]}</Text>
        </Text>
        <View style={styles.tripInfo}>
          <Text style={styles.tripDestination}>{selectedChild.trip.destination}</Text>
          <Text style={styles.tripDates}>{selectedChild.trip.dates}</Text>
          <View style={styles.tripDetails}>
            <Text style={styles.tripDetail}>Grupo: {selectedChild.trip.group}</Text>
            <Text style={styles.tripDetail}>Responsable: {selectedChild.trip.responsible}</Text>
          </View>
        </View>
      </View>


      {/* Acceso Rápido (se mantiene igual) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acceso Rápido</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map(action => (
            <TouchableOpacity 
              key={action.id} 
              style={styles.actionButton}
              onPress={action.action || (() => {})}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notificaciones (ligadas al hijo seleccionado) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones Recientes</Text>
        {selectedChild.notifications.map(notification => (
          <TouchableOpacity key={notification.id} style={styles.notificationItem}>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>hace {notification.time}</Text>
            </View>
            <View style={[styles.notificationDot, { backgroundColor: getNotificationColor(notification.type) }]} />
          </TouchableOpacity>
        ))}
      
      </View>
    </ScrollView>
    </>
  );
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'location': return '#4CAF50';
    case 'medical': return '#FF9800';
    case 'payment': return '#d62d28';
    default: return '#757575';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, backgroundColor: '#fff', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginBottom: 20,
  },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subGreeting: { fontSize: 16, color: '#666', marginTop: 4 },
  profileButton: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#fde3e3', justifyContent: 'center', alignItems: 'center',
  },

  tripCard: {
    backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 20, borderRadius: 15, padding: 20,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  tripTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  tripInfo: { marginBottom: 16 },
  tripDestination: { fontSize: 20, fontWeight: 'bold', color: '#d62d28', marginBottom: 4 },
  tripDates: { fontSize: 16, color: '#666', marginBottom: 8 },
  tripDetails: { marginTop: 8 },
  tripDetail: { fontSize: 14, color: '#666', marginBottom: 2 },
  tripButton: { backgroundColor: '#d62d28', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, alignSelf: 'flex-start' },
  tripButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  section: { marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionButton: {
    width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  actionIcon: { marginBottom: 8 },
  actionTitle: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' },

  notificationItem: {
    backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 8, flexDirection: 'row', alignItems: 'center',
    elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  notificationContent: { flex: 1 },
  notificationMessage: { fontSize: 14, color: '#333', marginBottom: 4 },
  notificationTime: { fontSize: 12, color: '#999' },
  notificationDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 12 },
  seeAllButton: { paddingVertical: 12, alignItems: 'center' },
  seeAllText: { color: '#d62d28', fontWeight: '600', fontSize: 14 },
  tripChild: {
    fontWeight: '600',
    color: '#aaa',
  },
});

export default DashboardScreen;
