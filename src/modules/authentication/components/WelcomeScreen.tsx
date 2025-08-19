// WelcomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
} from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ModalAccess from './ModalAccess';

// --- Constants for Design System ---
const COLORS = {
  primary: '#d62d28',
  white: '#fff',
  textPrimary: '#222',
  textSecondary: '#555',
  textMuted: '#888',
  background: '#fafafa',
  border: '#e0e0e0',
};

const SPACING = {
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

const FONT_SIZES = {
  small: 14,
  medium: 16,
  large: 18,
  xlarge: 28,
};

// --- Feature Item Component with Animation ---
interface FeatureItemProps {
  iconName: string;
  iconLibrary: 'FontAwesome' | 'FontAwesome6';
  text: string;
  index: number;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ iconName, iconLibrary, text, index }) => (
  <Animated.View
    entering={FadeInUp.delay(300 + index * 100).springify()}
    style={styles.featureCard}
  >
    <View style={styles.featureIconContainer}>
      {iconLibrary === 'FontAwesome' ? (
        <FontAwesome name={iconName as any} size={18} color={COLORS.primary} />
      ) : (
        <FontAwesome6 name={iconName as any} size={18} color={COLORS.primary} />
      )}
    </View>
    <Text style={styles.featureText}>{text}</Text>
  </Animated.View>
);

// --- Data for Features ---
const features = [
  { iconName: 'map-marker', iconLibrary: 'FontAwesome' as const, text: 'Ubicación en tiempo real' },
  { iconName: 'user-md', iconLibrary: 'FontAwesome' as const, text: 'Supervision médica' },
  { iconName: 'suitcase-rolling', iconLibrary: 'FontAwesome6' as const, text: 'Control de equipaje' },
  { iconName: 'bell', iconLibrary: 'FontAwesome' as const, text: 'Notificaciones instantáneas' },
];

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTab, setModalTab] = useState<'login' | 'register'>('login');

  const handleGuestLogin = () => {
    navigation.navigate('Login' as never);
  };

  const handleLogin = () => {
    setModalTab('login');
    setModalVisible(true);
  };

  const handleRegister = () => {
    setModalTab('register');
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Contenedor sin Scroll */}
      <View style={styles.container}>
        {/* Logo/Header Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <Image
            source={require('../../../shared/img/logo-cuadrado.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.welcomeTitle}>
            Te brindamos
          </Animated.Text>

          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              iconName={feature.iconName}
              iconLibrary={feature.iconLibrary}
              text={feature.text}
              index={index}
            />
          ))}
        </View>
      </View>

      {/* Footer Actions */}
      <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleLogin}
          accessibilityLabel="Iniciar sesión"
        >
          <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleRegister}
          accessibilityLabel="Crear cuenta"
        >
          <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleGuestLogin} hitSlop={16}>
          <Text style={styles.skipText}>Explorar como invitado</Text>
        </TouchableOpacity>

        <Text style={styles.legalText}>
          Al continuar, aceptas nuestros{' '}
          <Text style={styles.link}>Términos de Servicio</Text> y{' '}
          <Text style={styles.link}>Política de Privacidad</Text>
        </Text>
      </Animated.View>

      <ModalAccess visible={modalVisible} onClose={() => setModalVisible(false)} initialTab={modalTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  logo: {
    width: 140,   // 🔥 más grande
    height: 140,  // 🔥 más grande
    marginBottom: 12,
  },
  featuresContainer: {
    marginTop: 12,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
    marginBottom: 12,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 10,         // 🔥 más compacto
    marginBottom: 8,     // 🔥 menos espacio
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: FONT_SIZES.small, // 🔥 texto más compacto
    color: COLORS.textPrimary,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
  },
  secondaryButton: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
  },
  skipText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: FONT_SIZES.medium,
    marginBottom: 12,
  },
  legalText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
