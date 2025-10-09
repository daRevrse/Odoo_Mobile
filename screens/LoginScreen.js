import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder=""
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Ionicons
            name="mail-outline"
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
            placeholder=""
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Connexion</Text>
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
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 26 },
});
