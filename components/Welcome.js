import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { useTheme } from "../context/ThemeProvider";

const getThemeStyles = (isDark) => ({
  userName: {
    color: isDark ? COLORS.lightWhite : COLORS.primary,
  },
  welcomeMessage: {
    color: isDark ? COLORS.lightWhite : COLORS.primary,
  },
});

const Welcome = ({ userDetails }) => {
  //console.log("userDetails", userDetails?.userName);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const themeStyles = getThemeStyles(isDark);

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
  });

  return (
    <View>
      <View style={[styles.container]}>
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
