import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

export default function Security() {
  const navigation = useNavigation();
  const [twoFA, setTwoFA] = useState(false);
  const [biometrics, setBiometrics] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = () => {
    // Valider et traiter le changement de mot de passe
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    // Logique de changement de mot de passe...
    alert("Mot de passe changé avec succès");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header cohérent avec EditProfile */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sécurité</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        {/* Options de sécurité */}
        <View style={styles.securityOption}>
          <View style={styles.optionTextContainer}>
            <Icon
              name="shield-checkmark"
              size={20}
              color="#990000"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>
              Authentification à deux facteurs
            </Text>
          </View>
          <Switch
            value={twoFA}
            onValueChange={() => setTwoFA(!twoFA)}
            trackColor={{ false: "#f0f0f0", true: "#990000" }}
            thumbColor={twoFA ? "#fff" : "#f4f3f4"}
          />
        </View>

        <View style={styles.securityOption}>
          <View style={styles.optionTextContainer}>
            <Icon
              name="finger-print"
              size={20}
              color="#990000"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Authentification biométrique</Text>
          </View>
          <Switch
            value={biometrics}
            onValueChange={() => setBiometrics(!biometrics)}
            trackColor={{ false: "#f0f0f0", true: "#990000" }}
            thumbColor={biometrics ? "#fff" : "#f4f3f4"}
          />
        </View>

        {/* Formulaire de changement de mot de passe */}
        <Text style={styles.sectionTitle}>Changer le mot de passe</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Ancien mot de passe</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            style={styles.input}
            placeholder="Entrez votre mot de passe actuel"
            secureTextEntry
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nouveau mot de passe</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            placeholder="Entrez votre nouveau mot de passe"
            secureTextEntry
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            placeholder="Confirmez votre nouveau mot de passe"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          onPress={handlePasswordChange}
          style={styles.saveButton}
          disabled={!currentPassword || !newPassword || !confirmPassword}
        >
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 24,
    marginBottom: 16,
  },
  securityOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: "#990000",
    padding: 15,
    borderRadius: 10,
    marginTop: 24,
    alignItems: "center",
    opacity: 1,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
