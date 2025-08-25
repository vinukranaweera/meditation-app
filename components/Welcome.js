import { View, Text, StyleSheet, Image } from "react-native";
import { useState, useEffect } from "react";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { useTheme } from "../context/ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getThemeStyles = (isDark) => ({
  userName: {
    color: isDark ? COLORS.lightWhite : COLORS.primary,
  },
  welcomeMessage: {
    color: isDark ? COLORS.lightWhite : COLORS.primary,
  },
});

const USER_DETAILS_KEY = "userDetails";

const Welcome = ({ userDetails }) => {
  //console.log("userDetails", userDetails?.userName);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const themeStyles = getThemeStyles(isDark);
  const [profile, setProfile] = useState({ userName: "", photo: null });

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

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      padding: 10,
    },
    userName: {
      fontFamily: FONT.regular,
      fontSize: SIZES.large,
      //color: COLORS.secondary
    },
    welcomeMessage: {
      fontFamily: FONT.bold,
      fontSize: SIZES.xLarge,
      //color: COLORS.primary,
      marginTop: 2,
    },
    searchContainer: {
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      marginTop: SIZES.large,
      height: 50,
    },
    searchWrapper: {
      flex: 1,
      marginRight: SIZES.small,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: SIZES.medium,
      height: "100%",
    },
    searchInput: {
      fontFamily: FONT.regular,
      width: "100%",
      height: "100%",
      paddingHorizontal: SIZES.medium,
    },
    searchBtn: {
      width: 50,
      height: "100%",
      borderRadius: SIZES.medium,
      justifyContent: "center",
      alignItems: "center",
    },
    searchBtnImage: {
      width: "50%",
      height: "50%",
    },
    tabsContainer: {
      width: "100%",
      marginTop: SIZES.medium,
    },
    profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 10,
    },
  });

  return (
    <View>
      <View style={[styles.container]}>
        <Image
          source={
            profile.photo
              ? { uri: profile.photo }
              : require("../assets/placeholder.png")
          }
          style={styles.profileImage}
        />
        <Text style={[styles.userName, themeStyles.userName]}>
          Hello {userDetails?.userName}!
        </Text>
        <Text style={[styles.welcomeMessage, themeStyles.welcomeMessage]}>
          Find your perfect meditation
        </Text>
      </View>
    </View>
  );
};

export default Welcome;
