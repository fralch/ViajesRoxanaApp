import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';

const PersonalDataScreen = () => {
  const [activeTab, setActiveTab] = useState('personal_info');
  const [personalInfo, setPersonalInfo] = useState({
    name: 'María José',
    lastname: 'Rodríguez García',
    photo: null,
    document_type: 'DNI',
    document_number: '12345678',
    age: '16',
    birth_date: '2008-03-15',
    gender: 'Femenino',
    address: 'Av. Los Olivos 123, San Isidro',
    email: 'maria.rodriguez@email.com',
    phone: '+51 999 123 456',
    country: 'Perú'
  });

  const [emergencyContacts, setEmergencyContacts] = useState([
    {
      id: 1,
      contact_name: 'Ana',
      contact_lastname: 'García Morales',
      contact_phone: '+51 999 654 321',
      relationship: 'Madre'
    },
    {
      id: 2,
      contact_name: 'Carlos',
      contact_lastname: 'Rodríguez Silva',
      contact_phone: '+51 999 987 654',
      relationship: 'Padre'
    }
  ]);

  const [aboutMe, setAboutMe] = useState({
    hobbies: 'Leer, dibujar, tocar guitarra',
    sports: 'Voleibol, natación',
    relational_attitude: 'Amigable y colaborativa',
    additional_info: 'Le gusta participar en actividades grupales y ayudar a sus compañeros.'
  });

  const tabs = [
    { key: 'personal_info', label: 'Información Personal', icon: '👤' },
    { key: 'emergency_contact', label: 'Contactos de Emergencia', icon: '🚨' },
    { key: 'about_me', label: 'Acerca de Mí', icon: '💭' }
  ];

  const documentTypes = ['DNI', 'Carné de Extranjería', 'Pasaporte'];
  const genders = ['Masculino', 'Femenino', 'Otro'];

  const renderPersonalInfo = () => (
    <View style={styles.tabContent}>
      {/* Photo Section */}
      <View style={styles.photoSection}>
        <View style={styles.photoContainer}>
          {personalInfo.photo ? (
            <Text>Foto</Text>
          ) : (
            <Text style={styles.photoPlaceholder}>MJ</Text>
          )}
        </View>
        <View style={styles.photoButtons}>
          <TouchableOpacity style={styles.photoButton}>
            <Text style={styles.photoButtonText}>📷 Cambiar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButtonSecondary}>
            <Text style={styles.photoButtonSecondaryText}>🗑️ Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Form Fields */}
      <View style={styles.formSection}>
        <View style={styles.inputRow}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput
              style={styles.textInput}
              value={personalInfo.name}
              onChangeText={(text) => setPersonalInfo({...personalInfo, name: text})}
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>Apellidos</Text>
            <TextInput
              style={styles.textInput}
              value={personalInfo.lastname}
              onChangeText={(text) => setPersonalInfo({...personalInfo, lastname: text})}
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>Tipo de Documento</Text>
            <TouchableOpacity style={styles.pickerButton}>
              <Text style={styles.pickerText}>{personalInfo.document_type}</Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>Número de Documento</Text>
            <TextInput
              style={styles.textInput}
              value={personalInfo.document_number}
              onChangeText={(text) => setPersonalInfo({...personalInfo, document_number: text})}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>Edad</Text>
            <TextInput
              style={styles.textInput}
              value={personalInfo.age}
              onChangeText={(text) => setPersonalInfo({...personalInfo, age: text})}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>Fecha de Nacimiento</Text>
            <TouchableOpacity style={styles.pickerButton}>
              <Text style={styles.pickerText}>{personalInfo.birth_date}</Text>
              <Text style={styles.pickerArrow}>📅</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Género</Text>
          <TouchableOpacity style={styles.pickerButton}>
            <Text style={styles.pickerText}>{personalInfo.gender}</Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Dirección</Text>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            value={personalInfo.address}
            onChangeText={(text) => setPersonalInfo({...personalInfo, address: text})}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={personalInfo.email}
            onChangeText={(text) => setPersonalInfo({...personalInfo, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Teléfono</Text>
          <TextInput
            style={styles.textInput}
            value={personalInfo.phone}
            onChangeText={(text) => setPersonalInfo({...personalInfo, phone: text})}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>País</Text>
          <TouchableOpacity style={styles.pickerButton}>
            <Text style={styles.pickerText}>{personalInfo.country}</Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>💾 Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmergencyContacts = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Contactos de Emergencia</Text>
        <Text style={styles.sectionSubtitle}>Máximo 3 contactos</Text>
      </View>

      {emergencyContacts.map((contact, index) => (
        <View key={contact.id} style={styles.contactCard}>
          <View style={styles.contactHeader}>
            <Text style={styles.contactTitle}>Contacto {index + 1}</Text>
            <TouchableOpacity style={styles.deleteContactButton}>
              <Text style={styles.deleteContactText}>🗑️</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={styles.textInput}
                value={contact.contact_name}
                placeholder="Nombre del contacto"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Apellidos</Text>
              <TextInput
                style={styles.textInput}
                value={contact.contact_lastname}
                placeholder="Apellidos del contacto"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput
                style={styles.textInput}
                value={contact.contact_phone}
                placeholder="+51 999 123 456"
                keyboardType="phone-pad"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Parentesco</Text>
              <TextInput
                style={styles.textInput}
                value={contact.relationship}
                placeholder="Ej: Madre, Padre, Tío"
              />
            </View>
          </View>
        </View>
      ))}

      {emergencyContacts.length < 3 && (
        <TouchableOpacity style={styles.addContactButton}>
          <Text style={styles.addContactText}>➕ Agregar Nuevo Contacto</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>💾 Guardar Contactos</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAboutMe = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Acerca de Mí</Text>
        <Text style={styles.sectionSubtitle}>Información opcional para conocerte mejor</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Hobbies e Intereses</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          value={aboutMe.hobbies}
          onChangeText={(text) => setAboutMe({...aboutMe, hobbies: text})}
          placeholder="Describe tus hobbies favoritos..."
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Deportes que Practicas</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          value={aboutMe.sports}
          onChangeText={(text) => setAboutMe({...aboutMe, sports: text})}
          placeholder="¿Qué deportes te gustan?"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Actitud Relacional</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          value={aboutMe.relational_attitude}
          onChangeText={(text) => setAboutMe({...aboutMe, relational_attitude: text})}
          placeholder="¿Cómo te relacionas con otros?"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Información Adicional</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          value={aboutMe.additional_info}
          onChangeText={(text) => setAboutMe({...aboutMe, additional_info: text})}
          placeholder="Cualquier otra información que quieras compartir..."
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>💾 Guardar Información</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal_info':
        return renderPersonalInfo();
      case 'emergency_contact':
        return renderEmergencyContacts();
      case 'about_me':
        return renderAboutMe();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Datos Personales</Text>
        <Text style={styles.subtitle}>Gestiona tu información personal</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
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
  tabsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f8f9fa',
  },
  activeTab: {
    backgroundColor: '#d62d28',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  photoPlaceholder: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#d62d28',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    backgroundColor: '#d62d28',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  photoButtonSecondary: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  photoButtonSecondaryText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: 20,
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
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  pickerArrow: {
    fontSize: 12,
    color: '#666',
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteContactButton: {
    padding: 4,
  },
  deleteContactText: {
    fontSize: 16,
  },
  addContactButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#d62d28',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  addContactText: {
    fontSize: 16,
    color: '#d62d28',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PersonalDataScreen;