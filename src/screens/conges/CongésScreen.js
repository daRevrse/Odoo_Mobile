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

const mockConges = [
  {
    id: "1",
    employe: "Jean Dupont",
    poste: "Développeur Senior",
    type: "Congés annuels",
    dateDebut: "15/10/2025",
    dateFin: "22/10/2025",
    duree: "8 jours",
    statut: "Approuvé",
    soldeRestant: 12,
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "2",
    employe: "Marie Durant",
    poste: "Chef de projet",
    type: "Congés maladie",
    dateDebut: "12/10/2025",
    dateFin: "14/10/2025",
    duree: "3 jours",
    statut: "En attente",
    soldeRestant: 18,
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "3",
    employe: "Paul Kouassi",
    poste: "Comptable",
    type: "Congés sans solde",
    dateDebut: "20/10/2025",
    dateFin: "27/10/2025",
    duree: "8 jours",
    statut: "Refusé",
    soldeRestant: 20,
    image: "https://i.pravatar.cc/150?img=33",
  },
  {
    id: "4",
    employe: "Sophie Martin",
    poste: "Designer UI/UX",
    type: "Congés maternité",
    dateDebut: "01/11/2025",
    dateFin: "31/01/2026",
    duree: "90 jours",
    statut: "Approuvé",
    soldeRestant: 5,
    image: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: "5",
    employe: "Kofi Mensah",
    poste: "Analyste",
    type: "Congés annuels",
    dateDebut: "25/10/2025",
    dateFin: "29/10/2025",
    duree: "5 jours",
    statut: "En attente",
    soldeRestant: 15,
    image: "https://i.pravatar.cc/150?img=15",
  },
];

export default function CongésScreen({ navigation }) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredConges = mockConges.filter((c) =>
    c.employe.toLowerCase().includes(searchText.toLowerCase())
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

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "Approuvé":
        return "checkmark-circle";
      case "En attente":
        return "time";
      case "Refusé":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case "Approuvé":
        return "#27AE60";
      case "En attente":
        return "#F39C12";
      case "Refusé":
        return "#E74C3C";
      default:
        return "#95A5A6";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Congés annuels":
        return "sunny";
      case "Congés maladie":
        return "medical";
      case "Congés sans solde":
        return "wallet";
      case "Congés maternité":
        return "heart";
      default:
        return "calendar";
    }
  };

  // Statistiques
  const stats = {
    approuves: filteredConges.filter((c) => c.statut === "Approuvé").length,
    enAttente: filteredConges.filter((c) => c.statut === "En attente").length,
    refuses: filteredConges.filter((c) => c.statut === "Refusé").length,
    total: filteredConges.length,
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <Text style={styles.employe} numberOfLines={1}>
            {item.employe}
          </Text>
          <Text style={styles.poste}>{item.poste}</Text>
        </View>
        <View style={[styles.statutBadge, getStatutStyle(item.statut)]}>
          <Ionicons
            name={getStatutIcon(item.statut)}
            size={14}
            color={getStatutColor(item.statut)}
          />
          <Text
            style={[styles.statutText, { color: getStatutColor(item.statut) }]}
          >
            {item.statut}
          </Text>
        </View>
      </View>

      {/* Type de congé */}
      <View style={styles.typeContainer}>
        <Ionicons name={getTypeIcon(item.type)} size={16} color="#990000" />
        <Text style={styles.type}>{item.type}</Text>
      </View>

      {/* Dates */}
      <View style={styles.dateContainer}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.dateLabel}>Du</Text>
          <Text style={styles.date}>{item.dateDebut}</Text>
          <Text style={styles.dateLabel}>au</Text>
          <Text style={styles.date}>{item.dateFin}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <View style={styles.footerItem}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.footerText}>Durée: {item.duree}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="briefcase-outline" size={16} color="#990000" />
          <Text style={styles.soldeText}>Solde: {item.soldeRestant} jours</Text>
        </View>
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
        <Text style={styles.headerTitle}>Congés</Text>
        <TouchableOpacity>
          <Ionicons name="funnel-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#27AE60" }]}>
            {stats.approuves}
          </Text>
          <Text style={styles.statLabel}>Approuvés</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#F39C12" }]}>
            {stats.enAttente}
          </Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#E74C3C" }]}>
            {stats.refuses}
          </Text>
          <Text style={styles.statLabel}>Refusés</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#3498DB" }]}>
            {stats.total}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
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
          placeholder="Rechercher un employé..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {/* Bouton ajouter */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Demander un congé</Text>
      </TouchableOpacity>

      {/* Liste des congés */}
      <FlatList
        data={filteredConges}
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

  // Statistiques
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 3,
    alignItems: "center",
    elevation: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 3,
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
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  employe: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  poste: {
    fontSize: 13,
    color: "#666",
  },
  statutBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  statutApprouve: {
    backgroundColor: "#D5F4E6",
  },
  statutEnAttente: {
    backgroundColor: "#FCF3CF",
  },
  statutRefuse: {
    backgroundColor: "#FADBD8",
  },
  statutText: {
    fontSize: 11,
    fontWeight: "600",
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#FFF5F5",
    padding: 10,
    borderRadius: 8,
  },
  type: {
    fontSize: 14,
    fontWeight: "600",
    color: "#990000",
    marginLeft: 8,
  },
  dateContainer: {
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 13,
    color: "#999",
    marginHorizontal: 5,
  },
  date: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
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
  soldeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#990000",
    marginLeft: 5,
  },
});
