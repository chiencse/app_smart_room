import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AnalyticCard from "@/components/AnalyticCard";
import { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import fetchData from "@/utils/fetchData";

function AnalyticsScreen() {
  const navigation = useNavigation<any>();

  const [data, setData] = useState<any>({});

  const getAnalyticData = async () => {
    fetchData.getAnalytic().then((response) => setData(response));
  };

  useFocusEffect(
    useCallback(() => {
      getAnalyticData();
      const idInterval = setInterval(() => getAnalyticData(), 2000);
      return () => {
        clearInterval(idInterval);
      };
    }, [])
  );

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>
      <ScrollView>
        <View style={styles.group}>
          <Text style={styles.groupName}>Total Usage Today</Text>
          <View style={styles.rowItem}>
            <AnalyticCard
              title="Light"
              value={
                (data?.totalUsage?.["device.lamp"] ?? 0) +
                (data?.totalUsage?.["device.status-lamp"] ?? 0)
              }
            >
              <FontAwesome6
                name="lightbulb"
                size={26}
                color="black"
                style={styles.icon}
              />
            </AnalyticCard>
            <AnalyticCard
              title="Door"
              value={data?.totalUsage?.["device.door"] ?? 0}
            >
              <FontAwesome6
                name="door-open"
                size={26}
                color="black"
                style={styles.icon}
              />
            </AnalyticCard>
          </View>
          <View style={styles.rowItem}>
            <AnalyticCard
              title="Fan"
              value={
                (data?.totalUsage?.["device.fan"] ?? 0) +
                (data?.totalUsage?.["device.status-fan"] ?? 0)
              }
            >
              <FontAwesome6
                name="fan"
                size={26}
                color="black"
                style={styles.icon}
              />
            </AnalyticCard>
            <View style={{ flex: 1 }}></View>
          </View>
        </View>
        <View style={styles.group}>
          <Text style={styles.groupName}>Your Usage Today</Text>
          <View style={styles.rowItem}>
            <AnalyticCard
              title="Light"
              value={
                (data?.userUsage?.["device.lamp"] ?? 0) +
                (data?.userUsage?.["device.status-lamp"] ?? 0)
              }
            >
              <FontAwesome6
                name="lightbulb"
                size={26}
                color="black"
                style={styles.icon}
              />
            </AnalyticCard>
            <AnalyticCard
              title="Door"
              value={data?.userUsage?.["device.door"] ?? 0}
            >
              <FontAwesome6
                name="door-open"
                size={26}
                color="black"
                style={styles.icon}
              />
            </AnalyticCard>
          </View>
          <View style={styles.rowItem}>
            <AnalyticCard
              title="Fan"
              value={
                (data?.userUsage?.["device.fan"] ?? 0) +
                (data?.userUsage?.["device.status-fan"] ?? 0)
              }
            >
              <FontAwesome6
                name="fan"
                size={26}
                color="black"
                style={styles.icon}
              />
            </AnalyticCard>
            <View style={{ flex: 1 }}></View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("logs")}>
            <Text style={styles.showLogBtn}>Show detail usage</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

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

  showLogBtn: {
    flex: 1,
    textAlign: "center",
    padding: 18,
    fontSize: 16,
    fontWeight: "bold",
    color: "#34E0A1",
  },
});

export default AnalyticsScreen;
