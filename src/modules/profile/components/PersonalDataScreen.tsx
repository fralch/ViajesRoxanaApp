import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';

const PersonalDataScreen = () => {
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'María José Rodríguez García',
    document_number: '12345678',
    birth_date: '2008-03-15',
    age: 16
  });

  const [emergencyContacts, setEmergencyContacts] = useState([
    '+51 999 654 321',
    '+51 999 987 654'
  ]);

  const [aboutMe] = useState({
    additional_info: 'Le gusta participar en actividades grupales y ayudar a sus compañeros.'
  });

  // Calcular edad automáticamente desde la fecha de nacimiento
  useEffect(() => {
    if (personalInfo.birth_date) {
      const birthDate = new Date(personalInfo.birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setPersonalInfo(prev => ({ ...prev, age }));
    }
  }, []);



  const renderContent = () => (
    <View style={styles.content}>
      {/* Información Personal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Información Personal</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nombre Completo</Text>
          <View style={styles.disabledInput}>
            <Text style={styles.disabledText}>{personalInfo.fullName}</Text>
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>Tipo de Documento</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledText}>DNI</Text>
            </View>
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>Número de Documento</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledText}>{personalInfo.document_number}</Text>
            </View>
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>Fecha de Nacimiento</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledText}>{personalInfo.birth_date}</Text>
            </View>
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>Edad</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledText}>{personalInfo.age} años</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Contactos de Emergencia */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🚨 Contactos de Emergencia</Text>
          <Text style={styles.sectionSubtitle}>Máximo 3 números telefónicos</Text>
        </View>

        {emergencyContacts.map((contact, index) => (
          <View key={index} style={styles.contactRow}>
            <View style={styles.contactInputContainer}>
              <Text style={styles.inputLabel}>Contacto {index + 1}</Text>
              <View style={styles.disabledInput}>
                <Text style={styles.disabledText}>{contact}</Text>
              </View>
            </View>

          </View>
        ))}


      </View>

      {/* Acerca de Mí */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💭 Acerca de Mí</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Información Adicional</Text>
          <View style={[styles.disabledInput, styles.multilineInput]}>
            <Text style={styles.disabledText}>{aboutMe.additional_info}</Text>
          </View>
        </View>
      </View>


    </View>
  );







  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Datos Personales</Text>
        <Text style={styles.subtitle}>Gestiona tu información personal</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  disabledText: {
    fontSize: 16,
    color: '#999',
  },
  contactRow: {
     flexDirection: 'row',
     alignItems: 'flex-end',
     marginBottom: 16,
   },
   contactInputContainer: {
     flex: 1,
   },
});

export default PersonalDataScreen;