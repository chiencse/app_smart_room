import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashBoardScreen from "./dashboard";
import FanControlScreen from "./fanControl";
import LightControlScreen from "./lightControl";

const Stack = createNativeStackNavigator();

const DashboardNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Dashboard"
                component={DashBoardScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen name="Light" component={LightControlScreen} />
            <Stack.Screen name="Fan" component={FanControlScreen} />
        </Stack.Navigator>
    );
};

export default DashboardNavigator;
