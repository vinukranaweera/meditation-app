import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { useTheme } from "../context/ThemeProvider";

const getThemeStyles = (isDark) => ({
  quoteText: {
    color: isDark ? COLORS.lightWhite : COLORS.primary,
  },
});

const DailyQuote = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const themeStyles = getThemeStyles(isDark);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://dummyjson.com/quotes/random");
      if (response.ok) {
        const data = await response.json();
        setQuote(data.quote);
        setAuthor(data.author);
      } else {
        console.error("Error fetching quote:", response.status);
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      border: "1px solid #ccc",
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 5,
    },
    quoteText: {
      fontSize: 18,
      fontStyle: "italic",
      marginBottom: 10,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <>
          <Text style={[styles.quoteText, themeStyles.quoteText]}>"{quote}" - {author}</Text>
        </>
      )}
    </View>
  );
};
export default DailyQuote;
