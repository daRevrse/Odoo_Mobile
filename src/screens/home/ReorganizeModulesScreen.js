import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { configService } from "../../services";
import { getPrimaryColor } from "../../utils/branding";

export default function ReorganizeModulesScreen({ navigation }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      setLoading(true);
      const enabledModules = await configService.getEnabledModules();
      setModules(enabledModules);
    } catch (error) {
      console.error("Erreur lors du chargement des modules:", error);
      Alert.alert("Erreur", "Impossible de charger les modules");
    } finally {
      setLoading(false);
    }
  };

  const moveModule = (fromIndex, toIndex) => {
    const newModules = [...modules];
    const [movedModule] = newModules.splice(fromIndex, 1);
    newModules.splice(toIndex, 0, movedModule);
    setModules(newModules);
  };

  const moveUp = (index) => {
    if (index > 0) {
      moveModule(index, index - 1);
    }
  };

  const moveDown = (index) => {
    if (index < modules.length - 1) {
      moveModule(index, index + 1);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // TODO: Sauvegarder l'ordre dans AsyncStorage ou la config
      await configService.saveModulesOrder(modules);

      Alert.alert(
        "Succès",
        "L'ordre des modules a été sauvegardé",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      Alert.alert("Erreur", "Impossible de sauvegarder l'ordre des modules");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      "Réinitialiser",
      "Voulez-vous restaurer l'ordre par défaut ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réinitialiser",
          style: "destructive",
          onPress: async () => {
            await loadModules();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={getPrimaryColor()} />
        <Text style={styles.loadingText}>Chargement...</Text>
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
        <Text style={styles.headerTitle}>Réorganiser les modules</Text>
        <TouchableOpacity onPress={handleReset}>
          <Ionicons name="refresh" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Ionicons name="information-circle" size={20} color="#2196F3" />
        <Text style={styles.instructionsText}>
          Utilisez les flèches pour réorganiser l'ordre d'affichage des modules
        </Text>
      </View>

      {/* Liste des modules */}
      <ScrollView style={styles.scrollView}>
        {modules.map((module, index) => (
          <View
            key={index}
            style={[
              styles.moduleItem,
              draggedIndex === index && styles.moduleItemDragged,
            ]}
          >
            <View style={styles.moduleInfo}>
              <View
                style={[
                  styles.moduleIconCircle,
                  { backgroundColor: `${module.iconColor}20` },
                ]}
              >
                <Ionicons
                  name={module.icon}
                  size={24}
                  color={module.iconColor}
                />
              </View>
              <View style={styles.moduleText}>
                <Text style={styles.moduleName}>{module.label}</Text>
                <Text style={styles.modulePosition}>Position: {index + 1}</Text>
              </View>
            </View>

            <View style={styles.moduleActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  index === 0 && styles.actionButtonDisabled,
                ]}
                onPress={() => moveUp(index)}
                disabled={index === 0}
              >
                <Ionicons
                  name="chevron-up"
                  size={24}
                  color={index === 0 ? "#ccc" : "#666"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  index === modules.length - 1 && styles.actionButtonDisabled,
                ]}
                onPress={() => moveDown(index)}
                disabled={index === modules.length - 1}
              >
                <Ionicons
                  name="chevron-down"
                  size={24}
                  color={index === modules.length - 1 ? "#ccc" : "#666"}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bouton Sauvegarder */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.saveButtonText}>Sauvegarder</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
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

  // Instructions
  instructions: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  instructionsText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#1976D2",
  },

  // Liste
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  moduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moduleItemDragged: {
    opacity: 0.5,
  },
  moduleInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  moduleIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  moduleText: {
    flex: 1,
  },
  moduleName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  modulePosition: {
    fontSize: 13,
    color: "#999",
  },

  // Actions
  moduleActions: {
    flexDirection: "column",
    gap: 4,
  },
  actionButton: {
    padding: 4,
  },
  actionButtonDisabled: {
    opacity: 0.3,
  },

  // Footer
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#990000",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
