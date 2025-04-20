import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useCallback, useState, useRef } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import DeviceCard from "@/components/DeviceCard";
import EnvInfoCard from "@/components/EnvInfoCard";
import { ENVIRONMENT_THRESHOLDS } from "@/constants/Thresholds";

import fetchData from "@/utils/fetchData";

const DashBoardScreen = () => {
  const navigation = useNavigation();

  const [envInfo, setEnvInfo] = useState({
    temperature: 0,
    humidity: 0,
    brightness: 0,
    airQuality: 0,
  });

  const [statusDevice, setStatusDevice] = useState({
    light: "OFF",
    door: "OFF",
    fan: 0,
  });

  // Lưu trữ trạng thái trước đó của các giá trị
  const prevEnvInfoRef = useRef({
    temperature: 0,
    humidity: 0,
    brightness: 0,
    airQuality: 0,
  });

  const checkThresholdStatus = (value: number, min: number, max: number) => {
    if (value < min) return "low";
    if (value > max) return "high";
    return "normal";
  };

  const checkEnvironmentWarnings = (data: any) => {
    const warnings = [];
    const prevData = prevEnvInfoRef.current;

    // Kiểm tra nhiệt độ
    const tempStatus = checkThresholdStatus(
      data.temperature,
      ENVIRONMENT_THRESHOLDS.temperature.min,
      ENVIRONMENT_THRESHOLDS.temperature.max
    );
    const prevTempStatus = checkThresholdStatus(
      prevData.temperature,
      ENVIRONMENT_THRESHOLDS.temperature.min,
      ENVIRONMENT_THRESHOLDS.temperature.max
    );
    if (tempStatus !== "normal" && prevTempStatus === "normal") {
      warnings.push(
        `Temperature is ${tempStatus} (${data.temperature}°C). ${
          tempStatus === "low"
            ? `Minimum recommended: ${ENVIRONMENT_THRESHOLDS.temperature.min}°C`
            : `Maximum recommended: ${ENVIRONMENT_THRESHOLDS.temperature.max}°C`
        }`
      );
    }

    // Kiểm tra độ ẩm
    const humidityStatus = checkThresholdStatus(
      data.humidity,
      ENVIRONMENT_THRESHOLDS.humidity.min,
      ENVIRONMENT_THRESHOLDS.humidity.max
    );
    const prevHumidityStatus = checkThresholdStatus(
      prevData.humidity,
      ENVIRONMENT_THRESHOLDS.humidity.min,
      ENVIRONMENT_THRESHOLDS.humidity.max
    );
    if (humidityStatus !== "normal" && prevHumidityStatus === "normal") {
      warnings.push(
        `Humidity is ${humidityStatus} (${data.humidity}%). ${
          humidityStatus === "low"
            ? `Minimum recommended: ${ENVIRONMENT_THRESHOLDS.humidity.min}%`
            : `Maximum recommended: ${ENVIRONMENT_THRESHOLDS.humidity.max}%`
        }`
      );
    }

    // Kiểm tra độ sáng
    const brightnessStatus = checkThresholdStatus(
      data.brightness,
      ENVIRONMENT_THRESHOLDS.brightness.min,
      ENVIRONMENT_THRESHOLDS.brightness.max
    );
    const prevBrightnessStatus = checkThresholdStatus(
      prevData.brightness,
      ENVIRONMENT_THRESHOLDS.brightness.min,
      ENVIRONMENT_THRESHOLDS.brightness.max
    );
    if (brightnessStatus !== "normal" && prevBrightnessStatus === "normal") {
      warnings.push(
        `Brightness is ${brightnessStatus} (${data.brightness}%). ${
          brightnessStatus === "low"
            ? `Minimum recommended: ${ENVIRONMENT_THRESHOLDS.brightness.min}%`
            : `Maximum recommended: ${ENVIRONMENT_THRESHOLDS.brightness.max}%`
        }`
      );
    }

    // Kiểm tra chất lượng không khí
    const airQualityStatus = checkThresholdStatus(
      data.airQuality,
      ENVIRONMENT_THRESHOLDS.airQuality.min,
      ENVIRONMENT_THRESHOLDS.airQuality.max
    );
    const prevAirQualityStatus = checkThresholdStatus(
      prevData.airQuality,
      ENVIRONMENT_THRESHOLDS.airQuality.min,
      ENVIRONMENT_THRESHOLDS.airQuality.max
    );
    if (airQualityStatus !== "normal" && prevAirQualityStatus === "normal") {
      warnings.push(
        `Air Quality is ${airQualityStatus} (${data.airQuality}). ${
          airQualityStatus === "low"
            ? `Minimum recommended: ${ENVIRONMENT_THRESHOLDS.airQuality.min}`
            : `Maximum recommended: ${ENVIRONMENT_THRESHOLDS.airQuality.max}`
        }`
      );
    }

    if (warnings.length > 0) {
      Alert.alert("Environment Warnings", warnings.join("\n"), [
        { text: "OK" },
      ]);
    }

    // Cập nhật giá trị trước đó
    prevEnvInfoRef.current = { ...data };
  };

  const fetchInfomation = async () => {
    try {
      const data: any = await fetchData.getInfo();
      setEnvInfo({
        temperature: data.temperature,
        humidity: data.humidity,
        brightness: data.brightness,
        airQuality: data.airQuality,
      });

      setStatusDevice({
        light: data.light,
        door: data.door,
        fan: data.fan,
      });

      checkEnvironmentWarnings(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch environment data");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchInfomation();
      const idInterval = setInterval(() => fetchInfomation(), 2000);
      return () => {
        clearInterval(idInterval);
      };
    }, [])
  );

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Room</Text>
      </View>

      <ScrollView>
        <View style={styles.group}>
          <Text style={styles.groupName}>Environment Info</Text>
          <View style={styles.rowItem}>
            <EnvInfoCard envName="Temperature" value={envInfo.temperature}>
              <FontAwesome6
                name="temperature-half"
                size={24}
                color="black"
                style={styles.icon}
              />
            </EnvInfoCard>
            <EnvInfoCard envName="Humidity" value={envInfo.humidity}>
              <MaterialCommunityIcons
                name="air-humidifier"
                size={24}
                color="black"
                style={styles.icon}
              />
            </EnvInfoCard>
          </View>
          <View style={styles.rowItem}>
            <EnvInfoCard envName="Brightness" value={envInfo.brightness}>
              <MaterialIcons
                name="brightness-5"
                size={24}
                color="black"
                style={styles.icon}
              />
            </EnvInfoCard>
            <EnvInfoCard envName="Air Quality" value={envInfo.airQuality}>
              <Entypo name="air" size={24} color="black" style={styles.icon} />
            </EnvInfoCard>
          </View>
        </View>

        <View style={styles.group}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName}>Device</Text>
            <TouchableOpacity
              style={styles.strategyButton}
              onPress={() => router.push("/dashboard/strategy")}
            >
              <MaterialIcons name="auto-fix-high" size={24} color="#34E0A1" />
              <Text style={styles.strategyText}>Strategy</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowItem}>
            <DeviceCard
              deviceName="Light"
              statusDevice={statusDevice.light}
              navigation={navigation}
            >
              <FontAwesome6
                name="lightbulb"
                size={26}
                color="black"
                style={styles.icon}
              />
            </DeviceCard>
            <DeviceCard
              deviceName="Door"
              statusDevice={statusDevice.door}
              navigation={navigation}
            >
              <FontAwesome6
                name="door-open"
                size={26}
                color="black"
                style={styles.icon}
              />
            </DeviceCard>
          </View>
          <View style={styles.rowItem}>
            <DeviceCard
              deviceName="Fan"
              statusDevice={statusDevice.fan}
              navigation={navigation}
            >
              <FontAwesome6
                name="fan"
                size={26}
                color="black"
                style={styles.icon}
              />
            </DeviceCard>
            <View style={{ flex: 1 }} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: 600,
  },

  group: {
    padding: 12,
    gap: 10,
  },

  groupName: {
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: 500,
  },

  rowItem: {
    flexDirection: "row",
    gap: 10,
  },

  icon: {
    padding: 10,
  },

  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  strategyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#34E0A1",
  },
  strategyText: {
    marginLeft: 8,
    color: "#34E0A1",
    fontWeight: "500",
  },
});

export default DashBoardScreen;
