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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
        // ✅ MODIFICATION : Rediriger vers ConfigLoadingScreen au lieu de Home
        console.log("✅ Connexion réussie, chargement de la configuration...");
        navigation.replace("ConfigLoading");
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image source={require("./../../assets/logo.png")} style={styles.logo} />

        {/* Affichage de la base de données sélectionnée */}
        <View style={styles.databaseInfo}>
          <View style={styles.databaseLabel}>
            <Ionicons name="server-outline" size={16} color="#990000" />
            <Text style={styles.databaseText}>{db || "Aucune base"}</Text>
          </View>
          <TouchableOpacity onPress={handleChangeDatabase}>
            <Text style={styles.changeDbText}>Changer</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Connexion</Text>

        <TextInput
          placeholder="Nom d'utilisateur"
          style={styles.input}
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Mot de passe"
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        {/* <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Pas encore de compte ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Créer un compte</Text>
          </TouchableOpacity>
        </View> */}
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
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 280,
    height: 90,
    alignSelf: "center",
    marginBottom: 30,
    resizeMode: "contain",
  },
  databaseInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  databaseLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  databaseText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  changeDbText: {
    fontSize: 14,
    color: "#990000",
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 15,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: "#990000",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#990000",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    color: "#990000",
    fontSize: 14,
    fontWeight: "600",
  },
});
