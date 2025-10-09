import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const CreateEventScreen = () => {
  const navigation = useNavigation();
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [allDay, setAllDay] = useState(true);

  const [duration, setDuration] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [url, setUrl] = useState("");
  const [location, setLocation] = useState("");
  const [reminder, setReminder] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    // Logique de sauvegarde de l'événement
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header amélioré */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajouter un événement</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        {/* Section Heure */}
        <Text style={styles.sectionLabel}>HEURE</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.timeText}>DÉBUT</Text>
            <Icon name="clock-time-four-outline" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.timeText}>FIN</Text>
            <Icon name="clock-time-four-outline" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            onChange={(_, date) => {
              setShowStartPicker(false);
              if (date) setStartTime(date);
            }}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            onChange={(_, date) => {
              setShowEndPicker(false);
              if (date) setEndTime(date);
            }}
          />
        )}

        {/* Section Durée et Toute la journée */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.sectionLabel}>DURÉE</Text>
            <TextInput
              style={styles.input}
              placeholder="1h"
              value={duration}
              onChangeText={setDuration}
            />
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionLabel}>TOUTE LA JOURNÉE</Text>
            <View style={styles.allDayContainer}>
              <TouchableOpacity
                onPress={() => setAllDay(true)}
                style={styles.checkboxRow}
              >
                <View style={[styles.checkbox, allDay && styles.checkedBox]}>
                  {allDay && <Icon name="check" size={14} color="#fff" />}
                </View>
                <Text style={styles.optionText}>Oui</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAllDay(false)}
                style={styles.checkboxRow}
              >
                <View style={[styles.checkbox, !allDay && styles.checkedBox]}>
                  {!allDay && <Icon name="check" size={14} color="#fff" />}
                </View>
                <Text style={styles.optionText}>Non</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Section Organisateur */}
        <Text style={styles.sectionLabel}>ORGANISATEUR</Text>
        <TextInput
          style={styles.input}
          placeholder="Organisateur"
          value={organizer}
          onChangeText={setOrganizer}
        />

        {/* Section URL */}
        <Text style={styles.sectionLabel}>URL DE LA RÉUNION</Text>
        <TextInput
          style={styles.input}
          placeholder="Lien visio"
          value={url}
          onChangeText={setUrl}
          keyboardType="url"
        />

        {/* Section Lieu */}
        <Text style={styles.sectionLabel}>LIEU</Text>
        <TextInput
          style={styles.input}
          placeholder="Lieu"
          value={location}
          onChangeText={setLocation}
        />

        {/* Section Rappel */}
        <Text style={styles.sectionLabel}>RAPPEL</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 10 min avant"
          value={reminder}
          onChangeText={setReminder}
        />

        {/* Section Description */}
        <Text style={styles.sectionLabel}>DESCRIPTION</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          multiline
          numberOfLines={5}
          placeholder="Ajouter une description"
          value={description}
          onChangeText={setDescription}
        />

        {/* Bouton Enregistrer */}
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Enregistrer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionLabel: {
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 8,
    color: "#666",
    fontSize: 14,
  },
  input: {
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    marginBottom: 10,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  column: {
    flex: 1,
  },
  timeButton: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  timeText: {
    fontWeight: "600",
    color: "#333",
    fontSize: 14,
  },
  allDayContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 5,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    backgroundColor: "#990000",
    borderColor: "#990000",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#990000",
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CreateEventScreen;
