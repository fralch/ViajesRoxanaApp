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
    };
  };
  navigation?: any;
}

const MapScreen: React.FC<MapScreenProps> = ({ route, navigation }) => {
  // Datos por defecto (Cusco - Machu Picchu como en el DashboardScreen)
  const defaultData = {
    latitude: -13.1631,
    longitude: -72.5450,
    studentName: 'Diego García',
    address: 'Hotel Imperial Cusco, Av. Imperial 345, Cusco'
  };

  // Usar datos de la ruta o valores por defecto
  const {
    latitude = defaultData.latitude,
    longitude = defaultData.longitude,
    studentName = defaultData.studentName,
    address = defaultData.address
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