import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface RegisterFormProps {
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    guardian_name: '',
    guardian_lastname: '',
    address: '',
    phone: '',
    student_name: '',
    student_lastname: '',
    document_type: 'DNI',
    document_number: '',
    email: '',
    password: '',
    confirm_password: '',
    accept_terms: false,
    accept_privacy: false,
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleRegister();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirm_password) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (!formData.accept_terms || !formData.accept_privacy) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones y la política de privacidad');
      return;
    }
    
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      Alert.alert('Éxito', 'Registro completado exitosamente');
      onClose();
    } catch {
      Alert.alert('Error', 'Hubo un problema al registrar la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Datos del Apoderado</Text>
      
      <Text style={styles.label}>Nombre</Text>
      <View style={styles.inputWrap}>
        <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.leftIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nombre del apoderado"
          placeholderTextColor="#9CA3AF"
          value={formData.guardian_name}
          onChangeText={(text) => updateFormData('guardian_name', text)}
        />
      </View>

      <Text style={[styles.label, { marginTop: 14 }]}>Apellido</Text>
      <View style={styles.inputWrap}>
        <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.leftIcon} />
        <TextInput
          style={styles.input}
          placeholder="Apellido del apoderado"
          placeholderTextColor="#9CA3AF"
          value={formData.guardian_lastname}
          onChangeText={(text) => updateFormData('guardian_lastname', text)}
        />
      </View>

      <Text style={[styles.label, { marginTop: 14 }]}>Dirección</Text>
      <View style={styles.inputWrap}>
        <Ionicons name="location-outline" size={20} color="#6B7280" style={styles.leftIcon} />
        <TextInput
          style={styles.input}
          placeholder="Dirección completa"
          placeholderTextColor="#9CA3AF"
          value={formData.address}
          onChangeText={(text) => updateFormData('address', text)}
        />
      </View>

      <Text style={[styles.label, { marginTop: 14 }]}>Teléfono</Text>
      <View style={styles.inputWrap}>
        <Ionicons name="call-outline" size={20} color="#6B7280" style={styles.leftIcon} />
        <TextInput
          style={styles.input}
          placeholder="Número de teléfono"
          placeholderTextColor="#9CA3AF"
          value={formData.phone}
          onChangeText={(text) => updateFormData('phone', text)}
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Datos del Alumno</Text>
      
      <Text style={styles.label}>Nombre del Alumno</Text>
      <View style={styles.inputWrap}>
        <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.leftIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nombre del alumno"
          placeholderTextColor="#9CA3AF"
          value={formData.student_name}
          onChangeText={(text) => updateFormData('student_name', text)}
        />
      </View>

      <Text style={[styles.label, { marginTop: 14 }]}>Apellido del Alumno</Text>
      <View style={styles.inputWrap}>
        <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.leftIcon} />
        <TextInput
          style={styles.input}
          placeholder="Apellido del alumno"
          placeholderTextColor="#9CA3AF"
          value={formData.student_lastname}
          onChangeText={(text) => updateFormData('student_lastname', text)}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Documentos del Alumno</Text>
      
      <Text style={styles.label}>Tipo de Documento</Text>
      <View style={styles.inputWrap}>
        <Ionicons name="card-outline" size={20} color="#6B7280" style={styles.leftIcon} />
        <TextInput
          style={styles.input}
          placeholder="DNI"
          placeholderTextColor="#9CA3AF"
          value={formData.document_type}
          onChangeText={(text) => updateFormData('document_type', text)}
        />
      </View>

      <Text style={[styles.label, { marginTop: 14 }]}>Número de Documento</Text>
      <View style={styles.inputWrap}>
        <Ionicons name="card-outline" size={20} color="#6B7280" style={styles.leftIcon} />
        <TextInput
          style={styles.input}
          placeholder="Número de documento"
          placeholderTextColor="#9CA3AF"
          value={formData.document_number}
          onChangeText={(text) => updateFormData('document_number', text)}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.stepTitle}>Credenciales y Términos</Text>
      
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputWrap}>
        <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.leftIcon} />
        <TextInput
          style={styles.input}
          placeholder="tu@email.com"
          placeholderTextColor="#9CA3AF"
          value={formData.email}
          onChangeText={(text) => updateFormData('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={[styles.label, { marginTop: 14 }]}>Contraseña</Text>
      <View style={styles.inputWrap}>
        <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.leftIcon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#9CA3AF"
          value={formData.password}
          onChangeText={(text) => updateFormData('password', text)}
          secureTextEntry={!isPasswordVisible}
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

      <Text style={[styles.label, { marginTop: 14 }]}>Confirmar Contraseña</Text>
      <View style={styles.inputWrap}>
        <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.leftIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor="#9CA3AF"
          value={formData.confirm_password}
          onChangeText={(text) => updateFormData('confirm_password', text)}
          secureTextEntry={!isConfirmPasswordVisible}
        />
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          <Ionicons
            name={isConfirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      {/* Checkboxes */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => updateFormData('accept_terms', !formData.accept_terms)}
        >
          <View style={[styles.checkbox, formData.accept_terms && styles.checkboxChecked]}>
            {formData.accept_terms && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
          </View>
          <Text style={styles.checkboxText}>Acepto los términos y condiciones</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => updateFormData('accept_privacy', !formData.accept_privacy)}
        >
          <View style={[styles.checkbox, formData.accept_privacy && styles.checkboxChecked]}>
            {formData.accept_privacy && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
          </View>
          <Text style={styles.checkboxText}>Acepto la política de privacidad</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4].map((stepNumber) => (
          <View key={stepNumber} style={styles.progressStep}>
            <View style={[styles.progressCircle, step >= stepNumber && styles.progressCircleActive]}>
              <Text style={[styles.progressText, step >= stepNumber && styles.progressTextActive]}>
                {stepNumber}
              </Text>
            </View>
            {stepNumber < 4 && <View style={[styles.progressLine, step > stepNumber && styles.progressLineActive]} />}
          </View>
        ))}
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backBtnText}>Atrás</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.nextBtn, isLoading && { opacity: 0.8 }]}
          onPress={handleNext}
          disabled={isLoading}
        >
          <Text style={styles.nextBtnText}>
            {step === 4 ? (isLoading ? 'Registrando...' : 'Registrar') : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>
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

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleActive: {
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  progressTextActive: {
    color: '#fff',
  },
  progressLine: {
    width: 30,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 5,
  },
  progressLineActive: {
    backgroundColor: COLORS.primary,
  },
  formContainer: {
    minHeight: 200,
    maxHeight: 300,
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
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 6,
    marginLeft: 6,
  },
  checkboxContainer: {
    marginTop: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSubtle,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  backBtnText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  nextBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default RegisterForm;