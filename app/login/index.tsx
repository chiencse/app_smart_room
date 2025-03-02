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

const LoginScreen = () => {
  const router = useRouter();

  // State variables for email & password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Function to validate email format
  const isValidEmail = (email: string) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  // Handle Login
  const handleLogin = () => {
    setError(""); // Reset error state

    if (!email || !password) {
      setError("Both fields are required!");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email format!");
      return;
    }

    // Simulate API call (Replace with real authentication logic)
    setTimeout(() => {
      Alert.alert("Login Successful", `Welcome, ${email}!`);
      router.push("/home"); // Navigate to Home Screen
    }, 1000);
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
        Enter your credentials to continue.
      </Text>

      {/* Error Message */}
      {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}

      {/* Input Fields */}
      <TextInput
        placeholder="Email"
        className="border border-gray-300 p-4 rounded-lg mt-4 text-black"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
          email && password ? "bg-green-500" : "bg-gray-300"
        }`}
        onPress={handleLogin}
        disabled={!email || !password}
      >
        <Text className="text-white text-center font-semibold text-lg">
          LOGIN
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
