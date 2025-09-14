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
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../../shared/hooks';

interface LoginFormProps {
  onClose: () => void;
  userType?: 'parent' | 'child'; // Nuevo prop para especificar el tipo de usuario
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, userType = 'parent' }) => {
  const navigation = useNavigation();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    try {
      await login({
        emailPhone: email,
        password,
        remember,
        userType, // Pasar el tipo de usuario al login
      });
      onClose();
      // Navigation happens automatically via AppNavigator when isAuthenticated becomes true
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Credenciales incorrectas');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperar contraseña', 'Se enviará un enlace de recuperación a tu email');
  };

  return (
    <View style={styles.section}>
      {/* Email/DNI */}
      <Text style={styles.label}>
        {userType === 'child' ? 'DNI' : 'Correo electrónico'}
      </Text>
      <View style={styles.inputWrap}>
        <Ionicons
          name={userType === 'child' ? 'card-outline' : 'mail-outline'}
          size={20}
          color="#6B7280"
          style={styles.leftIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={userType === 'child' ? '12345678' : 'admin@viajesroxana.com'}
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType={userType === 'child' ? 'numeric' : 'email-address'}
          autoCapitalize="none"
          autoComplete={userType === 'child' ? 'off' : 'email'}
        />
      </View>

      {/* Password */}
      <Text style={[styles.label, { marginTop: 20 }]}>Contraseña</Text>
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
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
            {remember && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
          </View>
          <Text style={styles.rememberText}>Recordar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleForgotPassword} 
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.forgotPasswordBtn}
        >
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
  spacingLg: 14, // Aumentado de 14 a 20
  btnH: 54, // Aumentado de 54 a 56
  radiusMd: 12,
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 8,
    paddingHorizontal: 15, // Añadido más margen lateral
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
    marginBottom: 10, // Aumentado de 8 a 10
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16, // Aumentado de 12 a 16
    height: 56, // Aumentado de 52 a 56 para mejor área de tap
    marginBottom: 4, // Añadido espacio inferior
  },
  leftIcon: {
    marginRight: 12, // Aumentado de 8 a 12
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingVertical: 16, // Añadido padding vertical para mejor área de tap
    paddingHorizontal: 0,
  },
  eyeBtn: {
    padding: 12, // Aumentado de 6 a 12 para mejor área de tap
    marginLeft: 8, // Aumentado de 6 a 8
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12, // Aumentado de 4 a 12
    marginBottom: SIZES.spacingLg,
    paddingHorizontal: 4, // Añadido padding lateral
  },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, // Añadido padding vertical para mejor área de tap
  },
  checkbox: {
    width: 20, // Aumentado de 18 a 20
    height: 20, // Aumentado de 18 a 20
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 10, // Aumentado de 8 a 10
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
  forgotPasswordBtn: {
    paddingVertical: 8, // Añadido para mejor área de tap
    paddingHorizontal: 4,
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
    marginTop: 8, // Aumentado de 2 a 8
    marginBottom: 12,
    paddingHorizontal: 20, // Añadido padding lateral
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