import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import {
  format,
  addMonths,
  subMonths,
  getDaysInMonth,
  startOfMonth,
  getDay,
} from "date-fns";
import fr from "date-fns/locale/fr";

export default function CalendarScreen({ navigation }) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); // 1er Juillet 2025
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 6, 6)); // 6 Juillet 2025
  const today = new Date();

  const handleAddEvent = () => {
    navigation.navigate("AddEvent");
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const startWeekday = getDay(startOfMonth(currentDate)) - 1; // Lundi = 0
    const days = [];

    // Ajouter les jours vides du début
    for (let i = 0; i < startWeekday; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }

    // Ajouter les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString();
      const isToday = date.toDateString() === today.toDateString();
      const isEventDay = i === 6 && currentDate.getMonth() === 6;

      days.push(
        <TouchableOpacity
          key={i}
          onPress={() => setSelectedDate(date)}
          style={[
            styles.dayContainer,
            isToday && styles.todayContainer,
            isSelected && styles.selectedDayContainer,
            isEventDay && styles.eventDayContainer,
          ]}
        >
          <Text
            style={[
              styles.dayText,
              isToday && styles.todayText,
              isSelected && styles.selectedDayText,
            ]}
          >
            {i}
          </Text>
          {isEventDay && (
            <View style={styles.eventBadge}>
              <Text style={styles.eventBadgeText}>Meet</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return <View style={styles.calendarGrid}>{days}</View>;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="grid-outline" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Calendrier</Text>

        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search and Add */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAddEvent} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Days Header */}
      <View style={styles.daysHeader}>
        {daysOfWeek.map((day) => (
          <Text key={day} style={styles.dayHeaderText}>
            {day}
          </Text>
        ))}
      </View>

      {/* Month and arrows */}
      <View style={styles.monthHeader}>
        <Text style={styles.monthText}>
          {format(currentDate, "MMMM yyyy", { locale: fr })}
        </Text>
        <TouchableOpacity
          onPress={handlePrevMonth}
          style={{ backgroundColor: "#99000040", borderRadius: 50 }}
        >
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNextMonth}
          style={{ backgroundColor: "#99000040", borderRadius: 50 }}
        >
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Calendar grid */}
      {renderCalendar()}

      {/* Event of the day */}
      {selectedDate && (
        <View style={styles.todaySection}>
          <Text style={styles.todayTitle}>
            {format(selectedDate, "EEEE dd MMMM yyyy", { locale: fr })}
          </Text>
          <TouchableOpacity style={styles.eventContainer}>
            <Text style={styles.eventTitle}>Réunion Odoo</Text>
            <Text style={styles.eventSubtitle}>
              Appuyer pour voir l'événement du jour
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  addButton: {
    backgroundColor: "#990000",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  daysHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    width: 40,
    textAlign: "center",
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  emptyDay: {
    width: 40,
    height: 40,
    margin: 5,
  },
  dayContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  todayContainer: {
    backgroundColor: "#E53E3E20",
  },
  todayText: {
    color: "#E53E3E",
    fontWeight: "bold",
  },
  selectedDayContainer: {
    backgroundColor: "#990000",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "bold",
  },
  eventDayContainer: {
    backgroundColor: "#FFEDD5",
  },
  dayText: {
    color: "#333",
  },
  eventBadge: {
    backgroundColor: "#FB923C",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
  },
  eventBadgeText: {
    color: "#fff",
    fontSize: 10,
  },
  todaySection: {
    marginTop: 30,
  },
  todayTitle: {
    color: "#990000",
    fontWeight: "500",
    marginBottom: 10,
  },
  eventContainer: {
    borderLeftWidth: 4,
    borderLeftColor: "#990000",
    paddingLeft: 16,
    paddingVertical: 8,
  },
  eventTitle: {
    fontWeight: "600",
    color: "#333",
  },
  eventSubtitle: {
    color: "#666",
    marginTop: 4,
  },
});
