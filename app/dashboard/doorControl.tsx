import { useCallback, useState } from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";

import fetchData from "@/utils/fetchData";
import { useFocusEffect } from "@react-navigation/native";
import controlDevice from "@/utils/controlDevice";

const DoorControlScreen = () => {
  const { width, height } = Dimensions.get("window");

  const [deviceStatus, setDeviceStatus] = useState<string>("OFF");
  // const [autoMode, setAutoMode] = useState<string>("Manual");
  const [isLoading, setIsLoading] = useState(true);

  const [idInterval, setIdInterval] = useState<NodeJS.Timeout | null>(null);

  const getData = async () => {
    fetchData
      .getDeviceInfo("device.door")
      .then((data) => setDeviceStatus(data));
  };

  useFocusEffect(
    useCallback(() => {
      if (isLoading) {
        getData();
        setIdInterval(setInterval(() => getData(), 2000));
        setIsLoading(false);
      } else {
        return () => {
          if (idInterval) {
            clearInterval(idInterval);
          }
          setIsLoading(true);
        };
      }
    }, [isLoading])
  );

  const toggleDevice = async (value: string) => {
    if (idInterval) {
      clearInterval(idInterval);
      setIdInterval(null);
    }
    await controlDevice.control("device.door", value);
    setDeviceStatus(value);
    setIsLoading(true);
  };

  return (
    <View style={{ backgroundColor: "white", width: width, height: height }}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={{
            ...styles.toggleButton,
            backgroundColor: deviceStatus === "ON" ? "#34E0A1" : "#ee293a",
          }}
          onPress={() => toggleDevice(deviceStatus === "ON" ? "OFF" : "ON")}
        >
          <Text style={styles.buttonText}>
            {deviceStatus === "ON" ? "ON" : "OFF"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toggle: {
    alignSelf: "flex-start",
  },

  toggleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  toggleButton: {
    width: 150,
    height: 150,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },

  buttonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default DoorControlScreen;
