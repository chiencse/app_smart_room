import { PropsWithChildren } from "react";
import { StyleSheet, View, Text } from "react-native";

type EnvInfoCardProps = {
    envName: string,
    value: any,
}

const EnvInfoCard = ({ envName, value, children}: PropsWithChildren<EnvInfoCardProps>) => {
    return (
        <View style={styles.item}>
            {children}
            <Text style={styles.name}>{envName}</Text>
            <Text style={styles.value}>{value}</Text>
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
})

export default EnvInfoCard;
