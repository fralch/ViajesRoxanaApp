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

interface ParentLoginModalProps {
  visible: boolean;
  onClose: () => void;
}

const ParentLoginModal: React.FC<ParentLoginModalProps> = ({ visible, onClose }) => {
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
                <Text style={styles.modalTitle}>Acceso para Padres</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>
                Supervisa y protege el viaje de tu hijo
              </Text>

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
  spacingXl: 24,
  spacingLg: 20,
  spacingMd: 14,
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
    marginBottom: SIZES.spacingMd,
  },
  modalTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: SIZES.spacingLg,
    textAlign: 'left',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
});

export default ParentLoginModal;