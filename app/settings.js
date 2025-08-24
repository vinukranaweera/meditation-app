import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import { COLORS, FONT, icons, SHADOWS, SIZES } from "../constants";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenHeaderBtn from "../components/ScreenHeaderBtn";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeProvider"; 

const getThemeStyles = (isDark) => ({
  background: {
    backgroundColor: isDark ? COLORS.darkBackground : COLORS.lightWhite,
  },
  text: {
    color: isDark ? COLORS.darkText : COLORS.secondary,
  }
});

const Settings = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  //console.log("Dark:", COLORS.darkBackground, "Light:", COLORS.lightWhite);
  //console.log("isDark", isDark);
  const themeStyles = getThemeStyles(isDark);

  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();
  const settings = [
    {
      id: 1,
      title: "Settings",
      icon: "https://cdn-icons-png.flaticon.com/512/126/126472.png",
      target: "Mental Health",
      route: "ThemeChange",
    },
    {
      id: 2,
      title: "My Favourites",
      icon: "https://cdn-icons-png.flaticon.com/512/2932/2932360.png",
      target: "Mental Health",
      route: "Favourites",
    },
    {
      id: 3,
      title: "Daily Reminders",
      icon: "https://cdn-icons-png.flaticon.com/512/109/109613.png",
      target: "Mental Health",
      route: "DailyReminders",
    },
  ];

  const loadUserDetails = async () => {
    const user = await AsyncStorage.getItem("userDetails");
    console.log("user", user);
    setUserDetails(user);
  };

  useEffect(() => {
    loadUserDetails();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userDetails");
    router.push("/login");
  };

  return (
    <SafeAreaView style={[{ flex: 1 }, themeStyles.background]}>
      <ScreenHeaderBtn />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: SIZES.medium }}>
          <View style={{ width: "100%" }} testID="userDetails">
            {userDetails && (
              <Text
                style={[{
                  fontFamily: FONT.regular,
                  fontSize: SIZES.large,
                }, 
                themeStyles.text]}
              >
                Hello {JSON.parse(userDetails).userName}!
              </Text>
            )}
            <Text
              style={[{
                fontFamily: FONT.bold,
                fontSize: SIZES.xLarge,
                marginTop: 2,
              }, themeStyles.text]}
            >
              Would you like to change any settings?
            </Text>
          </View>
          {settings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                padding: SIZES.medium,
                borderRadius: SIZES.small,
                backgroundColor: "#FFF",
                ...SHADOWS.medium,
                shadowColor: COLORS.white,
                marginVertical: SIZES.small,
              }}
              onPress={() => router.push(`settings/${setting.route}`)}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: COLORS.white,
                  borderRadius: SIZES.medium,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: setting.icon }}
                  resizeMode="cover"
                  style={{ width: "70%", height: "70%" }}
                />
              </View>
              <View style={{ flex: 1, marginHorizontal: SIZES.medium }}>
                <Text
                  style={{
                    fontSize: SIZES.medium,
                    fontFamily: "DMBold",
                    color: COLORS.primary,
                  }}
                  numberOfLines={1}
                >
                  {setting?.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              padding: SIZES.medium,
              borderRadius: SIZES.small,
              backgroundColor: "#FFC0CB",
              ...SHADOWS.medium,
              shadowColor: COLORS.white,
              marginVertical: SIZES.small,
            }}
            onPress={handleLogout}
          >
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: COLORS.white,
                borderRadius: SIZES.medium,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={icons.left}
                resizeMode="cover"
                style={{
                  width: "70%",
                  height: "70%",
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                marginHorizontal: SIZES.medium,
              }}
            >
              <Text
                style={{
                  fontSize: SIZES.medium,
                  fontFamily: "DMBold",
                  color: COLORS.primary,
                }}
                numberOfLines={1}
              >
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
