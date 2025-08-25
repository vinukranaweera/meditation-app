import React from "react";
import { View, Text, Image } from "react-native";
import styles from "./MeditationTopDisplay.style";
import { useTheme } from "../../context/ThemeProvider";
import { COLORS, FONT, SIZES } from "../../constants";

const getThemeStyles = (isDark) => ({
  text: {
    color: isDark ? COLORS.darkText : COLORS.lightText,
  },
  description: {
    color: isDark ? COLORS.darkText : COLORS.primary,
  },
  image: {
    tintColor: isDark ? COLORS.darkText : COLORS.primary,
  }
});

const MeditationTopDisplay = ({
  meditationImage,
  meditationTitle,
  duration,
  target,
}) => {

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const themeStyles = getThemeStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Image
          source={{
            uri: meditationImage,
          }}
          resizeMode="cover"
          style={styles.logoImage}
        />
      </View>

      <View style={styles.meditationTitleBox}>
        <Text style={[styles.meditationTitle, themeStyles.description]}>{meditationTitle}</Text>
      </View>

      <View style={styles.meditationInfoBox}>
        <Text style={[styles.meditationName, themeStyles.text]}>{target} / </Text>
        <View style={styles.durationBox}>
          <Image
            source={"https://cdn-icons-png.flaticon.com/512/109/109613.png"}
            resizeMode="cover"
            style={[styles.durationImage, themeStyles.image]}
          />

          <Text style={styles.durationName}>{duration}</Text>
        </View>
      </View>
    </View>
  );
};

export default MeditationTopDisplay;
