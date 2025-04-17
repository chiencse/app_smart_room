import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/constants/ConfigEnv";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID || "",
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    // Check if we're already authenticated
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          router.replace("/home");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsReady(true);
      }
    };

    checkAuth();
  }, []);

  // Function to save token to AsyncStorage
  const saveToken = async (token: string) => {
    try {
      await AsyncStorage.setItem("authToken", token);
      console.log("Token saved successfully");
    } catch (error) {
      console.error("Failed to save token:", error);
    }
  };

  // Function to validate username format
  const isValidUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
  };

  // Handle Username/Password Login
  const handleLogin = async () => {
    if (!isReady) return;

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

    setIsLoading(true);
    try {
      const response = await fetch(`${config.BACKEND_URL}/auth/login`, {
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
      console.log(data);
      const token = data?.data?.token;
      if (token) {
        await saveToken(token); // Save the token
        Alert.alert("Login Successful", `Welcome, ${username}!`);
        router.replace("/home");
      } else {
        throw new Error("No token received from server");
      }
    } catch (error) {
      setError("Login failed. Please check your credentials." + error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    if (!isReady) return;

    setIsGoogleLoading(true);
    try {
      const result = await promptAsync();
      if (result.type === "success") {
        const { id_token } = result.params;

        // Send token to backend for verification
        const response = await fetch(
          `${config.BACKEND_URL}/auth/google/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: id_token }),
          }
        );

        if (!response.ok) {
          throw new Error("Google login failed");
        }

        const data = await response.json();
        const token = data.token; // Assuming backend returns a token

        if (token) {
          await saveToken(token); // Save the token
          Alert.alert("Login Successful", "Welcome!");
          router.replace("/home");
        } else {
          throw new Error("No token received from server");
        }
      }
    } catch (error) {
      setError("Google login failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (!isReady) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
        disabled={!username || !password || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            LOGIN
          </Text>
        )}
      </TouchableOpacity>

      {/* Google Login Button */}
      <TouchableOpacity
        className="py-4 rounded-lg mt-4 bg-blue-500"
        onPress={handleGoogleLogin}
        disabled={!request || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            LOGIN WITH GOOGLE
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
