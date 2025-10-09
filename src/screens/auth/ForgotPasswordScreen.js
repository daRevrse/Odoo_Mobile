import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = () => {
    if (!email.trim()) {
      Alert.alert("Erreur", "Veuillez entrer votre adresse email");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide");
      return;
    }

    // Simulation d'envoi d'email
    setEmailSent(true);
  };

  const handleResendEmail = () => {
    Alert.alert("Succès", "Un nouvel email a été envoyé");
  };

  if (emailSent) {
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
        </View>

        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail-outline" size={60} color="#990000" />
            </View>
          </View>

          {/* Message */}
          <Text style={styles.title}>Email envoyé !</Text>
          <Text style={styles.subtitle}>
            Nous avons envoyé un lien de réinitialisation à
          </Text>
          <Text style={styles.emailText}>{email}</Text>

          <Text style={styles.instruction}>
            Veuillez vérifier votre boîte de réception et cliquer sur le lien
            pour réinitialiser votre mot de passe.
          </Text>

          <View style={styles.noticeContainer}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#3498DB"
            />
            <Text style={styles.noticeText}>
              Le lien expirera dans 24 heures
            </Text>
          </View>

          {/* Boutons */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.primaryButtonText}>Retour à la connexion</Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Vous n'avez rien reçu ?</Text>
            <TouchableOpacity onPress={handleResendEmail}>
              <Text style={styles.resendLink}> Renvoyer l'email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed-outline" size={60} color="#990000" />
          </View>
        </View>

        {/* Titre */}
        <Text style={styles.title}>Mot de passe oublié ?</Text>
        <Text style={styles.subtitle}>
          Pas de problème ! Entrez votre adresse email et nous vous enverrons un
          lien pour réinitialiser votre mot de passe.
        </Text>

        {/* Formulaire */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse email</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#999"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="exemple@email.com"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Bouton */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !email && styles.primaryButtonDisabled,
            ]}
            onPress={handleSendEmail}
            disabled={!email}
          >
            <Text style={styles.primaryButtonText}>Envoyer le lien</Text>
          </TouchableOpacity>

          {/* Retour */}
          <View style={styles.backToLoginContainer}>
            <Ionicons name="arrow-back-outline" size={16} color="#999" />
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backToLoginText}> Retour à la connexion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
  },

  iconContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#990000",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  instruction: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },

  noticeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EBF5FB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 30,
  },
  noticeText: {
    fontSize: 13,
    color: "#3498DB",
    marginLeft: 8,
    fontWeight: "500",
  },

  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 25,
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

  primaryButton: {
    backgroundColor: "#990000",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#990000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 20,
  },
  primaryButtonDisabled: {
    backgroundColor: "#D0D0D0",
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  backToLoginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  backToLoginText: {
    fontSize: 14,
    color: "#999",
  },

  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: "#666",
  },
  resendLink: {
    fontSize: 14,
    color: "#990000",
    fontWeight: "600",
  },
});
