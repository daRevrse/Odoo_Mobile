import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import apiConfigService from "../services/apiConfigService";

import ServerConfigScreen from "../screens/auth/ServerConfigScreen";
import DatabaseSelectionScreen from "../screens/auth/DatabaseSelectionScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ConfigLoadingScreen from "../screens/auth/ConfigLoadingScreen";

import HomeScreen from "../screens/home/HomeScreen";
import ReorganizeModulesScreen from "../screens/home/ReorganizeModulesScreen";

import MessagesScreen from "../screens/messages/MessagesScreen";
import ChatScreen from "../screens/messages/ChatScreen";

import ContactsScreen from "../screens/contacts/ContactsScreen";
import AddContactScreen from "../screens/contacts/AddContactScreen";
import ContactDetailScreen from "../screens/contacts/ContactDetailScreen";

import VentesScreen from "../screens/ventes/VentesScreen";

import CalendarScreen from "../screens/calendar/CalendarScreen";
import CongésScreen from "../screens/conges/CongésScreen";
import CreateEventScreen from "../screens/calendar/CreateEventScreen";
import AbsencesScreen from "../screens/absences/AbsencesScreen";
import NotesScreen from "../screens/notes/NotesScreen";
import DocumentsScreen from "../screens/documents/DocumentsScreen";
import Profile from "../screens/profile/Profile";
import EditProfile from "../screens/profile/EditProfile";
import LanguageSelectionScreen from "../screens/profile/LanguageSelectionScreen";
import Notifications from "../screens/profile/Notifications";
import FuseauHoraire from "../screens/profile/FuseauHoraire";
import EmployésScreen from "../screens/employees/EmployésScreen";
import EmployeeDetailScreen from "../screens/employees/EmployeeDetailScreen";
import AddEmployeeScreen from "../screens/employees/AddEmployeeScreen";
import ProjetScreen from "../screens/projects/ProjetScreen";
import CRMScreen from "../screens/crm/CRMScreen";
import CRMDetailScreen from "../screens/crm/CRMDetailScreen";
import AddLeadScreen from "../screens/crm/AddLeadScreen";
import StockScreen from "../screens/stock/StockScreen";
import PrésencesScreen from "../screens/presences/PrésencesScreen";
import Security from "../screens/profile/Security";
import ProjetDetailScreen from "../screens/projects/ProjetDetailScreen";
import LoginScreen from "./../screens/auth/LoginScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApiConfig();
  }, []);

  const checkApiConfig = async () => {
    try {
      // Vérifier si une URL API est déjà configurée
      const hasUrl = await apiConfigService.hasApiUrl();

      if (hasUrl) {
        // URL configurée → aller à DatabaseSelection
        setInitialRoute("DatabaseSelection");
      } else {
        // Pas d'URL → aller à ServerConfig
        setInitialRoute("ServerConfig");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'API config:", error);
      setInitialRoute("ServerConfig");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#990000" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        {/* Configuration du serveur */}
        <Stack.Screen name="ServerConfig" component={ServerConfigScreen} />

        {/* Authentification */}
        <Stack.Screen
          name="DatabaseSelection"
          component={DatabaseSelectionScreen}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        {/* Configuration Loading */}
        <Stack.Screen name="ConfigLoading" component={ConfigLoadingScreen} />

        {/* Menu principal */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ReorganizeModules" component={ReorganizeModulesScreen} />

        {/* Modules principaux */}
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Screen name="AddContact" component={AddContactScreen} />
        <Stack.Screen name="ContactDetail" component={ContactDetailScreen} />
        <Stack.Screen name="Ventes" component={VentesScreen} />
        <Stack.Screen name="Calendrier" component={CalendarScreen} />
        <Stack.Screen name="AddEvent" component={CreateEventScreen} />
        <Stack.Screen name="Absences" component={AbsencesScreen} />
        <Stack.Screen name="Notes" component={NotesScreen} />
        <Stack.Screen name="Documents" component={DocumentsScreen} />
        <Stack.Screen name="Employés" component={EmployésScreen} />
        <Stack.Screen name="EmployeeDetail" component={EmployeeDetailScreen} />
        <Stack.Screen name="AddEmployee" component={AddEmployeeScreen} />
        <Stack.Screen name="Projet" component={ProjetScreen} />
        <Stack.Screen name="ProjetDetail" component={ProjetDetailScreen} />
        <Stack.Screen name="CRM" component={CRMScreen} />
        <Stack.Screen name="CRMDetail" component={CRMDetailScreen} />
        <Stack.Screen name="AddLead" component={AddLeadScreen} />
        <Stack.Screen name="Stock" component={StockScreen} />
        <Stack.Screen name="Présences" component={PrésencesScreen} />
        <Stack.Screen name="Congés" component={CongésScreen} />

        {/* Profil */}
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Langues" component={LanguageSelectionScreen} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="FuseauHoraire" component={FuseauHoraire} />
        <Stack.Screen name="Security" component={Security} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
});
