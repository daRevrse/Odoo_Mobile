import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService, initializeSession } from "../../services";

const STORAGE_KEY = "SELECTED_DATABASE";

export default function LoginScreen({ navigation, route }) {
  const [db, setDb] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Récupérer la base de données depuis les paramètres de navigation
    if (route.params?.database) {
      setDb(route.params.database);
    }

    // Initialiser la session Odoo dès le chargement de l'écran
    initializeSessionOnLoad();
  }, [route.params]);

  const initializeSessionOnLoad = async () => {
    try {
      await initializeSession();
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la session:", error);
    }
  };

  const handleChangeDatabase = async () => {
    try {
      // Supprimer la base de données stockée
      await AsyncStorage.removeItem(STORAGE_KEY);
      // Retourner à l'écran de sélection
      navigation.replace("DatabaseSelection");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de changer de base de données");
    }
  };

  const handleLogin = async () => {
    // Validation des champs
    if (!db.trim() || !login.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);

    try {
      // S'assurer que la session est initialisée avant le login
      await initializeSession();

      const result = await authService.login(db, login, password);

      if (result.success) {
        // Connexion réussie
        Alert.alert("Succès", "Connexion réussie", [
          {
            text: "OK",
            onPress: () => navigation.replace("Home"),
          },
        ]);
      } else {
        // Erreur de connexion
        Alert.alert("Erreur", result.error || "Échec de la connexion");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur s'est produite lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./../../../src/assets/logo.png")}
        style={styles.logo}
      />

      {/* Affichage de la base de données sélectionnée */}
      <View style={styles.databaseInfo}>
        <View style={styles.databaseLabel}>
          <Ionicons name="server-outline" size={20} color="#990000" />
          <Text style={styles.databaseText}>{db}</Text>
        </View>
        <TouchableOpacity onPress={handleChangeDatabase}>
          <Text style={styles.changeText}>Changer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Identifiant"
            style={styles.input}
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
            editable={!loading}
          />
          <Ionicons
            name="person-outline"
            size={20}
            color="#555"
            style={styles.icon}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mot de passe</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Mot de passe"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#555"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.forgot}>Mot de passe oublié?</Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Connexion</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 280,
    height: 90,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 30,
  },
  databaseInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 10,
    marginBottom: 24,
  },
  databaseLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  databaseText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  changeText: {
    fontSize: 14,
    color: "#990000",
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  inputContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    color: "#333",
  },
  icon: {
    marginLeft: 8,
  },
  forgot: {
    textAlign: "right",
    color: "#999",
    fontSize: 13,
    marginBottom: 24,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#990000",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: "#cc6666",
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
