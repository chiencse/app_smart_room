import { useEffect, useLayoutEffect, useState } from "react";
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
} from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";

import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

type device = {
    id: string;
    name: string;
    value: number;
};

const DATA: device[] = [
    {
        id: "123",
        name: "Fan 1",
        value: 50,
    },
    {
        id: "124",
        name: "Fan 2",
        value: 0,
    },
    {
        id: "125",
        name: "Fan 3",
        value: 60,
    },
    {
        id: "126",
        name: "Fan 4",
        value: 30,
    },
    {
        id: "127",
        name: "Fan 5",
        value: 30,
    },
    {
        id: "128",
        name: "Fan 6",
        value: 30,
    },
];

const FanControlScreen = () => {
    const { width, height } = Dimensions.get("window");

    const [devices, setDevice] = useState<device[]>([]);

    const [selectedDevice, setSelectedDevice] = useState<string>("");

    useLayoutEffect(() => {
        // call API
        setDevice(DATA);
    }, []);

    useEffect(() => {
        setSelectedDevice(DATA[0].id);
    }, []);

    const selectDevice = (id: string) => {
        setSelectedDevice(id);
    };

    const toogleDevice = (id: string, value: boolean) => {
        setDevice((pre) =>
            pre.map((device) =>
                device.id === id ? { ...device, value: value ? 50 : 0 } : device
            )
        );
        // call API to update db
    };

    const getDeviceValue = (id: string) => {
        return devices.find((device) => device.id === id)?.value ?? 0;
    };

    const setDeviceValue = (id: string, value: number) => {
        //call API
        setDevice((pre) =>
            pre.map((device) =>
                device.id === id ? { ...device, value: value } : device
            )
        );
    };

    const translateY = useSharedValue(100 - getDeviceValue(selectedDevice));

    useEffect(() => {
        translateY.value = withSpring(100 - getDeviceValue(selectedDevice));
    }, [devices, selectedDevice]);

    const controlDevice = (event: any) => {
        let newValue = 100 - event.nativeEvent.translationY;
        newValue = Math.max(0, Math.min(100, newValue));
        translateY.value = withSpring(100 - newValue);
        setDeviceValue(selectedDevice, Math.round(newValue));
    };

    const animatedStyle = useAnimatedStyle(() => ({
        height: `${Math.max(100 - translateY.value, 10)}%`,
    }));

    return (
        <View
            style={{ backgroundColor: "white", width: width, height: height }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10}}>
                <Text style={{paddingLeft: 10, fontSize: 16,}}>
                    Number of devices: {devices.length}
                </Text>
                <TouchableOpacity>
                    <Ionicons name="add-circle" size={28} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{ height: height / 3 }}>
                <FlatList
                    data={devices}
                    numColumns={2}
                    initialNumToRender={6}
                    scrollEnabled={true}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={{
                                ...styles.item,
                                borderColor:
                                    selectedDevice == item.id
                                        ? "#34E0A1"
                                        : "#F7F7F7",
                            }}
                            onPress={() => selectDevice(item.id)}
                        >
                            <View style={{ flex: 1 }}>
                                <FontAwesome6
                                    name="fan"
                                    size={26}
                                    color="black"
                                    style={styles.icon}
                                />
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.value}>
                                    Brightness: {item.value}%
                                </Text>
                            </View>
                            <Switch
                                trackColor={{
                                    false: "#101010",
                                    true: "#34E0A1",
                                }}
                                thumbColor={"#FFFFFF"}
                                onValueChange={(value) =>
                                    toogleDevice(item.id, value)
                                }
                                value={item.value != 0}
                                style={styles.toogle}
                            ></Switch>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                    extraData={selectedDevice}
                    contentContainerStyle={styles.flatlist}
                />
            </View>
            <Text style={{paddingTop: 20,paddingLeft: 20, fontSize: 18, fontWeight: 'bold'}}>
                {devices.find((device) => device.id === selectedDevice)?.name}
            </Text>
            <GestureHandlerRootView
                style={{ flexGrow: 1, justifyContent: "center" }}
            >
                <PanGestureHandler onGestureEvent={controlDevice}>
                    <View style={styles.sliderContainer}>
                        <View style={styles.sliderBackground}>
                            <Animated.View style={[styles.fill, animatedStyle]}>
                                <Text style={styles.text}>
                                    {getDeviceValue(selectedDevice)}%
                                </Text>
                            </Animated.View>
                        </View>
                    </View>
                </PanGestureHandler>
            </GestureHandlerRootView>
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

    toogle: {
        alignSelf: "flex-start",
    },

    sliderContainer: { 
        alignItems: "center", 
        height: 350 
    },

    sliderBackground: {
        width: 100,
        height: 200,
        backgroundColor: "#EEE",
        borderRadius: 15,
        overflow: "hidden",
    },

    fill: {
        backgroundColor: "#34E0A1",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        position: "absolute",
        bottom: 0,
    },

    text: { fontSize: 16, fontWeight: "bold", color: "#000" },
});

export default FanControlScreen;
