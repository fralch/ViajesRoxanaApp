import React from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {AntDesign, SimpleLineIcons} from '@expo/vector-icons';
import { useAuth } from '../shared/hooks';
import { LoadingSpinner } from '../shared/components';

// Import screens
import DashboardScreen from '../modules/dashboard/components/DashboardScreen';
import PersonalDataScreen from '../modules/profile/components/PersonalDataScreen';
import TripsListScreen from '../modules/trips/components/TripsListScreen';
import PaymentsListScreen from '../modules/payments/components/PaymentsListScreen';
import LiveLocationScreen from '../modules/location/components/LiveLocationScreen';
import MapScreen from '../modules/location/components/MapScreen';
import WelcomeScreen from '../modules/authentication/components/WelcomeScreen';

const Tab = createBottomTabNavigator();
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

// Main Tab Navigator
function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#d62d28',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          display: 'none',
        },
        headerStyle: {
          backgroundColor: '#d62d28',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitle: () => <HeaderLogo />,
        headerTitleAlign: 'center', // Asegura el centrado
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
            <AntDesign name="enviromento" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Payments" 
        component={PaymentsListScreen}
        options={{
          title: 'Pagos',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="creditcard" size={size} color={color} />
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
              <AntDesign name="arrowleft" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator for Main App with Map Screen
function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen 
        name="MapScreen" 
        component={MapScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#d62d28' },
          headerTintColor: '#fff',
          headerTitle: 'Mapa de Ubicación',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>
  );
}

// Root Stack Navigator (for authentication flow)
function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainApp" component={MainStackNavigator} />
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="MainApp" component={MainStackNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
