import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src';
import { AuthProvider } from './src/shared/hooks';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
