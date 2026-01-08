import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import employeeService from "../../services/employeeService";

export default function EmployeeDetailScreen({ route, navigation }) {
  const { employeeId } = route.params;
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployeeDetail();
  }, [employeeId]);

  const loadEmployeeDetail = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployeeById(employeeId);
      setEmployee(data);
    } catch (error) {
      console.error("Erreur lors du chargement du détail de l'employé:", error);
      Alert.alert(
        "Erreur",
        "Impossible de charger les détails de l'employé",
        [{ text: "Retour", onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleEmail = (email) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#990000" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!employee) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Ionicons name="alert-circle-outline" size={60} color="#ccc" />
        <Text style={styles.emptyText}>Employé non trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails Employé</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Carte profil */}
        <View style={styles.profileCard}>
          {employee.image_256 ? (
            <Image
              source={{ uri: `data:image/png;base64,${employee.image_256}` }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
              <Ionicons name="person" size={60} color="#999" />
            </View>
          )}

          <Text style={styles.profileName}>{employee.name}</Text>
          <Text style={styles.profileJob}>
            {employee.job_title || employee.job_id?.display_name || "N/A"}
          </Text>

          {employee.department_id?.display_name && (
            <View style={styles.profileDepartment}>
              <Ionicons name="briefcase-outline" size={16} color="#666" />
              <Text style={styles.profileDepartmentText}>
                {employee.department_id.display_name}
              </Text>
            </View>
          )}

          {/* Actions rapides */}
          <View style={styles.quickActions}>
            {employee.work_phone && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCall(employee.work_phone)}
              >
                <Ionicons name="call" size={24} color="#fff" />
              </TouchableOpacity>
            )}
            {employee.work_email && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEmail(employee.work_email)}
              >
                <Ionicons name="mail" size={24} color="#fff" />
              </TouchableOpacity>
            )}
            {employee.mobile_phone && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCall(employee.mobile_phone)}
              >
                <Ionicons name="phone-portrait" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Informations professionnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS PROFESSIONNELLES</Text>

          {employee.work_location_id?.display_name && (
            <InfoRow
              icon="location-outline"
              label="Lieu de travail"
              value={employee.work_location_id.display_name}
            />
          )}

          {employee.parent_id?.display_name && (
            <InfoRow
              icon="person-outline"
              label="Manager"
              value={employee.parent_id.display_name}
            />
          )}

          {employee.coach_id?.display_name && (
            <InfoRow
              icon="star-outline"
              label="Coach"
              value={employee.coach_id.display_name}
            />
          )}

          {employee.resource_calendar_id?.display_name && (
            <InfoRow
              icon="time-outline"
              label="Horaire de travail"
              value={employee.resource_calendar_id.display_name}
            />
          )}

          {employee.employee_type && (
            <InfoRow
              icon="briefcase-outline"
              label="Type d'employé"
              value={employee.employee_type === "employee" ? "Employé" : "Freelance"}
            />
          )}
        </View>

        {/* Contact professionnel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT PROFESSIONNEL</Text>

          {employee.work_phone && (
            <InfoRow
              icon="call-outline"
              label="Téléphone"
              value={employee.work_phone}
              onPress={() => handleCall(employee.work_phone)}
            />
          )}

          {employee.mobile_phone && (
            <InfoRow
              icon="phone-portrait-outline"
              label="Mobile"
              value={employee.mobile_phone}
              onPress={() => handleCall(employee.mobile_phone)}
            />
          )}

          {employee.work_email && (
            <InfoRow
              icon="mail-outline"
              label="Email"
              value={employee.work_email}
              onPress={() => handleEmail(employee.work_email)}
            />
          )}
        </View>

        {/* Informations personnelles */}
        {(employee.private_email || employee.private_phone) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONTACT PERSONNEL</Text>

            {employee.private_email && (
              <InfoRow
                icon="mail-outline"
                label="Email personnel"
                value={employee.private_email}
                onPress={() => handleEmail(employee.private_email)}
              />
            )}

            {employee.private_phone && (
              <InfoRow
                icon="call-outline"
                label="Téléphone personnel"
                value={employee.private_phone}
                onPress={() => handleCall(employee.private_phone)}
              />
            )}
          </View>
        )}

        {/* Adresse */}
        {(employee.private_street || employee.private_city) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ADRESSE PERSONNELLE</Text>

            {employee.private_street && (
              <InfoRow icon="home-outline" label="Rue" value={employee.private_street} />
            )}

            {employee.private_city && (
              <InfoRow icon="location-outline" label="Ville" value={employee.private_city} />
            )}

            {employee.private_zip && (
              <InfoRow icon="mail-outline" label="Code postal" value={employee.private_zip} />
            )}

            {employee.private_country_id?.display_name && (
              <InfoRow
                icon="flag-outline"
                label="Pays"
                value={employee.private_country_id.display_name}
              />
            )}
          </View>
        )}

        {/* Informations RH */}
        {(employee.marital || employee.birthday || employee.children > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INFORMATIONS PERSONNELLES</Text>

            {employee.gender && (
              <InfoRow
                icon="person-outline"
                label="Genre"
                value={employee.gender === "male" ? "Masculin" : "Féminin"}
              />
            )}

            {employee.birthday && (
              <InfoRow icon="calendar-outline" label="Date de naissance" value={employee.birthday} />
            )}

            {employee.marital && (
              <InfoRow
                icon="heart-outline"
                label="Situation familiale"
                value={
                  employee.marital === "single"
                    ? "Célibataire"
                    : employee.marital === "married"
                    ? "Marié(e)"
                    : employee.marital
                }
              />
            )}

            {employee.children > 0 && (
              <InfoRow icon="people-outline" label="Enfants" value={employee.children.toString()} />
            )}
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

// Composant pour afficher une ligne d'information
const InfoRow = ({ icon, label, value, onPress }) => (
  <TouchableOpacity
    style={styles.infoRow}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.infoLeft}>
      <Ionicons name={icon} size={20} color="#666" style={styles.infoIcon} />
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
    {onPress && <Ionicons name="chevron-forward" size={20} color="#999" />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#999",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  // Carte profil
  profileCard: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileImagePlaceholder: {
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  profileJob: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  profileDepartment: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileDepartmentText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },

  // Actions rapides
  quickActions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#990000",
    justifyContent: "center",
    alignItems: "center",
  },

  // Section
  section: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
    paddingTop: 16,
    paddingBottom: 16,
    letterSpacing: 0.5,
  },

  // Info row
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  bottomSpace: {
    height: 40,
  },
});
