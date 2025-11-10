import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { ODOO_BASE_URL } from "../../services/api";

const STORAGE_KEY = "SELECTED_DATABASE";

export default function DatabaseSelectionScreen({ navigation }) {
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingDatabases, setFetchingDatabases] = useState(true);
  const [selectedDb, setSelectedDb] = useState(null);

  useEffect(() => {
    checkStoredDatabase();
    fetchDatabases();
  }, []);

  const checkStoredDatabase = async () => {
    try {
      const storedDb = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedDb) {
        // Si une base de données existe, rediriger vers Login
        navigation.replace("Login", { database: storedDb });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la base:", error);
    }
  };

  const fetchDatabases = async () => {
    try {
      setFetchingDatabases(true);
      console.log("Récupération des bases de données depuis Odoo...");

      const response = await axios.post(
        `${ODOO_BASE_URL}/web/database/list`,
        {
          jsonrpc: "2.0",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      const { data } = response;

      if (data && data.result && Array.isArray(data.result)) {
        // Transformer le tableau de noms en tableau d'objets avec id et name
        const dbList = data.result.map((dbName, index) => ({
          id: String(index + 1),
          name: dbName,
        }));

        setDatabases(dbList);
        console.log(`${dbList.length} base(s) de données récupérée(s)`);
      } else {
        console.warn("Format de réponse inattendu:", data);
        Alert.alert(
          "Erreur",
          "Impossible de récupérer la liste des bases de données"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des bases:", error);
      Alert.alert(
        "Erreur de connexion",
        "Impossible de récupérer les bases de données. Vérifiez votre connexion."
      );
    } finally {
      setFetchingDatabases(false);
    }
  };

  const handleDatabaseSelect = async (dbName) => {
    setLoading(true);
    setSelectedDb(dbName);

    try {
      // Stocker la base de données sélectionnée
      await AsyncStorage.setItem(STORAGE_KEY, dbName);
      console.log("Base de données sélectionnée:", dbName);

      // Petite pause pour l'UX
      setTimeout(() => {
        setLoading(false);
        // Rediriger directement vers l'écran de connexion
        navigation.navigate("Login", { database: dbName });
      }, 500);
    } catch (error) {
      setLoading(false);
      setSelectedDb(null);
      Alert.alert(
        "Erreur",
        "Impossible de sélectionner la base de données. Veuillez réessayer."
      );
      console.error("Erreur lors de la sélection de la base:", error);
    }
  };

  const renderDatabase = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.databaseCard,
        selectedDb === item.name && styles.selectedCard,
      ]}
      onPress={() => handleDatabaseSelect(item.name)}
      disabled={loading}
    >
      <View style={styles.cardContent}>
        <View style={styles.dbIconContainer}>
          <Ionicons name="server-outline" size={32} color="#990000" />
        </View>
        <Text style={styles.databaseName}>{item.name}</Text>
      </View>
      {selectedDb === item.name && loading && (
        <ActivityIndicator color="#990000" style={styles.loader} />
      )}
      {(!loading || selectedDb !== item.name) && (
        <Ionicons name="chevron-forward" size={24} color="#999" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.header}>
        <Image
          source={require("./../../assets/logo.png")}
          style={styles.logo}
        />
      </View>

      {/* Titre */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Gérer les bases de données</Text>
        <Text style={styles.subtitle}>
          Sélectionnez une base de données pour continuer
        </Text>
      </View>

      {/* État de chargement */}
      {fetchingDatabases ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#990000" />
          <Text style={styles.loadingText}>
            Récupération des bases de données...
          </Text>
        </View>
      ) : databases.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="server-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Aucune base de données trouvée</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchDatabases}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Liste des bases de données */}
          <FlatList
            data={databases}
            renderItem={renderDatabase}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

          {/* Information */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              Sélectionnez une base de données pour vous connecter
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 25,
  },
  logo: {
    width: 280,
    height: 90,
    resizeMode: "contain",
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  listContainer: {
    paddingBottom: 20,
  },
  databaseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#f8f9fa",
  },
  selectedCard: {
    borderColor: "#990000",
    backgroundColor: "#fff",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  dbIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#99000015",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  databaseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  loader: {
    marginRight: 10,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#2e7d32",
    lineHeight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#990000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
