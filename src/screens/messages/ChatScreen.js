import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const mockMessages = [
  {
    id: "1",
    texte: "Bonjour ! Comment allez-vous ?",
    heure: "10:30",
    estMoi: false,
  },
  {
    id: "2",
    texte: "Très bien merci ! Et vous ?",
    heure: "10:32",
    estMoi: true,
  },
  {
    id: "3",
    texte: "Ça va bien aussi. J'ai une question concernant le projet.",
    heure: "10:33",
    estMoi: false,
  },
  {
    id: "4",
    texte: "Je vous écoute, dites-moi tout.",
    heure: "10:35",
    estMoi: true,
  },
  {
    id: "5",
    texte:
      "Est-ce que vous avez reçu les documents que je vous ai envoyés hier ?",
    heure: "10:36",
    estMoi: false,
  },
  {
    id: "6",
    texte: "Oui je les ai bien reçus ! Je les ai consultés ce matin.",
    heure: "10:38",
    estMoi: true,
  },
  {
    id: "7",
    texte: "Parfait ! Qu'en pensez-vous ?",
    heure: "10:40",
    estMoi: false,
  },
];

export default function ChatScreen({ route, navigation }) {
  const { conversation } = route.params || {
    conversation: { nom: "Contact", image: "https://i.pravatar.cc/150?img=1" },
  };
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        texte: message,
        heure: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        estMoi: true,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.estMoi ? styles.myMessage : styles.theirMessage,
      ]}
    >
      {!item.estMoi && (
        <Image
          source={{ uri: conversation.image }}
          style={styles.messageAvatar}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          item.estMoi ? styles.myBubble : styles.theirBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.estMoi ? styles.myText : styles.theirText,
          ]}
        >
          {item.texte}
        </Text>
        <Text
          style={[
            styles.messageTime,
            item.estMoi ? styles.myTime : styles.theirTime,
          ]}
        >
          {item.heure}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Image source={{ uri: conversation.image }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{conversation.nom}</Text>
          {conversation.statut === "en ligne" && (
            <Text style={styles.headerStatus}>En ligne</Text>
          )}
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="call-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="videocam-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Liste des messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      {/* Barre de saisie */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add-circle-outline" size={28} color="#990000" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Écrivez votre message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, message.trim() && styles.sendButtonActive]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={message.trim() ? "#fff" : "#999"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  headerStatus: {
    fontSize: 12,
    color: "#27AE60",
    marginTop: 2,
  },
  headerAction: {
    marginLeft: 15,
  },

  // Messages
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
  },
  myMessage: {
    justifyContent: "flex-end",
  },
  theirMessage: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: "#990000",
    borderBottomRightRadius: 4,
    marginLeft: "auto",
  },
  theirBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myText: {
    color: "#fff",
  },
  theirText: {
    color: "#333",
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  myTime: {
    color: "#fff",
    opacity: 0.8,
    textAlign: "right",
  },
  theirTime: {
    color: "#999",
  },

  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  attachButton: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: "#990000",
  },
});
