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

const TIMEZONES = [
  { id: "1", name: "Africa/Dakar", offset: "UTC+0", region: "Sénégal" },
  { id: "2", name: "Africa/Abidjan", offset: "UTC+0", region: "Côte d'Ivoire" },
  { id: "3", name: "Africa/Lagos", offset: "UTC+1", region: "Nigeria" },
  { id: "4", name: "Africa/Cairo", offset: "UTC+2", region: "Égypte" },
  { id: "5", name: "Europe/Paris", offset: "UTC+1", region: "France" },
  { id: "6", name: "Europe/London", offset: "UTC+0", region: "Royaume-Uni" },
  { id: "7", name: "America/New_York", offset: "UTC-5", region: "New York" },
  { id: "8", name: "America/Los_Angeles", offset: "UTC-8", region: "Los Angeles" },
  { id: "9", name: "Asia/Tokyo", offset: "UTC+9", region: "Japon" },
  { id: "10", name: "Asia/Dubai", offset: "UTC+4", region: "Dubai" },
  { id: "11", name: "Australia/Sydney", offset: "UTC+10", region: "Sydney" },
];

export default function FuseauHoraire({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState("Africa/Dakar");

  const filteredTimezones = TIMEZONES.filter(
    (tz) =>
      tz.name.toLowerCase().includes(searchText.toLowerCase()) ||
      tz.region.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const isSelected = item.name === selectedTimezone;

    return (
      <TouchableOpacity
        style={[styles.timezoneItem, isSelected && styles.selectedItem]}
        onPress={() => setSelectedTimezone(item.name)}
      >
        <View style={styles.timezoneLeft}>
          <View style={styles.timezoneIcon}>
            <Ionicons
              name="globe-outline"
              size={24}
              color={isSelected ? "#990000" : "#666"}
            />
          </View>
          <View style={styles.timezoneInfo}>
            <Text style={[styles.timezoneName, isSelected && styles.selectedText]}>
              {item.region}
            </Text>
            <Text style={styles.timezoneOffset}>{item.offset}</Text>
            <Text style={styles.timezoneCode}>{item.name}</Text>
          </View>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#990000" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fuseau horaire</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Recherche */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un fuseau horaire..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color="#2196F3" />
        <Text style={styles.infoText}>
          Le fuseau horaire est utilisé pour afficher les dates et heures dans votre zone.
        </Text>
      </View>

      {/* Liste des fuseaux horaires */}
      <FlatList
        data={filteredTimezones}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="globe-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Aucun fuseau horaire trouvé</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: "#1976D2",
    lineHeight: 18,
  },
  list: {
    paddingBottom: 20,
  },
  timezoneItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedItem: {
    borderColor: "#990000",
    backgroundColor: "#FFF5F5",
  },
  timezoneLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  timezoneIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  timezoneInfo: {
    flex: 1,
  },
  timezoneName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  selectedText: {
    color: "#990000",
  },
  timezoneOffset: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  timezoneCode: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#999",
  },
});
