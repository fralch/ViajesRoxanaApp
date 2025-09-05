import React, { useMemo, useState, useEffect, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useAuth } from '../../../shared/hooks';

// ---- Interfaces ----
interface PersonalInfo {
  fullName: string;
  document_number: string;
  birth_date: string;
  age: number;
}

interface AboutMe {
  additional_info: string;
}

interface ChipProps {
  icon: ReactNode;
  label: string;
  tone?: "default" | "primary" | "muted";
}

interface ReadonlyFieldProps {
  label: string;
  value: string;
  icon?: ReactNode;
}

interface SectionProps {
  title: string | ReactNode;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}

interface ContactRowProps {
  index: number;
  phone: string;
  onCall: (phone: string) => void;
  onWhats: (phone: string) => void;
}

// ---- Helpers UI/UX ----
const PRIMARY = "#d62d28";
const BG = "#0f0f10";
const SURFACE = "#ffffff";
const TEXT = "#111827";
const SUBTEXT = "#6b7280";
const MUTED = "#9ca3af";
const CHIP = "#f3f4f6";
const RADIUS = 16;

const maskDocument = (doc: string = ""): string =>
  doc.length > 4 ? `${doc.slice(0, doc.length - 4)}••••` : doc;

const formatDateISO = (iso: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
};

const normalizePhone = (p: string): string => p.replace(/[^\d+]/g, "");

const callPhone = async (phone: string): Promise<void> => {
  const url = `tel:${normalizePhone(phone)}`;
  const supported = await Linking.canOpenURL(url);
  if (supported) Linking.openURL(url);
};

const openWhatsApp = async (phone: string, text: string = "Hola 👋"): Promise<void> => {
  const pure = normalizePhone(phone);
  const wa = Platform.select({
    ios: `https://wa.me/${pure}?text=${encodeURIComponent(text)}`,
    android: `whatsapp://send?phone=${pure}&text=${encodeURIComponent(text)}`,
    default: `https://wa.me/${pure}?text=${encodeURIComponent(text)}`,
  });
  const supported = await Linking.canOpenURL(wa);
  if (supported) Linking.openURL(wa);
};

const Chip: React.FC<ChipProps> = ({ icon, label, tone = "default" }) => {
  const palette =
    tone === "primary"
      ? { bg: "#fee2e2", text: "#991b1b" }
      : tone === "muted"
      ? { bg: "#f3f4f6", text: "#374151" }
      : { bg: CHIP, text: "#111827" };
  return (
    <View style={[styles.chip, { backgroundColor: palette.bg }]}>
      {icon}
      <Text style={[styles.chipText, { color: palette.text }]}>{label}</Text>
    </View>
  );
};

const ReadonlyField: React.FC<ReadonlyFieldProps> = ({ label, value, icon }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.fieldBox}>
      {icon ? <View style={styles.fieldIcon}>{icon}</View> : null}
      <Text style={styles.fieldValue} numberOfLines={1}>
        {value || "-"}
      </Text>
    </View>
  </View>
);

const Section: React.FC<SectionProps> = ({ title, subtitle, right, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        {typeof title === 'string' ? (
          <Text style={styles.sectionTitle}>{title}</Text>
        ) : (
          title
        )}
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
    {children}
  </View>
);

const ContactRow: React.FC<ContactRowProps> = ({ index, phone, onCall, onWhats }) => (
  <View style={styles.contactRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.inputLabel}>Contacto {index + 1}</Text>
      <View style={styles.fieldBox}>
        <View style={styles.fieldIcon}>
          <Feather name="phone" size={18} color={MUTED} />
        </View>
        <Text style={styles.fieldValue}>{phone}</Text>
      </View>
    </View>

    <View style={styles.actionsCol}>
      <TouchableOpacity style={styles.quickBtn} onPress={() => onCall(phone)}>
        <Ionicons name="call-outline" size={18} color={SURFACE} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.quickBtn, { backgroundColor: "#25D366" }]} onPress={() => onWhats(phone)}>
        <Ionicons name="logo-whatsapp" size={18} color={SURFACE} />
      </TouchableOpacity>
    </View>
  </View>
);

const PersonalDataScreen: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: user?.name || "Usuario",
    document_number: user?.dni || "No disponible",
    birth_date: "1980-01-01", // Fecha por defecto para adultos
    age: 44, // Edad por defecto para adultos
  });

  const [emergencyContacts] = useState<string[]>([
    user?.phone || "No disponible", 
    "+51 999 987 654" // Contacto de emergencia adicional
  ]);

  const [aboutMe] = useState<AboutMe>({
    additional_info:
      "Le gusta participar en actividades grupales y ayudar a sus compañeros.",
  });

  // Actualizar información personal cuando cambie el usuario
  useEffect(() => {
    if (user) {
      setPersonalInfo(prev => ({
        ...prev,
        fullName: user.name || "Usuario",
        document_number: user.dni || "No disponible"
      }));
    }
  }, [user]);

  // Calcular edad cuando cambie birth_date
  const calcAge = (iso: string): number | null => {
    if (!iso) return null;
    const b = new Date(iso);
    const t = new Date();
    let age = t.getFullYear() - b.getFullYear();
    const m = t.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
    return age;
  };

  useEffect(() => {
    const newAge = calcAge(personalInfo.birth_date);
    if (newAge !== null && newAge !== personalInfo.age) {
      setPersonalInfo((p) => ({ ...p, age: newAge }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalInfo.birth_date]);

  const isMinor = useMemo(() => (personalInfo.age ?? 0) < 18, [personalInfo.age]);

  return (
    <View style={styles.container}>
      {/* Header mejorado */}
      <LinearGradient
        colors={[PRIMARY, "#b91c1c"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {personalInfo.fullName
                .split(" ")
                .slice(0, 2)
                .map((s) => s[0])
                .join("")
                .toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Datos Personales</Text>
            <Text style={styles.subtitle}>Gestiona tu información personal</Text>
          </View>
        </View>

        <View style={styles.headerChips}>
          <Chip
            icon={<MaterialIcons name="badge" size={16} color="#991b1b" />}
            label={`DNI ${maskDocument(personalInfo.document_number)}`}
            tone="primary"
          />
          <Chip
            icon={<Feather name="user" size={16} color="#374151" />}
            label={`${personalInfo.age ?? "-"} años`}
            tone={isMinor ? "primary" : "default"}
          />
          {user && (
            <Chip
              icon={<Feather name={user.is_active ? "check-circle" : "x-circle"} size={16} color={user.is_active ? "#059669" : "#dc2626"} />}
              label={user.is_active ? "Activo" : "Inactivo"}
              tone={user.is_active ? "default" : "primary"}
            />
          )}
        </View>
      </LinearGradient>

      {/* Contenido */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {/* Información Personal */}
        <Section
          title={(
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <FontAwesome name="user" size={18} color="#d62e29" />
              <Text style={styles.sectionTitle}>Información Personal</Text>
            </View>
          )}
          subtitle="Datos de identificación"
          right={
            <View style={styles.badgeRight}>
              <Text style={styles.badgeRightText}>{isMinor ? "Menor de edad" : "Mayor de edad"}</Text>
            </View>
          }
        >
          <ReadonlyField
            label="Nombre Completo"
            value={personalInfo.fullName}
            icon={<Feather name="user" size={18} color={MUTED} />}
          />

          {user?.email && (
            <ReadonlyField
              label="Correo Electrónico"
              value={user.email}
              icon={<Feather name="mail" size={18} color={MUTED} />}
            />
          )}

          {user?.phone && (
            <ReadonlyField
              label="Teléfono"
              value={user.phone}
              icon={<Feather name="phone" size={18} color={MUTED} />}
            />
          )}

          <ReadonlyField
            label="Tipo de Usuario"
            value={user?.is_admin ? "Administrador" : "Usuario"}
            icon={<Feather name="shield" size={18} color={MUTED} />}
          />

          {user?.created_at && (
            <ReadonlyField
              label="Fecha de Registro"
              value={new Date(user.created_at).toLocaleDateString('es-ES')}
              icon={<Feather name="calendar" size={18} color={MUTED} />}
            />
          )}

          <View style={styles.row}>
            <View style={[styles.col, { marginRight: 8 }]}>
              <ReadonlyField
                label="Tipo de Documento"
                value="DNI"
                icon={<MaterialIcons name="badge" size={18} color={MUTED} />}
              />
            </View>
            <View style={[styles.col, { marginLeft: 8 }]}>
              <ReadonlyField
                label="Número de Documento"
                value={maskDocument(personalInfo.document_number)}
                icon={<Feather name="hash" size={18} color={MUTED} />}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.col, { marginRight: 8 }]}>
              <ReadonlyField
                label="Fecha de Nacimiento"
                value={new Date(personalInfo.birth_date).toLocaleDateString('es-PE', {
                  day: '2-digit',
                  month: '2-digit', 
                  year: 'numeric'
                })}
                icon={<Feather name="calendar" size={18} color={MUTED} />}
              />
            </View>
            <View style={[styles.col, { marginLeft: 8 }]}>
              <ReadonlyField
                label="Edad"
                value={`${personalInfo.age ?? "-"} años`}
                icon={<Feather name="hash" size={18} color={MUTED} />}
              />
            </View>
          </View>
        </Section>

        {/* Contactos de Emergencia */}
        <Section 
          title={(
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <FontAwesome name="phone-square" size={18} color="#d62e29" />
              <Text style={styles.sectionTitle}>Contactos de Emergencia</Text>
            </View>
          )} 
          subtitle="Máximo 3 números telefónicos">
          {emergencyContacts.map((c, i) => (
            <ContactRow
              key={i}
              index={i}
              phone={c}
              onCall={callPhone}
              onWhats={openWhatsApp}
            />
          ))}
          <TouchableOpacity
            style={[styles.addBtn, emergencyContacts.length >= 3 && styles.addBtnDisabled]}
            disabled={emergencyContacts.length >= 3}
          >
            <Ionicons name="add" size={18} color={SURFACE} />
            <Text style={styles.addBtnText}>
              {emergencyContacts.length >= 3 ? "Límite alcanzado" : "Agregar contacto"}
            </Text>
          </TouchableOpacity>
        </Section>

        {/* Acerca de mí */}
        <Section 
          title={(
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <FontAwesome6 name="circle-info" size={18} color="#d62e29" />
              <Text style={styles.sectionTitle}>Acerca de mí</Text>
            </View>
          )} 
          subtitle="Información adicional y observaciones">
          <View style={styles.noteBox}>
            <Feather name="info" size={18} color={PRIMARY} />
            <Text style={styles.noteText}>{aboutMe.additional_info}</Text>
          </View>
        </Section>
      </ScrollView>
    </View>
  );
};

// ---- Estilos ----
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7f8" },

  header: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  headerTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: SURFACE,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontWeight: "800", color: PRIMARY },
  title: { fontSize: 20, fontWeight: "800", color: SURFACE },
  subtitle: { fontSize: 13, color: "#ffe4e6", marginTop: 2 },
  editBtn: {
    backgroundColor: SURFACE,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  editBtnText: { color: PRIMARY, fontWeight: "700" },

  headerChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: { fontSize: 12, fontWeight: "700" },

  scrollContainer: { flex: 1 },

  section: {
    backgroundColor: SURFACE,
    borderRadius: RADIUS,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: TEXT },
  sectionSubtitle: { fontSize: 13, color: SUBTEXT, marginTop: 4 },
  badgeRight: {
    backgroundColor: "#ecfccb",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  badgeRightText: { color: "#3f6212", fontWeight: "700", fontSize: 12 },

  row: { flexDirection: "row" },
  col: { flex: 1 },

  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, color: SUBTEXT, marginBottom: 6, fontWeight: "700" },
  fieldBox: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#eef2f7",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  fieldIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#eef2f7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  fieldValue: { fontSize: 15, color: TEXT, flex: 1 },

  inputLabel: { fontSize: 12, color: SUBTEXT, marginBottom: 6, fontWeight: "700" },

  // Contactos
  contactRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    marginBottom: 12,
  },
  actionsCol: { flexDirection: "row", gap: 8 },
  quickBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  addBtnDisabled: {
    backgroundColor: "#e5e7eb",
  },
  addBtnText: { color: SURFACE, fontWeight: "800" },

  // Nota / About me
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#ffedd5",
    borderRadius: 12,
    padding: 12,
  },
  noteText: { color: "#7c2d12", flex: 1, lineHeight: 20, fontSize: 14 },
});

export default PersonalDataScreen;
