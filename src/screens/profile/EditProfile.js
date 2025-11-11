import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { authService } from "../../services";

export default function EditProfile() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    mobile: "",
    function: "",
    street: "",
    city: "",
    zip: "",
    country_id: null,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const result = await authService.getUserProfile();

      if (result.success) {
        setProfile(result.profile);
        setForm({
          name: result.profile.name || "",
          email: result.profile.email || "",
          phone: result.profile.phone || "",
          mobile: result.profile.mobile || "",
          function: result.profile.function || "",
          street: result.profile.street || "",
          city: result.profile.city || "",
          zip: result.profile.zip || "",
          country_id: result.profile.country_id || null,
        });
      } else {
        Alert.alert("Erreur", result.error || "Impossible de charger le profil");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Implement profile update API call
      Alert.alert("Succès", "Votre profil a été mis à jour avec succès", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le profil");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = () => {
    Alert.alert("Photo de profil", "Choisissez une option", [
      { text: "Prendre une photo", onPress: () => {} },
      { text: "Choisir depuis la galerie", onPress: () => {} },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#990000" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le profil</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#990000" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Photo de profil */}
        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: profile?.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile?.name || "User"
                )}&size=150&background=990000&color=fff`,
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handlePhotoChange}
            >
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.photoHint}>Appuyez pour changer la photo</Text>
        </View>

        {/* Informations personnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS PERSONNELLES</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nom complet</Text>
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
                placeholder="Entrez votre nom complet"
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
                placeholder="Entrez votre email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Téléphone</Text>
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
                placeholder="Entrez votre téléphone"
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
                placeholder="Entrez votre mobile"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Informations professionnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS PROFESSIONNELLES</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Fonction</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="briefcase-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.function}
                onChangeText={(value) => handleChange("function", value)}
                style={styles.input}
                placeholder="Entrez votre fonction"
              />
            </View>
          </View>
        </View>

        {/* Localisation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LOCALISATION</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Adresse</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.street}
                onChangeText={(value) => handleChange("street", value)}
                style={styles.input}
                placeholder="Entrez votre adresse"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Code postal</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.zip}
                onChangeText={(value) => handleChange("zip", value)}
                style={styles.input}
                placeholder="Code postal"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Ville</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="business-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.city}
                onChangeText={(value) => handleChange("city", value)}
                style={styles.input}
                placeholder="Entrez votre ville"
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
  centerContent: {
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: "#990000",
    fontSize: 16,
    fontWeight: "600",
  },

  content: {
    flex: 1,
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
  avatarContainer: {
    position: "relative",
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cameraButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#990000",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  photoHint: {
    fontSize: 13,
    color: "#999",
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

  // Delete button
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FADBD8",
  },
  deleteButtonText: {
    color: "#E74C3C",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 10,
  },

  bottomSpace: {
    height: 40,
  },
});
