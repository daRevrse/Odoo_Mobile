import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {
  const handleEditProfile = () => navigation.navigate("EditProfile");
  const handleSecurityPress = () => navigation.navigate("Security");

  const handleLanguagePress = () => {
    Alert.alert("Langues", "Fonctionnalité en développement");
  };

  const handleNotificationsPress = () => {
    Alert.alert("Notifications", "Fonctionnalité en développement");
  };

  const handleTimeZonePress = () => {
    Alert.alert("Fuseau horaire", "Fonctionnalité en développement");
  };

  const handleThemePress = () => {
    Alert.alert("Thème", "Fonctionnalité en développement");
  };

  const handlePrivacyPress = () => {
    Alert.alert("Confidentialité", "Fonctionnalité en développement");
  };

  const handleHelpPress = () => {
    Alert.alert("Aide & Support", "Fonctionnalité en développement");
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: () =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          }),
      },
    ]);
  };

  const MenuSection = ({ title, children }) => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const MenuOption = ({ icon, title, onPress, badge, isLast }) => (
    <TouchableOpacity
      style={[styles.menuOption, !isLast && styles.menuOptionBorder]}
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color="#990000" />
        </View>
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <View style={styles.menuRight}>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="#990000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Section Profil */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
              }}
              style={styles.profileImage}
            />
            <View style={styles.statusIndicator} />
          </View>

          <Text style={styles.userName}>GASSOU Gilles</Text>
          <Text style={styles.userEmail}>koffjean@gmail.com</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Projets</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Tâches</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>89</Text>
              <Text style={styles.statLabel}>Contacts</Text>
            </View>
          </View>
        </View>

        {/* Section Compte */}
        <MenuSection title="COMPTE">
          <MenuOption
            icon="person-outline"
            title="Modifier le profil"
            onPress={handleEditProfile}
          />
          <MenuOption
            icon="shield-checkmark-outline"
            title="Sécurité du compte"
            onPress={handleSecurityPress}
          />
          <MenuOption
            icon="notifications-outline"
            title="Notifications"
            badge="3"
            onPress={handleNotificationsPress}
            isLast
          />
        </MenuSection>

        {/* Section Préférences */}
        <MenuSection title="PRÉFÉRENCES">
          <MenuOption
            icon="globe-outline"
            title="Langue"
            onPress={handleLanguagePress}
          />
          <MenuOption
            icon="time-outline"
            title="Fuseau horaire"
            onPress={handleTimeZonePress}
          />
          <MenuOption
            icon="color-palette-outline"
            title="Thème"
            onPress={handleThemePress}
            isLast
          />
        </MenuSection>

        {/* Section Support */}
        <MenuSection title="SUPPORT">
          <MenuOption
            icon="lock-closed-outline"
            title="Confidentialité"
            onPress={handlePrivacyPress}
          />
          <MenuOption
            icon="help-circle-outline"
            title="Aide & Support"
            onPress={handleHelpPress}
          />
          <MenuOption
            icon="information-circle-outline"
            title="À propos"
            onPress={() => Alert.alert("Version", "Odoo Mobile v1.0.0")}
            isLast
          />
        </MenuSection>

        {/* Bouton Déconnexion */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#E74C3C" />
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  editButton: {
    padding: 8,
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
  avatarWrapper: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#27AE60",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#990000",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E8E8E8",
  },

  // Menu
  menuSection: {
    backgroundColor: "#fff",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
    paddingTop: 16,
    paddingBottom: 12,
    letterSpacing: 0.5,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  menuOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  menuLeft: {
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
  menuText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#990000",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },

  // Déconnexion
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FADBD8",
  },
  logoutButtonText: {
    color: "#E74C3C",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 10,
  },

  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
});
