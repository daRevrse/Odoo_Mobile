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

export default function VenteDetailScreen({ route, navigation }) {
  const { vente } = route.params || {
    vente: {
      numero: "VEN-2025-001",
      client: "Jean Dupont",
      montant: "1 500 000 FCFA",
      montantHT: "1 271 186 FCFA",
      tva: "228 814 FCFA",
      date: "05/10/2025",
      dateEcheance: "05/11/2025",
      statut: "Payée",
      moyenPaiement: "Virement bancaire",
      reference: "REF-2025-001",
      articles: [
        {
          nom: "Service consulting",
          quantite: 10,
          prixUnitaire: "100 000 FCFA",
          total: "1 000 000 FCFA",
        },
        {
          nom: "Formation équipe",
          quantite: 1,
          prixUnitaire: "500 000 FCFA",
          total: "500 000 FCFA",
        },
      ],
      notes: "Client prioritaire - Règlement dans les délais",
    },
  };

  const handleEdit = () => {
    navigation.navigate("AddVente", { vente });
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer la vente",
      `Voulez-vous vraiment supprimer ${vente.numero} ?`,
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

  const handlePrint = () => {
    Alert.alert("Imprimer", "Génération du PDF en cours...");
  };

  const handleSendEmail = () => {
    Alert.alert("Envoyer par email", "Fonctionnalité en développement");
  };

  const getStatutStyle = (statut) => {
    switch (statut) {
      case "Payée":
        return { backgroundColor: "#D5F4E6", color: "#27AE60" };
      case "En attente":
        return { backgroundColor: "#FCF3CF", color: "#F39C12" };
      case "En retard":
        return { backgroundColor: "#FADBD8", color: "#E74C3C" };
      default:
        return { backgroundColor: "#F0F0F0", color: "#999" };
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
        <Text style={styles.headerTitle}>Détails de la vente</Text>
        <TouchableOpacity onPress={handleEdit}>
          <Ionicons name="create-outline" size={24} color="#990000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête vente */}
        <View style={styles.venteHeader}>
          <View style={styles.numeroContainer}>
            <Text style={styles.numero}>{vente.numero}</Text>
            <View
              style={[
                styles.statutBadge,
                {
                  backgroundColor: getStatutStyle(vente.statut).backgroundColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.statutText,
                  { color: getStatutStyle(vente.statut).color },
                ]}
              >
                {vente.statut}
              </Text>
            </View>
          </View>
          <Text style={styles.client}>{vente.client}</Text>
          <Text style={styles.montantTotal}>{vente.montant}</Text>
        </View>

        {/* Actions rapides */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handlePrint}>
            <View style={[styles.actionIcon, { backgroundColor: "#E74C3C20" }]}>
              <Ionicons name="print-outline" size={24} color="#E74C3C" />
            </View>
            <Text style={styles.actionText}>Imprimer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSendEmail}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#3498DB20" }]}>
              <Ionicons name="mail-outline" size={24} color="#3498DB" />
            </View>
            <Text style={styles.actionText}>Envoyer</Text>
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
          <InfoRow label="Date de vente" value={vente.date} />
          <InfoRow label="Date d'échéance" value={vente.dateEcheance} />
          <InfoRow label="Référence" value={vente.reference} />
          <InfoRow label="Moyen de paiement" value={vente.moyenPaiement} />
        </View>

        {/* Articles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ARTICLES</Text>
          {vente.articles.map((article, index) => (
            <View key={index} style={styles.articleCard}>
              <View style={styles.articleHeader}>
                <Text style={styles.articleNom}>{article.nom}</Text>
                <Text style={styles.articleTotal}>{article.total}</Text>
              </View>
              <View style={styles.articleDetails}>
                <Text style={styles.articleDetail}>
                  Quantité: {article.quantite}
                </Text>
                <Text style={styles.articleDetail}>
                  Prix unitaire: {article.prixUnitaire}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Calculs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MONTANTS</Text>
          <InfoRow label="Montant HT" value={vente.montantHT} />
          <InfoRow label="TVA (18%)" value={vente.tva} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL TTC</Text>
            <Text style={styles.totalValue}>{vente.montant}</Text>
          </View>
        </View>

        {/* Notes */}
        {vente.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NOTES</Text>
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>{vente.notes}</Text>
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

  // En-tête vente
  venteHeader: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  numeroContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  numero: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
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
  client: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  montantTotal: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#990000",
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

  // Articles
  articleCard: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  articleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  articleNom: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  articleTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#990000",
  },
  articleDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  articleDetail: {
    fontSize: 13,
    color: "#666",
  },

  // Total
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#990000",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#990000",
  },

  // Notes
  notesContainer: {
    backgroundColor: "#FFF5F5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  notesText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  bottomSpace: {
    height: 40,
  },
});
