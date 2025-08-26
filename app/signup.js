import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { COLORS, icons, SHADOWS } from "../constants";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({}); // store validation errors
  const router = useRouter();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters, one number, one special character
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async () => {
    let newErrors = {};

    if (!userName) newErrors.userName = "Username is required.";
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters and include a number & special character.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // stop if there are validation errors
    }

    try {
      setLoading(true);

      const userDetails = {
        userName,
        email,
        password,
        token: "sample-token",
      };
      await AsyncStorage.setItem("userDetails", JSON.stringify(userDetails));
      console.log("User registered:", userDetails);

      router.push("/login");
    } catch (error) {
      setErrors({ general: "Failed to register. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => <></>,
          headerTitle: "",
        }}
      />

      <View style={{ padding: 20 }} testID="signupContainer">
        {/* Logo / Icon */}
        <View
          style={{
            padding: 20,
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "#f0f0f0",
            borderRadius: 50,
            height: 90,
            ...SHADOWS.medium,
            shadowColor: COLORS.white,
          }}
          testID="imageIcon"
        >
          <Image
            source={icons.menu}
            style={{
              width: 50,
              height: 50,
            }}
          />
        </View>

        {/* Form */}
        <View style={{ marginTop: 30 }} testID="formData">
          {/* Username */}
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="UserName"
          />
          {errors.userName && <Text style={styles.error}>{errors.userName}</Text>}

          {/* Email */}
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          {/* Password */}
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Password"
          />
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}

          {/* Confirm Password */}
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <Text style={styles.error}>{errors.confirmPassword}</Text>
          )}

          {/* General Error */}
          {errors.general && <Text style={styles.error}>{errors.general}</Text>}

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: loading ? "#999" : COLORS.primary },
            ]}
            onPress={handleRegister}
            disabled={loading}
            testID="handleRegister"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Already have account */}
          <View style={styles.loginRow} testID="textData">
            <Text style={{ marginRight: 5 }}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={{ color: "blue" }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
};

export default SignUp;
