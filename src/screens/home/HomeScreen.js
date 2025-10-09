import React, { useState } from "react";
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
    screen: "Messages",
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
  const [searchText, setSearchText] = useState("");

  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="menu" size={32} color="#333" />
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
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {filteredItems.length === 0 ? (
        <View style={styles.noResults}>
          <Ionicons name="search-outline" size={60} color="#ccc" />
          <Text style={styles.noResultsText}>Aucun résultat trouvé</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {filteredItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.iconBox}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${item.iconColor}20` },
                ]}
              >
                <Ionicons name={item.icon} size={30} color={item.iconColor} />
              </View>
              <Text style={styles.iconLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 40,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
  avatar: { width: 45, height: 45, borderRadius: 22.5 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15 },

  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  noResultsText: {
    marginTop: 12,
    fontSize: 16,
    color: "#999",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 30,
  },
  iconBox: {
    width: "30%",
    alignItems: "center",
    marginBottom: 25,
    padding: 10,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  iconLabel: {
    fontSize: 13,
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
  },
});
