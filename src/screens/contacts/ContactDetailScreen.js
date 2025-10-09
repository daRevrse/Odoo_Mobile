import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ContactDetailScreen({ route, navigation }) {
  const { contact } = route.params || {
    contact: {
      name: "Contact",
      email: "contact@example.com",
      telephone: "+228 90 00 00 00",
      entreprise: "Entreprise",
      image: "https://i.pravatar.cc/150?img=1",
      type: "Client",
      adresse: "123 Avenue de la République",
      ville: "Lomé",
      pays: "Togo",
      site: "www.example.com",
    },
  };

  const handleCall = () => {
    Alert.alert("Appel", `Appeler ${contact.name} ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Appeler",
        onPress: () => Linking.openURL(`tel:${contact.telephone}`),
      },
    ]);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${contact.email}`);
  };

  const handleMessage = () => {
    navigation.navigate("Chat", {
      conversation: {
        nom: contact.name,
        image: contact.image,
      },
    });
  };

  const handleWhatsApp = () => {
    const phone = contact.telephone.replace(/[^0-9]/g, "");
    Linking.openURL(`whatsapp://send?phone=${phone}`);
  };

  const handleWebsite = () => {
    if (contact.site) {
      const url = contact.site.startsWith("http")
        ? contact.site
        : `https://${contact.site}`;
      Linking.openURL(url);
    }
  };

  const handleEdit = () => {
    navigation.navigate("AddContact", { contact });
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer le contact",
      `Voulez-vous vraiment supprimer ${contact.name} ?`,
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

  const getTypeColor = (type) => {
    switch (type) {
      case "Client":
        return "#3498DB";
      case "Fournisseur":
        return "#27AE60";
      case "Partenaire":
        return "#F39C12";
      default:
        return "#999";
    }
  };

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
          <Image source={{ uri: contact.image }} style={styles.avatar} />
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.entreprise}>{contact.entreprise}</Text>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: `${getTypeColor(contact.type)}20` },
            ]}
          >
            <Text
              style={[styles.typeText, { color: getTypeColor(contact.type) }]}
            >
              {contact.type}
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
          <InfoRow
            icon="call-outline"
            label="Téléphone"
            value={contact.telephone}
            onPress={handleCall}
          />
          <InfoRow
            icon="mail-outline"
            label="Email"
            value={contact.email}
            onPress={handleEmail}
          />
          <InfoRow
            icon="globe-outline"
            label="Site web"
            value={contact.site}
            onPress={contact.site ? handleWebsite : null}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LOCALISATION</Text>
          <InfoRow
            icon="location-outline"
            label="Adresse"
            value={contact.adresse}
          />
          <InfoRow
            icon="location-outline"
            label="Ville"
            value={contact.ville}
          />
          <InfoRow icon="flag-outline" label="Pays" value={contact.pays} />
        </View>

        {/* Activité récente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACTIVITÉ RÉCENTE</Text>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="calendar-outline" size={16} color="#3498DB" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Réunion planifiée</Text>
              <Text style={styles.activityDate}>Demain à 10:00</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons
                name="document-text-outline"
                size={16}
                color="#27AE60"
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Devis envoyé</Text>
              <Text style={styles.activityDate}>Il y a 2 jours</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="call-outline" size={16} color="#F39C12" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Dernier appel</Text>
              <Text style={styles.activityDate}>Il y a 5 jours</Text>
            </View>
          </View>
        </View>

        {/* Bouton supprimer */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#E74C3C" />
          <Text style={styles.deleteButtonText}>Supprimer le contact</Text>
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
  deleteButtonText: {
    color: "#E74C3C",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 10,
  },

  bottomSpace: {
    height: 40,
  },
});
