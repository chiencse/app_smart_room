import { PropsWithChildren } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ENVIRONMENT_THRESHOLDS } from "@/constants/Thresholds";

type EnvInfoCardProps = {
  envName: string;
  value: number;
};

const EnvInfoCard = ({
  envName,
  value,
  children,
}: PropsWithChildren<EnvInfoCardProps>) => {
  const unitEnv = (envName: string) => {
    switch (envName) {
      case "Temperature":
        return "ᵒC";
      case "Humidity":
        return "%";
      case "Brightness":
        return "%";
      case "Air Quality":
        return "";
      default:
        return "";
    }
  };

  const checkThreshold = (envName: string, value: number) => {
    const key = envName.toLowerCase() as keyof typeof ENVIRONMENT_THRESHOLDS;
    const threshold = ENVIRONMENT_THRESHOLDS[key];

    if (value < threshold?.min) {
      return "low";
    } else if (value > threshold?.max) {
      return "high";
    }
    return "normal";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "#FFA500";
      case "high":
        return "#FF0000";
      default:
        return "#000000";
    }
  };

  const status = checkThreshold(envName, value);
  const textColor = getStatusColor(status);

  return (
    <View style={styles.item}>
      {children}
      <Text style={styles.name}>{envName}</Text>
      <Text style={[styles.value, { color: textColor }]}>
        {value + unitEnv(envName)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    backgroundColor: "#F7F7F7",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15,
    flex: 1,
    flexWrap: "wrap",
  },

  name: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: 500,
    flex: 1,
  },

  value: {
    fontSize: 26,
    fontWeight: 500,
    flexBasis: "100%",
    alignSelf: "center",
    textAlign: "center",
    padding: 10,
    paddingBottom: 20,
  },
});

export default EnvInfoCard;
