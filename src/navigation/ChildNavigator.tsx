import React from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {AntDesign, MaterialIcons} from '@expo/vector-icons';

// Import child screens
import ChildDashboardScreen from '../modules/children/dashboard/components/ChildDashboardScreen';
import ChildLocationScreen from '../modules/children/location/components/ChildLocationScreen';
import ChildProfileScreen from '../modules/children/profile/components/ChildProfileScreen';
import GamesScreen from '../modules/children/games/components/GamesScreen';

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

// Main Tab Navigator for Children
function ChildTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          display: 'flex',
          backgroundColor: '#fff',
        },
        headerStyle: {
          backgroundColor: '#e74c3c',
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
        component={ChildDashboardScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Location"
        component={ChildLocationScreen}
        options={{
          title: 'Ubicación',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="location-on" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Games"
        component={GamesScreen}
        options={{
          title: 'Juegos',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="games" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ChildProfile"
        component={ChildProfileScreen}
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

// Stack Navigator for Child App
function ChildStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChildTabs" component={ChildTabNavigator} />
    </Stack.Navigator>
  );
}

export default ChildStackNavigator;