import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Logo/Image Section */}
      <View style={styles.imageContainer}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>🎒</Text>
        </View>
        <Text style={styles.appName}>ViajesRoxana</Text>
        <Text style={styles.tagline}>Tu compañero de aventuras escolares</Text>
      </View>

      {/* Welcome Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
        <Text style={styles.welcomeDescription}>
          Mantente conectado con tus hijos durante sus viajes escolares. 
          Recibe actualizaciones en tiempo real y accede a toda la información importante.
        </Text>

        {/* Features List */}
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📍</Text>
            <Text style={styles.featureText}>Ubicación en tiempo real</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🏥</Text>
            <Text style={styles.featureText}>Información médica segura</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💳</Text>
            <Text style={styles.featureText}>Gestión de pagos</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>Notificaciones instantáneas</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Crear Cuenta</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Explorar como invitado</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Al continuar, aceptas nuestros {' '}
          <Text style={styles.linkText}>Términos de Servicio</Text>
          {' '} y {' '}
          <Text style={styles.linkText}>Política de Privacidad</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 0.45,
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  featuresList: {
    paddingHorizontal: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  actionsContainer: {
    flex: 0.3,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loginButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196F3',
    marginBottom: 12,
  },
  registerButtonText: {
    color: '#2196F3',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;