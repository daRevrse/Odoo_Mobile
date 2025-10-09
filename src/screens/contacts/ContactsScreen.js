import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const mockContacts = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@gmail.com",
    telephone: "+228 90 12 34 56",
    entreprise: "TechCorp",
    image: "https://i.pravatar.cc/150?img=1",
    type: "Client",
  },
  {
    id: "2",
    name: "Marie Durant",
    email: "marie.durant@gmail.com",
    telephone: "+228 90 23 45 67",
    entreprise: "Design Studio",
    image: "https://i.pravatar.cc/150?img=2",
    type: "Fournisseur",
  },
  {
    id: "3",
    name: "Paul Kouassi",
    email: "paul.kouassi@gmail.com",
    telephone: "+228 90 34 56 78",
    entreprise: "Consulting Plus",
    image: "https://i.pravatar.cc/150?img=3",
    type: "Partenaire",
  },
  {
    id: "4",
    name: "Sophie Martin",
    email: "sophie.martin@gmail.com",
    telephone: "+228 90 45 67 89",
    entreprise: "Innovation Lab",
    image: "https://i.pravatar.cc/150?img=4",
    type: "Client",
  },
  {
    id: "5",
    name: "Kofi Mensah",
    email: "kofi.mensah@gmail.com",
    telephone: "+228 90 56 78 90",
    entreprise: "Tech Solutions",
    image: "https://i.pravatar.cc/150?img=5",
    type: "Fournisseur",
  },
];

export default function ContactsScreen({ navigation }) {
  const [isGrid, setIsGrid] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("Tous");

  const filteredContacts = mockContacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.email.toLowerCase().includes(searchText.toLowerCase()) ||
      c.entreprise.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filterType === "Tous" || c.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const contactTypes = ["Tous", "Client", "Fournisseur", "Partenaire"];

  const getTypeColor = (type) => {
    switch (type) {
      case "Client":
        return "#3498DB";
      case "Fournisseur":
        return "#27AE60";
      case "Partenaire":
        return "#F39C12";
      default:
        return "#999";
    }
  };

  const handleContactPress = (contact) => {
    navigation.navigate("ContactDetail", { contact });
  };

  const handleCallPress = (telephone) => {
    Alert.alert("Appel", `Appeler ${telephone} ?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Appeler", onPress: () => {} },
    ]);
  };

  const handleEmailPress = (email) => {
    Alert.alert("Email", `Envoyer un email à ${email} ?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Envoyer", onPress: () => {} },
    ]);
  };

  const renderGridItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gridCard}
      onPress={() => handleContactPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.gridAvatar} />
      <View style={styles.gridInfo}>
        <Text style={styles.gridName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.gridEmail} numberOfLines={1}>
          {item.email}
        </Text>
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: `${getTypeColor(item.type)}20` },
          ]}
        >
          <Text style={[styles.typeText, { color: getTypeColor(item.type) }]}>
            {item.type}
          </Text>
        </View>
      </View>
      <View style={styles.gridActions}>
        <TouchableOpacity
          style={styles.gridActionButton}
          onPress={() => handleCallPress(item.telephone)}
        >
          <Ionicons name="call" size={18} color="#27AE60" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.gridActionButton}
          onPress={() => handleEmailPress(item.email)}
        >
          <Ionicons name="mail" size={18} color="#3498DB" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() => handleContactPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.listAvatar} />
      <View style={styles.listInfo}>
        <View style={styles.listHeader}>
          <Text style={styles.listName}>{item.name}</Text>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: `${getTypeColor(item.type)}20` },
            ]}
          >
            <Text style={[styles.typeText, { color: getTypeColor(item.type) }]}>
              {item.type}
            </Text>
          </View>
        </View>
        <Text style={styles.listEntreprise}>{item.entreprise}</Text>
        <View style={styles.listContactInfo}>
          <Ionicons name="call-outline" size={14} color="#666" />
          <Text style={styles.listContactText}>{item.telephone}</Text>
        </View>
        <View style={styles.listContactInfo}>
          <Ionicons name="mail-outline" size={14} color="#666" />
          <Text style={styles.listContactText} numberOfLines={1}>
            {item.email}
          </Text>
        </View>
      </View>
      <View style={styles.listActions}>
        <TouchableOpacity
          style={styles.listActionButton}
          onPress={() => handleCallPress(item.telephone)}
        >
          <Ionicons name="call" size={20} color="#27AE60" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listActionButton}
          onPress={() => handleEmailPress(item.email)}
        >
          <Ionicons name="mail" size={20} color="#3498DB" />
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity>
          <Ionicons name="funnel-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{filteredContacts.length}</Text>
          <Text style={styles.statLabel}>Contacts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#3498DB" }]}>
            {filteredContacts.filter((c) => c.type === "Client").length}
          </Text>
          <Text style={styles.statLabel}>Clients</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#27AE60" }]}>
            {filteredContacts.filter((c) => c.type === "Fournisseur").length}
          </Text>
          <Text style={styles.statLabel}>Fournisseurs</Text>
        </View>
      </View>

      {/* Filtres par type */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {contactTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                filterType === type && styles.filterChipActive,
              ]}
              onPress={() => setFilterType(type)}
            >
              <Text
                style={[
                  styles.filterText,
                  filterType === type && styles.filterTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Ligne de recherche et vue */}
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

      {/* Liste */}
      <FlatList
        data={filteredContacts}
        key={isGrid ? "g" : "l"}
        keyExtractor={(item) => item.id}
        renderItem={isGrid ? renderGridItem : renderListItem}
        numColumns={isGrid ? 2 : 1}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Aucun contact trouvé</Text>
          </View>
        }
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

  // Stats
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#990000",
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 3,
  },

  // Filtres
  filtersContainer: {
    marginBottom: 15,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  filterChipActive: {
    backgroundColor: "#990000",
    borderColor: "#990000",
  },
  filterText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#fff",
  },

  // Recherche
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
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  activeToggle: {
    borderColor: "#990000",
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
    elevation: 2,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },

  // Liste
  list: { paddingBottom: 30 },

  // Grid view
  gridCard: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 5,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  gridAvatar: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  gridInfo: {
    marginBottom: 10,
  },
  gridName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  gridEmail: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  gridActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  gridActionButton: {
    padding: 8,
  },

  // List view
  listCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  listAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  listName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  listEntreprise: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  listContactInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  listContactText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
    flex: 1,
  },
  listActions: {
    flexDirection: "row",
  },
  listActionButton: {
    padding: 8,
    marginLeft: 4,
  },

  // Type badge
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "600",
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#999",
  },
});
