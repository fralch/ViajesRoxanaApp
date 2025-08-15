import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [emailPhone, setEmailPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailPhone || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      Alert.alert('Éxito', 'Inicio de sesión exitoso');
      onClose();
    } catch {
      Alert.alert('Error', 'Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperar contraseña', 'Se enviará un enlace de recuperación a tu email');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            {/* Header del Modal */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* Card con Tabs */}
            <View style={styles.card}>
              {/* Tabs (segmentado) */}
              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[styles.tabBtn, tab === 'login' && styles.tabBtnActive]}
                  onPress={() => setTab('login')}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>
                    Tengo una cuenta
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabBtn, tab === 'register' && styles.tabBtnActive]}
                  onPress={() => setTab('register')}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.tabText, tab === 'register' && styles.tabTextActive]}>
                    Crear una cuenta
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Contenido del tab login */}
              {tab === 'login' ? (
                <>
                  <Text style={styles.sectionTitle}>Iniciar sesión</Text>

                  {/* Email / teléfono */}
                  <Text style={styles.label}>Correo electrónico o celular</Text>
                  <View style={styles.inputWrap}>
                    <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.leftIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="carlosrosales@gmail.com"
                      placeholderTextColor="#9CA3AF"
                      value={emailPhone}
                      onChangeText={setEmailPhone}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>

                  {/* Password */}
                  <Text style={[styles.label, { marginTop: 14 }]}>Contraseña</Text>
                  <View style={styles.inputWrap}>
                    <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.leftIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="****************"
                      placeholderTextColor="#9CA3AF"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!isPasswordVisible}
                      autoComplete="password"
                    />
                    <TouchableOpacity
                      style={styles.eyeBtn}
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      <Ionicons
                        name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Recordar + ¿Olvidaste? */}
                  <View style={styles.rowBetween}>
                    <TouchableOpacity
                      style={styles.remember}
                      onPress={() => setRemember(!remember)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                        {remember && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
                      </View>
                      <Text style={styles.rememberText}>Recordar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleForgotPassword} hitSlop={6}>
                      <Text style={styles.linkMuted}>¿No recuerdas tu contraseña?</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Botón ingresar */}
                  <TouchableOpacity
                    style={[styles.primaryBtn, isLoading && { opacity: 0.8 }]}
                    onPress={handleLogin}
                    disabled={isLoading}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.primaryBtnText}>{isLoading ? 'Ingresando…' : 'Ingresar'}</Text>
                  </TouchableOpacity>

                  {/* Términos */}
                  <Text style={styles.terms}>
                    Al ingresar al sistema estás de acuerdo con los{' '}
                    <Text style={styles.termsStrong}>términos y condiciones</Text>.
                  </Text>
                </>
              ) : (
                // Aquí podrías renderizar tu formulario de registro
                <View style={{ paddingVertical: 24 }}>
                  <Text style={{ color: '#6B7280', textAlign: 'center' }}>
                    Formulario de registro próximamente.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const CARD_RADIUS = 16;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#F6F7F9',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#111827',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    height: 52,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 6,
    marginLeft: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#d62d28',
    borderColor: '#d62d28',
  },
  rememberText: {
    color: '#374151',
    fontSize: 14,
  },
  linkMuted: {
    color: '#6B7280',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  primaryBtn: {
    backgroundColor: '#d62d28',
    height: 54,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  terms: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  termsStrong: {
    fontWeight: '800',
  },
});

export default LoginModal;