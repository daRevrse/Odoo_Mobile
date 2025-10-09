import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const mockContacts = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@gmail.com",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Marie Durant",
    email: "marie.durant@gmail.com",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Paul Kouassi",
    email: "paul.kouassi@gmail.com",
    image: "https://i.pravatar.cc/150?img=3",
  },
];

export default function ContactsScreen({ navigation }) {
  const [isGrid, setIsGrid] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredContacts = mockContacts.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={isGrid ? styles.card : styles.rowItem}
      onPress={() => navigation.navigate("ContactDetail", { contact: item })}
    >
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={isGrid ? styles.contactInfoGrid : styles.contactInfoRow}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="grid-outline" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity>
          <Ionicons name="funnel-outline" size={24} />
        </TouchableOpacity>
      </View>

      {/* Ligne de recherche + boutons de vue */}
      <View style={styles.searchRow}>
        <TouchableOpacity
          onPress={() => setSearchActive(!searchActive)}
          style={styles.searchButton}
        >
          <Ionicons name="search-outline" size={20} color="#333" />
        </TouchableOpacity>

        <View style={styles.toggleView}>
          <TouchableOpacity
            onPress={() => setIsGrid(true)}
            style={[styles.toggleButton, isGrid && styles.activeToggle]}
          >
            <Ionicons
              name="grid"
              size={20}
              color={isGrid ? "#990000" : "#333"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsGrid(false)}
            style={[styles.toggleButton, !isGrid && styles.activeToggle]}
          >
            <Ionicons
              name="list-outline"
              size={20}
              color={!isGrid ? "#990000" : "#333"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Champ recherche */}
      {searchActive && (
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un contact..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {/* Bouton ajouter */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddContact")}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Créer un contact</Text>
      </TouchableOpacity>

      {/* Liste ou grille */}
      <FlatList
        data={filteredContacts}
        key={isGrid ? "g" : "l"}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={isGrid ? 2 : 1}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F3F3F3" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Ligne search + toggle
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  toggleView: {
    flexDirection: "row",
    gap: 10,
  },
  toggleButton: {
    backgroundColor: "#F3F3F3",
    padding: 10,
    borderRadius: 10,
  },
  activeToggle: {
    backgroundColor: "#F3F3F3",
  },

  // Champ de recherche (visible si activé)
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },

  // Bouton d'ajout
  addButton: {
    flexDirection: "row",
    // alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#990000",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },

  // Liste
  list: { paddingBottom: 30 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 5,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    elevation: 2,
  },
  rowItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    textAlign: "center",
  },
  contactInfoGrid: {
    flex: 1,
    alignItems: "center",
  },
  contactInfoRow: {
    flex: 1,
    alignItems: "flex-start",
  },
  email: {
    fontSize: 12,
    color: "#666",
  },
});
