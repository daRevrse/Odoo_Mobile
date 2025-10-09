import React, { useState } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfile() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    prenom: "Gilles",
    nom: "GASSOU",
    email: "koffjean@gmail.com",
    telephone: "+228 90 12 34 56",
    poste: "Développeur Full Stack",
    departement: "Informatique",
    adresse: "123 Avenue de la République",
    ville: "Lomé",
    pays: "Togo",
    bio: "Passionné par le développement web et mobile. Expert React Native.",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = () => {
    Alert.alert("Succès", "Votre profil a été mis à jour avec succès", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  const handlePhotoChange = () => {
    Alert.alert("Photo de profil", "Choisissez une option", [
      { text: "Prendre une photo", onPress: () => {} },
      { text: "Choisir depuis la galerie", onPress: () => {} },
      { text: "Annuler", style: "cancel" },
    ]);
  };

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
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Photo de profil */}
        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
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
            <Text style={styles.label}>Prénom</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.prenom}
                onChangeText={(value) => handleChange("prenom", value)}
                style={styles.input}
                placeholder="Entrez votre prénom"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nom</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.nom}
                onChangeText={(value) => handleChange("nom", value)}
                style={styles.input}
                placeholder="Entrez votre nom"
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
                value={form.telephone}
                onChangeText={(value) => handleChange("telephone", value)}
                style={styles.input}
                placeholder="Entrez votre téléphone"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Informations professionnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS PROFESSIONNELLES</Text>

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
                placeholder="Entrez votre poste"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Département</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="business-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.departement}
                onChangeText={(value) => handleChange("departement", value)}
                style={styles.input}
                placeholder="Entrez votre département"
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
                value={form.adresse}
                onChangeText={(value) => handleChange("adresse", value)}
                style={styles.input}
                placeholder="Entrez votre adresse"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Ville</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.ville}
                onChangeText={(value) => handleChange("ville", value)}
                style={styles.input}
                placeholder="Entrez votre ville"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Pays</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="globe-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                value={form.pays}
                onChangeText={(value) => handleChange("pays", value)}
                style={styles.input}
                placeholder="Entrez votre pays"
              />
            </View>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BIOGRAPHIE</Text>

          <View style={styles.formGroup}>
            <View style={[styles.inputContainer, styles.textareaContainer]}>
              <TextInput
                value={form.bio}
                onChangeText={(value) => handleChange("bio", value)}
                style={[styles.input, styles.textarea]}
                placeholder="Parlez-nous de vous..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Bouton supprimer le compte */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            Alert.alert(
              "Supprimer le compte",
              "Cette action est irréversible. Êtes-vous sûr ?",
              [
                { text: "Annuler", style: "cancel" },
                { text: "Supprimer", style: "destructive" },
              ]
            )
          }
        >
          <Ionicons name="trash-outline" size={20} color="#E74C3C" />
          <Text style={styles.deleteButtonText}>Supprimer mon compte</Text>
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
