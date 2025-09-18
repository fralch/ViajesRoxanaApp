import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');

const COLORS = {
  primary: '#d62d28',
  primaryLight: '#e85550',
  white: '#ffffff',
  textPrimary: '#2c3e50',
  textSecondary: '#5a6c7d',
  textLight: '#8492a6',
  background: '#f8f9fa',
  overlay: 'rgba(0, 0, 0, 0.5)',
  border: '#e1e8ed',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  visible,
  onClose,
  onAccept,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View entering={FadeIn.duration(300)} style={styles.backdrop} />
        
        <Animated.View 
          entering={FadeInDown.delay(100).springify()} 
          style={styles.modalContainer}
        >
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <FontAwesome name="times" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {/* Modal Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Permiso de privacidad</Text>
            
            <ScrollView 
              style={styles.textContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.description}>
               Para utilizar esta aplicación, es necesario que aceptes nuestros Términos y Condiciones y nuestras Políticas de Privacidad. Al hacer clic en "Aceptar", confirmas que has leído, comprendido y aceptado todos los términos, condiciones y políticas de privacidad establecidos.
              </Text>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={onAccept}
                activeOpacity={0.8}
              >
                <Text style={styles.acceptButtonText}>Aceptar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.declineButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.declineButtonText}>Leer más</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    maxHeight: height * 0.7,
    minHeight: height * 0.4,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingTop: SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    textAlign: 'left',
  },
  textContainer: {
    flex: 1,
    marginBottom: SPACING.xl,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textSecondary,
    textAlign: 'left',
  },
  buttonContainer: {
    gap: SPACING.md,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  acceptButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  declineButton: {
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  declineButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PrivacyPolicyModal;