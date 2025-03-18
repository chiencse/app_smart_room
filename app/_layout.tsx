import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import useRouteLogger from "@/hooks/useRouteLogger";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAppReady, setIsAppReady] = useState(false); // Tracks full app readiness
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const router = useRouter();
  const logger = useRouteLogger();
  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token: any = await AsyncStorage.getItem("authToken");
        console.log("Token found:", token);
        if (!token) {
          setIsAuthenticated(false);
          return;
        }
        const decodedToken: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        if (decodedToken.exp < currentTime) {
          // Token is expired, delete it
          await AsyncStorage.removeItem("authToken");
          console.log("Token expired and removed");
          setIsAuthenticated(false);
        }

        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        if (loaded) {
          SplashScreen.hideAsync();
        }
      }
    };

    checkAuth();
  }, [loaded]);

  // Handle navigation after the navigator is mounted
  useEffect(() => {
    if (isAppReady && isAuthenticated !== null) {
      if (isAuthenticated) {
        router.replace("/home");
      }
      // No redirect needed for login since it's the initial route
    }
  }, [isAppReady, isAuthenticated, router]);

  // Mark the app as ready after the first render
  useEffect(() => {
    if (loaded && isAuthenticated !== null) {
      setIsAppReady(true);
    }
  }, [loaded, isAuthenticated]);

  if (!loaded || isAuthenticated === null) {
    return null; // Show nothing until fonts and auth are ready
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login/index" />
        <Stack.Screen name="home/index" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
