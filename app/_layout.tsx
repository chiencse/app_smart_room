import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import DashBoardScreen from "./dashboard";
import ProfileScreen from "./profile";
import AnalyticsScreen from "./analytics";

const Tab = createBottomTabNavigator();

function RootLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: "beside-icon",
        tabBarStyle: {
          position: "absolute",
          bottom: 10,
          elevation: 0,
          backgroundColor: "#000000",
          borderRadius: 20,
          height: 60,
          margin: 10,
        },
        tabBarActiveTintColor: "white",
      }}
    >
      <Tab.Screen
        name="dashboard"
        component={DashBoardScreen}
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="analytics"
        component={AnalyticsScreen}
        options={{
          title: "Analytics",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="google-analytics"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-alt" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default RootLayout;
