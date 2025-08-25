import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { SIZES, FONT, COLORS } from "../../constants/theme";

// Use userDetails instead of PROFILE_KEY
const USER_DETAILS_KEY = "userDetails";

const Profile = () => {
  const [profile, setProfile] = useState({
    userName: "",
    email: "",
    password: "",
    token: "",
    photo: null,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem(USER_DETAILS_KEY);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.log("Error loading profile:", error);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem(USER_DETAILS_KEY, JSON.stringify(profile));
      alert("Profile saved!");
    } catch (error) {
      console.log("Error saving profile:", error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfile({ ...profile, photo: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            profile.photo
              ? { uri: profile.photo }
              : require("../../assets/placeholder.png")
          }
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={profile.userName}
        onChangeText={(text) => setProfile({ ...profile, userName: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={profile.email}
        onChangeText={(text) => setProfile({ ...profile, email: text })}
      />

      {/* <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        value={profile.password}
        onChangeText={(text) => setProfile({ ...profile, password: text })}
      /> */}

      {/* <TextInput
        style={styles.input}
        placeholder="Enter token"
        value={profile.token}
        onChangeText={(text) => setProfile({ ...profile, token: text })}
      /> */}

      <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
        <Text style={styles.saveBtnText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SIZES.medium,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: SIZES.large,
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.small,
    padding: SIZES.small,
    marginVertical: SIZES.small,
    fontFamily: FONT.regular,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    marginTop: SIZES.large,
  },
  saveBtnText: {
    color: COLORS.white,
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
  },
});

export default Profile;
