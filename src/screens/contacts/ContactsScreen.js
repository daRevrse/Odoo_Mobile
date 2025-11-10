import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { contactService } from "../../services";

export default function ContactsScreen({ navigation }) {
  const [isGrid, setIsGrid] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [contactFilter, setContactFilter] = useState("all"); // "all", "companies", "individuals"

  // Charger les contacts au montage du composant
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async (forceRefresh = false) => {
    // Ne pas afficher le loader si on a déjà des contacts en cache
    if (contacts.length === 0) {
      setLoading(true);
    }

    const result = await contactService.getContacts({ forceRefresh });

    if (result.success) {
      setContacts(result.data);
      setFromCache(result.fromCache || false);

      // Indiquer si le cache est périmé
      if (result.fromCache && result.isStale) {
        console.log('📱 Affichage des données en cache (périmées)');
      }
    } else {
      console.error("Erreur de chargement:", result.error);
    }

    setLoading(false);
  };

  // Fonction pour rafraîchir manuellement les données
  const handleManualRefresh = async () => {
    setFromCache(false);
    setRefreshing(true);
    await loadContacts(true);
    setRefreshing(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Forcer le rechargement depuis le serveur lors du pull-to-refresh
    await loadContacts(true);
    setRefreshing(false);
  };

  // Appliquer les filtres de recherche et de type
  const filteredContacts = contacts.filter((c) => {
    // Filtre de recherche par nom
    const matchesSearch = c.name?.toLowerCase().includes(searchText.toLowerCase());

    // Filtre par type de contact
    let matchesFilter = true;
    if (contactFilter === "companies") {
      matchesFilter = c.is_company === true;
    } else if (contactFilter === "individuals") {
      matchesFilter = c.is_company === false || !c.is_company;
    }

    return matchesSearch && matchesFilter;
  });

  // Fonction pour appliquer un filtre
  const handleFilterSelect = (filter) => {
    setContactFilter(filter);
    setFilterModalVisible(false);
  };

  const renderItem = ({ item }) => {
    // Gérer l'image via l'URL Odoo
    // const avatarUri = item.id
    //   ? `http://161.97.125.198:11077/web/image?model=res.partner&field=image_128&id=${item.id}`
    //   : `https://ui-avatars.com/api/?name=${encodeURIComponent(
    //       item.name || "Contact"
    //     )}&size=150&background=990000&color=fff`;

    const avatarUri = item.imageUrl
      ? item.imageUrl
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          item.name || "Contact"
        )}&size=150&background=990000&color=fff`;

    return (
      <TouchableOpacity
        style={isGrid ? styles.card : styles.rowItem}
        onPress={() => navigation.navigate("ContactDetail", { contact: item })}
      >
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={isGrid ? styles.contactInfoGrid : styles.contactInfoRow}>
          <Text style={styles.name}>{item.name || "Sans nom"}</Text>
          <Text style={styles.email}>{item.email || "Pas d'email"}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#990000" />
        <Text style={styles.loadingText}>Chargement des contacts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="grid-outline" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Ionicons
            name="funnel-outline"
            size={24}
            color={contactFilter !== "all" ? "#990000" : "#333"}
          />
        </TouchableOpacity>
      </View>

      {/* Ligne de recherche + boutons de vue */}
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

      {/* Boutons ajouter et rafraîchir */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddContact")}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Créer un contact</Text>
        </TouchableOpacity>

        {fromCache && (
          <TouchableOpacity
            style={styles.refreshButtonMain}
            onPress={handleManualRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#990000" />
            ) : (
              <Ionicons name="refresh" size={20} color="#990000" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Liste ou grille */}
      {filteredContacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Aucun contact trouvé</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          key={isGrid ? "g" : "l"}
          keyExtractor={(item) =>
            item.id?.toString() || Math.random().toString()
          }
          renderItem={renderItem}
          numColumns={isGrid ? 2 : 1}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#990000"]}
            />
          }
        />
      )}

      {/* Modal de filtrage */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrer les contacts</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  contactFilter === "all" && styles.filterOptionActive,
                ]}
                onPress={() => handleFilterSelect("all")}
              >
                <Ionicons
                  name="people-outline"
                  size={24}
                  color={contactFilter === "all" ? "#990000" : "#666"}
                />
                <View style={styles.filterOptionText}>
                  <Text
                    style={[
                      styles.filterOptionTitle,
                      contactFilter === "all" && styles.filterOptionTitleActive,
                    ]}
                  >
                    Tous les contacts
                  </Text>
                  <Text style={styles.filterOptionSubtitle}>
                    Afficher tous les contacts
                  </Text>
                </View>
                {contactFilter === "all" && (
                  <Ionicons name="checkmark" size={24} color="#990000" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  contactFilter === "companies" && styles.filterOptionActive,
                ]}
                onPress={() => handleFilterSelect("companies")}
              >
                <Ionicons
                  name="business-outline"
                  size={24}
                  color={contactFilter === "companies" ? "#990000" : "#666"}
                />
                <View style={styles.filterOptionText}>
                  <Text
                    style={[
                      styles.filterOptionTitle,
                      contactFilter === "companies" &&
                        styles.filterOptionTitleActive,
                    ]}
                  >
                    Entreprises
                  </Text>
                  <Text style={styles.filterOptionSubtitle}>
                    Uniquement les entreprises
                  </Text>
                </View>
                {contactFilter === "companies" && (
                  <Ionicons name="checkmark" size={24} color="#990000" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  contactFilter === "individuals" && styles.filterOptionActive,
                ]}
                onPress={() => handleFilterSelect("individuals")}
              >
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={contactFilter === "individuals" ? "#990000" : "#666"}
                />
                <View style={styles.filterOptionText}>
                  <Text
                    style={[
                      styles.filterOptionTitle,
                      contactFilter === "individuals" &&
                        styles.filterOptionTitleActive,
                    ]}
                  >
                    Contacts individuels
                  </Text>
                  <Text style={styles.filterOptionSubtitle}>
                    Uniquement les personnes
                  </Text>
                </View>
                {contactFilter === "individuals" && (
                  <Ionicons name="checkmark" size={24} color="#990000" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F3F3F3" },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },

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

  // Ligne search + toggle
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

  // Champ de recherche
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },

  // Container pour les boutons d'action
  actionButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },

  // Bouton d'ajout
  addButton: {
    flexDirection: "row",
    backgroundColor: "#990000",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },

  // Bouton de rafraîchissement principal
  refreshButtonMain: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  // Liste
  list: { paddingBottom: 30 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 5,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    elevation: 2,
  },
  rowItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    textAlign: "center",
  },
  contactInfoGrid: {
    flex: 1,
    alignItems: "center",
  },
  contactInfoRow: {
    flex: 1,
    alignItems: "flex-start",
  },
  email: {
    fontSize: 12,
    color: "#666",
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
  },

  // Modal de filtrage
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  filterOptions: {
    gap: 12,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  filterOptionActive: {
    backgroundColor: "#FFF5F5",
    borderColor: "#990000",
  },
  filterOptionText: {
    flex: 1,
    marginLeft: 12,
  },
  filterOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  filterOptionTitleActive: {
    color: "#990000",
  },
  filterOptionSubtitle: {
    fontSize: 13,
    color: "#666",
  },
});
