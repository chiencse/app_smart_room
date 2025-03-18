import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import DeviceCard from "../../components/DeviceCard";
import EnvInfoCard from "../../components/EnvInfoCard";

import fetchData from "@/utils/fetchData";

const DashBoardScreen = () => {
  const { width, height } = Dimensions.get("window");

  const navigation = useNavigation();

  const [envInfo, setEnvInfo] = useState({
    temperature: 0,
    humidity: 0,
    brightness: 0,
    airQuality: 0,
  });

  const [numDevice, setNumDevice] = useState({
    light: 0,
    door: 0,
    fan: 0,
  });

  const fetchEnvInfo = async () => {
    try {
      const envInfoFetch: any = await fetchData.getEnvInfo();
      setEnvInfo(envInfoFetch);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEnvInfo();

      //call API
      setNumDevice({
        ...numDevice,
        light: 3,
        door: 1,
        fan: 2,
      });

      // Auto update enviroment info
      const idInterval = setInterval(() => {
        fetchEnvInfo();
      }, 2000);

      return () => {
        clearInterval(idInterval);
      };
    }, [])
  );

  return (
    <View style={{ backgroundColor: "white", width: width, height: height }}>
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
          <Text style={styles.groupName}>Device</Text>
          <View style={styles.rowItem}>
            <DeviceCard
              deviceName="Light"
              numDevice={numDevice.light}
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
              numDevice={numDevice.door}
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
              numDevice={numDevice.fan}
              navigation={navigation}
            >
              <FontAwesome6
                name="fan"
                size={26}
                color="black"
                style={styles.icon}
              />
            </DeviceCard>
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

  body: {
    flex: 1,
    backgroundColor: "white",
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
});

export default DashBoardScreen;
