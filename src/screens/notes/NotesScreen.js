import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const mockNotes = [
  {
    id: "1",
    titre: "Réunion équipe",
    contenu: "Points à aborder : Budget Q4, nouveaux projets, planning...",
    date: "09/10/2025",
    heure: "14:30",
    couleur: "#FFE5B4",
  },
  {
    id: "2",
    titre: "Idées produit",
    contenu:
      "Nouvelle fonctionnalité pour le module CRM, intégration WhatsApp...",
    date: "08/10/2025",
    heure: "10:15",
    couleur: "#D4F1F4",
  },
  {
    id: "3",
    titre: "Liste courses",
    contenu: "Papier A4, stylos, marqueurs, post-it, agrafeuse...",
    date: "07/10/2025",
    heure: "16:45",
    couleur: "#E5D4F1",
  },
  {
    id: "4",
    titre: "Formation",
    contenu: "React Native avancé - Inscription avant le 15/10",
    date: "06/10/2025",
    heure: "09:00",
    couleur: "#FFD4E5",
  },
];

export default function NotesScreen({ navigation }) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" ou "list"

  const filteredNotes = mockNotes.filter(
    (n) =>
      n.titre.toLowerCase().includes(searchText.toLowerCase()) ||
      n.contenu.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        viewMode === "grid" ? styles.cardGrid : styles.cardList,
        { backgroundColor: item.couleur },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.titre} numberOfLines={1}>
          {item.titre}
        </Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={18} color="#333" />
        </TouchableOpacity>
      </View>
      <Text style={styles.contenu} numberOfLines={viewMode === "grid" ? 3 : 2}>
        {item.contenu}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.dateTime}>{item.date}</Text>
        <Text style={styles.dateTime}>{item.heure}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notes</Text>
        <TouchableOpacity>
          <Ionicons name="funnel-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche et vue */}
      <View style={styles.searchRow}>
        <TouchableOpacity
          onPress={() => setSearchActive(!searchActive)}
          style={styles.searchButton}
        >
          <Ionicons name="search-outline" size={20} color="#333" />
        </TouchableOpacity>

        <View style={styles.toggleView}>
          <TouchableOpacity
            onPress={() => setViewMode("grid")}
            style={[
              styles.toggleButton,
              viewMode === "grid" && styles.activeToggle,
            ]}
          >
            <Ionicons
              name="grid"
              size={20}
              color={viewMode === "grid" ? "#990000" : "#333"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode("list")}
            style={[
              styles.toggleButton,
              viewMode === "list" && styles.activeToggle,
            ]}
          >
            <Ionicons
              name="list-outline"
              size={20}
              color={viewMode === "list" ? "#990000" : "#333"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {searchActive && (
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une note..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {/* Bouton ajouter */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Nouvelle note</Text>
      </TouchableOpacity>

      {/* Liste des notes */}
      <FlatList
        data={filteredNotes}
        key={viewMode}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={viewMode === "grid" ? 2 : 1}
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

  // Recherche et vue
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
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },

  // Bouton ajouter
  addButton: {
    flexDirection: "row",
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
  cardGrid: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    margin: 5,
    elevation: 2,
    minHeight: 150,
  },
  cardList: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  contenu: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateTime: {
    fontSize: 11,
    color: "#666",
  },
});
