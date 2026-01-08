import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import crmService from "../../services/crmService";

export default function CRMScreen({ navigation }) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await crmService.getLeads();
      setLeads(data.leads);
    } catch (error) {
      console.error("Erreur lors du chargement des opportunités:", error);
      Alert.alert("Erreur", "Impossible de charger la liste des opportunités");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadLeads();
  };

  const handleLeadPress = (lead) => {
    navigation.navigate("CRMDetail", { leadId: lead.id });
  };

  const filteredLeads = crmService.searchLeads(searchText, leads);

  const getStatutStyle = (stage) => {
    const stageName = stage?.display_name?.toLowerCase() || "";

    if (stageName.includes("nouveau") || stageName.includes("new")) {
      return { bg: "#D6EAF8", text: stage.display_name };
    }
    if (stageName.includes("qualifi") || stageName.includes("qualified")) {
      return { bg: "#FCF3CF", text: stage.display_name };
    }
    if (stageName.includes("proposition") || stageName.includes("proposal")) {
      return { bg: "#FADBD8", text: stage.display_name };
    }
    if (stageName.includes("gagn") || stageName.includes("won")) {
      return { bg: "#D5F4E6", text: stage.display_name };
    }
    if (stageName.includes("perdu") || stageName.includes("lost")) {
      return { bg: "#EAECEE", text: stage.display_name };
    }

    return { bg: "#F0F0F0", text: stage?.display_name || "N/A" };
  };

  const getProbabiliteColor = (probabilite) => {
    if (probabilite >= 75) return "#27AE60";
    if (probabilite >= 50) return "#F39C12";
    if (probabilite >= 25) return "#E67E22";
    return "#E74C3C";
  };

  const formatCurrency = (value, currency) => {
    if (!value) return "0";
    const symbol = currency?.display_name || "XOF";
    return `${value.toLocaleString()} ${symbol}`;
  };

  const renderItem = ({ item }) => {
    const statut = getStatutStyle(item.stage_id);

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleLeadPress(item)}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.nom} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.contact}>
              {item.partner_name || item.contact_name || "N/A"}
            </Text>
          </View>
          <View style={[styles.statutBadge, { backgroundColor: statut.bg }]}>
            <Text style={styles.statutText}>{statut.text}</Text>
          </View>
        </View>

        {/* Valeur et probabilité */}
        <View style={styles.valeurContainer}>
          <View style={styles.valeurRow}>
            <Ionicons name="cash-outline" size={16} color="#990000" />
            <Text style={styles.valeur}>
              {formatCurrency(item.expected_revenue, item.company_currency)}
            </Text>
          </View>
          <View style={styles.probabiliteContainer}>
            <View
              style={[
                styles.probabiliteCircle,
                { backgroundColor: getProbabiliteColor(item.probability) },
              ]}
            >
              <Text style={styles.probabiliteText}>{Math.round(item.probability)}%</Text>
            </View>
          </View>
        </View>

        {/* Informations de contact */}
        {item.phone && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={14} color="#666" />
            <Text style={styles.infoText}>{item.phone}</Text>
          </View>
        )}
        {item.email_from && (
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={14} color="#666" />
            <Text style={styles.infoText} numberOfLines={1}>
              {item.email_from}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.cardFooter}>
          {item.source_id?.display_name && (
            <View style={styles.footerItem}>
              <Ionicons name="pricetag-outline" size={14} color="#666" />
              <Text style={styles.footerText}>{item.source_id.display_name}</Text>
            </View>
          )}
          {item.date_deadline && (
            <View style={styles.footerItem}>
              <Ionicons name="calendar-outline" size={14} color="#666" />
              <Text style={styles.footerText}>{item.date_deadline}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#990000" />
        <Text style={styles.loadingText}>Chargement des opportunités...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CRM ({leads.length})</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddLead")}>
          <Ionicons name="add-circle" size={28} color="#990000" />
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
          placeholder="Rechercher un lead..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {/* Liste des leads */}
      <FlatList
        data={filteredLeads}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="briefcase-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Aucune opportunité trouvée</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F3F3F3" },
  loadingContainer: {
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
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#999",
  },
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
  },
  headerLeft: {
    flex: 1,
    marginRight: 10,
  },
  nom: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  contact: {
    fontSize: 14,
    color: "#666",
  },
  statutBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statutText: {
    fontSize: 11,
    fontWeight: "600",
  },
  valeurContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  valeurRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  valeur: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#990000",
    marginLeft: 5,
  },
  probabiliteContainer: {
    alignItems: "center",
  },
  probabiliteCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  probabiliteText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fff",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 5,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },
});
