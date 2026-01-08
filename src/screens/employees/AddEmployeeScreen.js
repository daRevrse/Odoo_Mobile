import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import employeeService from "../../services/employeeService";
import Dropdown from "../../components/Dropdown";
import { referenceDataService } from "../../services";

export default function AddEmployeeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [countries, setCountries] = useState([]);

  const [form, setForm] = useState({
    name: "",
    workEmail: "",
    workPhone: "",
    mobilePhone: "",
    jobTitle: "",
    departmentName: "",
    privateEmail: "",
    privatePhone: "",
    street: "",
    city: "",
    zip: "",
    countryId: null,
    gender: "",
    birthday: "",
  });

  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    try {
      setLoadingData(true);
      const countriesData = await referenceDataService.getCountries();
      setCountries(countriesData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.name.trim()) {
      Alert.alert("Erreur", "Le nom de l'employé est requis");
      return;
    }

    if (!form.workEmail.trim()) {
      Alert.alert("Erreur", "L'email professionnel est requis");
      return;
    }

    try {
      setLoading(true);

      // Préparer les données pour l'API
      const employeeData = {
        name: form.name.trim(),
        work_email: form.workEmail.trim(),
        work_phone: form.workPhone.trim() || false,
        mobile_phone: form.mobilePhone.trim() || false,
        job_title: form.jobTitle.trim() || false,
        private_email: form.privateEmail.trim() || false,
        private_phone: form.privatePhone.trim() || false,
        private_street: form.street.trim() || false,
        private_city: form.city.trim() || false,
        private_zip: form.zip.trim() || false,
        gender: form.gender || false,
        birthday: form.birthday.trim() || false,
      };

      if (form.countryId) {
        employeeData.private_country_id = form.countryId;
      }

      // Appel API pour créer l'employé
      const response = await employeeService.createEmployee(employeeData);

      Alert.alert(
        "Succès",
        "Employé ajouté avec succès",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'employé:", error);
      Alert.alert(
        "Erreur",
        error.message || "Impossible d'ajouter l'employé"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#990000" />
        <Text style={styles.loadingText}>Chargement...</Text>
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
        <Text style={styles.headerTitle}>Nouvel Employé</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Informations de base */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS DE BASE</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nom complet <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Jean Dupont"
              value={form.name}
              onChangeText={(value) => handleChange("name", value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Titre du poste</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Développeur"
              value={form.jobTitle}
              onChangeText={(value) => handleChange("jobTitle", value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Département</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: IT"
              value={form.departmentName}
              onChangeText={(value) => handleChange("departmentName", value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Genre</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  form.gender === "male" && styles.genderButtonActive,
                ]}
                onPress={() => handleChange("gender", "male")}
              >
                <Ionicons
                  name="male"
                  size={20}
                  color={form.gender === "male" ? "#fff" : "#666"}
                />
                <Text
                  style={[
                    styles.genderButtonText,
                    form.gender === "male" && styles.genderButtonTextActive,
                  ]}
                >
                  Masculin
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  form.gender === "female" && styles.genderButtonActive,
                ]}
                onPress={() => handleChange("gender", "female")}
              >
                <Ionicons
                  name="female"
                  size={20}
                  color={form.gender === "female" ? "#fff" : "#666"}
                />
                <Text
                  style={[
                    styles.genderButtonText,
                    form.gender === "female" && styles.genderButtonTextActive,
                  ]}
                >
                  Féminin
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date de naissance</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA-MM-JJ"
              value={form.birthday}
              onChangeText={(value) => handleChange("birthday", value)}
            />
          </View>
        </View>

        {/* Contact professionnel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT PROFESSIONNEL</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email professionnel <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="exemple@entreprise.com"
              value={form.workEmail}
              onChangeText={(value) => handleChange("workEmail", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone fixe</Text>
            <TextInput
              style={styles.input}
              placeholder="+221 33 XXX XX XX"
              value={form.workPhone}
              onChangeText={(value) => handleChange("workPhone", value)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile</Text>
            <TextInput
              style={styles.input}
              placeholder="+221 77 XXX XX XX"
              value={form.mobilePhone}
              onChangeText={(value) => handleChange("mobilePhone", value)}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Contact personnel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT PERSONNEL</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email personnel</Text>
            <TextInput
              style={styles.input}
              placeholder="exemple@email.com"
              value={form.privateEmail}
              onChangeText={(value) => handleChange("privateEmail", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone personnel</Text>
            <TextInput
              style={styles.input}
              placeholder="+221 77 XXX XX XX"
              value={form.privatePhone}
              onChangeText={(value) => handleChange("privatePhone", value)}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Adresse */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ADRESSE PERSONNELLE</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rue</Text>
            <TextInput
              style={styles.input}
              placeholder="Adresse complète"
              value={form.street}
              onChangeText={(value) => handleChange("street", value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ville</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Dakar"
              value={form.city}
              onChangeText={(value) => handleChange("city", value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Code postal</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 10200"
              value={form.zip}
              onChangeText={(value) => handleChange("zip", value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pays</Text>
            <Dropdown
              items={countries}
              value={form.countryId}
              onSelect={(value) => handleChange("countryId", value)}
              placeholder="Sélectionner un pays"
              iconName="flag-outline"
              searchable={true}
            />
          </View>
        </View>

        {/* Bouton d'envoi */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Ajouter l'employé</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

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
  section: {
    backgroundColor: "#fff",
    marginTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
    paddingTop: 16,
    paddingBottom: 16,
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#E74C3C",
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    gap: 8,
  },
  genderButtonActive: {
    backgroundColor: "#990000",
    borderColor: "#990000",
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  genderButtonTextActive: {
    color: "#fff",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#990000",
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#CCC",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpace: {
    height: 40,
  },
});
