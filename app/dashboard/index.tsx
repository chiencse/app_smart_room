import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch,
    ScrollView,
} from "react-native";
import { useLayoutEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const DashBoardScreen = () => {
    const [envInfo, setEnvInfo] = useState({
        temperature: 0,
        humdity: 0,
        brightness: 0,
        airQuality: "",
    });
    const [autoMode, setAutoMode] = useState(false);
    const [deviceStatus, setDeviceStatus] = useState({
        airCondition: true,
        fan: true,
        light: true,
        airPurifier: true,
    });
    const [numDevice, setNumDevice] = useState({
        airCondition: 0,
        fan: 0,
        light: 0,
        airPurifier: 0,
    });

    useLayoutEffect(() => {
        //fake data
        setEnvInfo({
            ...envInfo,
            temperature: 37,
            humdity: 50,
            brightness: 200,
            airQuality: "Good",
        });
        setAutoMode(true);
        setDeviceStatus({
            ...deviceStatus,
            airCondition: true,
            fan: true,
            light: true,
            airPurifier: true,
        });
        setNumDevice({
            ...numDevice,
            airCondition: 1,
            fan: 2,
            light: 2,
            airPurifier: 1,
        });

        // Auto update enviroment info
        const idInterval = setInterval(() => {
            //call API 
        }, 20000)

        return () => {
            clearInterval(idInterval)
        }
    }, []);

    const controlDeivce = (value: boolean, type: string) => {
        setDeviceStatus({
            ...deviceStatus,
            [type]: value,
        });
        // call API to update db
    };

    return (
        <View style={{ backgroundColor: "white" }}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Room</Text>
                <TouchableOpacity>
                    <Ionicons name="add-circle-sharp" size={30} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={styles.group}>
                    <Text style={styles.groupName}>Environment Info</Text>
                    <View style={styles.rowItem}>
                        <View style={styles.item}>
                            <FontAwesome6
                                name="temperature-half"
                                size={24}
                                color="black"
                                style={styles.icon}
                            />
                            <Text style={styles.name}>Temperature</Text>
                            <Text style={styles.value}>
                                {envInfo.temperature}
                            </Text>
                        </View>
                        <View style={styles.item}>
                            <MaterialCommunityIcons
                                name="air-humidifier"
                                size={24}
                                color="black"
                                style={styles.icon}
                            />
                            <Text style={styles.name}>Humidity</Text>
                            <Text style={styles.value}>{envInfo.humdity}</Text>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <View style={styles.item}>
                            <MaterialIcons
                                name="brightness-5"
                                size={24}
                                color="black"
                                style={styles.icon}
                            />
                            <Text style={styles.name}>Brightness</Text>
                            <Text style={styles.value}>
                                {envInfo.brightness}
                            </Text>
                        </View>
                        <View style={styles.item}>
                            <Entypo
                                name="air"
                                size={24}
                                color="black"
                                style={styles.icon}
                            />
                            <Text style={styles.name}>Air Quality</Text>
                            <Text style={styles.value}>
                                {envInfo.airQuality}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.group}>
                    <Text style={styles.groupName}>Mode</Text>
                    <View style={styles.rowItem}>
                        <View style={styles.item}>
                            <MaterialIcons
                                name="auto-mode"
                                size={24}
                                color="black"
                                style={styles.icon}
                            />
                            <Text style={styles.name}>Automation mode</Text>
                            <Switch
                                trackColor={{
                                    false: "#101010",
                                    true: "#34E0A1",
                                }}
                                thumbColor={"#FFFFFF"}
                                onValueChange={(value) => {
                                    setAutoMode(value);
                                }}
                                value={autoMode}
                                style={styles.toogle}
                            ></Switch>
                        </View>
                    </View>
                </View>

                <View style={styles.group}>
                    <Text style={styles.groupName}>Device</Text>
                    <View style={styles.rowItem}>
                        <View style={styles.item}>
                            <View style={{ flex: 1 }}>
                                <MaterialIcons
                                    name="auto-mode"
                                    size={24}
                                    color="black"
                                    style={styles.icon}
                                />
                                <Text style={styles.name}>Air Condition</Text>
                                <Text style={styles.numDevice}>
                                    {numDevice.airCondition +
                                        (numDevice.airCondition == 1
                                            ? " Device"
                                            : " Devices")}
                                </Text>
                            </View>
                            <Switch
                                trackColor={{
                                    false: "#101010",
                                    true: "#34E0A1",
                                }}
                                thumbColor={"#FFFFFF"}
                                onValueChange={(value) =>
                                    controlDeivce(value, "airCondition")
                                }
                                value={deviceStatus.airCondition}
                                style={styles.toogle}
                            ></Switch>
                        </View>
                        <View style={styles.item}>
                            <View style={{ flex: 1 }}>
                                <MaterialIcons
                                    name="auto-mode"
                                    size={24}
                                    color="black"
                                    style={styles.icon}
                                />
                                <Text style={styles.name}>Fan</Text>
                                <Text style={styles.numDevice}>
                                    {numDevice.fan +
                                        (numDevice.fan == 1
                                            ? " Device"
                                            : " Devices")}
                                </Text>
                            </View>
                            <Switch
                                trackColor={{
                                    false: "#101010",
                                    true: "#34E0A1",
                                }}
                                thumbColor={"#FFFFFF"}
                                onValueChange={(value) =>
                                    controlDeivce(value, "fan")
                                }
                                value={deviceStatus.fan}
                                style={styles.toogle}
                            ></Switch>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <View style={styles.item}>
                            <View style={{ flex: 1 }}>
                                <MaterialIcons
                                    name="auto-mode"
                                    size={24}
                                    color="black"
                                    style={styles.icon}
                                />
                                <Text style={styles.name}>Light</Text>
                                <Text style={styles.numDevice}>
                                    {numDevice.light +
                                        (numDevice.light == 1
                                            ? " Device"
                                            : " Devices")}
                                </Text>
                            </View>
                            <Switch
                                trackColor={{
                                    false: "#101010",
                                    true: "#34E0A1",
                                }}
                                thumbColor={"#FFFFFF"}
                                onValueChange={(value) =>
                                    controlDeivce(value, "light")
                                }
                                value={deviceStatus.light}
                                style={styles.toogle}
                            ></Switch>
                        </View>
                        <View style={styles.item}>
                            <View style={{ flex: 1 }}>
                                <MaterialIcons
                                    name="auto-mode"
                                    size={24}
                                    color="black"
                                    style={styles.icon}
                                />
                                <Text style={styles.name}>Air Purifier</Text>
                                <Text style={styles.numDevice}>
                                    {numDevice.airPurifier +
                                        (numDevice.airPurifier == 1
                                            ? " Device"
                                            : " Devices")}
                                </Text>
                            </View>
                            <Switch
                                trackColor={{
                                    false: "#101010",
                                    true: "#34E0A1",
                                }}
                                thumbColor={"#FFFFFF"}
                                onValueChange={(value) =>
                                    controlDeivce(value, "airPurifier")
                                }
                                value={deviceStatus.airPurifier}
                                style={styles.toogle}
                            ></Switch>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        marginTop: 48,
        padding: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    headerTitle: {
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

    item: {
        flexDirection: "row",
        backgroundColor: "#F7F7F7",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 15,
        flex: 1,
        flexWrap: "wrap",
    },

    icon: {
        padding: 10,
    },

    name: {
        paddingLeft: 10,
        fontSize: 16,
        fontWeight: 500,
        flex: 1,
    },

    toogle: {
        alignSelf: "flex-start",
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

    numDevice: {
        padding: 10,
        paddingTop: 5,
    },
});

export default DashBoardScreen;
