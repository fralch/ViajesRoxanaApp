# Ejemplo de Uso - Seguimiento de Ubicación en Tiempo Real

## 1. En un componente de pantalla (por ejemplo, ChildLocationScreen)

```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useBackgroundLocationTracking } from '../../../shared/hooks/useBackgroundLocationTracking';
import { LocationService } from '../../../shared/services';

interface ChildLocationScreenProps {
  childId: string; // ID del hijo que se quiere rastrear
}

export const ChildLocationScreen: React.FC<ChildLocationScreenProps> = ({ childId }) => {
  const {
    isTracking,
    currentLocation,
    error,
    lastUpdate,
    startTracking,
    stopTracking,
    forceUpdate,
    isTrackingChild
  } = useBackgroundLocationTracking();

  // Iniciar seguimiento automáticamente cuando se monta el componente
  useEffect(() => {
    if (childId && !isTrackingChild(childId)) {
      handleStartTracking();
    }

    // Limpiar al desmontar (opcional)
    return () => {
      // No detenemos automáticamente para permitir seguimiento continuo
      // stopTracking();
    };
  }, [childId]);

  const handleStartTracking = async () => {
    try {
      await startTracking(childId);
      Alert.alert('Éxito', 'Seguimiento iniciado cada 20 segundos');
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar el seguimiento');
    }
  };

  const handleStopTracking = async () => {
    try {
      await stopTracking();
      Alert.alert('Seguimiento detenido', 'El seguimiento en tiempo real se ha detenido');
    } catch (error) {
      Alert.alert('Error', 'No se pudo detener el seguimiento');
    }
  };

  const handleForceUpdate = async () => {
    try {
      await forceUpdate();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la ubicación');
    }
  };

  // Transformar datos para mostrar en UI
  const locationData = currentLocation ?
    LocationService.transformGeolocationData(currentLocation) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ubicación de {childId}</Text>

      {/* Estado del seguimiento */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Estado: {isTracking ? '🟢 Activo' : '🔴 Inactivo'}
        </Text>
        {lastUpdate && (
          <Text style={styles.updateText}>
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </Text>
        )}
      </View>

      {/* Ubicación actual */}
      {locationData && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationTitle}>Ubicación Actual:</Text>
          <Text>Latitud: {locationData.currentLocation.latitude}</Text>
          <Text>Longitud: {locationData.currentLocation.longitude}</Text>
          <Text>Estado: {locationData.liveStatus.status}</Text>
          <Text>Última movimiento: {locationData.liveStatus.lastMovement}</Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}

      {/* Controles */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={handleStartTracking}
          disabled={isTracking}
        >
          <Text style={styles.buttonText}>Iniciar Seguimiento</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={handleStopTracking}
          disabled={!isTracking}
        >
          <Text style={styles.buttonText}>Detener Seguimiento</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.updateButton]}
          onPress={handleForceUpdate}
          disabled={!isTracking}
        >
          <Text style={styles.buttonText}>Actualizar Ahora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  locationContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  controlsContainer: {
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4caf50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  updateButton: {
    backgroundColor: '#2196f3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

## 2. Para múltiples hijos (en un dashboard de padres)

```tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useBackgroundLocationTracking } from '../../../shared/hooks/useBackgroundLocationTracking';

interface Child {
  id: string;
  name: string;
}

export const ParentDashboard: React.FC = () => {
  const [children] = useState<Child[]>([
    { id: '12345', name: 'Juan' },
    { id: '67890', name: 'María' },
  ]);

  const [activeChildId, setActiveChildId] = useState<string | null>(null);

  const {
    isTracking,
    currentLocation,
    startTracking,
    stopTracking,
    isTrackingChild
  } = useBackgroundLocationTracking();

  const handleTrackChild = async (childId: string) => {
    // Detener seguimiento anterior si existe
    if (isTracking) {
      await stopTracking();
    }

    // Iniciar seguimiento del nuevo hijo
    await startTracking(childId);
    setActiveChildId(childId);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Mis Hijos
      </Text>

      <FlatList
        data={children}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 15,
              backgroundColor: isTrackingChild(item.id) ? '#e8f5e8' : '#f0f0f0',
              marginBottom: 10,
              borderRadius: 10,
            }}
            onPress={() => handleTrackChild(item.id)}
          >
            <Text style={{ fontSize: 16 }}>
              {item.name} {isTrackingChild(item.id) ? '🟢' : '⚫'}
            </Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              ID: {item.id}
            </Text>
          </TouchableOpacity>
        )}
      />

      {currentLocation && activeChildId && (
        <View style={{ marginTop: 20, padding: 15, backgroundColor: '#fff', borderRadius: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>Última ubicación:</Text>
          <Text>Hijo: {activeChildId}</Text>
          <Text>Lat: {currentLocation.data.geolocalizacion.latitud}</Text>
          <Text>Lng: {currentLocation.data.geolocalizacion.longitud}</Text>
          <Text>Hace: {currentLocation.data.geolocalizacion.minutes_ago.toFixed(1)} minutos</Text>
        </View>
      )}
    </View>
  );
};
```

## 3. Características principales

### ✅ **Lo que incluye:**
- **Seguimiento automático cada 20 segundos**
- **Optimizado para Redis backend** (usando `getRealTimeLocation`)
- **Gestión de estado de app** (foreground/background)
- **Manejo de errores robusto**
- **Cache-Control para datos frescos**
- **Singleton pattern** para evitar múltiples instancias
- **Hook fácil de usar** con React

### ⚙️ **Configuración:**
```tsx
// En tu componente principal o donde inicies el tracking
const { startTracking } = useBackgroundLocationTracking();

// Iniciar seguimiento
await startTracking('12345'); // ID del hijo

// El servicio ahora consultará automáticamente cada 20 segundos
```

### 🔧 **Personalización:**
Para cambiar el intervalo de 20 segundos, modifica la línea en `backgroundLocationService.ts`:
```typescript
this.intervalId = setInterval(async () => {
  await this.fetchChildLocation();
}, 20000); // <-- Cambiar este valor (en milisegundos)
```

### 📱 **Compatibilidad:**
- ✅ Funciona cuando la app está activa
- ⚠️ Continúa brevemente cuando la app está en background
- 🔄 Se reanuda automáticamente cuando la app vuelve al foreground
- 🚀 Preparado para background tasks completos con TaskManager