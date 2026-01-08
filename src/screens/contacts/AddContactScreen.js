import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../services/api";
import Dropdown from "../../components/Dropdown";
import referenceDataService from "../../services/referenceDataService";

export default function AddContactScreen({ route, navigation }) {
  const { contact } = route.params || {};
  const isEdit = !!contact;

  const [form, setForm] = useState({
    name: contact?.name || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    mobile: contact?.mobile || "",
    entreprise: contact?.entreprise || "",
    type: contact?.type || "Client",
    poste: contact?.poste || "",
    adresse: contact?.adresse || "",
    ville: contact?.ville || "",
    codePostal: contact?.codePostal || "",
    pays: contact?.pays || "",
    paysId: contact?.country_id || null,
    site: contact?.site || "",
    notes: contact?.notes || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  const contactTypes = ["Client", "Fournisseur", "Partenaire", "Autre"];

  // Charger les pays au montage du composant
  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setLoadingCountries(true);
      const countriesData = await referenceDataService.getCountries();
      setCountries(countriesData);
      setLoadingCountries(false);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des pays:", error);
      setLoadingCountries(false);
      Alert.alert(
        "Erreur",
        "Impossible de charger la liste des pays. Veuillez réessayer."
      );
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleCountrySelect = (country) => {
    setForm({
      ...form,
      pays: country.name,
      paysId: country.id,
    });
  };

  const handleSave = async () => {
    // Validation
    if (!form.name.trim()) {
      Alert.alert("Erreur", "Le nom est obligatoire");
      return;
    }
    if (!form.email.trim() && !form.phone.trim() && !form.mobile.trim()) {
      Alert.alert(
        "Erreur",
        "Veuillez fournir au moins un email, un téléphone ou un mobile"
      );
      return;
    }

    setIsLoading(true);

    try {
      // Préparer les données pour l'API Odoo
      const contactData = {
        name: form.name.trim(),
        email: form.email.trim() || false,
        phone: form.phone.trim() || false,
        mobile: form.mobile.trim() || false,
        street: form.adresse.trim() || false,
        city: form.ville.trim() || false,
        zip: form.codePostal.trim() || false,
        function: form.poste.trim() || false,
        comment: form.notes.trim() || false,
        website: form.site.trim() || false,
        company_type: "person",
        is_company: false,
      };

      // Ajouter le country_id si un pays a été sélectionné
      if (form.paysId) {
        contactData.country_id = form.paysId;
      }

      // TODO: Gérer parent_id si le contact appartient à une entreprise
      // Si form.entreprise est renseigné, il faudrait rechercher l'ID de cette entreprise
      // ou permettre à l'utilisateur de sélectionner une entreprise existante

      console.log("📤 Envoi des données contact:", contactData);

      // Appel API
      const response = await api.post("/res.partner", contactData);

      console.log("✅ Contact créé/modifié:", response.data);

      setIsLoading(false);

      Alert.alert(
        "Succès",
        isEdit ? "Contact modifié avec succès" : "Contact créé avec succès",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      setIsLoading(false);

      console.error("❌ Erreur lors de la sauvegarde du contact:", error);

      Alert.alert(
        "Erreur",
        error.userMessage ||
          error.response?.data?.message ||
          "Une erreur est survenue lors de la sauvegarde du contact"
      );
    }
  };

  const handlePhotoChange = () => {
    Alert.alert("Photo de contact", "Choisissez une option", [
      { text: "Prendre une photo", onPress: () => {} },
      { text: "Choisir depuis la galerie", onPress: () => {} },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
          <Ionicons name="arrow-back" size={24} color={isLoading ? "#ccc" : "#333"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? "Modifier le contact" : "Nouveau contact"}
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#990000" />
          ) : (
            <Text style={styles.saveText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photo */}
        <View style={styles.photoSection}>
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={handlePhotoChange}
          >
            <Ionicons name="camera" size={32} color="#999" />
            <Text style={styles.photoText}>Ajouter une photo</Text>
          </TouchableOpacity>
        </View>

        {/* Type de contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TYPE DE CONTACT</Text>
          <View style={styles.typeContainer}>
            {contactTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  form.type === type && styles.typeButtonActive,
                ]}
                onPress={() => handleChange("type", type)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    form.type === type && styles.typeButtonTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Informations générales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS GÉNÉRALES</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Nom complet <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.name}
                onChangeText={(value) => handleChange("name", value)}
                style={styles.input}
                placeholder="Jean Dupont"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Entreprise</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="business-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.entreprise}
                onChangeText={(value) => handleChange("entreprise", value)}
                style={styles.input}
                placeholder="Nom de l'entreprise"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Poste</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="briefcase-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.poste}
                onChangeText={(value) => handleChange("poste", value)}
                style={styles.input}
                placeholder="Directeur commercial"
              />
            </View>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Téléphone fixe</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.phone}
                onChangeText={(value) => handleChange("phone", value)}
                style={styles.input}
                placeholder="+225 27 00 00 00"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mobile</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="phone-portrait-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.mobile}
                onChangeText={(value) => handleChange("mobile", value)}
                style={styles.input}
                placeholder="+225 05 00 00 00"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.email}
                onChangeText={(value) => handleChange("email", value)}
                style={styles.input}
                placeholder="contact@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Site web</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="globe-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.site}
                onChangeText={(value) => handleChange("site", value)}
                style={styles.input}
                placeholder="www.example.com"
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        {/* Adresse */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ADRESSE</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Rue</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.adresse}
                onChangeText={(value) => handleChange("adresse", value)}
                style={styles.input}
                placeholder="123 Avenue de la République"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Ville</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={form.ville}
                  onChangeText={(value) => handleChange("ville", value)}
                  style={styles.input}
                  placeholder="Lomé"
                />
              </View>
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Code postal</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={form.codePostal}
                  onChangeText={(value) => handleChange("codePostal", value)}
                  style={styles.input}
                  placeholder="00000"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {loadingCountries ? (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Pays</Text>
              <View style={styles.inputContainer}>
                <ActivityIndicator color="#990000" />
                <Text style={[styles.input, { color: "#999" }]}>
                  Chargement des pays...
                </Text>
              </View>
            </View>
          ) : (
            <Dropdown
              label="Pays"
              placeholder="Sélectionner un pays"
              value={form.pays}
              items={countries}
              onSelect={handleCountrySelect}
              iconName="flag-outline"
              searchable={true}
            />
          )}
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTES</Text>

          <View style={styles.formGroup}>
            <View style={[styles.inputContainer, styles.textareaContainer]}>
              <TextInput
                value={form.notes}
                onChangeText={(value) => handleChange("notes", value)}
                style={[styles.input, styles.textarea]}
                placeholder="Ajoutez des notes sur ce contact..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

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
  saveText: {
    color: "#990000",
    fontSize: 16,
    fontWeight: "600",
  },

  // Photo
  photoSection: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E8E8E8",
    borderStyle: "dashed",
  },
  photoText: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },

  // Sections
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

  // Type selector
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  typeButtonActive: {
    backgroundColor: "#990000",
    borderColor: "#990000",
  },
  typeButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  typeButtonTextActive: {
    color: "#fff",
  },

  // Form
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#E74C3C",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 15,
    color: "#333",
  },
  textareaContainer: {
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  textarea: {
    minHeight: 100,
    paddingVertical: 0,
  },

  // Row layout
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },

  bottomSpace: {
    height: 40,
  },
});
