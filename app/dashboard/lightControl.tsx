import { useCallback, useState } from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import fetchData from "@/utils/fetchData";
import { useFocusEffect } from "@react-navigation/native";
import controlDevice from "@/utils/controlDevice";

const LightControlScreen = () => {
  const { width, height } = Dimensions.get("window");

  const [deviceStatus, setDeviceStatus] = useState<string>("OFF");
  const [autoMode, setAutoMode] = useState<string>("Manual");
  const [isLoading, setIsLoading] = useState(true);

  const [idInterval, setIdInterval] = useState<NodeJS.Timeout | null>(null);

  const getData = async () => {
    fetchData
      .getDeviceInfo("device.lamp")
      .then((data) => setDeviceStatus(data));
    fetchData
      .getDeviceInfo("device.status-lamp")
      .then((data) => setAutoMode(data));
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

  const toggleAutoMode = async (value: string) => {
    if (idInterval) {
      clearInterval(idInterval);
      setIdInterval(null);
    }
    await controlDevice.control("device.status-lamp", value);
    setAutoMode(value);
    setIsLoading(true);
  };

  const toggleDevice = async (value: string) => {
    if (idInterval) {
      clearInterval(idInterval);
      setIdInterval(null);
    }
    await controlDevice.control("device.lamp", value);
    setDeviceStatus(value);
    setIsLoading(true);
  };

  return (
    <View style={{ backgroundColor: "white", width: width, height: height }}>
      <View style={{ height: 100, margin: 10 }}>
        <View
          style={{
            ...styles.item,
            borderColor: "#F7F7F7",
          }}
        >
          <View style={{ flex: 1 }}>
            <MaterialIcons
              name="brightness-auto"
              size={26}
              color="black"
              style={styles.icon}
            />
            <Text style={styles.name}>Automation mode</Text>
          </View>
          <Switch
            trackColor={{
              false: "#101010",
              true: "#34E0A1",
            }}
            thumbColor={"#FFFFFF"}
            onValueChange={(value) => toggleAutoMode(value ? "Auto" : "Manual")}
            value={autoMode === "Auto"}
            style={styles.toggle}
          ></Switch>
        </View>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={{
            ...styles.toggleButton,
            backgroundColor:
              autoMode === "Auto"
                ? "#ececec"
                : deviceStatus === "ON"
                ? "#34E0A1"
                : "#ee293a",
          }}
          disabled={autoMode === "Auto"}
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
  flatlist: {
    margin: 10,
  },

  item: {
    flexDirection: "row",
    backgroundColor: "#F7F7F7",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15,
    flex: 1,
    flexWrap: "wrap",
    margin: 5,
    borderWidth: 2,
  },

  name: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: 500,
    flex: 1,
  },

  icon: {
    padding: 10,
  },

  value: {
    paddingLeft: 10,
    paddingBottom: 10,
    paddingTop: 5,
  },

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

export default LightControlScreen;
