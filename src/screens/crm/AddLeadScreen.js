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
import crmService from "../../services/crmService";
import Dropdown from "../../components/Dropdown";
import { referenceDataService } from "../../services";

export default function AddLeadScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [countries, setCountries] = useState([]);

  const [form, setForm] = useState({
    name: "",
    partnerName: "",
    contactName: "",
    email: "",
    phone: "",
    mobile: "",
    website: "",
    function: "",
    street: "",
    city: "",
    zip: "",
    countryId: null,
    expectedRevenue: "",
    probability: "10",
    priority: "1",
    type: "lead",
    description: "",
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
      Alert.alert("Erreur", "Le titre de l'opportunité est requis");
      return;
    }

    try {
      setLoading(true);

      // Préparer les données pour l'API
      const leadData = {
        name: form.name.trim(),
        partner_name: form.partnerName.trim() || false,
        contact_name: form.contactName.trim() || false,
        email_from: form.email.trim() || false,
        phone: form.phone.trim() || false,
        mobile: form.mobile.trim() || false,
        website: form.website.trim() || false,
        function: form.function.trim() || false,
        street: form.street.trim() || false,
        city: form.city.trim() || false,
        zip: form.zip.trim() || false,
        expected_revenue: parseFloat(form.expectedRevenue) || 0,
        probability: parseFloat(form.probability) || 10,
        priority: form.priority,
        type: form.type,
        description: form.description.trim() || false,
      };

      if (form.countryId) {
        leadData.country_id = form.countryId;
      }

      // Appel API pour créer l'opportunité
      const response = await crmService.createLead(leadData);

      Alert.alert(
        "Succès",
        "Opportunité créée avec succès",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Erreur lors de la création de l'opportunité:", error);
      Alert.alert(
        "Erreur",
        error.message || "Impossible de créer l'opportunité"
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
        <Text style={styles.headerTitle}>Nouvelle Opportunité</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Informations de base */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS GÉNÉRALES</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Titre de l'opportunité <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Projet ERP pour ABC Corp"
              value={form.name}
              onChangeText={(value) => handleChange("name", value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  form.type === "lead" && styles.typeButtonActive,
                ]}
                onPress={() => handleChange("type", "lead")}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    form.type === "lead" && styles.typeButtonTextActive,
                  ]}
                >
                  Piste
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  form.type === "opportunity" && styles.typeButtonActive,
                ]}
                onPress={() => handleChange("type", "opportunity")}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    form.type === "opportunity" && styles.typeButtonTextActive,
                  ]}
                >
                  Opportunité
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priorité</Text>
            <View style={styles.priorityContainer}>
              {[
                { value: "1", label: "Basse" },
                { value: "2", label: "Moyenne" },
                { value: "3", label: "Haute" },
              ].map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.priorityButton,
                    form.priority === p.value && styles.priorityButtonActive,
                  ]}
                  onPress={() => handleChange("priority", p.value)}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      form.priority === p.value && styles.priorityButtonTextActive,
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Entreprise</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom de l'entreprise"
              value={form.partnerName}
              onChangeText={(value) => handleChange("partnerName", value)}
            />
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS DE CONTACT</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom du contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Jean Dupont"
              value={form.contactName}
              onChangeText={(value) => handleChange("contactName", value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fonction</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Directeur IT"
              value={form.function}
              onChangeText={(value) => handleChange("function", value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="contact@entreprise.com"
              value={form.email}
              onChangeText={(value) => handleChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone fixe</Text>
            <TextInput
              style={styles.input}
              placeholder="+221 33 XXX XX XX"
              value={form.phone}
              onChangeText={(value) => handleChange("phone", value)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile</Text>
            <TextInput
              style={styles.input}
              placeholder="+221 77 XXX XX XX"
              value={form.mobile}
              onChangeText={(value) => handleChange("mobile", value)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Site web</Text>
            <TextInput
              style={styles.input}
              placeholder="https://www.exemple.com"
              value={form.website}
              onChangeText={(value) => handleChange("website", value)}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Adresse */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ADRESSE</Text>

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

        {/* Détails commerciaux */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DÉTAILS COMMERCIAUX</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Revenu attendu (XOF)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 5000000"
              value={form.expectedRevenue}
              onChangeText={(value) => handleChange("expectedRevenue", value)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Probabilité de succès (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 50"
              value={form.probability}
              onChangeText={(value) => handleChange("probability", value)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description détaillée de l'opportunité..."
              value={form.description}
              onChangeText={(value) => handleChange("description", value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
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
              <Text style={styles.submitButtonText}>Créer l'opportunité</Text>
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
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
  },
  typeButtonActive: {
    backgroundColor: "#990000",
    borderColor: "#990000",
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  priorityContainer: {
    flexDirection: "row",
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
  },
  priorityButtonActive: {
    backgroundColor: "#990000",
    borderColor: "#990000",
  },
  priorityButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
  },
  priorityButtonTextActive: {
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
