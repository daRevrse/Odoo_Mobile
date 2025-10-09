import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function ProfileScreen({ navigation }) {
  const handleEditProfile = () => navigation.navigate("EditProfile");
  const handleLanguagePress = () => navigation.navigate("Langues");
  const handleSecurityPress = () => navigation.navigate("Security");
  const handleNotificationsPress = () => navigation.navigate("Notifications");
  const handleTimeZonePress = () => navigation.navigate("FuseauHoraire");
  const handleLogout = () => console.log("Logout");

  const MenuOption = ({ icon, title, onPress, isPage }) => (
    <TouchableOpacity style={styles.menuOption} onPress={onPress}>
      <View style={styles.menuContent}>
        <Icon name={icon} size={24} color="#990000" style={styles.menuIcon} />
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Icon
        name={isPage ? "chevron-forward" : "chevron-down"}
        size={20}
        color="#ccc"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.photoIconButton}>
              <Icon name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>GASSOU Gilles</Text>
            <Text style={styles.userEmail}>koffjean@gmail.com</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editButtonText}>Edit profil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options avec le style de votre Sheet */}
        <View style={styles.menuSection}>
          <MenuOption
            icon="globe-outline"
            title="Langues"
            onPress={handleLanguagePress}
          />
          <MenuOption
            icon="shield-checkmark-outline"
            title="Sécurité du compte"
            onPress={handleSecurityPress}
            isPage={true}
          />
          <MenuOption
            icon="notifications-outline"
            title="Notifications"
            onPress={handleNotificationsPress}
          />
          <MenuOption
            icon="time-outline"
            title="Fuseau horaire"
            onPress={handleTimeZonePress}
          />
        </View>

        {/* Bouton Déconnexion avec votre style */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    // alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  photoIconButton: {
    position: "absolute",
    bottom: 10,
    right: 20,
    backgroundColor: "#990000",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInfo: {
    alignItems: "flex-start",
    marginBottom: 20,
    flex: 1,
  },
  userName: {
    fontSize: 25,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  editButton: {
    backgroundColor: "#990000",
    marginTop: 10,
    paddingHorizontal: 24,
    paddingVertical: 5,
    borderRadius: 6,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  menuSection: {
    backgroundColor: "#fff",
    marginBottom: 32,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    marginBottom: 40,
  },
  menuContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#990000",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
