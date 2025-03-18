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
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/constants/ConfigEnv";


const RegisterScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  // Function to validate username format
  const isValidUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email);
  }

  const isValidPhoneNumber = (phoneNumber: string) => {
    return (phoneNumber.length >= 10 && phoneNumber.length <= 11) && !isNaN(Number(phoneNumber));
  };

  // Handle Username/Password Login
  const handleRegister = async () => {
    setError(""); // Reset error state
    if (!email || !username || !password || !confirmPassword || !phoneNumber) {
      setError("All fields are required!");
      return;
    }

    if (!isValidEmail(email)) {
      setError(
        "Invalid email format! Example: example@gmail.com"
      );
      return;
    }

    if (!isValidUsername(username)) {
      setError(
        "Invalid username format! Use 3-20 characters (letters, numbers, _, -)"
      );
      return;
    }

    if (password != confirmPassword) {
      setError("The password and confirm password do not match.");
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setError(
        "Invalid phone number format!Please enter exactly 10-11 digits"
      );
      return;
    }

    try {
      const response = await fetch(`${config.BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email, phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message);
      }
      Alert.alert("Register Successful", `Let's login!`);
      router.push("/login");

    } catch (error: any) {
      setError(error.message);
    }
  };

  const redirectLogin = () => {
    router.push('/home');
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
      <Text className="text-2xl font-semibold text-gray-900">REGISTER</Text>
      <Text className="text-gray-500 mt-1">
        Enter your credentials to continue
      </Text>

      {/* Error Message */}
      {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}

      {/* Input Fields */}
      <TextInput
        placeholder="Email"
        className="border border-gray-300 p-4 rounded-lg mt-4 text-black"
        value={email}
        onChangeText={setEmail}
        keyboardType="default"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Username"
        className="border border-gray-300 p-4 rounded-lg mt-4 text-black"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        className="border border-gray-300 p-4 rounded-lg mt-4 text-black"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        className="border border-gray-300 p-4 rounded-lg mt-4 text-black"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TextInput
        placeholder="Phone Number"
        className="border border-gray-300 p-4 rounded-lg mt-4 text-black"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {/* Login Button */}
      <TouchableOpacity
        className={`py-4 rounded-lg mt-6 ${
          username && password && email && confirmPassword && phoneNumber ? "bg-green-500" : "bg-gray-300"
        }`}
        onPress={handleRegister}
        disabled={!username || !password || !email || !confirmPassword || !phoneNumber}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Register
        </Text>
      </TouchableOpacity>
      <View className="flex-row justify-center mt-4">
              <Text className="text-base text-gray-700">
                  Already have an account?{' '}
                </Text>
              <TouchableOpacity onPress={redirectLogin}>
                <Text className="text-blue-500 text-base">
                  Login now
                </Text>
              </TouchableOpacity>
            </View>
    </View>
  );
};

export default RegisterScreen;
