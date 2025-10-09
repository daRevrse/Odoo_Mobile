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

const mockAbsences = [
  {
    id: "1",
    employe: "Jean Dupont",
    type: "Congé",
    dateDebut: "10/10/2025",
    dateFin: "15/10/2025",
    duree: "5 jours",
    statut: "Approuvé",
  },
  {
    id: "2",
    employe: "Marie Durant",
    type: "Maladie",
    dateDebut: "08/10/2025",
    dateFin: "09/10/2025",
    duree: "2 jours",
    statut: "En attente",
  },
  {
    id: "3",
    employe: "Paul Kouassi",
    type: "Permission",
    dateDebut: "12/10/2025",
    dateFin: "12/10/2025",
    duree: "1 jour",
    statut: "Refusé",
  },
];

export default function AbsencesScreen({ navigation }) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredAbsences = mockAbsences.filter((a) =>
    a.employe.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatutStyle = (statut) => {
    switch (statut) {
      case "Approuvé":
        return styles.statutApprouve;
      case "En attente":
        return styles.statutEnAttente;
      case "Refusé":
        return styles.statutRefuse;
      default:
        return {};
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.employe}>{item.employe}</Text>
        <View style={[styles.statutBadge, getStatutStyle(item.statut)]}>
          <Text style={styles.statutText}>{item.statut}</Text>
        </View>
      </View>
      <View style={styles.typeContainer}>
        <Ionicons name="calendar-outline" size={16} color="#666" />
        <Text style={styles.type}>{item.type}</Text>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Du</Text>
        <Text style={styles.date}>{item.dateDebut}</Text>
        <Text style={styles.dateLabel}>au</Text>
        <Text style={styles.date}>{item.dateFin}</Text>
      </View>
      <Text style={styles.duree}>Durée : {item.duree}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Absences</Text>
        <TouchableOpacity>
          <Ionicons name="funnel-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchRow}>
        <TouchableOpacity
          onPress={() => setSearchActive(!searchActive)}
          style={styles.searchButton}
        >
          <Ionicons name="search-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {searchActive && (
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une absence..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {/* Bouton ajouter */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Déclarer une absence</Text>
      </TouchableOpacity>

      {/* Liste des absences */}
      <FlatList
        data={filteredAbsences}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
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

  // Recherche
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  employe: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statutBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statutApprouve: {
    backgroundColor: "#d4edda",
  },
  statutEnAttente: {
    backgroundColor: "#fff3cd",
  },
  statutRefuse: {
    backgroundColor: "#f8d7da",
  },
  statutText: {
    fontSize: 12,
    fontWeight: "600",
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  type: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  dateLabel: {
    fontSize: 13,
    color: "#999",
    marginRight: 5,
  },
  date: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
    marginRight: 5,
  },
  duree: {
    fontSize: 13,
    color: "#990000",
    fontWeight: "600",
  },
});
