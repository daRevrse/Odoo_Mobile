import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function AddContactScreen({ navigation }) {
  const [form, setForm] = useState({
    rue: "",
    ville: "",
    etat: "",
    codePostal: "",
    pays: "",
    telephone: "",
    email: "",
    site: "",
    langues: "",
    etiquettes: "",
    tva: "",
    name: "",
  });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSave = () => {
    // logiquement une requête POST/PUT
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer un contact</Text>
        <View style={{ width: 24 }} /> {/* espace vide pour équilibrer */}
      </View>

      {/* Photo */}
      <View style={styles.photoContainer}>
        <TouchableOpacity>
          <MaterialIcons
            name="edit"
            size={18}
            color="#444"
            style={styles.iconLeft}
          />
        </TouchableOpacity>
        <View style={styles.avatarCircle}>
          <Ionicons name="camera" size={30} color="#999" />
        </View>
        <TouchableOpacity>
          <Ionicons
            name="trash-outline"
            size={20}
            color="#444"
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>

      {/* Champs */}
      <View style={styles.row}>
        <TextInput
          style={styles.inputHalf}
          placeholder="Rue"
          value={form.rue}
          onChangeText={(v) => handleChange("rue", v)}
        />
        <TextInput
          style={styles.inputHalf}
          placeholder="Ville"
          value={form.ville}
          onChangeText={(v) => handleChange("ville", v)}
        />
      </View>

      <View style={styles.row}>
        <TextInput
          style={styles.inputHalf}
          placeholder="État"
          value={form.etat}
          onChangeText={(v) => handleChange("etat", v)}
        />
        <TextInput
          style={styles.inputHalf}
          placeholder="Code postal"
          value={form.codePostal}
          onChangeText={(v) => handleChange("codePostal", v)}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Sélectionner un pays..."
        value={form.pays}
        onChangeText={(v) => handleChange("pays", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        value={form.telephone}
        onChangeText={(v) => handleChange("telephone", v)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(v) => handleChange("email", v)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Site web"
        value={form.site}
        onChangeText={(v) => handleChange("site", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Langues"
        value={form.langues}
        onChangeText={(v) => handleChange("langues", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Étiquettes"
        value={form.etiquettes}
        onChangeText={(v) => handleChange("etiquettes", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="TVA"
        value={form.tva}
        onChangeText={(v) => handleChange("tva", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        value={form.name}
        onChangeText={(v) => handleChange("name", v)}
      />

      {/* Bouton enregistrer */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Enregistrer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 16, paddingTop: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center" },

  photoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  iconLeft: { marginRight: 5 },
  iconRight: { marginLeft: 5 },

  row: { flexDirection: "row", justifyContent: "space-between" },
  inputHalf: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: "48%",
  },
  input: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#990000",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
