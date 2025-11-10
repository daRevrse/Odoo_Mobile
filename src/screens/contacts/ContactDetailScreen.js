import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { contactService } from "../../services";

export default function ContactDetailScreen({ route, navigation }) {
  const { contact } = route.params || {};
  const [deleting, setDeleting] = useState(false);

  // Construire l'URL de l'avatar depuis Odoo ou utiliser un avatar par défaut
  const avatarUri = contact?.imageUrl
    ? contact.imageUrl
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        contact?.name || "Contact"
      )}&size=200&background=990000&color=fff`;

  const handleCall = () => {
    const phone = contact?.phone || contact?.mobile;
    if (!phone) {
      Alert.alert("Erreur", "Aucun numéro de téléphone disponible");
      return;
    }
    Alert.alert("Appel", `Appeler ${contact.name} ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Appeler",
        onPress: () => Linking.openURL(`tel:${phone}`),
      },
    ]);
  };

  const handleEmail = () => {
    if (!contact?.email) {
      Alert.alert("Erreur", "Aucune adresse email disponible");
      return;
    }
    Linking.openURL(`mailto:${contact.email}`);
  };

  const handleMessage = () => {
    Alert.alert("Information", "Fonctionnalité de messagerie à venir");
  };

  const handleWhatsApp = () => {
    const phone = contact?.mobile || contact?.phone;
    if (!phone) {
      Alert.alert("Erreur", "Aucun numéro de téléphone disponible");
      return;
    }
    const phoneNumber = phone.replace(/[^0-9]/g, "");
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
  };

  const handleWebsite = () => {
    if (contact?.website) {
      const url = contact.website.startsWith("http")
        ? contact.website
        : `https://${contact.website}`;
      Linking.openURL(url);
    }
  };

  const handleEdit = () => {
    navigation.navigate("AddContact", { contact });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Supprimer le contact",
      `Voulez-vous vraiment supprimer ${contact.name} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await contactService.deleteContact(contact.id);
              Alert.alert("Succès", "Contact supprimé avec succès");
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                "Erreur",
                error.message || "Impossible de supprimer le contact"
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  // Déterminer le type de contact basé sur les données Odoo
  const getContactType = () => {
    if (contact?.is_company) {
      return "Entreprise";
    }
    if (contact?.customer_rank > 0) {
      return "Client";
    }
    if (contact?.supplier_rank > 0) {
      return "Fournisseur";
    }
    return "Contact";
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Client":
        return "#3498DB";
      case "Fournisseur":
        return "#27AE60";
      case "Entreprise":
        return "#F39C12";
      default:
        return "#999";
    }
  };

  // Vérifier si le contact a des données
  if (!contact) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Contact introuvable</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const contactType = getContactType();

  const InfoRow = ({ icon, label, value, onPress }) => (
    <TouchableOpacity
      style={styles.infoRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.infoLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#990000" />
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value || "Non renseigné"}</Text>
        </View>
      </View>
      {onPress && <Ionicons name="chevron-forward" size={20} color="#999" />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du contact</Text>
        <TouchableOpacity onPress={handleEdit}>
          <Ionicons name="create-outline" size={24} color="#990000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Section Profil */}
        <View style={styles.profileSection}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <Text style={styles.name}>{contact.name || "Sans nom"}</Text>
          {contact.function && (
            <Text style={styles.entreprise}>{contact.function}</Text>
          )}
          {contact.parent_id && contact.parent_id[1] && (
            <Text style={styles.entreprise}>{contact.parent_id[1]}</Text>
          )}
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: `${getTypeColor(contactType)}20` },
            ]}
          >
            <Text
              style={[styles.typeText, { color: getTypeColor(contactType) }]}
            >
              {contactType}
            </Text>
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <View style={[styles.actionIcon, { backgroundColor: "#27AE6020" }]}>
              <Ionicons name="call" size={24} color="#27AE60" />
            </View>
            <Text style={styles.actionText}>Appeler</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleMessage}>
            <View style={[styles.actionIcon, { backgroundColor: "#F9871520" }]}>
              <Ionicons name="chatbubble" size={24} color="#F98715" />
            </View>
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
            <View style={[styles.actionIcon, { backgroundColor: "#3498DB20" }]}>
              <Ionicons name="mail" size={24} color="#3498DB" />
            </View>
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleWhatsApp}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#25D36620" }]}>
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            </View>
            <Text style={styles.actionText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Informations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS DE CONTACT</Text>
          {(contact.phone || contact.mobile) && (
            <>
              {contact.phone && (
                <InfoRow
                  icon="call-outline"
                  label="Téléphone"
                  value={contact.phone}
                  onPress={handleCall}
                />
              )}
              {contact.mobile && (
                <InfoRow
                  icon="phone-portrait-outline"
                  label="Mobile"
                  value={contact.mobile}
                  onPress={handleCall}
                />
              )}
            </>
          )}
          {contact.email && (
            <InfoRow
              icon="mail-outline"
              label="Email"
              value={contact.email}
              onPress={handleEmail}
            />
          )}
          {contact.website && (
            <InfoRow
              icon="globe-outline"
              label="Site web"
              value={contact.website}
              onPress={handleWebsite}
            />
          )}
          {!contact.phone &&
            !contact.mobile &&
            !contact.email &&
            !contact.website && (
              <Text style={styles.noDataText}>
                Aucune information de contact disponible
              </Text>
            )}
        </View>

        {/* Localisation */}
        {(contact.street ||
          contact.city ||
          contact.zip ||
          contact.state_id ||
          contact.country_id) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LOCALISATION</Text>
            {contact.street && (
              <InfoRow
                icon="location-outline"
                label="Adresse"
                value={contact.street}
              />
            )}
            {(contact.zip || contact.city) && (
              <InfoRow
                icon="business-outline"
                label="Ville"
                value={`${contact.zip || ""} ${contact.city || ""}`.trim()}
              />
            )}
            {contact.state_id && contact.state_id[1] && (
              <InfoRow
                icon="map-outline"
                label="Région"
                value={contact.state_id[1]}
              />
            )}
            {contact.country_id && contact.country_id[1] && (
              <InfoRow
                icon="flag-outline"
                label="Pays"
                value={contact.country_id[1]}
              />
            )}
          </View>
        )}

        {/* Informations additionnelles */}
        {(contact.vat || contact.ref || contact.comment) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INFORMATIONS ADDITIONNELLES</Text>
            {contact.vat && (
              <InfoRow
                icon="document-text-outline"
                label="N° TVA"
                value={contact.vat}
              />
            )}
            {contact.ref && (
              <InfoRow
                icon="pricetag-outline"
                label="Référence"
                value={contact.ref}
              />
            )}
            {contact.comment && (
              <View style={styles.commentSection}>
                <Text style={styles.commentLabel}>Notes :</Text>
                <Text style={styles.commentText}>{contact.comment}</Text>
              </View>
            )}
          </View>
        )}

        {/* Bouton supprimer */}
        <TouchableOpacity
          style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#E74C3C" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="#E74C3C" />
              <Text style={styles.deleteButtonText}>Supprimer le contact</Text>
            </>
          )}
        </TouchableOpacity>

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

  // Profil
  profileSection: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  entreprise: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  // Activité
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: "#999",
  },

  // Delete button
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FADBD8",
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    color: "#E74C3C",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 10,
  },

  bottomSpace: {
    height: 40,
  },

  // Error state
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#999",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#990000",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // No data text
  noDataText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    paddingVertical: 16,
    textAlign: "center",
  },

  // Comment section
  commentSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  commentLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 8,
  },
  commentText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
});
