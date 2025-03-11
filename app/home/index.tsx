import { useRouter } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const HomeScreen: React.FC = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Smart Room App</Text>
      <Text style={styles.subtitle}>Your home automation solution</Text>
      <Button title="Go to Login" onPress={() => router.push("/login")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
});

export default HomeScreen;
