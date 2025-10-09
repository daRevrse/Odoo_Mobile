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

const mockStock = [
  {
    id: "1",
    nom: "Ordinateur portable Dell XPS",
    reference: "REF-2025-001",
    categorie: "Informatique",
    quantite: 15,
    quantiteMin: 5,
    prixUnitaire: "450 000 FCFA",
    valeurTotale: "6 750 000 FCFA",
    emplacement: "Entrepôt A - R2",
    statut: "Disponible",
  },
  {
    id: "2",
    nom: "Imprimante HP LaserJet",
    reference: "REF-2025-002",
    categorie: "Bureautique",
    quantite: 3,
    quantiteMin: 8,
    prixUnitaire: "180 000 FCFA",
    valeurTotale: "540 000 FCFA",
    emplacement: "Entrepôt B - R1",
    statut: "Stock faible",
  },
  {
    id: "3",
    nom: "Chaise de bureau ergonomique",
    reference: "REF-2025-003",
    categorie: "Mobilier",
    quantite: 0,
    quantiteMin: 10,
    prixUnitaire: "85 000 FCFA",
    valeurTotale: "0 FCFA",
    emplacement: "Entrepôt C - R3",
    statut: "Rupture",
  },
  {
    id: "4",
    nom: "Écran moniteur 27 pouces",
    reference: "REF-2025-004",
    categorie: "Informatique",
    quantite: 25,
    quantiteMin: 10,
    prixUnitaire: "120 000 FCFA",
    valeurTotale: "3 000 000 FCFA",
    emplacement: "Entrepôt A - R5",
    statut: "Disponible",
  },
  {
    id: "5",
    nom: "Téléphone IP Cisco",
    reference: "REF-2025-005",
    categorie: "Télécommunication",
    quantite: 8,
    quantiteMin: 5,
    prixUnitaire: "95 000 FCFA",
    valeurTotale: "760 000 FCFA",
    emplacement: "Entrepôt B - R4",
    statut: "Disponible",
  },
];

export default function StockScreen({ navigation }) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredStock = mockStock.filter(
    (s) =>
      s.nom.toLowerCase().includes(searchText.toLowerCase()) ||
      s.reference.toLowerCase().includes(searchText.toLowerCase()) ||
      s.categorie.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatutStyle = (statut) => {
    switch (statut) {
      case "Disponible":
        return styles.statutDisponible;
      case "Stock faible":
        return styles.statutStockFaible;
      case "Rupture":
        return styles.statutRupture;
      default:
        return {};
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "Disponible":
        return "checkmark-circle";
      case "Stock faible":
        return "warning";
      case "Rupture":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case "Disponible":
        return "#27AE60";
      case "Stock faible":
        return "#F39C12";
      case "Rupture":
        return "#E74C3C";
      default:
        return "#95A5A6";
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.nom} numberOfLines={1}>
            {item.nom}
          </Text>
          <Text style={styles.reference}>{item.reference}</Text>
        </View>
        <View style={[styles.statutBadge, getStatutStyle(item.statut)]}>
          <Ionicons
            name={getStatutIcon(item.statut)}
            size={12}
            color={getStatutColor(item.statut)}
          />
          <Text
            style={[styles.statutText, { color: getStatutColor(item.statut) }]}
          >
            {item.statut}
          </Text>
        </View>
      </View>

      {/* Catégorie */}
      <View style={styles.infoRow}>
        <Ionicons name="pricetag-outline" size={14} color="#666" />
        <Text style={styles.infoText}>{item.categorie}</Text>
      </View>

      {/* Quantité */}
      <View style={styles.quantiteContainer}>
        <View style={styles.quantiteRow}>
          <Text style={styles.quantiteLabel}>Quantité:</Text>
          <Text
            style={[
              styles.quantite,
              item.quantite <= item.quantiteMin && styles.quantiteAlert,
            ]}
          >
            {item.quantite} unités
          </Text>
        </View>
        <Text style={styles.quantiteMin}>Min: {item.quantiteMin}</Text>
      </View>

      {/* Prix et valeur */}
      <View style={styles.prixContainer}>
        <View style={styles.prixRow}>
          <Text style={styles.prixLabel}>Prix unitaire:</Text>
          <Text style={styles.prix}>{item.prixUnitaire}</Text>
        </View>
        <View style={styles.prixRow}>
          <Text style={styles.prixLabel}>Valeur totale:</Text>
          <Text style={styles.valeurTotale}>{item.valeurTotale}</Text>
        </View>
      </View>

      {/* Emplacement */}
      <View style={styles.emplacementContainer}>
        <Ionicons name="location-outline" size={14} color="#666" />
        <Text style={styles.emplacement}>{item.emplacement}</Text>
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
        <Text style={styles.headerTitle}>Stock</Text>
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
          placeholder="Rechercher un article..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {/* Bouton ajouter */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Ajouter un article</Text>
      </TouchableOpacity>

      {/* Liste du stock */}
      <FlatList
        data={filteredStock}
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
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerLeft: {
    flex: 1,
    marginRight: 10,
  },
  nom: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  reference: {
    fontSize: 12,
    color: "#999",
  },
  statutBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statutDisponible: {
    backgroundColor: "#D5F4E6",
  },
  statutStockFaible: {
    backgroundColor: "#FCF3CF",
  },
  statutRupture: {
    backgroundColor: "#FADBD8",
  },
  statutText: {
    fontSize: 11,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 5,
  },
  quantiteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#F8F9FA",
    padding: 10,
    borderRadius: 8,
  },
  quantiteRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantiteLabel: {
    fontSize: 13,
    color: "#666",
    marginRight: 5,
  },
  quantite: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  quantiteAlert: {
    color: "#E74C3C",
  },
  quantiteMin: {
    fontSize: 12,
    color: "#999",
  },
  prixContainer: {
    marginBottom: 10,
  },
  prixRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  prixLabel: {
    fontSize: 13,
    color: "#666",
  },
  prix: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  valeurTotale: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#990000",
  },
  emplacementContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  emplacement: {
    fontSize: 13,
    color: "#666",
    marginLeft: 5,
  },
});
