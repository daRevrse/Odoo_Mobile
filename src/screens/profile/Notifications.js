import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Notifications({ navigation }) {
  const [settings, setSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    messages: true,
    leads: true,
    tasks: true,
    meetings: true,
    documents: false,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const SettingItem = ({ icon, title, description, settingKey }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="#990000" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {description && (
            <Text style={styles.settingDescription}>{description}</Text>
          )}
        </View>
      </View>
      <Switch
        value={settings[settingKey]}
        onValueChange={() => toggleSetting(settingKey)}
        trackColor={{ false: "#E0E0E0", true: "#99000050" }}
        thumbColor={settings[settingKey] ? "#990000" : "#f4f3f4"}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Canaux de notification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CANAUX DE NOTIFICATION</Text>

          <SettingItem
            icon="notifications"
            title="Notifications push"
            description="Recevoir des notifications sur l'appareil"
            settingKey="pushEnabled"
          />

          <SettingItem
            icon="mail"
            title="Notifications email"
            description="Recevoir des notifications par email"
            settingKey="emailEnabled"
          />

          <SettingItem
            icon="chatbox"
            title="Notifications SMS"
            description="Recevoir des notifications par SMS"
            settingKey="smsEnabled"
          />
        </View>

        {/* Types de notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TYPES DE NOTIFICATIONS</Text>

          <SettingItem
            icon="chatbubbles"
            title="Messages"
            description="Nouveaux messages et discussions"
            settingKey="messages"
          />

          <SettingItem
            icon="briefcase"
            title="Opportunités CRM"
            description="Nouvelles opportunités et mises à jour"
            settingKey="leads"
          />

          <SettingItem
            icon="checkbox"
            title="Tâches"
            description="Tâches assignées et échéances"
            settingKey="tasks"
          />

          <SettingItem
            icon="calendar"
            title="Réunions"
            description="Invitations et rappels de réunion"
            settingKey="meetings"
          />

          <SettingItem
            icon="document-text"
            title="Documents"
            description="Nouveaux documents partagés"
            settingKey="documents"
          />
        </View>

        {/* Préférences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRÉFÉRENCES</Text>

          <SettingItem
            icon="volume-high"
            title="Son"
            description="Jouer un son pour les notifications"
            settingKey="soundEnabled"
          />

          <SettingItem
            icon="phone-portrait"
            title="Vibration"
            description="Vibrer pour les notifications"
            settingKey="vibrationEnabled"
          />
        </View>

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
  section: {
    backgroundColor: "#fff",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
    paddingTop: 16,
    paddingBottom: 16,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
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
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: "#999",
  },
  bottomSpace: {
    height: 40,
  },
});
