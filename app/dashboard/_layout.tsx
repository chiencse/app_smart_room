import { Stack } from "expo-router";
import React from "react";

export default function DashboardLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="strategy/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="strategy/edit"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="lightControl"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="fanControl"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
