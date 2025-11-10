import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DatabaseSelectionScreen from "../screens/auth/DatabaseSelectionScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";

import HomeScreen from "../screens/home/HomeScreen";

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
import EmployésScreen from "../screens/employees/EmployésScreen";
import ProjetScreen from "../screens/projects/ProjetScreen";
import CRMScreen from "../screens/crm/CRMScreen";
import StockScreen from "../screens/stock/StockScreen";
import PrésencesScreen from "../screens/presences/PrésencesScreen";
import Security from "../screens/profile/Security";
import ProjetDetailScreen from "../screens/projects/ProjetDetailScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DatabaseSelection"
        screenOptions={{ headerShown: false }}
      >
        {/* Authentification */}
        <Stack.Screen
          name="DatabaseSelection"
          component={DatabaseSelectionScreen}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        {/* Menu principal */}
        <Stack.Screen name="Home" component={HomeScreen} />

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
        <Stack.Screen name="Projet" component={ProjetScreen} />
        <Stack.Screen name="ProjetDetail" component={ProjetDetailScreen} />
        <Stack.Screen name="CRM" component={CRMScreen} />
        <Stack.Screen name="Stock" component={StockScreen} />
        <Stack.Screen name="Présences" component={PrésencesScreen} />
        <Stack.Screen name="Congés" component={CongésScreen} />

        {/* Profil */}
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Security" component={Security} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
