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

const mockDocuments = [
  {
    id: "1",
    nom: "Contrat_Client_Dupont.pdf",
    type: "PDF",
    taille: "2.5 MB",
    date: "09/10/2025",
    categorie: "Contrats",
    icon: "document-text",
    iconColor: "#E74C3C",
  },
  {
    id: "2",
    nom: "Facture_2025_001.xlsx",
    type: "Excel",
    taille: "156 KB",
    date: "08/10/2025",
    categorie: "Factures",
    icon: "document",
    iconColor: "#27AE60",
  },
  {
    id: "3",
    nom: "Presentation_Produit.pptx",
    type: "PowerPoint",
    taille: "8.3 MB",
    date: "07/10/2025",
    categorie: "Présentations",
    icon: "easel",
    iconColor: "#F39C12",
  },
  {
    id: "4",
    nom: "Photo_Equipe_2025.jpg",
    type: "Image",
    taille: "4.2 MB",
    date: "06/10/2025",
    categorie: "Images",
    icon: "image",
    iconColor: "#3498DB",
  },
  {
    id: "5",
    nom: "Rapport_Mensuel_Septembre.docx",
    type: "Word",
    taille: "892 KB",
    date: "05/10/2025",
    categorie: "Rapports",
    icon: "document-text-outline",
    iconColor: "#2C3E50",
  },
];

export default function DocumentsScreen({ navigation }) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "grid" ou "list"

  const filteredDocuments = mockDocuments.filter((d) =>
    d.nom.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={viewMode === "grid" ? styles.cardGrid : styles.cardList}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={32} color={item.iconColor} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.nom} numberOfLines={1}>
          {item.nom}
        </Text>
        <Text style={styles.categorie}>{item.categorie}</Text>
        <View style={styles.metaContainer}>
          <Text style={styles.taille}>{item.taille}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Documents</Text>
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
          placeholder="Rechercher un document..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {/* Bouton ajouter */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Télécharger un document</Text>
      </TouchableOpacity>

      {/* Liste des documents */}
      <FlatList
        data={filteredDocuments}
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
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    margin: 5,
    elevation: 2,
    minHeight: 120,
    alignItems: "center",
  },
  cardList: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  nom: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  categorie: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  taille: {
    fontSize: 12,
    color: "#999",
  },
  separator: {
    fontSize: 12,
    color: "#999",
    marginHorizontal: 5,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  moreButton: {
    padding: 5,
  },
});
