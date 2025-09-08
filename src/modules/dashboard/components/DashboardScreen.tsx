import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, StatusBar, Alert } from 'react-native';
import { FontAwesome, FontAwesome6, Feather } from '@expo/vector-icons';
import { useAuth } from '../../../shared/hooks';

// Types for API data
interface Child {
  id: number;
  user_id: number;
  nombres: string;
  doc_tipo: string;
  doc_numero: string;
  nums_emergencia: string[];
  fecha_nacimiento: string;
  foto: string | null;
  pasatiempos: string | null;
  deportes: string | null;
  plato_favorito: string | null;
  color_favorito: string | null;
  informacion_adicional: string | null;
  created_at: string;
  updated_at: string;
  inscripciones: Inscription[];
}

interface Inscription {
  id: number;
  hijo_id: number;
  paquete_id: number;
  grupo_id: number;
  usuario_id: number;
  created_at: string;
  updated_at: string;
  grupo: Group;
}

interface Group {
  id: number;
  paquete_id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  capacidad: number;
  tipo_encargado: string[];
  nombre_encargado: string[];
  celular_encargado: string[];
  tipo_encargado_agencia: string[];
  nombre_encargado_agencia: string[];
  celular_encargado_agencia: string[];
  activo: boolean;
  created_at: string;
  updated_at: string;
  paquete: Package;
}

interface Package {
  id: number;
  nombre: string;
  destino: string;
  descripcion: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

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
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión? Se borrarán todos los datos guardados localmente.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: () => logout()
        }
      ]
    );
  };

  // Usar datos reales del usuario o valores por defecto
  const userName = user?.name || "Usuario";
  const userEmail = user?.email || "";
  const userPhone = user?.phone || "";
  const userDni = user?.dni || "";
  const isAdmin = user?.is_admin || false;

  // === Datos de los hijos del usuario ===
  const rawChildren: Child[] = (user?.hijos as Child[]) || [];
  
  // Transform API data to component format
  const children = rawChildren.map((child) => {
    const activeInscription = child.inscripciones?.[0]; // Get first/active inscription
    const group = activeInscription?.grupo;
    const pkg = group?.paquete;
    
    return {
      id: child.id.toString(),
      name: child.nombres,
      trip: {
        destination: pkg?.destino || "Sin destino asignado",
        dates: group ? `${group.fecha_inicio} - ${group.fecha_fin}` : "Sin fechas",
        group: group?.nombre || "Sin grupo asignado",
        responsible: group?.nombre_encargado?.[0] || group?.nombre_encargado_agencia?.[0] || "Sin responsable",
      },
      location: {
        // Default location - in real app this would come from real-time data
        latitude: -12.0464,
        longitude: -77.0428,
        address: "Lima, Peru" // Default location
      },
      notifications: [
        // Default notifications - in real app this would come from API
        { id: `n1_${child.id}`, type: "location", message: "Ubicación actualizada", time: "2 min" },
        { id: `n2_${child.id}`, type: "payment", message: "Estado del viaje actualizado", time: "1 hora" },
      ],
      rawData: child // Keep original data for profile access
    };
  });

  // Hijo seleccionado - handle case when no children
  const [selectedChildId, setSelectedChildId] = useState(children.length > 0 ? children[0].id : '');
  const selectedChild = useMemo(
    () => children.find(c => c.id === selectedChildId) ?? (children.length > 0 ? children[0] : null),
    [selectedChildId, children]
  );

  // Función para navegar al mapa
  const handleViewLocation = () => {
    if (navigation && selectedChild) {
      // Pass docNumber so Map component can fetch real location data from API
      navigation.navigate('MapScreen', {
        docNumber: selectedChild.rawData.doc_numero,
        studentName: selectedChild.name,
        // Optionally pass fallback data
        latitude: selectedChild.location.latitude,
        longitude: selectedChild.location.longitude,
        address: selectedChild.location.address
      });
    }
  };

  // Función para navegar al perfil del hijo seleccionado
  const handleNavigateToProfile = () => {
    if (navigation && selectedChild) {
      navigation.navigate('Profile', {
        childData: selectedChild.rawData // Pass the raw child data
      });
    } else {
      navigation.navigate('Profile'); // Navigate to parent profile if no child selected
    }
  };

  // Acciones rápidas (se mantienen, pero puedes usarlas con el contexto del hijo seleccionado)
  const quickActions = [
    { id: 1, title: "Ver Ubicación", icon: <FontAwesome6 name="map-location-dot" size={28} color="#d62d28" />, action: handleViewLocation },
    { id: 2, title: "Perfil", icon: <FontAwesome  name="user" size={28} color="#d62d28" />, action: handleNavigateToProfile },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#d62d28" />
      <ScrollView style={styles.container}>
      {/* Header con información del usuario padre */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>¡Hola, {userName}!</Text>
          <Text style={styles.subGreeting}>{isAdmin ? "Administrador" : "Bienvenido"}</Text>
        

          {/* Select de hijo */}
          {children.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Dropdown
                label="Hijo/a"
                options={children.map(c => ({ label: c.name, value: c.id }))}
                value={selectedChildId}
                onChange={setSelectedChildId}
              />
            </View>
          )}
        </View>
        
        {/* Botón de logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#d62d28" />
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Viaje Actual (usa datos del hijo seleccionado) */}
      {selectedChild ? (
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
      ) : (
        <View style={styles.tripCard}>
          <Text style={styles.tripTitle}>Sin hijos registrados</Text>
          <Text style={styles.tripDestination}>No tienes hijos registrados en el sistema.</Text>
          <Text style={styles.tripDates}>Contacta con el administrador para más información.</Text>
        </View>
      )}


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
      {selectedChild && (
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
      )}
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
  logoutButton: {
    backgroundColor: '#fde3e3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoutText: {
    color: '#d62d28',
    fontWeight: '600',
    fontSize: 12,
  },
  userInfo: {
    marginTop: 8,
    gap: 4,
  },
  userDetail: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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
