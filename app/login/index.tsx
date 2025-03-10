import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import * as Google from "expo-auth-session/providers/google";

const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL ?? "";

const LoginScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Google Auth Configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "YOUR_EXPO_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  // Function to validate username format
  const isValidUsername = (username: string) => {
    // Username validation: 3-20 characters, letters, numbers, underscore, hyphen
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
  };

  // Handle Username/Password Login
  const handleLogin = async () => {
    setError(""); // Reset error state

    if (!username || !password) {
      setError("Both fields are required!");
      return;
    }

    if (!isValidUsername(username)) {
      setError(
        "Invalid username format! Use 3-20 characters (letters, numbers, _, -)"
      );
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      Alert.alert("Login Successful", `Welcome, ${username}!`);
      router.push("/home");
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await promptAsync();
      if (result.type === "success") {
        const accessToken = result.authentication?.accessToken;

        // Send token to backend for verification
        const response = await fetch(`${BACKEND_URL}/google-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: accessToken }),
        });

        if (!response.ok) {
          throw new Error("Google login failed");
        }

        const data = await response.json();
        Alert.alert("Login Successful", "Welcome!");
        router.push("/home");
      }
    } catch (error) {
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      {/* Logo */}
      <View className="items-center mb-6 flex flex-row justify-center">
        <Image
          source={require("../../assets/logo/logo.png")}
          className="h-12 w-12 m-4"
        />
        <Text className="text-3xl pb-2 font-bold text-black mt-2">SRoom</Text>
      </View>

      {/* Sign In Title */}
      <Text className="text-2xl font-semibold text-gray-900">SIGN IN</Text>
      <Text className="text-gray-500 mt-1">
        Enter your credentials to continue
      </Text>

      {/* Error Message */}
      {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}

      {/* Input Fields */}
      <TextInput
        placeholder="Username"
        className="border border-gray-300 p-4 rounded-lg mt-4 text-black"
        value={username}
        onChangeText={setUsername}
        keyboardType="default"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        className="border border-gray-300 p-4 rounded-lg mt-4 text-black"
        value={password}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <TouchableOpacity
        className={`py-4 rounded-lg mt-6 ${
          username && password ? "bg-green-500" : "bg-gray-300"
        }`}
        onPress={handleLogin}
        disabled={!username || !password}
      >
        <Text className="text-white text-center font-semibold text-lg">
          LOGIN
        </Text>
      </TouchableOpacity>

      {/* Google Login Button */}
      <TouchableOpacity
        className="py-4 rounded-lg mt-4 bg-blue-500"
        onPress={handleGoogleLogin}
        disabled={!request}
      >
        <Text className="text-white text-center font-semibold text-lg">
          LOGIN WITH GOOGLE
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
