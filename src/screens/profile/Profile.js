import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { authService } from "../../services";

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const result = await authService.getUserProfile();

      if (result.success) {
        setProfile(result.profile);
      } else {
        Alert.alert(
          "Erreur",
          result.error || "Impossible de charger le profil"
        );
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => navigation.navigate("EditProfile");
  const handleLanguagePress = () => navigation.navigate("Langues");
  const handleSecurityPress = () => navigation.navigate("Security");
  const handleNotificationsPress = () => navigation.navigate("Notifications");
  const handleTimeZonePress = () => navigation.navigate("FuseauHoraire");

  const handleLogout = async () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          try {
            const result = await authService.logout();

            if (result.success) {
              // Rediriger vers l'écran de connexion
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } else {
              Alert.alert(
                "Erreur",
                result.error || "Erreur lors de la déconnexion"
              );
            }
          } catch (error) {
            Alert.alert("Erreur", "Une erreur s'est produite");
          }
        },
      },
    ]);
  };

  const MenuOption = ({ icon, title, onPress, isPage }) => (
    <TouchableOpacity style={styles.menuOption} onPress={onPress}>
      <View style={styles.menuContent}>
        <Ionicons
          name={icon}
          size={24}
          color="#990000"
          style={styles.menuIcon}
        />
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Ionicons
        name={isPage ? "chevron-forward" : "chevron-down"}
        size={20}
        color="#ccc"
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#990000" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  profile?.image_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile?.name || "User"
                  )}&size=150&background=990000&color=fff`,
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.photoIconButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>
              {profile?.name || "Utilisateur"}
            </Text>
            <Text style={styles.userEmail}>
              {profile?.email || profile?.login || "N/A"}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editButtonText}>Edit profil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options */}
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

        {/* Bouton Déconnexion */}
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
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
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
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  photoIconButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#990000",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: "#990000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  menuSection: {
    marginTop: 24,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuContent: {
    flexDirection: "row",
    alignItems: "center",
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
    marginTop: 32,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 32,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
