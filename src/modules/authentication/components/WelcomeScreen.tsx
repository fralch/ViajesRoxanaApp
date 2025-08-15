import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Image
} from 'react-native';
import {FontAwesome, FontAwesome6 } from '@expo/vector-icons';

// --- Constants for Design System ---
// Using constants makes the design consistent and easy to update.
const COLORS = {
  primary: '#d62d28',
  white: '#fff',
  textPrimary: '#333',
  textSecondary: '#666',
  textMuted: '#999',
  background: '#fff',
  lightGray: '#e3f2fd',
  border: '#d62d28',
};

const SPACING = {
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

const FONT_SIZES = {
  xsmall: 12,
  small: 14,
  medium: 16,
  large: 18,
  xlarge: 24,
  xxlarge: 32,
};

// --- Reusable Feature Item Component ---
// Creating a separate component makes the main code cleaner and promotes reuse.
interface FeatureItemProps {
  iconName: string;
  iconLibrary: 'FontAwesome' | 'FontAwesome6';
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ iconName, iconLibrary, text }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIconContainer}>
      {iconLibrary === 'FontAwesome' ? (
        <FontAwesome name={iconName as any} size={20} color={COLORS.primary} />
      ) : (
        <FontAwesome6 name={iconName as any} size={20} color={COLORS.primary} />
      )}
    </View>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

// --- Data for Features ---
// Separating data from presentation is a good practice.
const features = [
  { iconName: 'map-marker', iconLibrary: 'FontAwesome' as const, text: 'Ubicación en tiempo real' },
  { iconName: 'user-md', iconLibrary: 'FontAwesome' as const, text: 'Atención médica 24/7' },
  { iconName: 'suitcase-rolling', iconLibrary: 'FontAwesome6' as const, text: 'Control de equipaje' },
  { iconName: 'bell', iconLibrary: 'FontAwesome' as const, text: 'Notificaciones instantáneas' },
];

const WelcomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo/Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.logoPlaceholder}>
            <Image source={require('../../../shared/img/logo-cuadrado.png')} style={styles.logoImage} />
          </View>
          <Text style={styles.tagline}>Tu compañero de aventuras</Text>
        </View>

        {/* Welcome Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
          <Text style={styles.welcomeDescription}>
            Mantente conectado con tus hijos durante sus viajes. Recibe actualizaciones y accede a toda la información importante.
          </Text>
          
          {/* Features List - Now dynamically rendered */}
          {features.map((feature, index) => (
            <FeatureItem 
              key={index} 
              iconName={feature.iconName} 
              iconLibrary={feature.iconLibrary} 
              text={feature.text} 
            />
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons & Footer */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={[styles.button, styles.primaryButton]}>
          <Text style={[styles.buttonText, styles.primaryButtonText]}>Iniciar Sesión</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Crear Cuenta</Text>
        </TouchableOpacity>
        
        <TouchableOpacity>
          <Text style={styles.skipButtonText}>Explorar como invitado</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Al continuar, aceptas nuestros{' '}
          <Text style={styles.linkText}>Términos de Servicio</Text> y{' '}
          <Text style={styles.linkText}>Política de Privacidad</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.large,
  },
  // --- Header ---
  headerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
    marginTop: SPACING.large,
  },
  logoPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appName: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: '700',
    color: COLORS.primary,
  },
  tagline: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    marginTop: SPACING.small / 2,
  },
  // --- Main Content ---
  contentContainer: {
    marginBottom: SPACING.xlarge,
  },
  welcomeTitle: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
  welcomeDescription: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.large,
  },
  // --- Feature Item ---
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.medium,
  },
  featureText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textPrimary,
    flex: 1, // Allows text to wrap
  },
  // --- Footer & Actions ---
  footerContainer: {
    padding: SPACING.large,
    paddingTop: SPACING.medium,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    paddingVertical: SPACING.medium,
    borderRadius: 12,
    marginBottom: SPACING.medium,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  buttonText: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: COLORS.white,
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
  skipButtonText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: FONT_SIZES.small,
    marginBottom: SPACING.large,
  },
  footerText: {
    fontSize: FONT_SIZES.xsmall,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;