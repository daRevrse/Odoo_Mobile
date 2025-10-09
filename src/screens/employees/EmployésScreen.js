import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const mockEmployes = [
  {
    id: "1",
    nom: "Jean Dupont",
    poste: "Développeur Senior",
    departement: "Informatique",
    telephone: "+228 90 12 34 56",
    email: "jean.dupont@entreprise.com",
    statut: "Actif",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "2",
    nom: "Marie Durant",
    poste: "Chef de projet",
    departement: "Management",
    telephone: "+228 90 23 45 67",
    email: "marie.durant@entreprise.com",
    statut: "Actif",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "3",
    nom: "Paul Kouassi",
    poste: "Comptable",
    departement: "Finance",
    telephone: "+228 90 34 56 78",
    email: "paul.kouassi@entreprise.com",
    statut: "En congé",
    image: "https://i.pravatar.cc/150?img=33",
  },
  {
    id: "4",
    nom: "Sophie Martin",
    poste: "Designer UI/UX",
    departement: "Design",
    telephone: "+228 90 45 67 89",
    email: "sophie.martin@entreprise.com",
    statut: "Actif",
    image: "https://i.pravatar.cc/150?img=9",
  },
];

export default function EmployésScreen({ navigation }) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "grid" ou "list"

  const filteredEmployes = mockEmployes.filter(
    (e) =>
      e.nom.toLowerCase().includes(searchText.toLowerCase()) ||
      e.poste.toLowerCase().includes(searchText.toLowerCase()) ||
      e.departement.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={viewMode === "grid" ? styles.cardGrid : styles.cardList}
    >
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.nom} numberOfLines={1}>
            {item.nom}
          </Text>
          <View
            style={[
              styles.statutBadge,
              item.statut === "Actif" ? styles.statutActif : styles.statutConge,
            ]}
          >
            <Text style={styles.statutText}>{item.statut}</Text>
          </View>
        </View>
        <Text style={styles.poste}>{item.poste}</Text>
        <View style={styles.departementContainer}>
          <Ionicons name="briefcase-outline" size={14} color="#666" />
          <Text style={styles.departement}>{item.departement}</Text>
        </View>
        {viewMode === "list" && (
          <>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={14} color="#666" />
              <Text style={styles.contactText}>{item.telephone}</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="mail-outline" size={14} color="#666" />
              <Text style={styles.contactText} numberOfLines={1}>
                {item.email}
              </Text>
            </View>
          </>
        )}
      </View>
      {viewMode === "list" && (
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Employés</Text>
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
          placeholder="Rechercher un employé..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {/* Bouton ajouter */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Ajouter un employé</Text>
      </TouchableOpacity>

      {/* Liste des employés */}
      <FlatList
        data={filteredEmployes}
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    marginBottom: 8,
  },
  infoContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  nom: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  statutBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 5,
  },
  statutActif: {
    backgroundColor: "#d4edda",
  },
  statutConge: {
    backgroundColor: "#fff3cd",
  },
  statutText: {
    fontSize: 10,
    fontWeight: "600",
  },
  poste: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  departementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  departement: {
    fontSize: 13,
    color: "#666",
    marginLeft: 5,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  contactText: {
    fontSize: 12,
    color: "#999",
    marginLeft: 5,
    flex: 1,
  },
  moreButton: {
    padding: 5,
  },
});
