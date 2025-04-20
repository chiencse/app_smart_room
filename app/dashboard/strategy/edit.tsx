import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import fetchData from "@/utils/fetchData";

interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
  location: string;
  ownerId: string;
  roomId: string;
  strategyDevices: {
    id: number;
    value: string;
  }[];
}

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
  repeatStatus: string;
  listDeviceValues: DeviceValue[];
}

const EditStrategyScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [strategy, setStrategy] = useState<Strategy>({
    id: 0,
    name: "",
    description: "",
    status: "ACTIVE",
    startTime: null,
    repeatStatus: "ONE_TIME",
    listDeviceValues: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);

  useEffect(() => {
    if (id) {
      fetchStrategyDetails();
    } else {
      setLoading(false);
    }
    fetchAvailableDevices();
  }, [id]);

  const fetchStrategyDetails = async () => {
    try {
      const strategies = await fetchData.getStrategies();
      const foundStrategy = strategies.find(
        (s: Strategy) => s.id === Number(id)
      );
      if (foundStrategy) {
        // Format startTime if it's a timestamp
        // const formattedStrategy = {
        //   ...foundStrategy,
        //   startTime: formatTime(foundStrategy.startTime || ""),
        // };
        setStrategy(foundStrategy);
      } else {
        Alert.alert("Error", "Strategy not found");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching strategy:", error);
      Alert.alert("Error", "Failed to load strategy");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDevices = async () => {
    try {
      const devices = await fetchData.getDevices();
      setAvailableDevices(devices);
    } catch (error) {
      console.error("Error fetching available devices:", error);
      Alert.alert("Error", "Failed to load available devices");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Validate required fields
      if (!strategy.name.trim()) {
        Alert.alert("Error", "Strategy name is required");
        return;
      }

      if (strategy.listDeviceValues.length === 0) {
        Alert.alert("Error", "At least one device is required");
        return;
      }

      // Validate device values
      const invalidDevices = strategy.listDeviceValues.filter(
        (device) => !device.value.trim()
      );
      if (invalidDevices.length > 0) {
        Alert.alert("Error", "All device values must be set");
        return;
      }

      // Validate startTime format (HH:mm)
      if (
        strategy.startTime &&
        !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(strategy.startTime)
      ) {
        Alert.alert(
          "Error",
          "Start time must be in HH:mm format (e.g., 14:30)"
        );
        return;
      }

      const strategyData = {
        name: strategy.name.trim(),
        description: strategy.description.trim(),
        status: strategy.status.trim(),
        startTime: strategy.startTime || new Date().getHours().toString(),
        repeatStatus: strategy.repeatStatus,
        listDeviceValues: strategy.listDeviceValues.map((device) => ({
          deviceId: device.deviceId,
          value: device.value.trim(),
        })),
      };

      if (id) {
        await fetchData.updateStrategy(Number(id), strategyData);
      } else {
        await fetchData.createStrategy(strategyData);
      }
      Alert.alert("Success", "Strategy saved successfully");
      router.back();
    } catch (error: any) {
      console.error("Error saving strategy:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save strategy";
      Alert.alert("Error", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
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
              await fetchData.deleteStrategy(Number(id));
              Alert.alert("Success", "Strategy deleted successfully");
              router.back();
            } catch (error) {
              console.error("Error deleting strategy:", error);
              Alert.alert("Error", "Failed to delete strategy");
            }
          },
        },
      ]
    );
  };

  const addDevice = (device: Device) => {
    const deviceValue: DeviceValue = {
      deviceId: device.id,
      deviceName: device.name,
      deviceType: device.type,
      deviceStatus: device.status,
      value: "",
    };
    setStrategy((prev) => ({
      ...prev,
      listDeviceValues: [...prev.listDeviceValues, deviceValue],
    }));
  };

  const removeDevice = (deviceId: number) => {
    setStrategy((prev) => ({
      ...prev,
      listDeviceValues: prev.listDeviceValues.filter(
        (device) => device.deviceId !== deviceId
      ),
    }));
  };

  const updateDeviceValue = (deviceId: number, value: string) => {
    setStrategy((prev) => ({
      ...prev,
      listDeviceValues: prev.listDeviceValues.map((device) =>
        device.deviceId === deviceId ? { ...device, value } : device
      ),
    }));
  };

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "light":
        return "bulb-outline";
      case "fan":
        return "flash-outline";
      case "air_conditioner":
        return "thermometer-outline";
      default:
        return "hardware-chip-outline";
    }
  };

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
          <Text style={styles.title}>
            {id ? "Edit Strategy" : "New Strategy"}
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            {saving ? (
              <View style={styles.loadingIndicator}>
                <ActivityIndicator size="small" color="#34E0A1" />
              </View>
            ) : (
              <Ionicons name="checkmark" size={24} color="#34E0A1" />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Strategy Details</Text>
            <TextInput
              style={styles.input}
              value={strategy.name}
              onChangeText={(text) => setStrategy({ ...strategy, name: text })}
              placeholder="Strategy Name"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={strategy.description}
              onChangeText={(text) =>
                setStrategy({ ...strategy, description: text })
              }
              placeholder="Description"
              multiline
              numberOfLines={3}
            />
            <TextInput
              style={styles.input}
              value={strategy.startTime ?? ""}
              onChangeText={(text) =>
                setStrategy({ ...strategy, startTime: text })
              }
              placeholder="StartTime (HH:mm)"
            />
            <View style={styles.repeatStatusContainer}>
              <Text style={styles.repeatStatusLabel}>Repeat Status:</Text>
              <View style={styles.repeatStatusOptions}>
                <TouchableOpacity
                  style={[
                    styles.repeatStatusOption,
                    strategy.repeatStatus === "ONE_TIME" &&
                      styles.selectedOption,
                  ]}
                  onPress={() =>
                    setStrategy({ ...strategy, repeatStatus: "ONE_TIME" })
                  }
                >
                  <Text
                    style={[
                      styles.repeatStatusText,
                      strategy.repeatStatus === "ONE_TIME" &&
                        styles.selectedText,
                    ]}
                  >
                    One Time
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.repeatStatusOption,
                    strategy.repeatStatus === "REPEAT_DAILY" &&
                      styles.selectedOption,
                  ]}
                  onPress={() =>
                    setStrategy({ ...strategy, repeatStatus: "REPEAT_DAILY" })
                  }
                >
                  <Text
                    style={[
                      styles.repeatStatusText,
                      strategy.repeatStatus === "REPEAT_DAILY" &&
                        styles.selectedText,
                    ]}
                  >
                    Daily
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Status:</Text>
              <View style={styles.statusOptions}>
                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    strategy.status === "ACTIVE" && styles.selectedOption,
                  ]}
                  onPress={() => setStrategy({ ...strategy, status: "ACTIVE" })}
                >
                  <Text
                    style={[
                      styles.statusText,
                      strategy.status === "ACTIVE" && styles.selectedText,
                    ]}
                  >
                    Active
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    strategy.status === "INACTIVE" && styles.selectedOption,
                  ]}
                  onPress={() =>
                    setStrategy({ ...strategy, status: "INACTIVE" })
                  }
                >
                  <Text
                    style={[
                      styles.statusText,
                      strategy.status === "INACTIVE" && styles.selectedText,
                    ]}
                  >
                    Inactive
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Devices</Text>
            {strategy.listDeviceValues.map((device) => (
              <View key={device.deviceId} style={styles.deviceItem}>
                <View style={styles.deviceInfo}>
                  <Ionicons
                    name={getDeviceIcon(device.deviceType)}
                    size={24}
                    color="#666"
                  />
                  <View style={styles.deviceDetails}>
                    <Text style={styles.deviceName}>{device.deviceName}</Text>
                    <View style={styles.valueContainer}>
                      <TextInput
                        style={styles.valueInput}
                        value={device.value}
                        onChangeText={(text) =>
                          updateDeviceValue(device.deviceId, text)
                        }
                        placeholder="Value"
                      />
                      <Text style={styles.statusText}>
                        Status: {device.deviceStatus}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeDevice(device.deviceId)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Devices</Text>
            <View style={styles.availableDevicesContainer}>
              {availableDevices
                .filter(
                  (device) =>
                    !strategy.listDeviceValues.some(
                      (selectedDevice) => selectedDevice.deviceId === device.id
                    )
                )
                .map((device) => (
                  <TouchableOpacity
                    key={device.id}
                    style={styles.availableDeviceCard}
                    onPress={() => addDevice(device)}
                  >
                    <View style={styles.deviceCardHeader}>
                      <Ionicons
                        name={getDeviceIcon(device.type)}
                        size={20}
                        color="#34E0A1"
                      />
                      <Text style={styles.deviceCardName}>{device.name}</Text>
                      <View>
                        <Ionicons
                          name="add-circle-outline"
                          size={24}
                          color="#34E0A1"
                        />
                      </View>
                    </View>
                    <View style={styles.deviceCardInfo}>
                      <View style={styles.deviceCardStatus}>
                        <Ionicons
                          name={
                            device.status === "ON" ? "power" : "power-outline"
                          }
                          size={14}
                          color={device.status === "ON" ? "#34E0A1" : "#666"}
                        />
                        <Text
                          style={[
                            styles.deviceStatusText,
                            {
                              color:
                                device.status === "ON" ? "#34E0A1" : "#666",
                            },
                          ]}
                        >
                          {device.status}
                        </Text>
                      </View>
                      <Text style={styles.deviceTypeText}>{device.type}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </View>

          {id && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#ff4444" />
              <Text style={styles.deleteButtonText}>Delete Strategy</Text>
            </TouchableOpacity>
          )}
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
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  deviceDetails: {
    marginLeft: 12,
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  valueInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    width: 80,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
  },
  removeButton: {
    padding: 4,
  },
  availableDevicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 4,
  },
  availableDeviceCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  deviceCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  deviceCardName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  deviceCardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceCardStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  deviceStatusText: {
    fontSize: 11,
    fontWeight: "500",
  },
  deviceTypeText: {
    fontSize: 11,
    color: "#666",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff4444",
    borderRadius: 8,
    padding: 12,
    margin: 16,
  },
  deleteButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  repeatStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  repeatStatusLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  repeatStatusOptions: {
    flexDirection: "row",
    gap: 8,
  },
  repeatStatusOption: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  selectedOption: {
    borderColor: "#34E0A1",
  },
  repeatStatusText: {
    fontSize: 14,
    color: "#333",
  },
  selectedText: {
    fontWeight: "600",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  statusOptions: {
    flexDirection: "row",
    gap: 8,
  },
  statusOption: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  loadingIndicator: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditStrategyScreen;
