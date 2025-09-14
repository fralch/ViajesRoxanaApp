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
  Dimensions,
} from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import ParentLoginModal from './ParentLoginModal';
import ChildLoginModal from './ChildLoginModal';

const { height } = Dimensions.get('window');

// --- Enhanced Design System ---
const COLORS = {
  primary: '#d62d28',
  primaryLight: '#e85550',
  primaryDark: '#b8241f',
  secondary: '#2c3e50',
  accent: '#f39c12',
  white: '#ffffff',
  offWhite: '#fafbfc',
  textPrimary: '#2c3e50',
  textSecondary: '#5a6c7d',
  textLight: '#8492a6',
  background: '#f8f9fa',
  cardBackground: '#ffffff',
  border: '#e1e8ed',
  shadow: 'rgba(44, 62, 80, 0.08)',
  overlay: 'rgba(214, 45, 40, 0.05)',
  gradient: ['#d62d28', '#e85550'],
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

const TYPOGRAPHY = {
  hero: 36,
  title: 28,
  heading: 24,
  subheading: 20,
  body: 16,
  caption: 14,
  small: 12,
};

const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 50,
};

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [parentModalVisible, setParentModalVisible] = useState(false);
  const [childModalVisible, setChildModalVisible] = useState(false);

  const handleParentLogin = () => {
    setParentModalVisible(true);
  };

  const handleChildLogin = () => {
    setChildModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.container}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Logo Container with Enhanced Animation */}
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Image
                source={require('../../../shared/img/logo-cuadrado.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            {/* Decorative Elements */}
            <View style={[styles.decorativeCircle, styles.circle1]} />
            <View style={[styles.decorativeCircle, styles.circle2]} />
          </Animated.View>

          {/* Welcome Text */}
          <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
            <Text style={styles.welcomeSubtitle}>
              Tu compañero de confianza para viajes seguros y tranquilos
            </Text>
          </Animated.View>

          {/* Visual Enhancement - Floating Icons */}
          <Animated.View entering={FadeIn.delay(800).duration(1000)} style={styles.floatingIcons}>
            <View style={[styles.floatingIcon, styles.icon1]}>
              <FontAwesome name="shield" size={16} color={COLORS.primary} />
            </View>
            <View style={[styles.floatingIcon, styles.icon2]}>
              <FontAwesome name="heart" size={14} color={COLORS.primary} />
            </View>
            <View style={[styles.floatingIcon, styles.icon3]}>
              <FontAwesome6 name="location-dot" size={15} color={COLORS.primary} />
            </View>
          </Animated.View>
        </View>

        {/* CTA Section */}
        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.ctaSection}>
          <View style={styles.ctaHeader}>
            <Text style={styles.ctaTitle}>Empezar ahora</Text>
            <Text style={styles.ctaSubtitle}>Selecciona cómo quieres acceder</Text>
          </View>

          <View style={styles.buttonContainer}>
            {/* Parent Button - Enhanced */}
            <TouchableOpacity
              style={[styles.userButton, styles.parentButton]}
              onPress={handleParentLogin}
              activeOpacity={0.85}
              accessibilityLabel="Acceso para padres"
            >
              <View style={styles.buttonContent}>
                <View style={styles.buttonIconWrapper}>
                  <View style={styles.buttonIconContainer}>
                    <FontAwesome name="user" size={24} color={COLORS.white} />
                  </View>
                </View>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.buttonTitle}>Padre/Madre</Text>
                  <Text style={styles.buttonSubtitle}>Supervisar y proteger</Text>
                </View>
                <View style={styles.buttonArrow}>
                  <FontAwesome name="arrow-right" size={18} color="rgba(255,255,255,0.9)" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Child Button - Enhanced */}
            <TouchableOpacity
              style={[styles.userButton, styles.childButton]}
              onPress={handleChildLogin}
              activeOpacity={0.85}
              accessibilityLabel="Acceso para hijos"
            >
              <View style={styles.buttonContent}>
                <View style={styles.buttonIconWrapper}>
                  <View style={[styles.buttonIconContainer, styles.childIconContainer]}>
                    <FontAwesome name="child" size={24} color={COLORS.primary} />
                  </View>
                </View>
                <View style={styles.buttonTextContainer}>
                  <Text style={[styles.buttonTitle, styles.childButtonTitle]}>Hijo/Hija</Text>
                  <Text style={[styles.buttonSubtitle, styles.childButtonSubtitle]}>
                    Mantenerse conectado
                  </Text>
                </View>
                <View style={styles.buttonArrow}>
                  <FontAwesome name="arrow-right" size={18} color={COLORS.primary} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Enhanced Legal Text */}
          <Animated.Text entering={FadeIn.delay(700)} style={styles.legalText}>
            Al continuar aceptas los{' '}
            <Text style={styles.legalLink}>Términos de Uso</Text>
            {' '}y la{' '}
            <Text style={styles.legalLink}>Política de Privacidad</Text>
          </Animated.Text>
        </Animated.View>
      </View>

      <ParentLoginModal
        visible={parentModalVisible}
        onClose={() => setParentModalVisible(false)}
      />

      <ChildLoginModal
        visible={childModalVisible}
        onClose={() => setChildModalVisible(false)}
      />
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
  },
  
  // Hero Section
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl,
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
    position: 'relative',
  },
  logoBackground: {
    width: 140,
    height: 140,
    borderRadius: RADIUS.xxl,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  logo: {
    width: 90,
    height: 90,
  },
  
  // Decorative Elements
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: COLORS.overlay,
    borderRadius: RADIUS.full,
  },
  circle1: {
    width: 20,
    height: 20,
    top: 10,
    right: -10,
  },
  circle2: {
    width: 16,
    height: 16,
    bottom: 20,
    left: -5,
  },
  
  floatingIcons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingIcon: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },
  icon1: {
    top: '20%',
    right: '15%',
  },
  icon2: {
    top: '60%',
    left: '10%',
  },
  icon3: {
    top: '40%',
    right: '5%',
  },
  
  // Welcome Text
  welcomeTextContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  welcomeTitle: {
    fontSize: TYPOGRAPHY.hero,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
    letterSpacing: -1,
  },
  welcomeSubtitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  
  // CTA Section
  ctaSection: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xl,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
    minHeight: height * 0.4,
  },
  ctaHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  ctaTitle: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  ctaSubtitle: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  // Enhanced Buttons
  buttonContainer: {
    gap: SPACING.lg,
    marginBottom: SPACING.xxxl,
  },
  userButton: {
    borderRadius: RADIUS.xl,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  parentButton: {
    backgroundColor: COLORS.primary,
  },
  childButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  buttonIconWrapper: {
    marginRight: SPACING.lg,
  },
  buttonIconContainer: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childIconContainer: {
    backgroundColor: COLORS.overlay,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: TYPOGRAPHY.subheading,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  childButtonTitle: {
    color: COLORS.primary,
  },
  buttonSubtitle: {
    fontSize: TYPOGRAPHY.caption,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  childButtonSubtitle: {
    color: COLORS.textSecondary,
  },
  buttonArrow: {
    marginLeft: SPACING.md,
  },
  
  // Legal Text
  legalText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: SPACING.lg,
  },
  legalLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default WelcomeScreen;