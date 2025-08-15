import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

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

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#d62d28',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#d62d28',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
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
  // For now, we'll go directly to the main app
  // Later you can add authentication logic here
  const isAuthenticated = true; // This should come from your auth state

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