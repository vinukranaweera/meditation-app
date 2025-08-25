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

// for repeat option
import { Picker } from "@react-native-picker/picker";

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
  },
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
  const [description, setDescription] = useState("");
  const [repeat, setRepeat] = useState(null); // new field
  const [editingId, setEditingId] = useState(null); // track which reminder is being edited

  useEffect(() => {
    requestPermissions();
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

  const loadReminders = async () => {
    const storedReminders = await AsyncStorage.getItem("reminders");
    const allReminders = storedReminders ? JSON.parse(storedReminders) : [];
    setReminders(allReminders);
  };

  const handleSaveReminder = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    const [year, month, day] = selectedDate.split("-").map(Number);
    const triggerDate = new Date(year, month - 1, day);

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

    const now = new Date();
    if (triggerDate <= now) {
      alert("Please select a future time.");
      return;
    }

    const reminder = {
      id: editingId || Date.now(),
      date: selectedDate,
      time:
        manualTime ||
        triggerDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      description: description || "Reminder: Time for your daily task!",
      triggerDate: triggerDate.toISOString(),
      repeat: repeat, // daily, weekly, monthly
    };

    try {
      let updatedReminders;
      if (editingId) {
        // update existing
        updatedReminders = reminders.map((r) =>
          r.id === editingId ? reminder : r
        );
      } else {
        // new
        updatedReminders = [...reminders, reminder];
      }

      await AsyncStorage.setItem("reminders", JSON.stringify(updatedReminders));
      setReminders(updatedReminders);

      await scheduleNotification(reminder);
      alert(editingId ? "Reminder updated!" : "Reminder added!");
      resetForm();
    } catch (error) {
      alert("Error saving reminder.");
    }
  };

  const scheduleNotification = async (reminder) => {
    const triggerDate = new Date(reminder.triggerDate);

    if (Platform.OS === "web") {
      setTimeout(() => {
        new Notification("Reminder", { body: reminder.description });
      }, triggerDate - new Date());
    } else {
      let trigger;
      if (reminder.repeat === "daily") {
        trigger = {
          hour: triggerDate.getHours(),
          minute: triggerDate.getMinutes(),
          repeats: true,
        };
      } else if (reminder.repeat === "weekly") {
        trigger = {
          weekday: triggerDate.getDay() + 1,
          hour: triggerDate.getHours(),
          minute: triggerDate.getMinutes(),
          repeats: true,
        };
      } else if (reminder.repeat === "monthly") {
        // Expo Notifications doesn't support "monthly" directly → simulate by rescheduling
        trigger = {
          day: triggerDate.getDate(),
          hour: triggerDate.getHours(),
          minute: triggerDate.getMinutes(),
          repeats: true,
        };
      } else {
        trigger = { date: triggerDate };
      }

      await Notifications.scheduleNotificationAsync({
        content: { title: "Reminder", body: reminder.description },
        trigger,
      });
    }
  };

  const deleteReminder = async (id) => {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id);
    await AsyncStorage.setItem("reminders", JSON.stringify(updatedReminders));
    setReminders(updatedReminders);
  };

  const startEditing = (reminder) => {
    setSelectedDate(reminder.date);
    setManualTime(reminder.time);
    setDescription(reminder.description);
    setRepeat(reminder.repeat);
    setEditingId(reminder.id);
  };

  const resetForm = () => {
    setSelectedDate(null);
    setManualTime("");
    setDescription("");
    setRepeat(null);
    setEditingId(null);
  };

  const Reminder = ({ item }) => (
    <View style={styles.reminderContainer}>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.date}>
        {item.date} - {item.time} ({item.repeat || "once"})
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <TouchableOpacity
          onPress={() => startEditing(item)}
          style={{ marginRight: 10 }}
        >
          <Text style={{ color: "yellow", fontWeight: "bold" }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteReminder(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
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
      borderWidth: 1,
      padding: SIZES.small,
      marginVertical: SIZES.small,
    },
    selected: {
      fontSize: SIZES.medium,
      marginVertical: SIZES.small,
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

        <TextInput
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, themeStyles.input]}
        />

        <Picker
          selectedValue={repeat || ""}
          onValueChange={(itemValue) => setRepeat(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="None" value="" />
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Monthly" value="monthly" />
        </Picker>

        <Text style={[styles.selected, themeStyles.selected]}>
          Date: {selectedDate || "None"}
        </Text>
        <Text style={[styles.selected, themeStyles.selected]}>
          Time:{" "}
          {manualTime ||
            selectedTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </Text>

        <TouchableOpacity onPress={handleSaveReminder} style={styles.button}>
          <Text style={styles.buttonText}>
            {editingId ? "Update Reminder" : "Add Reminder"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={resetForm}
          style={[styles.button, { backgroundColor: "gray", marginTop: 10 }]}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>

        <Text style={[styles.reminderHeader, themeStyles.reminderHeader]}>
          All Reminders:
        </Text>
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
