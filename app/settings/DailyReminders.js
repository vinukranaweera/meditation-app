import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  TextInput,
  StyleSheet,
} from "react-native";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenHeaderBtn from "../../components/ScreenHeaderBtn";
import { Calendar } from "react-native-calendars";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS, SIZES } from "../../constants";
import { useTheme } from "../../context/ThemeProvider";

const getThemeStyles = (isDark) => ({
    input: {
      borderColor: isDark ? COLORS.lightWhite : COLORS.primary,
      color: isDark ? COLORS.lightWhite : COLORS.darkBackground,
    },
    selected: {
      color: isDark ? COLORS.lightWhite : COLORS.primary,
    },
    reminderHeader: {
      color: isDark ? COLORS.lightWhite : COLORS.primary,
    }
  });

const DailyReminders = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const themeStyles = getThemeStyles(isDark);
  const [reminders, setReminders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [manualTime, setManualTime] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    requestPermissions();
    loadUserDetails();
    loadReminders();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Please allow notifications to receive reminders."
      );
    }
  };

  const loadUserDetails = async () => {
    const user = await AsyncStorage.getItem("userDetails");
    setUserDetails(user ? JSON.parse(user) : {});
  };

  const loadReminders = async () => {
    const storedReminders = await AsyncStorage.getItem("reminders");
    const allReminders = storedReminders ? JSON.parse(storedReminders) : [];
    const futureReminders = allReminders.filter(
      (reminder) => new Date(reminder.triggerDate) > new Date()
    );
    setReminders(futureReminders);
  };

  const handleAddReminder = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    // Parse selectedDate ("YYYY-MM-DD") as local date, not UTC
    const [year, month, day] = selectedDate.split("-").map(Number);
    const triggerDate = new Date(year, month - 1, day);

    // Apply manual time if provided, otherwise use selectedTime
    const [inputHours, inputMinutes] = manualTime
      .split(":")
      .map((item) => parseInt(item, 10));

    if (!isNaN(inputHours) && !isNaN(inputMinutes)) {
      triggerDate.setHours(inputHours, inputMinutes, 0, 0);
    } else {
      triggerDate.setHours(
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        0,
        0
      );
    }

    // Validation: must be in the future
    const now = new Date();
    if (triggerDate <= now) {
      alert("Please select a future time.");
      return;
    }

    const newReminder = {
      id: Date.now(),
      date: selectedDate,
      time:
        manualTime ||
        triggerDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      description: `Reminder: Time for your daily task!`,
      triggerDate: triggerDate.toISOString(),
    };

    try {
      const updatedReminders = [...reminders, newReminder];
      await AsyncStorage.setItem("reminders", JSON.stringify(updatedReminders));
      setReminders(updatedReminders);
      await scheduleNotification(newReminder);
      alert("Reminder added successfully!");
    } catch (error) {
      alert("Error adding reminder.");
    }
  };

  const scheduleNotification = async (reminder) => {
    const triggerDate = new Date(reminder.triggerDate);

    if (Platform.OS === "web") {
      setTimeout(() => {
        new Notification("Reminder", { body: reminder.description });
      }, triggerDate - new Date());
    } else {
      await Notifications.scheduleNotificationAsync({
        content: { title: "Reminder", body: reminder.description },
        trigger: { date: triggerDate },
      });
    }
  };

  const deleteReminder = async (id) => {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id);
    await AsyncStorage.setItem("reminders", JSON.stringify(updatedReminders));
    setReminders(updatedReminders);
  };

  const Reminder = ({ item }) => (
    <View style={styles.reminderContainer}>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.date}>
        {item.date} - {item.time}
      </Text>
      <TouchableOpacity
        onPress={() => deleteReminder(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const styles = StyleSheet.create({
    reminderContainer: {
      backgroundColor: COLORS.primary,
      borderRadius: SIZES.small,
      padding: SIZES.small,
      marginVertical: SIZES.small,
    },
    description: { color: COLORS.lightWhite, fontWeight: "bold" },
    date: { color: COLORS.darkText, fontSize: SIZES.small },
    input: {
      //borderColor: COLORS.primary,
      borderWidth: 1,
      padding: SIZES.small,
      marginVertical: SIZES.small,
    },
    selected: {
      fontSize: SIZES.medium,
      marginVertical: SIZES.small,
      //color: COLORS.primary,
    },
    button: {
      backgroundColor: COLORS.primary,
      padding: SIZES.medium,
      borderRadius: SIZES.medium,
      alignItems: "center",
    },
    buttonText: { color: COLORS.lightWhite, fontWeight: "bold" },
    deleteButton: { marginTop: SIZES.small, alignSelf: "flex-end" },
    deleteText: { color: "#FE7654", fontWeight: "bold" },
    reminderHeader: {
      fontSize: SIZES.large,
      fontWeight: "bold",
      //color: COLORS.primary,
      marginVertical: SIZES.medium,
    },
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? COLORS.darkBackground : COLORS.lightWhite,
      }}
    >
      <Stack.Screen options={{ headerTitle: "Daily Reminders" }} />
      <ScreenHeaderBtn />
      <ScrollView contentContainerStyle={{ padding: SIZES.medium }}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: COLORS.primary },
          }}
        />

        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            onChange={(event, selected) => {
              setSelectedTime(selected || selectedTime);
              setShowTimePicker(false);
            }}
          />
        )}

        <TextInput
          placeholder="Enter Time (HH:mm)"
          value={manualTime}
          onChangeText={setManualTime}
          keyboardType="numeric"
          maxLength={5}
          style={[styles.input, themeStyles.input]}
        />

        <Text style={[styles.selected, themeStyles.selected]}>Date: {selectedDate || "None"}</Text>
        <Text style={[styles.selected, themeStyles.selected]}>
          Time:{" "}
          {manualTime ||
            selectedTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </Text>

        <TouchableOpacity onPress={handleAddReminder} style={styles.button}>
          <Text style={styles.buttonText}>Add Reminder</Text>
        </TouchableOpacity>

        <Text style={[styles.reminderHeader, themeStyles.reminderHeader]}>All Reminders:</Text>
        {reminders.length > 0 ? (
          reminders.map((rem) => <Reminder key={rem.id} item={rem} />)
        ) : (
          <Text>No reminders yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default DailyReminders;
