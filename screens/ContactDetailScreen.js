import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function ContactDetailScreen({ navigation, route }) {
  const contact = route.params?.contact || {};

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {contact.name || "Nom entreprise"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Photo */}
      <View style={styles.photoContainer}>
        <MaterialIcons
          name="edit"
          size={18}
          color="#444"
          style={styles.iconLeft}
        />
        <View style={styles.avatarCircle}>
          <Ionicons name="camera" size={30} color="#999" />
        </View>
        <Ionicons
          name="trash-outline"
          size={20}
          color="#444"
          style={styles.iconRight}
        />
      </View>

      {/* Infos */}
      {[
        {
          label: "ADRESSE",
          value: `${contact.rue ?? ""} - ${contact.ville ?? ""}`,
        },
        {
          label: "",
          value: `${contact.etat ?? ""} - ${contact.codePostal ?? ""}`,
        },
        { label: "", value: contact.pays ?? "" },
        { label: "TELEPHONE", value: contact.telephone ?? "" },
        { label: "EMAIL", value: contact.email ?? "" },
        { label: "SITE WEB", value: contact.site ?? "Neant" },
        { label: "LANGUES", value: contact.langues ?? "" },
        { label: "NOM COMPLET", value: contact.name ?? "" },
      ].map((item, i) => (
        <View key={i} style={styles.infoBlock}>
          {item.label ? <Text style={styles.label}>{item.label}</Text> : null}
          <Text style={styles.info}>{item.value}</Text>
        </View>
      ))}

      {/* Modifier */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddContact", { contact })}
      >
        <Text style={styles.buttonText}>Modifier</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 16, paddingTop: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },

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

  infoBlock: { marginBottom: 12 },
  label: { fontWeight: "bold", fontSize: 13 },
  info: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 4,
  },

  button: {
    backgroundColor: "#990000",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
