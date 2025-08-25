import { View, Text } from "react-native";
import { useTheme } from "../../context/ThemeProvider";
import styles from "./About.style";
import { COLORS } from "../../constants";

const getThemeStyles = (isDark) => ({
  text: {
    color: isDark ? COLORS.darkText : COLORS.lightText,
  },
  description: {
    color: isDark ? COLORS.darkText : COLORS.primary,
  }
});

const About = ({ info, title }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const themeStyles = getThemeStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={[styles.headText, themeStyles.text]}>About {title}:</Text>

      <View style={styles.contentBox}>
        <Text style={[styles.contextText, themeStyles.text]}>{info}</Text>
      </View>
    </View>
  );
};

export default About;
