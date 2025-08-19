import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface LoginFormProps {
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
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
    <View style={styles.section}>
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
        Al continuar aceptas nuestros <Text style={styles.termsStrong}>Términos y Condiciones</Text> y la{' '}
        <Text style={styles.termsStrong}>Política de Privacidad</Text>.
      </Text>
    </View>
  );
};

const COLORS = {
  primary: '#d62d28',
  textPrimary: '#111827',
  textSubtle: '#374151',
  textMuted: '#6B7280',
  border: '#E5E7EB',
};

const SIZES = {
  spacingLg: 14,
  btnH: 54,
  radiusMd: 12,
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSubtle,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
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
    color: COLORS.textPrimary,
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
    marginTop: 4,
    marginBottom: SIZES.spacingLg,
  },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  rememberText: {
    color: COLORS.textSubtle,
    fontSize: 14,
    fontWeight: '600',
  },
  linkMuted: {
    color: COLORS.textMuted,
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    height: SIZES.btnH,
    borderRadius: SIZES.btnH / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  terms: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  termsStrong: {
    fontWeight: '800',
    color: COLORS.textSubtle,
  },
});

export default LoginForm;