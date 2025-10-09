import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProjetDetailScreen({ route, navigation }) {
  //   const { projet } = route.params ||
  const { projet } = {
    projet: {
      nom: "Refonte site web",
      client: "TechCorp SA",
      statut: "En cours",
      progression: 75,
      dateDebut: "01/09/2025",
      dateFin: "31/10/2025",
      budget: "15 000 000 FCFA",
      budgetConsomme: "11 250 000 FCFA",
      equipe: [
        { nom: "Jean Dupont", role: "Chef de projet" },
        { nom: "Marie Durant", role: "Développeur" },
        { nom: "Paul Kouassi", role: "Designer" },
        { nom: "Sophie Martin", role: "Testeur" },
        { nom: "Kofi Mensah", role: "DevOps" },
      ],
      taches: [
        { nom: "Maquettes UI/UX", statut: "Terminé", progression: 100 },
        { nom: "Développement Frontend", statut: "En cours", progression: 80 },
        { nom: "Développement Backend", statut: "En cours", progression: 70 },
        { nom: "Tests & Déploiement", statut: "En attente", progression: 0 },
      ],
      description:
        "Refonte complète du site web de TechCorp avec une nouvelle identité visuelle et de nouvelles fonctionnalités.",
      priorite: "Haute",
      risques: "Délais serrés, dépendance externe",
    },
  };

  const handleEdit = () => {
    navigation.navigate("AddProjet", { projet });
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer le projet",
      `Voulez-vous vraiment supprimer "${projet.nom}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleAddTask = () => {
    Alert.alert("Ajouter une tâche", "Fonctionnalité en développement");
  };

  const handleExport = () => {
    Alert.alert("Exporter", "Génération du rapport PDF...");
  };

  const getStatutStyle = (statut) => {
    switch (statut) {
      case "En cours":
        return { backgroundColor: "#D6EAF8", color: "#3498DB" };
      case "Terminé":
        return { backgroundColor: "#D5F4E6", color: "#27AE60" };
      case "Planifié":
        return { backgroundColor: "#FCF3CF", color: "#F39C12" };
      case "En attente":
        return { backgroundColor: "#ECF0F1", color: "#95A5A6" };
      case "En pause":
        return { backgroundColor: "#FADBD8", color: "#E74C3C" };
      default:
        return { backgroundColor: "#F0F0F0", color: "#999" };
    }
  };

  const getPrioriteColor = (priorite) => {
    switch (priorite) {
      case "Haute":
        return "#E74C3C";
      case "Moyenne":
        return "#F39C12";
      case "Basse":
        return "#27AE60";
      default:
        return "#95A5A6";
    }
  };

  const InfoRow = ({ label, value, isAmount }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, isAmount && styles.amountText]}>
        {value}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du projet</Text>
        <TouchableOpacity onPress={handleEdit}>
          <Ionicons name="create-outline" size={24} color="#990000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête projet */}
        <View style={styles.projetHeader}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.nom}>{projet.nom}</Text>
              <Text style={styles.client}>{projet.client}</Text>
            </View>
            <View
              style={[
                styles.statutBadge,
                {
                  backgroundColor: getStatutStyle(projet.statut)
                    .backgroundColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.statutText,
                  { color: getStatutStyle(projet.statut).color },
                ]}
              >
                {projet.statut}
              </Text>
            </View>
          </View>

          {/* Barre de progression */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progression globale</Text>
              <Text style={styles.progressPercentage}>
                {projet.progression}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${projet.progression}%` },
                ]}
              />
            </View>
          </View>

          {/* Priorité */}
          <View style={styles.prioriteContainer}>
            <Ionicons
              name="flag"
              size={16}
              color={getPrioriteColor(projet.priorite)}
            />
            <Text
              style={[
                styles.prioriteText,
                { color: getPrioriteColor(projet.priorite) },
              ]}
            >
              Priorité {projet.priorite}
            </Text>
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAddTask}>
            <View style={[styles.actionIcon, { backgroundColor: "#3498DB20" }]}>
              <Ionicons name="add-outline" size={24} color="#3498DB" />
            </View>
            <Text style={styles.actionText}>Tâche</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
            <View style={[styles.actionIcon, { backgroundColor: "#E74C3C20" }]}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#E74C3C"
              />
            </View>
            <Text style={styles.actionText}>Exporter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <View style={[styles.actionIcon, { backgroundColor: "#F39C1220" }]}>
              <Ionicons name="create-outline" size={24} color="#F39C12" />
            </View>
            <Text style={styles.actionText}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <View style={[styles.actionIcon, { backgroundColor: "#95A5A620" }]}>
              <Ionicons name="trash-outline" size={24} color="#95A5A6" />
            </View>
            <Text style={styles.actionText}>Supprimer</Text>
          </TouchableOpacity>
        </View>

        {/* Informations générales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS GÉNÉRALES</Text>
          <InfoRow label="Date de début" value={projet.dateDebut} />
          <InfoRow label="Date de fin" value={projet.dateFin} />
          <InfoRow label="Budget total" value={projet.budget} isAmount />
          <InfoRow
            label="Budget consommé"
            value={projet.budgetConsomme}
            isAmount
          />
        </View>

        {/* Description */}
        {projet.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DESCRIPTION</Text>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{projet.description}</Text>
            </View>
          </View>
        )}

        {/* Équipe */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              ÉQUIPE ({projet.equipe.length})
            </Text>
          </View>
          {projet.equipe.map((membre, index) => (
            <View key={index} style={styles.membreCard}>
              <View style={styles.membreAvatar}>
                <Text style={styles.membreInitials}>
                  {membre.nom
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Text>
              </View>
              <View style={styles.membreInfo}>
                <Text style={styles.membreNom}>{membre.nom}</Text>
                <Text style={styles.membreRole}>{membre.role}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tâches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              TÂCHES ({projet.taches.length})
            </Text>
            <TouchableOpacity onPress={handleAddTask}>
              <Ionicons name="add-circle" size={24} color="#990000" />
            </TouchableOpacity>
          </View>
          {projet.taches.map((tache, index) => (
            <View key={index} style={styles.tacheCard}>
              <View style={styles.tacheHeader}>
                <Text style={styles.tacheNom}>{tache.nom}</Text>
                <View
                  style={[
                    styles.tacheStatutBadge,
                    {
                      backgroundColor: getStatutStyle(tache.statut)
                        .backgroundColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tacheStatutText,
                      { color: getStatutStyle(tache.statut).color },
                    ]}
                  >
                    {tache.statut}
                  </Text>
                </View>
              </View>
              <View style={styles.tacheProgress}>
                <View style={styles.tacheProgressBar}>
                  <View
                    style={[
                      styles.tacheProgressFill,
                      { width: `${tache.progression}%` },
                    ]}
                  />
                </View>
                <Text style={styles.tacheProgressText}>
                  {tache.progression}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Risques */}
        {projet.risques && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RISQUES & ALERTES</Text>
            <View style={styles.risquesContainer}>
              <Ionicons name="warning" size={20} color="#F39C12" />
              <Text style={styles.risquesText}>{projet.risques}</Text>
            </View>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
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

  // En-tête projet
  projetHeader: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
    marginRight: 10,
  },
  nom: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  client: {
    fontSize: 16,
    color: "#666",
  },
  statutBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statutText: {
    fontSize: 12,
    fontWeight: "600",
  },
  progressSection: {
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: "#666",
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#990000",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#E8E8E8",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#990000",
    borderRadius: 5,
  },
  prioriteContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  prioriteText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },

  // Actions
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 20,
    marginBottom: 20,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },

  // Sections
  section: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
    paddingTop: 16,
    paddingBottom: 12,
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  amountText: {
    color: "#990000",
    fontWeight: "600",
  },

  // Description
  descriptionContainer: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  // Équipe
  membreCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  membreAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#990000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  membreInitials: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  membreInfo: {
    flex: 1,
  },
  membreNom: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  membreRole: {
    fontSize: 13,
    color: "#666",
  },

  // Tâches
  tacheCard: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  tacheHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  tacheNom: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  tacheStatutBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tacheStatutText: {
    fontSize: 10,
    fontWeight: "600",
  },
  tacheProgress: {
    flexDirection: "row",
    alignItems: "center",
  },
  tacheProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E8E8E8",
    borderRadius: 3,
    marginRight: 8,
    overflow: "hidden",
  },
  tacheProgressFill: {
    height: "100%",
    backgroundColor: "#3498DB",
    borderRadius: 3,
  },
  tacheProgressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    width: 35,
  },

  // Risques
  risquesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  risquesText: {
    flex: 1,
    fontSize: 14,
    color: "#856404",
    marginLeft: 10,
    lineHeight: 20,
  },

  bottomSpace: {
    height: 40,
  },
});
