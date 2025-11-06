import React, { useState } from "react";
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
import { authService } from "../../services";

export default function LoginScreen({ navigation }) {
  const [db, setDb] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validation des champs
    if (!db.trim() || !login.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);

    try {
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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Base de données</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Nom de la base de données"
            style={styles.input}
            value={db}
            onChangeText={setDb}
            autoCapitalize="none"
            editable={!loading}
          />
          <Ionicons
            name="server-outline"
            size={20}
            color="#555"
            style={styles.icon}
          />
        </View>
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
    width: 380,
    height: 120,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 40,
    marginInline: 20,
  },

  inputGroup: { marginBottom: 20 },
  label: { marginBottom: 5, fontSize: 20 },

  inputContainer: {
    backgroundColor: "#eee",
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 55,
  },
  input: {
    flex: 1,
    fontSize: 26,
    paddingVertical: 10,
  },
  icon: {
    marginLeft: 10,
    fontSize: 26,
  },

  forgot: {
    textAlign: "right",
    color: "#999",
    fontSize: 18,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#990000",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#cc6666",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 26 },
});
