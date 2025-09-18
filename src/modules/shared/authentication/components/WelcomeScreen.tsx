// WelcomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import ParentLoginModal from './ParentLoginModal';
import ChildLoginModal from './ChildLoginModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import { usePrivacyPolicy } from '../../../../shared/hooks/usePrivacyPolicy';

const { height, width } = Dimensions.get('window');

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

// Responsive spacing based on screen height
const getSpacing = () => {
  const isSmallScreen = height < 700;
  const isMediumScreen = height < 800;
  
  return {
    xs: 4,
    sm: 8,
    md: isSmallScreen ? 12 : 16,
    lg: isSmallScreen ? 16 : 24,
    xl: isSmallScreen ? 20 : 32,
    xxl: isSmallScreen ? 32 : 48,
    xxxl: isSmallScreen ? 40 : 64,
  };
};

const SPACING = getSpacing();

// Responsive typography
const getTypography = () => {
  const isSmallScreen = height < 700;
  
  return {
    hero: isSmallScreen ? 28 : 36,
    title: isSmallScreen ? 24 : 28,
    heading: isSmallScreen ? 20 : 24,
    subheading: isSmallScreen ? 18 : 20,
    body: 16,
    caption: 14,
    small: 12,
  };
};

const TYPOGRAPHY = getTypography();

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
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  
  const { isAccepted, isLoading } = usePrivacyPolicy();

  // Mostrar el modal de privacidad automáticamente solo si no ha sido aceptado
  useEffect(() => {
    if (!isLoading && !isAccepted) {
      setPrivacyModalVisible(true);
    }
  }, [isLoading, isAccepted]);

  const handleParentLogin = () => {
    setParentModalVisible(true);
  };

  const handleChildLogin = () => {
    setChildModalVisible(true);
  };

  const handlePrivacyAccept = () => {
    setPrivacyModalVisible(false);
  };

  const handlePrivacyClose = () => {
    setPrivacyModalVisible(false);
  };

  // Responsive values
  const isSmallScreen = height < 700;
  const heroMinHeight = Math.max(height * 0.5, 400);
  const ctaMinHeight = Math.max(height * 0.45, 350);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Section */}
        <View style={[styles.heroSection, { minHeight: heroMinHeight }]}>
          {/* Logo Container with Enhanced Animation */}
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Image
                source={require('../../../../shared/img/logo-cuadrado.png')}
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
            <Text style={styles.welcomeTitle} adjustsFontSizeToFit numberOfLines={1}>
              ¡Bienvenido!
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Tu compañero de confianza para viajes seguros y tranquilos
            </Text>
          </Animated.View>

          {/* Visual Enhancement - Floating Icons */}
          {!isSmallScreen && (
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
          )}
        </View>

        {/* CTA Section */}
        <Animated.View entering={FadeInDown.delay(500).springify()} style={[styles.ctaSection, { minHeight: ctaMinHeight }]}>
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
      </ScrollView>

      <ParentLoginModal
        visible={parentModalVisible}
        onClose={() => setParentModalVisible(false)}
      />

      <ChildLoginModal
        visible={childModalVisible}
        onClose={() => setChildModalVisible(false)}
      />

      <PrivacyPolicyModal
        visible={privacyModalVisible}
        onClose={handlePrivacyClose}
        onAccept={handlePrivacyAccept}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  
  // Hero Section
  heroSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    position: 'relative',
  },
  logoBackground: {
    width: height < 700 ? 120 : 140,
    height: height < 700 ? 120 : 140,
    borderRadius: RADIUS.xxl,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 12,
  },
  logo: {
    width: height < 700 ? 75 : 90,
    height: height < 700 ? 75 : 90,
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
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
  },
  ctaHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
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
    marginBottom: SPACING.xl,
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
    padding: SPACING.lg,
  },
  buttonIconWrapper: {
    marginRight: SPACING.lg,
  },
  buttonIconContainer: {
    width: height < 700 ? 48 : 56,
    height: height < 700 ? 48 : 56,
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