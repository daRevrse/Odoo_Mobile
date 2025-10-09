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

const mockProjets = [
  {
    id: "1",
    nom: "Refonte site web",
    client: "TechCorp SA",
    statut: "En cours",
    progression: 75,
    dateDebut: "01/09/2025",
    dateFin: "31/10/2025",
    budget: "15 000 000 FCFA",
    equipe: 5,
  },
  {
    id: "2",
    nom: "Application mobile CRM",
    client: "Groupe Atlantique",
    statut: "En cours",
    progression: 45,
    dateDebut: "15/09/2025",
    dateFin: "15/12/2025",
    budget: "25 000 000 FCFA",
    equipe: 8,
  },
  {
    id: "3",
    nom: "Migration cloud",
    client: "Bank of Africa",
    statut: "Terminé",
    progression: 100,
    dateDebut: "01/08/2025",
    dateFin: "30/09/2025",
    budget: "40 000 000 FCFA",
    equipe: 12,
  },
  {
    id: "4",
    nom: "ERP Personnalisé",
    client: "Industrie Plus",
    statut: "Planifié",
    progression: 0,
    dateDebut: "01/11/2025",
    dateFin: "30/04/2026",
    budget: "60 000 000 FCFA",
    equipe: 15,
  },
];

export default function ProjetScreen({ navigation }) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredProjets = mockProjets.filter(
    (p) =>
      p.nom.toLowerCase().includes(searchText.toLowerCase()) ||
      p.client.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatutStyle = (statut) => {
    switch (statut) {
      case "En cours":
        return styles.statutEnCours;
      case "Terminé":
        return styles.statutTermine;
      case "Planifié":
        return styles.statutPlanifie;
      default:
        return {};
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case "En cours":
        return "#3498DB";
      case "Terminé":
        return "#27AE60";
      case "Planifié":
        return "#F39C12";
      default:
        return "#95A5A6";
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleProjectPress(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.nom} numberOfLines={1}>
          {item.nom}
        </Text>
        <View style={[styles.statutBadge, getStatutStyle(item.statut)]}>
          <Text style={styles.statutText}>{item.statut}</Text>
        </View>
      </View>

      <Text style={styles.client}>{item.client}</Text>

      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${item.progression}%`,
                backgroundColor: getStatutColor(item.statut),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{item.progression}%</Text>
      </View>

      {/* Infos dates */}
      <View style={styles.dateContainer}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.dateText}>
            {item.dateDebut} - {item.dateFin}
          </Text>
        </View>
      </View>

      {/* Infos budget et équipe */}
      <View style={styles.footerContainer}>
        <View style={styles.footerItem}>
          <Ionicons name="cash-outline" size={16} color="#990000" />
          <Text style={styles.footerText}>{item.budget}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.footerText}>{item.equipe} membres</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleProjectPress = (projet) => {
    navigation.navigate("ProjetDetail", { projet });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Projets</Text>
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
          placeholder="Rechercher un projet..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {/* Bouton ajouter */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Nouveau projet</Text>
      </TouchableOpacity>

      {/* Liste des projets */}
      <FlatList
        data={filteredProjets}
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
    alignItems: "center",
    marginBottom: 8,
  },
  nom: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  statutBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statutEnCours: {
    backgroundColor: "#D6EAF8",
  },
  statutTermine: {
    backgroundColor: "#D5F4E6",
  },
  statutPlanifie: {
    backgroundColor: "#FCF3CF",
  },
  statutText: {
    fontSize: 11,
    fontWeight: "600",
  },
  client: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E8E8E8",
    borderRadius: 4,
    marginRight: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    width: 40,
  },
  dateContainer: {
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 5,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 5,
  },
});
