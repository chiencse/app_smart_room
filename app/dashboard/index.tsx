import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashBoardScreen from "./dashboard";
import FanControlScreen from "./fanControl";
import LightControlScreen from "./lightControl";
import DoorControlScreen from "./doorControl";

const Stack = createNativeStackNavigator();

const DashboardNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="index">
      <Stack.Screen
        name="index"
        component={DashBoardScreen}
        options={{
          title: "Dashboard",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="light"
        component={LightControlScreen}
        options={{
          title: "Light control",
        }}
      />
      <Stack.Screen
        name="fan"
        component={FanControlScreen}
        options={{
          title: "Fan control",
        }}
      />
      <Stack.Screen
        name="door"
        component={DoorControlScreen}
        options={{
          title: "Door control",
        }}
      />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;
