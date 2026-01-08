import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import crmService from "../../services/crmService";

export default function CRMDetailScreen({ route, navigation }) {
  const { leadId } = route.params;
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeadDetail();
  }, [leadId]);

  const loadLeadDetail = async () => {
    try {
      setLoading(true);
      const data = await crmService.getLeadById(leadId);
      setLead(data);
    } catch (error) {
      console.error("Erreur lors du chargement du détail de l'opportunité:", error);
      Alert.alert(
        "Erreur",
        "Impossible de charger les détails de l'opportunité",
        [{ text: "Retour", onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleEmail = (email) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const getStageColor = (stage) => {
    const stageName = stage?.display_name?.toLowerCase() || "";

    if (stageName.includes("nouveau") || stageName.includes("new")) return "#3498DB";
    if (stageName.includes("qualifi") || stageName.includes("qualified")) return "#F39C12";
    if (stageName.includes("proposition") || stageName.includes("proposal")) return "#E74C3C";
    if (stageName.includes("gagn") || stageName.includes("won")) return "#27AE60";
    if (stageName.includes("perdu") || stageName.includes("lost")) return "#95A5A6";

    return "#7F8C8D";
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 75) return "#27AE60";
    if (probability >= 50) return "#F39C12";
    if (probability >= 25) return "#E67E22";
    return "#E74C3C";
  };

  const formatCurrency = (value, currency) => {
    if (!value) return "0";
    const symbol = currency?.display_name || "XOF";
    return `${value.toLocaleString()} ${symbol}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#990000" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!lead) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Ionicons name="alert-circle-outline" size={60} color="#ccc" />
        <Text style={styles.emptyText}>Opportunité non trouvée</Text>
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
        <Text style={styles.headerTitle}>Détails Opportunité</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Carte principale */}
        <View style={styles.mainCard}>
          <Text style={styles.leadName}>{lead.name}</Text>

          {lead.partner_name && (
            <View style={styles.partnerRow}>
              <Ionicons name="business-outline" size={18} color="#666" />
              <Text style={styles.partnerName}>{lead.partner_name}</Text>
            </View>
          )}

          {/* Étape et priorité */}
          <View style={styles.statusRow}>
            <View
              style={[
                styles.stageBadge,
                { backgroundColor: getStageColor(lead.stage_id) },
              ]}
            >
              <Text style={styles.stageText}>
                {lead.stage_id?.display_name || "N/A"}
              </Text>
            </View>

            {lead.priority && lead.priority !== "0" && (
              <View style={styles.priorityBadge}>
                <Ionicons name="flag" size={14} color="#E74C3C" />
                <Text style={styles.priorityText}>
                  {lead.priority === "1" ? "Basse" :
                   lead.priority === "2" ? "Moyenne" : "Haute"}
                </Text>
              </View>
            )}
          </View>

          {/* Valeur et probabilité */}
          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Valeur attendue</Text>
              <Text style={styles.metricValue}>
                {formatCurrency(lead.expected_revenue, lead.company_currency)}
              </Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Probabilité</Text>
              <View style={styles.probabilityRow}>
                <View
                  style={[
                    styles.probabilityCircle,
                    { backgroundColor: getProbabilityColor(lead.probability) },
                  ]}
                >
                  <Text style={styles.probabilityText}>
                    {Math.round(lead.probability)}%
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Actions rapides */}
          {(lead.phone || lead.email_from || lead.mobile) && (
            <View style={styles.quickActions}>
              {lead.phone && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleCall(lead.phone)}
                >
                  <Ionicons name="call" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Appeler</Text>
                </TouchableOpacity>
              )}
              {lead.email_from && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEmail(lead.email_from)}
                >
                  <Ionicons name="mail" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Email</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Informations du contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS CONTACT</Text>

          {lead.contact_name && (
            <InfoRow
              icon="person-outline"
              label="Nom du contact"
              value={lead.contact_name}
            />
          )}

          {lead.function && (
            <InfoRow icon="briefcase-outline" label="Fonction" value={lead.function} />
          )}

          {lead.phone && (
            <InfoRow
              icon="call-outline"
              label="Téléphone"
              value={lead.phone}
              onPress={() => handleCall(lead.phone)}
            />
          )}

          {lead.mobile && (
            <InfoRow
              icon="phone-portrait-outline"
              label="Mobile"
              value={lead.mobile}
              onPress={() => handleCall(lead.mobile)}
            />
          )}

          {lead.email_from && (
            <InfoRow
              icon="mail-outline"
              label="Email"
              value={lead.email_from}
              onPress={() => handleEmail(lead.email_from)}
            />
          )}

          {lead.website && (
            <InfoRow
              icon="globe-outline"
              label="Site web"
              value={lead.website}
              onPress={() => Linking.openURL(lead.website)}
            />
          )}
        </View>

        {/* Adresse */}
        {(lead.street || lead.city || lead.country_id?.display_name) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ADRESSE</Text>

            {lead.street && (
              <InfoRow icon="home-outline" label="Rue" value={lead.street} />
            )}

            {lead.city && (
              <InfoRow icon="location-outline" label="Ville" value={lead.city} />
            )}

            {lead.zip && (
              <InfoRow icon="mail-outline" label="Code postal" value={lead.zip} />
            )}

            {lead.country_id?.display_name && (
              <InfoRow
                icon="flag-outline"
                label="Pays"
                value={lead.country_id.display_name}
              />
            )}
          </View>
        )}

        {/* Détails de l'opportunité */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DÉTAILS OPPORTUNITÉ</Text>

          {lead.type && (
            <InfoRow
              icon="albums-outline"
              label="Type"
              value={lead.type === "lead" ? "Piste" : "Opportunité"}
            />
          )}

          {lead.user_id?.display_name && (
            <InfoRow
              icon="person-outline"
              label="Responsable"
              value={lead.user_id.display_name}
            />
          )}

          {lead.team_id?.display_name && (
            <InfoRow
              icon="people-outline"
              label="Équipe commerciale"
              value={lead.team_id.display_name}
            />
          )}

          {lead.source_id?.display_name && (
            <InfoRow
              icon="pricetag-outline"
              label="Source"
              value={lead.source_id.display_name}
            />
          )}

          {lead.campaign_id?.display_name && (
            <InfoRow
              icon="megaphone-outline"
              label="Campagne"
              value={lead.campaign_id.display_name}
            />
          )}

          {lead.medium_id?.display_name && (
            <InfoRow
              icon="radio-outline"
              label="Medium"
              value={lead.medium_id.display_name}
            />
          )}
        </View>

        {/* Dates importantes */}
        {(lead.date_deadline || lead.date_open || lead.date_closed) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DATES</Text>

            {lead.date_deadline && (
              <InfoRow
                icon="calendar-outline"
                label="Date limite"
                value={lead.date_deadline}
              />
            )}

            {lead.date_open && (
              <InfoRow
                icon="calendar-outline"
                label="Date d'ouverture"
                value={new Date(lead.date_open).toLocaleDateString()}
              />
            )}

            {lead.date_closed && (
              <InfoRow
                icon="calendar-outline"
                label="Date de clôture"
                value={new Date(lead.date_closed).toLocaleDateString()}
              />
            )}

            {lead.day_open !== undefined && (
              <InfoRow
                icon="time-outline"
                label="Jours ouverts"
                value={`${lead.day_open} jours`}
              />
            )}
          </View>
        )}

        {/* Description */}
        {lead.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DESCRIPTION</Text>
            <Text style={styles.descriptionText}>{lead.description}</Text>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

// Composant pour afficher une ligne d'information
const InfoRow = ({ icon, label, value, onPress }) => (
  <TouchableOpacity
    style={styles.infoRow}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.infoLeft}>
      <Ionicons name={icon} size={20} color="#666" style={styles.infoIcon} />
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
    {onPress && <Ionicons name="chevron-forward" size={20} color="#999" />}
  </TouchableOpacity>
);

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
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#999",
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

  // Carte principale
  mainCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  leadName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  partnerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  partnerName: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },

  // Statut
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  stageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stageText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#FADBD8",
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E74C3C",
    marginLeft: 4,
  },

  // Métriques
  metricsRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 16,
  },
  metricBox: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
  },
  metricLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#990000",
  },
  probabilityRow: {
    alignItems: "flex-start",
  },
  probabilityCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  probabilityText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },

  // Actions rapides
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#990000",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Section
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
    paddingBottom: 16,
    letterSpacing: 0.5,
  },

  // Info row
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  // Description
  descriptionText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    paddingBottom: 16,
  },

  bottomSpace: {
    height: 40,
  },
});
