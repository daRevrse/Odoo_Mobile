import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import employeeService from "../../services/employeeService";

export default function EmployésScreen({ navigation }) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "grid" ou "list"
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployees();
      setEmployees(data.employees);
    } catch (error) {
      console.error("Erreur lors du chargement des employés:", error);
      Alert.alert("Erreur", "Impossible de charger la liste des employés");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadEmployees();
  };

  const handleEmployeePress = (employee) => {
    navigation.navigate("EmployeeDetail", { employeeId: employee.id });
  };

  const filteredEmployees = employeeService.searchEmployees(searchText, employees);

  const getEmployeeStatus = (employee) => {
    if (!employee.active) return { label: "Inactif", color: "#f8d7da" };
    if (employee.employee_type === "freelance") return { label: "Freelance", color: "#d1ecf1" };
    return { label: "Actif", color: "#d4edda" };
  };

  const renderItem = ({ item }) => {
    const status = getEmployeeStatus(item);

    return (
      <TouchableOpacity
        style={viewMode === "grid" ? styles.cardGrid : styles.cardList}
        onPress={() => handleEmployeePress(item)}
      >
        <View style={viewMode === "grid" ? styles.avatarContainerGrid : null}>
          {item.image_128 ? (
            <Image
              source={{ uri: `data:image/png;base64,${item.image_128}` }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={30} color="#999" />
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.nom} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={[styles.statutBadge, { backgroundColor: status.color }]}>
              <Text style={styles.statutText}>{status.label}</Text>
            </View>
          </View>

          <Text style={styles.poste} numberOfLines={1}>
            {item.job_title || item.job_id?.display_name || "N/A"}
          </Text>

          {item.department_id?.display_name && (
            <View style={styles.departementContainer}>
              <Ionicons name="briefcase-outline" size={14} color="#666" />
              <Text style={styles.departement} numberOfLines={1}>
                {item.department_id.display_name}
              </Text>
            </View>
          )}

          {viewMode === "list" && (
            <>
              {item.work_phone && (
                <View style={styles.contactRow}>
                  <Ionicons name="call-outline" size={14} color="#666" />
                  <Text style={styles.contactText}>{item.work_phone}</Text>
                </View>
              )}
              {item.work_email && (
                <View style={styles.contactRow}>
                  <Ionicons name="mail-outline" size={14} color="#666" />
                  <Text style={styles.contactText} numberOfLines={1}>
                    {item.work_email}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {viewMode === "list" && (
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#990000" />
        <Text style={styles.loadingText}>Chargement des employés...</Text>
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
        <Text style={styles.headerTitle}>Employés ({employees.length})</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddEmployee")}>
          <Ionicons name="add-circle" size={28} color="#990000" />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche et vue */}
      <View style={styles.searchRow}>
        <TouchableOpacity
          onPress={() => setSearchActive(!searchActive)}
          style={styles.searchButton}
        >
          <Ionicons name="search-outline" size={20} color="#333" />
        </TouchableOpacity>

        <View style={styles.toggleView}>
          <TouchableOpacity
            onPress={() => setViewMode("grid")}
            style={[
              styles.toggleButton,
              viewMode === "grid" && styles.activeToggle,
            ]}
          >
            <Ionicons
              name="grid"
              size={20}
              color={viewMode === "grid" ? "#990000" : "#333"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode("list")}
            style={[
              styles.toggleButton,
              viewMode === "list" && styles.activeToggle,
            ]}
          >
            <Ionicons
              name="list-outline"
              size={20}
              color={viewMode === "list" ? "#990000" : "#333"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {searchActive && (
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un employé..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {/* Liste des employés */}
      <FlatList
        data={filteredEmployees}
        key={viewMode}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={viewMode === "grid" ? 2 : 1}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Aucun employé trouvé</Text>
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

  // Recherche et vue
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
    backgroundColor: "#fff",
    borderColor: "#990000",
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
  cardGrid: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    margin: 5,
    elevation: 2,
    alignItems: "center",
  },
  cardList: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  avatarContainerGrid: {
    marginBottom: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  nom: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  statutBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 5,
  },
  statutText: {
    fontSize: 10,
    fontWeight: "600",
  },
  poste: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  departementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  departement: {
    fontSize: 13,
    color: "#666",
    marginLeft: 5,
    flex: 1,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  contactText: {
    fontSize: 12,
    color: "#999",
    marginLeft: 5,
    flex: 1,
  },
  moreButton: {
    padding: 5,
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
