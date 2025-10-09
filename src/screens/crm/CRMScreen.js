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

const mockLeads = [
  {
    id: "1",
    nom: "TechStart SARL",
    contact: "Amadou Diallo",
    telephone: "+228 90 11 22 33",
    email: "contact@techstart.tg",
    statut: "Qualifié",
    valeur: "8 000 000 FCFA",
    probabilite: 75,
    prochainContact: "12/10/2025",
    source: "Référence",
  },
  {
    id: "2",
    nom: "Commerce Plus",
    contact: "Fatou Mensah",
    telephone: "+228 90 22 33 44",
    email: "info@commerceplus.tg",
    statut: "Nouveau",
    valeur: "12 000 000 FCFA",
    probabilite: 30,
    prochainContact: "10/10/2025",
    source: "Site web",
  },
  {
    id: "3",
    nom: "Industrie Nord",
    contact: "Koffi Assou",
    telephone: "+228 90 33 44 55",
    email: "k.assou@industrienord.tg",
    statut: "Négociation",
    valeur: "25 000 000 FCFA",
    probabilite: 85,
    prochainContact: "11/10/2025",
    source: "Salon",
  },
  {
    id: "4",
    nom: "Services Express",
    contact: "Ama Koffi",
    telephone: "+228 90 44 55 66",
    email: "contact@servicesexpress.tg",
    statut: "Gagné",
    valeur: "5 000 000 FCFA",
    probabilite: 100,
    prochainContact: "-",
    source: "Publicité",
  },
  {
    id: "5",
    nom: "Distribution Plus",
    contact: "Yao Mensah",
    telephone: "+228 90 55 66 77",
    email: "yao@distributionplus.tg",
    statut: "Perdu",
    valeur: "15 000 000 FCFA",
    probabilite: 0,
    prochainContact: "-",
    source: "Email",
  },
];

export default function CRMScreen({ navigation }) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredLeads = mockLeads.filter(
    (l) =>
      l.nom.toLowerCase().includes(searchText.toLowerCase()) ||
      l.contact.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatutStyle = (statut) => {
    switch (statut) {
      case "Nouveau":
        return styles.statutNouveau;
      case "Qualifié":
        return styles.statutQualifie;
      case "Négociation":
        return styles.statutNegociation;
      case "Gagné":
        return styles.statutGagne;
      case "Perdu":
        return styles.statutPerdu;
      default:
        return {};
    }
  };

  const getProbabiliteColor = (probabilite) => {
    if (probabilite >= 75) return "#27AE60";
    if (probabilite >= 50) return "#F39C12";
    if (probabilite >= 25) return "#E67E22";
    return "#E74C3C";
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.nom} numberOfLines={1}>
            {item.nom}
          </Text>
          <Text style={styles.contact}>{item.contact}</Text>
        </View>
        <View style={[styles.statutBadge, getStatutStyle(item.statut)]}>
          <Text style={styles.statutText}>{item.statut}</Text>
        </View>
      </View>

      {/* Valeur et probabilité */}
      <View style={styles.valeurContainer}>
        <View style={styles.valeurRow}>
          <Ionicons name="cash-outline" size={16} color="#990000" />
          <Text style={styles.valeur}>{item.valeur}</Text>
        </View>
        <View style={styles.probabiliteContainer}>
          <View
            style={[
              styles.probabiliteCircle,
              { backgroundColor: getProbabiliteColor(item.probabilite) },
            ]}
          >
            <Text style={styles.probabiliteText}>{item.probabilite}%</Text>
          </View>
        </View>
      </View>

      {/* Informations de contact */}
      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={14} color="#666" />
        <Text style={styles.infoText}>{item.telephone}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="mail-outline" size={14} color="#666" />
        <Text style={styles.infoText} numberOfLines={1}>
          {item.email}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="pricetag-outline" size={14} color="#666" />
          <Text style={styles.footerText}>{item.source}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.footerText}>{item.prochainContact}</Text>
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
        <Text style={styles.headerTitle}>CRM</Text>
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
          placeholder="Rechercher un lead..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {/* Bouton ajouter */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Nouveau lead</Text>
      </TouchableOpacity>

      {/* Liste des leads */}
      <FlatList
        data={filteredLeads}
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
  statutNouveau: {
    backgroundColor: "#D6EAF8",
  },
  statutQualifie: {
    backgroundColor: "#FCF3CF",
  },
  statutNegociation: {
    backgroundColor: "#FADBD8",
  },
  statutGagne: {
    backgroundColor: "#D5F4E6",
  },
  statutPerdu: {
    backgroundColor: "#EAECEE",
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
