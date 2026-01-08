import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import apiConfigService from "../../services/apiConfigService";

export default function ServerConfigScreen({ navigation }) {
  const [serverUrl, setServerUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleManualConfig = async () => {
    if (!serverUrl.trim()) {
      Alert.alert("Erreur", "Veuillez entrer l'URL du serveur");
      return;
    }

    setLoading(true);

    try {
      const result = await apiConfigService.saveApiUrl(serverUrl);

      if (result.success) {
        Alert.alert("Succès", "Serveur configuré avec succès", [
          {
            text: "OK",
            onPress: () => navigation.replace("DatabaseSelection"),
          },
        ]);
      } else {
        Alert.alert(
          "Erreur",
          result.error || "Impossible de se connecter au serveur"
        );
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          "Permission requise",
          "L'accès à la caméra est nécessaire pour scanner le QR code"
        );
        return;
      }
    }

    setScanMode(true);
  };

  const handleBarCodeScanned = async ({ data }) => {
    setScanMode(false);

    const result = apiConfigService.parseQRCode(data);

    if (!result.success) {
      Alert.alert("Erreur", result.error);
      return;
    }

    setServerUrl(result.url);
    setLoading(true);

    try {
      const saveResult = await apiConfigService.saveApiUrl(result.url);

      if (saveResult.success) {
        Alert.alert("Succès", "Serveur configuré avec succès", [
          {
            text: "OK",
            onPress: () => navigation.replace("DatabaseSelection"),
          },
        ]);
      } else {
        Alert.alert("Erreur", saveResult.error);
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    if (!serverUrl.trim()) {
      Alert.alert("Erreur", "Veuillez entrer l'URL du serveur");
      return;
    }

    setLoading(true);

    try {
      const isReachable = await apiConfigService.testConnection(serverUrl);

      if (isReachable) {
        const info = await apiConfigService.getServerInfo(serverUrl);
        Alert.alert(
          "Connexion réussie",
          `Serveur accessible\n${info.databaseCount} base(s) de données disponible(s)`
        );
      } else {
        Alert.alert("Erreur", "Impossible de se connecter au serveur");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  if (scanMode) {
    return (
      <View style={styles.scanContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        >
          <View style={styles.scanOverlay}>
            <View style={styles.scanHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setScanMode(false)}
              >
                <Ionicons name="close" size={32} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.scanFrame}>
              <View style={styles.scanCorner} />
            </View>

            <Text style={styles.scanText}>
              Scannez le QR code fourni par le module Odoo
            </Text>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Configuration du serveur</Text>
        <Text style={styles.subtitle}>
          Pour utiliser l'application, vous devez d'abord configurer l'URL de
          votre serveur Odoo
        </Text>

        {/* Option 1 : Scanner QR Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Option 1 : Scanner le QR Code</Text>
          <TouchableOpacity
            style={styles.qrButton}
            onPress={handleQRScan}
            disabled={loading}
          >
            <Ionicons name="qr-code-outline" size={40} color="#990000" />
            <Text style={styles.qrButtonText}>Scanner le QR Code</Text>
          </TouchableOpacity>
          <Text style={styles.helpText}>
            Le QR code vous est fourni par le module Odoo
          </Text>
        </View>

        {/* Séparateur */}
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>OU</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Option 2 : Saisie manuelle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Option 2 : Saisie manuelle</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="server-outline"
              size={20}
              color="#999"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="https://exemple.com:8069"
              style={styles.input}
              value={serverUrl}
              onChangeText={setServerUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              editable={!loading}
            />
            {serverUrl.length > 0 && (
              <TouchableOpacity onPress={() => setServerUrl("")}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.helpText}>
            Exemple : http://161.97.125.198:11077 ou
            https://monentreprise.odoo.com
          </Text>

          {/* Bouton Tester */}
          <TouchableOpacity
            style={styles.testButton}
            onPress={testConnection}
            disabled={loading || !serverUrl.trim()}
          >
            <Ionicons name="flash-outline" size={20} color="#666" />
            <Text style={styles.testButtonText}>Tester la connexion</Text>
          </TouchableOpacity>
        </View>

        {/* Bouton Continuer */}
        <TouchableOpacity
          style={[styles.continueButton, loading && styles.buttonDisabled]}
          onPress={handleManualConfig}
          disabled={loading || !serverUrl.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.continueButtonText}>Continuer</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },

  // Sections
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },

  // QR Scanner
  qrButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#990000",
    borderStyle: "dashed",
  },
  qrButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#990000",
    marginTop: 10,
  },

  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    color: "#333",
  },
  helpText: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    fontStyle: "italic",
  },

  // Boutons
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    gap: 8,
  },
  testButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#990000",
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  // Séparateur
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8E8E8",
  },
  separatorText: {
    fontSize: 14,
    color: "#999",
    marginHorizontal: 15,
    fontWeight: "600",
  },

  // Scanner
  scanContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scanHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  scanFrame: {
    alignSelf: "center",
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 20,
    marginBottom: 30,
  },
  scanCorner: {
    position: "absolute",
    top: -2,
    left: -2,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#990000",
    borderTopLeftRadius: 20,
  },
  scanText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
