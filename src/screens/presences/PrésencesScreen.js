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

const mockPresences = [
  {
    id: "1",
    nom: "Jean Dupont",
    poste: "Développeur Senior",
    date: "09/10/2025",
    heureArrivee: "08:00",
    heureDepart: "17:30",
    statut: "Présent",
    duree: "9h 30m",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "2",
    nom: "Marie Durant",
    poste: "Chef de projet",
    date: "09/10/2025",
    heureArrivee: "08:15",
    heureDepart: "18:00",
    statut: "Présent",
    duree: "9h 45m",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "3",
    nom: "Paul Kouassi",
    poste: "Comptable",
    date: "09/10/2025",
    heureArrivee: "09:30",
    heureDepart: "-",
    statut: "Retard",
    duree: "-",
    image: "https://i.pravatar.cc/150?img=33",
  },
  {
    id: "4",
    nom: "Sophie Martin",
    poste: "Designer UI/UX",
    date: "09/10/2025",
    heureArrivee: "-",
    heureDepart: "-",
    statut: "Absent",
    duree: "-",
    image: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: "5",
    nom: "Kofi Mensah",
    poste: "Analyste",
    date: "09/10/2025",
    heureArrivee: "08:00",
    heureDepart: "13:00",
    statut: "Demi-journée",
    duree: "5h 00m",
    image: "https://i.pravatar.cc/150?img=15",
  },
];

export default function PrésencesScreen({ navigation }) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState("09/10/2025");

  const filteredPresences = mockPresences.filter((p) =>
    p.nom.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatutStyle = (statut) => {
    switch (statut) {
      case "Présent":
        return styles.statutPresent;
      case "Retard":
        return styles.statutRetard;
      case "Absent":
        return styles.statutAbsent;
      case "Demi-journée":
        return styles.statutDemiJournee;
      default:
        return {};
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "Présent":
        return "checkmark-circle";
      case "Retard":
        return "time";
      case "Absent":
        return "close-circle";
      case "Demi-journée":
        return "partly-sunny";
      default:
        return "help-circle";
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case "Présent":
        return "#27AE60";
      case "Retard":
        return "#F39C12";
      case "Absent":
        return "#E74C3C";
      case "Demi-journée":
        return "#3498DB";
      default:
        return "#95A5A6";
    }
  };

  // Statistiques
  const stats = {
    presents: filteredPresences.filter((p) => p.statut === "Présent").length,
    retards: filteredPresences.filter((p) => p.statut === "Retard").length,
    absents: filteredPresences.filter((p) => p.statut === "Absent").length,
    total: filteredPresences.length,
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <Text style={styles.nom} numberOfLines={1}>
            {item.nom}
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

      <View style={styles.timeContainer}>
        <View style={styles.timeRow}>
          <Ionicons name="log-in-outline" size={16} color="#27AE60" />
          <Text style={styles.timeLabel}>Arrivée:</Text>
          <Text style={styles.timeValue}>{item.heureArrivee}</Text>
        </View>
        <View style={styles.timeRow}>
          <Ionicons name="log-out-outline" size={16} color="#E74C3C" />
          <Text style={styles.timeLabel}>Départ:</Text>
          <Text style={styles.timeValue}>{item.heureDepart}</Text>
        </View>
      </View>

      <View style={styles.dureeContainer}>
        <Ionicons name="time-outline" size={16} color="#666" />
        <Text style={styles.dureeLabel}>Durée totale:</Text>
        <Text style={styles.dureeValue}>{item.duree}</Text>
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
        <Text style={styles.headerTitle}>Présences</Text>
        <TouchableOpacity>
          <Ionicons name="calendar-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Date sélectionnée */}
      <View style={styles.dateContainer}>
        <TouchableOpacity style={styles.dateButton}>
          <Ionicons name="chevron-back" size={20} color="#990000" />
        </TouchableOpacity>
        <Text style={styles.dateText}>{selectedDate}</Text>
        <TouchableOpacity style={styles.dateButton}>
          <Ionicons name="chevron-forward" size={20} color="#990000" />
        </TouchableOpacity>
      </View>

      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.presents}</Text>
          <Text style={styles.statLabel}>Présents</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#F39C12" }]}>
            {stats.retards}
          </Text>
          <Text style={styles.statLabel}>Retards</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#E74C3C" }]}>
            {stats.absents}
          </Text>
          <Text style={styles.statLabel}>Absents</Text>
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

      {/* Liste des présences */}
      <FlatList
        data={filteredPresences}
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

  // Date selector
  dateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 1,
  },
  dateButton: {
    padding: 5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 20,
    color: "#333",
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
    color: "#27AE60",
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
  nom: {
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
  statutPresent: {
    backgroundColor: "#D5F4E6",
  },
  statutRetard: {
    backgroundColor: "#FCF3CF",
  },
  statutAbsent: {
    backgroundColor: "#FADBD8",
  },
  statutDemiJournee: {
    backgroundColor: "#D6EAF8",
  },
  statutText: {
    fontSize: 11,
    fontWeight: "600",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  timeLabel: {
    fontSize: 13,
    color: "#666",
    marginLeft: 5,
    marginRight: 5,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  dureeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 10,
    borderRadius: 8,
  },
  dureeLabel: {
    fontSize: 13,
    color: "#666",
    marginLeft: 5,
    marginRight: 5,
  },
  dureeValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#990000",
  },
});
