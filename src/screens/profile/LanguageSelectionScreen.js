import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import languageService from "../../services/languageService";

export default function LanguageSelectionScreen({ navigation }) {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    setLoading(true);
    try {
      const result = await languageService.getLanguages();

      if (result.success) {
        setLanguages(result.data);
      } else {
        Alert.alert("Erreur", result.error || "Impossible de charger les langues");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSelect = async (language) => {
    setSelectedLanguage(language.code);

    try {
      const result = await languageService.updateUserLanguage(language.code);

      if (result.success) {
        Alert.alert("Succès", "Langue mise à jour avec succès", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Erreur", result.error || "Impossible de mettre à jour la langue");
        setSelectedLanguage(null);
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur s'est produite");
      setSelectedLanguage(null);
    }
  };

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.languageCard,
        selectedLanguage === item.code && styles.selectedCard,
      ]}
      onPress={() => handleLanguageSelect(item)}
    >
      <View style={styles.cardContent}>
        <View style={styles.languageInfo}>
          <Text style={styles.languageName}>{item.name || "Langue"}</Text>
          <Text style={styles.languageCode}>{item.code || "N/A"}</Text>
        </View>
      </View>
      {selectedLanguage === item.code ? (
        <Ionicons name="checkmark-circle" size={24} color="#990000" />
      ) : (
        <Ionicons name="chevron-forward" size={24} color="#999" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Langues</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Titre */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sélectionner une langue</Text>
        <Text style={styles.subtitle}>
          Choisissez la langue de l'interface
        </Text>
      </View>

      {/* État de chargement */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#990000" />
          <Text style={styles.loadingText}>
            Chargement des langues...
          </Text>
        </View>
      ) : languages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="language-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Aucune langue disponible</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadLanguages}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Liste des langues */}
          <FlatList
            data={languages}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item.code || item.id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

          {/* Information */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              La langue sera appliquée à toute l'interface
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  headerSpacer: {
    width: 40,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  languageCard: {
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
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  languageCode: {
    fontSize: 13,
    color: "#666",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
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
