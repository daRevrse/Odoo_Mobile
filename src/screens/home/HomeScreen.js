import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { configService } from "../../services";
import {
  getBranding,
  getPrimaryColor,
  hasCustomLogo,
  getLogoUrl,
  getAppName,
} from "../../utils/branding";

export default function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branding, setBranding] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    loadModulesAndBranding();
  }, []);

  const loadModulesAndBranding = async () => {
    try {
      setLoading(true);

      // Charger les modules activés depuis la config
      const enabledModules = await configService.getEnabledModules();

      // Charger le branding
      const brandingData = getBranding();

      setModules(enabledModules);
      setBranding(brandingData);

      console.log(`📱 ${enabledModules.length} modules activés`);
    } catch (error) {
      console.error("Erreur lors du chargement des modules:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredModules = modules.filter((module) =>
    module.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleReorganizeModules = () => {
    setMenuVisible(false);
    navigation.navigate("ReorganizeModules");
  };

  const handleSettings = () => {
    setMenuVisible(false);
    navigation.navigate("Profile");
  };

  const handleRefresh = async () => {
    setMenuVisible(false);
    await loadModulesAndBranding();
  };

  const menuOptions = [
    {
      icon: "refresh",
      label: "Actualiser",
      onPress: handleRefresh,
      color: "#4CAF50",
    },
    {
      icon: "swap-vertical",
      label: "Réorganiser les modules",
      onPress: handleReorganizeModules,
      color: "#2196F3",
    },
    {
      icon: "settings-outline",
      label: "Paramètres",
      onPress: handleSettings,
      color: "#FF9800",
    },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={getPrimaryColor()} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={32} color="#333" />
        </TouchableOpacity>

        {/* ✅ MODIFICATION : Afficher le nom de l'app personnalisé */}
        <Text style={styles.title}>{getAppName()}</Text>

        <TouchableOpacity
          key={"profile"}
          onPress={() => navigation.navigate("Profile")}
        >
          {/* ✅ MODIFICATION : Afficher le logo personnalisé si disponible */}
          {hasCustomLogo() ? (
            <Image source={{ uri: getLogoUrl() }} style={styles.avatar} />
          ) : (
            <Image
              source={{ uri: "https://i.pravatar.cc/300" }}
              style={styles.avatar}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Actions rapides</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {menuOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={option.onPress}
              >
                <View
                  style={[
                    styles.menuIconCircle,
                    { backgroundColor: `${option.color}20` },
                  ]}
                >
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={option.color}
                  />
                </View>
                <Text style={styles.menuItemText}>{option.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Rechercher un module..."
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {filteredModules.length === 0 ? (
        <View style={styles.noResults}>
          <Ionicons name="search-outline" size={60} color="#ccc" />
          <Text style={styles.noResultsText}>
            {modules.length === 0
              ? "Aucun module activé"
              : "Aucun résultat trouvé"}
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {filteredModules.map((module, index) => (
            <TouchableOpacity
              key={index}
              style={styles.iconBox}
              onPress={() => navigation.navigate(module.screen)}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${module.iconColor}20` },
                ]}
              >
                <Ionicons
                  name={module.icon}
                  size={30}
                  color={module.iconColor}
                />
              </View>
              <Text style={styles.iconLabel}>{module.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", padding: 16 },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 40,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
  avatar: { width: 45, height: 45, borderRadius: 22.5 },

  // Menu Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    paddingTop: 100,
    paddingHorizontal: 16,
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuIconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15 },

  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  noResultsText: {
    marginTop: 12,
    fontSize: 16,
    color: "#999",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 30,
  },
  iconBox: {
    width: "30%",
    alignItems: "center",
    marginBottom: 25,
    padding: 10,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  iconLabel: {
    fontSize: 13,
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
  },
});
