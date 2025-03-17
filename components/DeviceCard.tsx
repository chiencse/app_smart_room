import { PropsWithChildren } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type DeviceCardProps = {
    deviceName: string;
    numDevice: number;
    navigation: any;
};

const DeviceCard = ({
    deviceName,
    numDevice,
    navigation,
    children,
}: PropsWithChildren<DeviceCardProps>) => {
    

    return (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate(deviceName.toLowerCase())}>
            <View style={{ flex: 1 }}>
                {children}
                <Text style={styles.name}>{deviceName}</Text>
                <Text style={styles.numDevice}>
                    {numDevice + (numDevice == 1 ? " Device" : " Devices")}
                </Text>
            </View>
        </TouchableOpacity>
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

    numDevice: {
        padding: 10,
        paddingTop: 5,
    },
});

export default DeviceCard;
