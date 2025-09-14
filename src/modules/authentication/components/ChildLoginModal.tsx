import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, BounceIn } from 'react-native-reanimated';
import { useAuth } from '../../../shared/hooks/useAuth';

interface ChildLoginModalProps {
  visible: boolean;
  onClose: () => void;
}

const ChildLoginModal: React.FC<ChildLoginModalProps> = ({ visible, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        emailPhone: email,
        password: password,
        remember: rememberMe
      });
      onClose();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <Animated.View entering={BounceIn.delay(200)} style={styles.modalContent}>
              {/* Fun Header with decorative elements */}
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>

                {/* Fun decorative circles */}
                <View style={styles.decorativeElements}>
                  <View style={[styles.floatingCircle, styles.circle1]} />
                  <View style={[styles.floatingCircle, styles.circle2]} />
                  <View style={[styles.floatingCircle, styles.circle3]} />
                </View>

                <Animated.View entering={FadeIn.delay(400)} style={styles.headerContent}>
                  <View style={styles.iconContainer}>
                    <FontAwesome name="child" size={32} color="#fff" />
                  </View>
                  <Text style={styles.welcomeText}>¡Hola!</Text>
                  <Text style={styles.subtitle}>¿Listo para tu aventura?</Text>
                </Animated.View>
              </View>

              {/* Fun Login Form */}
              <View style={styles.formContainer}>
                <Animated.View entering={FadeIn.delay(600)} style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Tu email</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="email" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="ejemplo@email.com"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor={COLORS.placeholder}
                    />
                  </View>
                </Animated.View>

                <Animated.View entering={FadeIn.delay(700)} style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Tu contraseña</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="lock" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Tu contraseña secreta"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      placeholderTextColor={COLORS.placeholder}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={showPassword ? "eye" : "eye-off"}
                        size={18}
                        color={COLORS.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                </Animated.View>

                <Animated.View entering={FadeIn.delay(800)} style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={styles.rememberContainer}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                      {rememberMe && (
                        <MaterialIcons name="check" size={14} color="#fff" />
                      )}
                    </View>
                    <Text style={styles.rememberText}>Recordarme</Text>
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeIn.delay(900)}>
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={isLoading}
                  >
                    <Text style={styles.loginButtonText}>
                      {isLoading ? '🚀 Entrando...' : '🎉 ¡Entrar!'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeIn.delay(1000)}>
                  <TouchableOpacity style={styles.helpContainer}>
                    <Text style={styles.helpText}>
                      ¿Necesitas ayuda?
                      <Text style={styles.helpLink}> Pregunta a tus papás</Text>
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const COLORS = {
  primary: '#FF6B47', // Rojo-naranja juvenil
  secondary: '#FF8A65', // Naranja-rojizo amigable
  accent: '#FF5722', // Rojo vibrante
  background: 'linear-gradient(135deg, #ff6b47 0%, #ff8a65 100%)',
  cardBg: '#ffffff',
  text: '#2D3748',
  textSecondary: '#4A5568',
  placeholder: '#A0AEC0',
  border: '#E2E8F0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  white: '#ffffff',
  overlayBg: 'rgba(92, 92, 92, 0.3)',
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlayBg,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },

  // Header styles
  header: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
  },
  circle1: {
    width: 80,
    height: 80,
    top: -20,
    left: -20,
  },
  circle2: {
    width: 60,
    height: 60,
    top: 60,
    right: -10,
  },
  circle3: {
    width: 40,
    height: 40,
    bottom: 20,
    left: 50,
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 20,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },

  // Form styles
  formContainer: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  eyeButton: {
    padding: 8,
  },

  // Options
  optionsContainer: {
    marginBottom: 32,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  rememberText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },

  // Button
  loginButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.5,
  },

  // Help
  helpContainer: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  helpLink: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default ChildLoginModal;