import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import fetchData from "@/utils/fetchData";

interface DeviceValue {
  deviceId: number;
  deviceName: string;
  deviceType: string;
  deviceStatus: string;
  value: string;
}

interface Strategy {
  id: number;
  name: string;
  description: string;
  status: string;
  startTime: string | null;
  listDeviceValues: DeviceValue[];
}

const StrategyScreen = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const data = await fetchData.getStrategies();
      setStrategies(data);
    } catch (error) {
      console.error("Error fetching strategies:", error);
      Alert.alert("Error", "Failed to load strategies");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStrategy = () => {
    router.push("/dashboard/strategy/edit");
  };

  const handleEditStrategy = (strategy: Strategy) => {
    router.push(`/dashboard/strategy/edit?id=${strategy.id}`);
  };

  const handleDeleteStrategy = (strategy: Strategy) => {
    Alert.alert(
      "Delete Strategy",
      "Are you sure you want to delete this strategy?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await fetchData.deleteStrategy(strategy.id);
              await fetchStrategies();
            } catch (error) {
              console.error("Error deleting strategy:", error);
              Alert.alert("Error", "Failed to delete strategy");
            }
          },
        },
      ]
    );
  };

  const handleRunStrategy = (strategy: Strategy) => {
    // TODO: Implement run strategy functionality
    console.log("Running strategy:", strategy.name);
  };

  // Add focus effect to reload strategies when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchStrategies();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Strategies</Text>
          <TouchableOpacity onPress={handleAddStrategy}>
            <Ionicons name="add-circle-outline" size={24} color="#34E0A1" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {strategies.map((strategy) => (
            <View key={`strategy-${strategy.id}`} style={styles.strategyItem}>
              <TouchableOpacity
                style={styles.strategyInfo}
                onPress={() => handleEditStrategy(strategy)}
              >
                <View style={styles.strategyHeader}>
                  <Text style={styles.strategyName}>{strategy.name}</Text>
                  <View style={styles.autoRunTime}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.autoRunTimeText}>
                      {strategy.startTime}
                    </Text>
                  </View>
                </View>
                <Text style={styles.strategyDescription}>
                  {strategy.description}
                </Text>
                <View style={styles.devicesList}>
                  {strategy.listDeviceValues.map((device) => (
                    <View
                      key={`strategy-${strategy.id}-device-${device.deviceId}`}
                      style={styles.deviceChip}
                    >
                      <Ionicons
                        name={
                          device.deviceStatus === "ON"
                            ? "power"
                            : "power-outline"
                        }
                        size={16}
                        color={
                          device.deviceStatus === "ON" ? "#34E0A1" : "#666"
                        }
                      />
                      <Text style={styles.deviceName}>{device.deviceName}</Text>
                      <Text style={styles.deviceValue}>{device.value}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
              <View style={styles.strategyActions}>
                <TouchableOpacity
                  style={styles.runButton}
                  onPress={() => handleRunStrategy(strategy)}
                >
                  <Ionicons name="play" size={20} color="#fff" />
                  <Text style={styles.runButtonText}>Run</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteStrategy(strategy)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditStrategy(strategy)}
                >
                  <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  strategyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  strategyInfo: {
    flex: 1,
  },
  strategyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  strategyName: {
    fontSize: 16,
    fontWeight: "600",
  },
  autoRunTime: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  autoRunTimeText: {
    fontSize: 12,
    color: "#666",
  },
  strategyDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  devicesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  deviceChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  deviceName: {
    fontSize: 12,
    color: "#666",
  },
  deviceValue: {
    fontSize: 12,
    color: "#34E0A1",
    fontWeight: "500",
  },
  strategyActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  runButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#34E0A1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  runButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  deleteButton: {
    padding: 4,
  },
  editButton: {
    padding: 4,
  },
});

export default StrategyScreen;
