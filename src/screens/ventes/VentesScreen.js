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

const mockVentes = [
  {
    id: "1",
    numero: "VEN-2025-001",
    client: "Jean Dupont",
    montant: "1 500 000 FCFA",
    date: "05/10/2025",
    statut: "Payée",
  },
  {
    id: "2",
    numero: "VEN-2025-002",
    client: "Marie Durant",
    montant: "850 000 FCFA",
    date: "08/10/2025",
    statut: "En attente",
  },
  {
    id: "3",
    numero: "VEN-2025-003",
    client: "Paul Kouassi",
    montant: "2 300 000 FCFA",
    date: "09/10/2025",
    statut: "Payée",
  },
];

export default function VentesScreen({ navigation }) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredVentes = mockVentes.filter(
    (v) =>
      v.numero.toLowerCase().includes(searchText.toLowerCase()) ||
      v.client.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.numero}>{item.numero}</Text>
        <View
          style={[
            styles.statutBadge,
            item.statut === "Payée"
              ? styles.statutPayee
              : styles.statutEnAttente,
          ]}
        >
          <Text style={styles.statutText}>{item.statut}</Text>
        </View>
      </View>
      <Text style={styles.client}>{item.client}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.montant}>{item.montant}</Text>
        <Text style={styles.date}>{item.date}</Text>
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
        <Text style={styles.headerTitle}>Ventes</Text>
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
          placeholder="Rechercher une vente..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {/* Bouton ajouter */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Nouvelle vente</Text>
      </TouchableOpacity>

      {/* Liste des ventes */}
      <FlatList
        data={filteredVentes}
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
    marginBottom: 8,
  },
  numero: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statutBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statutPayee: {
    backgroundColor: "#d4edda",
  },
  statutEnAttente: {
    backgroundColor: "#fff3cd",
  },
  statutText: {
    fontSize: 12,
    fontWeight: "600",
  },
  client: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  montant: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#990000",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
});
