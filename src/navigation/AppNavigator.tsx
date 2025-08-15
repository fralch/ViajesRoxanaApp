import React from 'react';
import { Text, Image, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import DashboardScreen from '../modules/dashboard/components/DashboardScreen';
import ProfileMainScreen from '../modules/profile/components/ProfileMainScreen';
import TripsListScreen from '../modules/trips/components/TripsListScreen';
import PaymentsListScreen from '../modules/payments/components/PaymentsListScreen';
import LiveLocationScreen from '../modules/location/components/LiveLocationScreen';
import WelcomeScreen from '../modules/authentication/components/WelcomeScreen';
import LoginScreen from '../modules/authentication/components/LoginScreen';

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
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: Math.max(insets.bottom, 15),
          paddingTop: 5,
          height: 60 + Math.max(insets.bottom, 15),
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
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Trips" 
        component={TripsListScreen}
        options={{
          title: 'Viajes',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>✈️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Location" 
        component={LiveLocationScreen}
        options={{
          title: 'Ubicación',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📍</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Payments" 
        component={PaymentsListScreen}
        options={{
          title: 'Pagos',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>💳</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileMainScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Root Stack Navigator (for authentication flow)
function AppNavigator() {
  const isAuthenticated = true;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainApp" component={MainTabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
