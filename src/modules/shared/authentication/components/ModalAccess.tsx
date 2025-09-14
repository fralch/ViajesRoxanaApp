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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface ModalAccessProps {
  visible: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

const ModalAccess: React.FC<ModalAccessProps> = ({ visible, onClose, initialTab = 'login' }) => {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Iniciar Sesión
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <LoginForm onClose={onClose} />
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const COLORS = {
  bgOverlay: 'rgba(15, 23, 42, 0.55)',
  surface: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#6B7280',
  textSubtle: '#374151',
  border: '#E5E7EB',
  primary: '#d62d28',
};

const SIZES = {
  radiusLg: 20,
  radiusMd: 14,
  radiusSm: 10,
  inputH: 56,
  btnH: 56,
  spacingXl: 24,
  spacingLg: 20,
  spacingMd: 14,
  spacingSm: 10,
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.bgOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 420,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    paddingVertical: SIZES.spacingXl,
    paddingHorizontal: SIZES.spacingXl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacingLg,
  },
  modalTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },

  // Tabs
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: SIZES.radiusMd,
    padding: 6,
    marginBottom: SIZES.spacingXl,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radiusSm,
    paddingVertical: 10,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  tabTextActive: {
    color: COLORS.text,
  },

  // Secciones y campos
  section: {
    paddingTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SIZES.spacingLg,
  },
  fieldBlock: {
    marginBottom: SIZES.spacingLg,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSubtle,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    height: SIZES.inputH,
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 8,
    marginLeft: 6,
    borderRadius: 8,
  },

  // Opciones
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

  // Botón principal
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

  // Texto legal
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

  // Register placeholder
  placeholderRegister: {
    paddingVertical: 28,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    backgroundColor: '#FCFCFC',
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderText: {
    marginLeft: 10,
    color: COLORS.textMuted,
    fontSize: 14,
  },
});

export default ModalAccess;
