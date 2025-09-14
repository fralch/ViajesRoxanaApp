import React from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // COMENTADO PARA USO FUTURO
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import {AntDesign, SimpleLineIcons} from '@expo/vector-icons'; // COMENTADO PARA USO FUTURO

// Import parent screens
import DashboardScreen from '../modules/parents/dashboard/components/DashboardScreen';
import PersonalDataScreen from '../modules/parents/profile/components/PersonalDataScreen';
import TripsListScreen from '../modules/parents/trips/components/TripsListScreen';
import PaymentsListScreen from '../modules/parents/payments/components/PaymentsListScreen';
import LiveLocationScreen from '../modules/parents/location/components/LiveLocationScreen';
import MapScreen from '../modules/parents/location/components/MapScreen';
import NotificationDetailsScreen from '../modules/parents/notifications/components/NotificationDetailsScreen';

// const Tab = createBottomTabNavigator(); // COMENTADO PARA USO FUTURO
const Stack = createStackNavigator();

// Header Logo Component - CENTRADO
function HeaderLogo() {
  return (
    <View style={{
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Image
        source={require('../shared/img/logo-roxana-blanco.png')}
        style={{ width: 120, height: 40 }}
        resizeMode="contain"
      />
    </View>
  );
}

/* 
// ========================================
// HORIZONTAL NAV BAR (TAB NAVIGATOR) - COMENTADO PARA USO FUTURO
// ========================================

// Main Tab Navigator for Parents
function ParentTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#d62d28',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          display: 'flex',
        },
        headerStyle: {
          backgroundColor: '#d62d28',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitle: () => <HeaderLogo />,
        headerTitleAlign: 'center',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Trips"
        component={TripsListScreen}
        options={{
          title: 'Viajes',
          tabBarIcon: ({ color, size }) => (
            <SimpleLineIcons name="plane" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Location"
        component={LiveLocationScreen}
        options={{
          title: 'Ubicación',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="environment" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Payments"
        component={PaymentsListScreen}
        options={{
          title: 'Pagos',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={PersonalDataScreen}
        options={({ navigation }) => ({
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Dashboard')}
              style={{ marginLeft: 15 }}
            >
              <AntDesign name="left" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
    </Tab.Navigator>
  );
}

// ======================================== 
*/

// Stack Navigator for Parent App (VERSIÓN SIN TAB NAVIGATOR)
function ParentStackNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#d62d28',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitle: () => <HeaderLogo />,
        headerTitleAlign: 'center',
      }}
    >
      {/* Pantallas principales que estaban en el Tab Navigator */}
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Inicio' }}
      />
      <Stack.Screen 
        name="Trips" 
        component={TripsListScreen}
        options={{ title: 'Viajes' }}
      />
      <Stack.Screen 
        name="Location" 
        component={LiveLocationScreen}
        options={{ title: 'Ubicación' }}
      />
      <Stack.Screen 
        name="Payments" 
        component={PaymentsListScreen}
        options={{ title: 'Pagos' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={PersonalDataScreen}
        options={{ title: 'Perfil' }}
      />
      
      {/* Pantallas adicionales */}
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          headerTitle: 'Mapa de Ubicación',
        }}
      />
      <Stack.Screen
        name="NotificationDetails"
        component={NotificationDetailsScreen}
        options={{
          headerTitle: 'Notificaciones',
        }}
      />
    </Stack.Navigator>
  );
}

export default ParentStackNavigator;
