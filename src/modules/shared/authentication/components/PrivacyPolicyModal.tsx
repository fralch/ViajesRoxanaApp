import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  Linking,
  Alert,
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
  success: '#27ae60',
  info: '#3498db',
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
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  const handleReadMore = () => {
    setShowDocumentsModal(true);
  };

  const handleCloseDocumentsModal = () => {
    setShowDocumentsModal(false);
  };

  const handleOpenTerms = async () => {
    try {
      await Linking.openURL('https://viajesroxana.com/pdfs/terminos-condiciones-intranet.pdf');
    } catch (error) {
      console.error('Error al abrir Términos y Condiciones:', error);
      Alert.alert('Error', 'No se pudo abrir el documento de Términos y Condiciones');
    }
  };

  const handleOpenPrivacy = async () => {
    try {
      await Linking.openURL('https://viajesroxana.com/pdfs/politica-de-seguridad-datos.pdf');
    } catch (error) {
      console.error('Error al abrir Política de Privacidad:', error);
      Alert.alert('Error', 'No se pudo abrir el documento de Política de Privacidad');
    }
  };

  const handleOpenBoth = async () => {
    try {
      await Promise.all([
        Linking.openURL('https://viajesroxana.com/pdfs/terminos-condiciones-intranet.pdf'),
        Linking.openURL('https://viajesroxana.com/pdfs/politica-de-seguridad-datos.pdf')
      ]);
      setShowDocumentsModal(false);
    } catch (error) {
      console.error('Error al abrir ambos documentos:', error);
      Alert.alert('Error', 'No se pudieron abrir los documentos');
    }
  };

  return (
    <>
      {/* Modal Principal de Privacidad */}
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
                  Es necesario que aceptes nuestros Términos y Condiciones y nuestras Políticas de Privacidad. Al hacer clic en "Aceptar", confirmas que has aceptado.
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
                  onPress={handleReadMore}
                  activeOpacity={0.8}
                >
                  <FontAwesome 
                    name="file-text" 
                    size={16} 
                    color={COLORS.textSecondary} 
                    style={styles.readMoreIcon} 
                  />
                  <Text style={styles.declineButtonText}>Leer documentos</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Modal de Documentos */}
      <Modal
        visible={showDocumentsModal}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <Animated.View entering={FadeIn.duration(300)} style={styles.backdrop} />
          
          <Animated.View 
            entering={FadeInDown.delay(100).springify()} 
            style={styles.documentsModalContainer}
          >
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseDocumentsModal}
              activeOpacity={0.7}
            >
              <FontAwesome name="times" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>

            {/* Documents Modal Content */}
            <View style={styles.documentsContent}>
              <View style={styles.documentsHeader}>
                <FontAwesome name="file-text-o" size={24} color={COLORS.primary} />
                <Text style={styles.documentsTitle}>Documentos legales</Text>
              </View>
              
              <Text style={styles.documentsDescription}>
                Selecciona qué documento deseas leer:
              </Text>

              {/* Document Buttons */}
              <View style={styles.documentsButtonContainer}>
                {/* Términos y Condiciones */}
                <TouchableOpacity
                  style={styles.documentButton}
                  onPress={handleOpenTerms}
                  activeOpacity={0.8}
                >
                  <View style={styles.documentButtonContent}>
                    <FontAwesome name="gavel" size={20} color={COLORS.info} />
                    <View style={styles.documentButtonText}>
                      <Text style={styles.documentButtonTitle}>Términos y Condiciones</Text>
                      <Text style={styles.documentButtonSubtitle}>Condiciones de uso de la aplicación</Text>
                    </View>
                    <FontAwesome name="external-link" size={14} color={COLORS.textLight} />
                  </View>
                </TouchableOpacity>

                {/* Política de Privacidad */}
                <TouchableOpacity
                  style={styles.documentButton}
                  onPress={handleOpenPrivacy}
                  activeOpacity={0.8}
                >
                  <View style={styles.documentButtonContent}>
                    <FontAwesome name="shield" size={20} color={COLORS.success} />
                    <View style={styles.documentButtonText}>
                      <Text style={styles.documentButtonTitle}>Política de Privacidad</Text>
                      <Text style={styles.documentButtonSubtitle}>Manejo y protección de datos</Text>
                    </View>
                    <FontAwesome name="external-link" size={14} color={COLORS.textLight} />
                  </View>
                </TouchableOpacity>

                {/* Abrir ambos */}
                <TouchableOpacity
                  style={styles.bothDocumentsButton}
                  onPress={handleOpenBoth}
                  activeOpacity={0.8}
                >
                  <FontAwesome name="copy" size={16} color={COLORS.white} />
                  <Text style={styles.bothDocumentsButtonText}>Abrir ambos documentos</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
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
    flexDirection: 'row',
  },
  declineButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  readMoreIcon: {
    marginRight: SPACING.sm,
  },
  
  // Estilos para el modal de documentos
  documentsModalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    maxHeight: height * 0.6,
    position: 'relative',
  },
  documentsContent: {
    paddingTop: SPACING.sm,
  },
  documentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  documentsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  documentsDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  documentsButtonContainer: {
    gap: SPACING.md,
  },
  documentButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  documentButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentButtonText: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  documentButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  documentButtonSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  bothDocumentsButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  bothDocumentsButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
});

export default PrivacyPolicyModal;
