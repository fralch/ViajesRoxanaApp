import React from 'react';
import { View, StyleSheet } from 'react-native';
import Map from './Map';

interface MapScreenProps {
  route?: {
    params?: {
      latitude?: number;
      longitude?: number;
      studentName?: string;
      address?: string;
      docNumber?: string;
    };
  };
  navigation?: any;
}

const MapScreen: React.FC<MapScreenProps> = ({ route, navigation }) => {
  // Datos por defecto 
  const defaultData = {
    latitude: 4.6097,
    longitude: -74.0817,
    studentName: 'Juan Pérez Prueba',
    address: 'Centro de Bogotá'
  };

  // Usar datos de la ruta o valores por defecto
  const {
    latitude = defaultData.latitude,
    longitude = defaultData.longitude,
    studentName = defaultData.studentName,
    address = defaultData.address,
    docNumber
  } = route?.params || {};

  const handleClose = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Map
        latitude={latitude}
        longitude={longitude}
        studentName={studentName}
        address={address}
        docNumber={docNumber}
        onClose={handleClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MapScreen;