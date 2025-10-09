import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ContactsScreen from "../screens/ContactsScreen";
import AddContactScreen from "../screens/AddContactScreen";
import ContactDetailScreen from "../screens/ContactDetailScreen";
import Profile from "../screens/Profile";
import EditProfile from "../screens/EditProfile";
import Security from "../screens/Security";
import CalendarScreen from "../screens/CalendarScreen";
import CreateEventScreen from "../screens/CreateEventScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Screen name="AddContact" component={AddContactScreen} />
        <Stack.Screen name="ContactDetail" component={ContactDetailScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Security" component={Security} />
        <Stack.Screen name="Calendrier" component={CalendarScreen} />
        <Stack.Screen name="AddEvent" component={CreateEventScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
