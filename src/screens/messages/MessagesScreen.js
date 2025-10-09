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

const mockConversations = [
  {
    id: "1",
    nom: "Jean Dupont",
    dernierMessage: "Merci pour le document, je vais le consulter.",
    heure: "14:30",
    nonLu: 2,
    image: "https://i.pravatar.cc/150?img=12",
    statut: "en ligne",
  },
  {
    id: "2",
    nom: "Marie Durant",
    dernierMessage: "La réunion de demain est confirmée à 10h.",
    heure: "13:45",
    nonLu: 0,
    image: "https://i.pravatar.cc/150?img=5",
    statut: "absent",
  },
  {
    id: "3",
    nom: "Paul Kouassi",
    dernierMessage: "J'ai envoyé les fichiers demandés par email.",
    heure: "12:20",
    nonLu: 5,
    image: "https://i.pravatar.cc/150?img=33",
    statut: "en ligne",
  },
  {
    id: "4",
    nom: "Sophie Martin",
    dernierMessage: "Le design est prêt, je vous l'envoie.",
    heure: "11:15",
    nonLu: 0,
    image: "https://i.pravatar.cc/150?img=9",
    statut: "absent",
  },
  {
    id: "5",
    nom: "Équipe Développement",
    dernierMessage: "Kofi: Le bug a été corrigé.",
    heure: "10:50",
    nonLu: 12,
    image: "https://i.pravatar.cc/150?img=15",
    type: "groupe",
  },
  {
    id: "6",
    nom: "Ama Koffi",
    dernierMessage: "D'accord, à tout à l'heure !",
    heure: "Hier",
    nonLu: 0,
    image: "https://i.pravatar.cc/150?img=25",
    statut: "absent",
  },
];

export default function MessagesScreen({ navigation }) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredConversations = mockConversations.filter((c) =>
    c.nom.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      onPress={() => navigation.navigate("Chat", { conversation: item })}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        {item.statut === "en ligne" && <View style={styles.onlineIndicator} />}
        {item.type === "groupe" && (
          <View style={styles.groupBadge}>
            <Ionicons name="people" size={12} color="#fff" />
          </View>
        )}
      </View>

      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.nom} numberOfLines={1}>
            {item.nom}
          </Text>
          <Text style={styles.heure}>{item.heure}</Text>
        </View>
        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.dernierMessage,
              item.nonLu > 0 && styles.messageNonLu,
            ]}
            numberOfLines={1}
          >
            {item.dernierMessage}
          </Text>
          {item.nonLu > 0 && (
            <View style={styles.badgeNonLu}>
              <Text style={styles.badgeText}>{item.nonLu}</Text>
            </View>
          )}
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
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={24} color="#333" />
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
          placeholder="Rechercher une conversation..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {/* Statistiques rapides */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Ionicons name="chatbubbles" size={20} color="#990000" />
          <Text style={styles.statNumber}>{filteredConversations.length}</Text>
          <Text style={styles.statLabel}>Conversations</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="mail-unread" size={20} color="#F39C12" />
          <Text style={styles.statNumber}>
            {filteredConversations.reduce((sum, c) => sum + c.nonLu, 0)}
          </Text>
          <Text style={styles.statLabel}>Non lus</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="people" size={20} color="#3498DB" />
          <Text style={styles.statNumber}>
            {
              filteredConversations.filter((c) => c.statut === "en ligne")
                .length
            }
          </Text>
          <Text style={styles.statLabel}>En ligne</Text>
        </View>
      </View>

      {/* Liste des conversations */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 10,
    color: "#666",
    marginTop: 3,
  },

  // Liste
  list: { paddingBottom: 30 },
  conversationCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
  },
  separator: {
    height: 10,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#27AE60",
    borderWidth: 2,
    borderColor: "#fff",
  },
  groupBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#3498DB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  nom: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  heure: {
    fontSize: 12,
    color: "#999",
    marginLeft: 10,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dernierMessage: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  messageNonLu: {
    fontWeight: "600",
    color: "#333",
  },
  badgeNonLu: {
    backgroundColor: "#990000",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
    minWidth: 24,
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
});
