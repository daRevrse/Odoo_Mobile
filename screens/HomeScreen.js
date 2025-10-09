import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const menuItems = [
  {
    label: "Messages",
    icon: "chatbubble-ellipses-outline",
    screen: "Contacts",
    iconColor: "#F98715",
  },
  {
    label: "Ventes",
    icon: "pricetag-outline",
    screen: "Ventes",
    iconColor: "#256572",
  },
  {
    label: "Contacts",
    icon: "people-outline",
    screen: "Contacts",
    iconColor: "#975185",
  },
  {
    label: "Calendrier",
    icon: "calendar-outline",
    screen: "Calendrier",
    iconColor: "#1ED0C0",
  },
  {
    label: "Absences",
    icon: "time-outline",
    screen: "Absences",
    iconColor: "#975185",
  },
  {
    label: "Notes",
    icon: "create-outline",
    screen: "Notes",
    iconColor: "#326590",
  },
  {
    label: "Documents",
    icon: "folder-outline",
    screen: "Documents",
    iconColor: "#FA6218",
  },
  {
    label: "Employés",
    icon: "person-outline",
    screen: "Employés",
    iconColor: "#F98715",
  },
  {
    label: "Projet",
    icon: "settings-outline",
    screen: "Projet",
    iconColor: "#991B1F",
  },
  {
    label: "CRM",
    icon: "hand-left-outline",
    screen: "CRM",
    iconColor: "#256572",
  },
  {
    label: "Stock",
    icon: "cube-outline",
    screen: "Stock",
    iconColor: "#975185",
  },
  {
    label: "Présences",
    icon: "eye-outline",
    screen: "Présences",
    iconColor: "#326590",
  },
  {
    label: "Congés",
    icon: "person-add-outline",
    screen: "Congés",
    iconColor: "#1ED0C0",
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="menu" size={32} />
        <Text style={styles.title}>Menu</Text>
        <TouchableOpacity
          key={"profile"}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image
            source={{ uri: "https://i.pravatar.cc/300" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Rechercher un menu..."
          style={styles.searchInput}
        />
      </View>

      {/* <TextInput placeholder="Rechercher un menu..." style={styles.search} /> */}

      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.iconBox}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon} size={30} color={item.iconColor} />
            <Text style={styles.iconLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F3F3F3", paddingTop: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: { fontSize: 26, fontWeight: "bold" },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  search: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  iconBox: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    marginVertical: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
});
