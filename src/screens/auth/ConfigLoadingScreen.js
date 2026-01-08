import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import configService from "../../services/configService";
import { applyBranding } from "../../utils/branding";
import { updateApiUrls } from "../../services/api";

export default function ConfigLoadingScreen({ navigation }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initialisation...");
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      console.log("⚙️ === CHARGEMENT CONFIGURATION ===");
      setError(null);
      setProgress(0);

      // Étape 0 : S'assurer que les URLs API sont à jour
      setStatus("Initialisation...");
      console.log("🔄 Mise à jour des URLs API...");
      await updateApiUrls();
      setProgress(10);

      // Étape 1 : Téléchargement de la configuration
      setStatus("Téléchargement de la configuration...");
      setProgress(20);

      // MODE TEST : Pour tester, on utilise une config de test
      // Pour utiliser le serveur réel, passer useTestConfig à false
      const USE_TEST_CONFIG = true; // À changer en false en production

      console.log("📥 Récupération config (TEST MODE:", USE_TEST_CONFIG, ")");
      const result = await configService.fetchUserConfig(USE_TEST_CONFIG);

      console.log("📥 Config result:", {
        success: result.success,
        fromTest: result.fromTest,
        fromCache: result.fromCache,
        fromDefault: result.fromDefault,
        hasConfig: !!result.config,
        hasBranding: !!result.config?.branding,
      });

      if (!result.success) {
        console.error("❌ Échec récupération config:", result.error);
        throw new Error(result.error || "Échec du téléchargement");
      }

      setProgress(40);

      // Étape 2 : Enregistrement des paramètres
      setStatus("Enregistrement des paramètres...");
      setProgress(60);

      // Attendre un peu pour l'effet visuel
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Étape 3 : Application du branding
      setStatus("Personnalisation de l'interface...");
      setProgress(80);

      if (result.config && result.config.branding) {
        console.log("🎨 Application du branding:", result.config.branding);
        await applyBranding(result.config.branding);
      } else {
        console.log("⚠️ Pas de branding dans la config");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Étape 4 : Finalisation
      setStatus("Finalisation...");
      setProgress(100);

      await new Promise((resolve) => setTimeout(resolve, 300));

      // Afficher un message selon le mode
      if (result.fromTest) {
        console.log("🧪 Configuration de test chargée");
      } else if (result.fromCache) {
        console.log("📦 Configuration chargée depuis le cache");
      } else if (result.fromDefault) {
        console.log("⚠️ Configuration par défaut utilisée");
      } else {
        console.log("✅ Configuration téléchargée depuis le serveur");
      }

      // Rediriger vers Home
      console.log("✅ Redirection vers Home");
      navigation.replace("Home");
    } catch (error) {
      console.error("❌ === ERREUR CHARGEMENT CONFIG ===");
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);
      setError(error.message || "Une erreur s'est produite");
      setProgress(0);
    }
  };

  const handleRetry = () => {
    if (retryCount >= 3) {
      // Après 3 tentatives, proposer de passer en mode par défaut
      Alert.alert(
        "Échec du chargement",
        "Impossible de charger la configuration. Voulez-vous continuer avec la configuration par défaut ?",
        [
          {
            text: "Annuler",
            style: "cancel",
            onPress: () => navigation.replace("Login"),
          },
          {
            text: "Continuer",
            onPress: async () => {
              try {
                setError(null);
                setStatus("Chargement de la configuration par défaut...");
                setProgress(50);

                // Utiliser la config par défaut
                const defaultConfig = await configService.getStoredConfig();
                if (defaultConfig && defaultConfig.branding) {
                  await applyBranding(defaultConfig.branding);
                }

                setProgress(100);
                await new Promise((resolve) => setTimeout(resolve, 300));
                navigation.replace("Home");
              } catch (err) {
                Alert.alert(
                  "Erreur",
                  "Impossible de continuer. Veuillez réessayer."
                );
                navigation.replace("Login");
              }
            },
          },
        ]
      );
    } else {
      // Réessayer
      setRetryCount(retryCount + 1);
      loadConfiguration();
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Annuler le chargement",
      "Voulez-vous retourner à l'écran de connexion ?",
      [
        {
          text: "Non",
          style: "cancel",
        },
        {
          text: "Oui",
          onPress: () => navigation.replace("Login"),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Indicateur de chargement */}
      {!error ? (
        <>
          <ActivityIndicator
            size="large"
            color="#990000"
            style={styles.loader}
          />

          {/* Statut */}
          <Text style={styles.status}>{status}</Text>

          {/* Barre de progression */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>

          <Text style={styles.progressText}>{progress}%</Text>

          {/* Bouton annuler */}
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Icône d'erreur */}
          <View style={styles.errorIconContainer}>
            <Ionicons name="alert-circle-outline" size={80} color="#E74C3C" />
          </View>

          {/* Message d'erreur */}
          <Text style={styles.errorTitle}>Erreur de chargement</Text>
          <Text style={styles.errorMessage}>{error}</Text>

          {/* Boutons d'action */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Ionicons name="refresh-outline" size={20} color="#fff" />
              <Text style={styles.retryButtonText}>
                Réessayer {retryCount > 0 ? `(${retryCount}/3)` : ""}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.replace("Login")}
            >
              <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  loader: {
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#E8E8E8",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#990000",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 30,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    fontSize: 14,
    color: "#999",
  },

  // Styles d'erreur
  errorIconContainer: {
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E74C3C",
    marginBottom: 10,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 10,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#990000",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#999",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
});
