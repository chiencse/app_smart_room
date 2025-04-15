import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AnalyticsScreen from './analytics';
import LogScreen from './log';

const Stack = createNativeStackNavigator();

const AnalyticsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="index">
      <Stack.Screen
        name="index"
        component={AnalyticsScreen}
        options={{
          title: "Analytics",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="logs"
        component={LogScreen}
        options={{
          title: "Logs",
        }}
      />
    </Stack.Navigator>
  );
};

export default AnalyticsNavigator;
