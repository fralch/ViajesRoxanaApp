import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../shared/hooks';
import { LoadingSpinner } from '../shared/components';

// Import navigators
import ParentStackNavigator from './ParentNavigator';
import ChildStackNavigator from './ChildNavigator';

// Import shared screens
import WelcomeScreen from '../modules/shared/authentication/components/WelcomeScreen';

const Stack = createStackNavigator();

// Root Stack Navigator (for authentication flow)
function AppNavigator() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </View>
    );
  }

  // Determinar qué navegador usar basado en el rol del usuario
  const getNavigatorComponent = () => {
    if (!user) return null;

    // Si es estudiante, usar el navegador de niños
    if (user.role === 'student') {
      return ChildStackNavigator;
    }

    // Si es guardian o admin, usar el navegador de padres
    return ParentStackNavigator;
  };

  const NavigatorComponent = getNavigatorComponent();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated && NavigatorComponent ? (
          <Stack.Screen name="MainApp" component={NavigatorComponent} />
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            {NavigatorComponent && (
              <Stack.Screen name="MainApp" component={NavigatorComponent} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
