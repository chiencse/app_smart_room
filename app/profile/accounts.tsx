import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/constants/ConfigEnv";
import { Ionicons } from "@expo/vector-icons";

interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  roles: string[];
  authorities: { authority: string }[];
}

const AccountsScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState<User[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<number | null>(null);

  // Function to validate username format
  const isValidUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phoneNumber: string) => {
    return (
      phoneNumber.length >= 10 &&
      phoneNumber.length <= 11 &&
      !isNaN(Number(phoneNumber))
    );
  };

  const handleRegister = async () => {
    setError("");
    if (!email || !username || !password || !confirmPassword || !phoneNumber) {
      setError("All fields are required!");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email format! Example: example@gmail.com");
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
        "Invalid phone number format! Please enter exactly 10-11 digits"
      );
      return;
    }

    setIsRegisterLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${config.BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password, email, phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message);
      }
      Alert.alert("Register Successful", `Account created successfully!`);
      setIsRegistering(false);
      fetchAccounts();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(
        "https://api-sroom.mchieens.io.vn/api/user/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok && data.status === 200) {
        setAccounts(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch accounts");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      Alert.alert("Error", "Failed to fetch accounts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (userId: number, currentStatus: boolean) => {
    setIsUpdatingStatus(userId);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(
        `https://api-sroom.mchieens.io.vn/api/user/set-active/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.status === 200) {
        // Update the local state
        setAccounts(
          accounts.map((account) =>
            account.id === userId
              ? { ...account, isActive: !currentStatus }
              : account
          )
        );
      } else {
        throw new Error(data.message || "Failed to update account status");
      }
    } catch (error) {
      console.error("Error updating account status:", error);
      Alert.alert(
        "Error",
        "Failed to update account status. Please try again."
      );
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Account Management</Text>
        </View>

        {!isRegistering ? (
          <>
            <View style={styles.accountsList}>
              <Text style={styles.sectionTitle}>Registered Accounts</Text>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#34E0A1" />
                </View>
              ) : (
                accounts.map((account) => (
                  <View key={account.id} style={styles.accountItem}>
                    <View style={styles.accountInfo}>
                      <Text style={styles.accountEmail}>{account.email}</Text>
                      <Text style={styles.accountUsername}>
                        {account.username}
                      </Text>
                      <Text style={styles.accountRole}>
                        {account.roles.join(", ")}
                      </Text>
                    </View>
                    <View style={styles.accountActions}>
                      {isUpdatingStatus === account.id ? (
                        <ActivityIndicator size="small" color="#34E0A1" />
                      ) : (
                        <Switch
                          value={account.isActive}
                          onValueChange={() =>
                            handleToggleActive(account.id, account.isActive)
                          }
                          trackColor={{ false: "#767577", true: "#34E0A1" }}
                          thumbColor={account.isActive ? "#fff" : "#f4f3f4"}
                        />
                      )}
                    </View>
                  </View>
                ))
              )}
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsRegistering(true)}
            >
              <Text style={styles.addButtonText}>Add New Account</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.registerForm}>
            <Text style={styles.sectionTitle}>Register New Account</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="default"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Username"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TextInput
              placeholder="Phone Number"
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />

            <TouchableOpacity
              style={[
                styles.registerButton,
                !username ||
                !password ||
                !email ||
                !confirmPassword ||
                !phoneNumber ||
                isRegisterLoading
                  ? styles.disabledButton
                  : null,
              ]}
              onPress={handleRegister}
              disabled={
                !username ||
                !password ||
                !email ||
                !confirmPassword ||
                !phoneNumber ||
                isRegisterLoading
              }
            >
              {isRegisterLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Register</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsRegistering(false)}
              disabled={isRegisterLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
  accountsList: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  accountItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountInfo: {
    flex: 1,
  },
  accountEmail: {
    fontSize: 16,
    fontWeight: "500",
  },
  accountUsername: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  accountRole: {
    fontSize: 12,
    color: "#34E0A1",
    marginTop: 5,
  },
  accountActions: {
    marginLeft: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#34E0A1",
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerForm: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#34E0A1",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
  },
});

export default AccountsScreen;
