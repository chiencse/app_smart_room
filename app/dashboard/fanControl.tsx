import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  View,
  Text,
  FlatList,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import fetchData from "@/utils/fetchData";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import controlDevice from "./../../utils/controlDevice";

const FanControlScreen = () => {
  const { width, height } = Dimensions.get("window");

  const [deviceStatus, setDeviceStatus] = useState<number>(0);
  const [autoMode, setAutoMode] = useState<string>("Manual");
  const [isLoading, setIsLoading] = useState(true);

  const [idInterval, setIdInterval] = useState<NodeJS.Timeout | null>(null);

  const getData = async () => {
    fetchData.getDeviceInfo("device.fan").then((data) => setDeviceStatus(data));
    fetchData
      .getDeviceInfo("device.status-fan")
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
    setAutoMode(value);
    await controlDevice.control("device.status-fan", value);
    setIsLoading(true);
  };

  const translateY = useSharedValue(100 - deviceStatus);

  useEffect(() => {
    translateY.value = withSpring(100 - deviceStatus);
  }, [deviceStatus]);

  const control = (event: any) => {
    if (autoMode == "Auto") return;

    if (idInterval) {
      clearInterval(idInterval);
      setIdInterval(null);
    }
    let newValue = 100 - (event.nativeEvent.y / 200) * 100;
    newValue = Math.max(0, Math.min(100, newValue));
    translateY.value = withSpring(100 - newValue);
    setDeviceStatus(Math.round(newValue));
  };

  const onHandlerStateChange = async (event: any) => {
    if (event.nativeEvent.state === State.END) {
      if (autoMode == "Auto") return;
      await controlDevice.control("device.fan", String(deviceStatus));
      setIsLoading(true);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: `${Math.max(100 - translateY.value, 10)}%`,
  }));

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

      <View style={{ flexGrow: 1 }}>
        <GestureHandlerRootView
          style={{ flexGrow: 1, justifyContent: "center" }}
        >
          <PanGestureHandler
            onGestureEvent={control}
            onHandlerStateChange={onHandlerStateChange}
          >
            <View style={styles.sliderContainer}>
              <View style={styles.sliderBackground}>
                <Animated.View
                  style={[
                    {
                      ...styles.fill,
                      backgroundColor: autoMode == "Auto" ? "#aaa" : "#34E0A1",
                    },
                    animatedStyle,
                  ]}
                >
                  <Text style={styles.text}>{deviceStatus}%</Text>
                </Animated.View>
              </View>
            </View>
          </PanGestureHandler>
        </GestureHandlerRootView>
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

  sliderContainer: {
    alignItems: "center",
    height: 350,
  },

  sliderBackground: {
    width: 100,
    height: 200,
    backgroundColor: "#EEE",
    borderRadius: 15,
    overflow: "hidden",
  },

  fill: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },

  text: { fontSize: 16, fontWeight: "bold", color: "#000" },
});

export default FanControlScreen;
