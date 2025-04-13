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
import { AppState } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import useRouteLogger from "@/hooks/useRouteLogger";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAppReady, setIsAppReady] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const router = useRouter();
  const logger = useRouteLogger();

  // Check authentication on mount and when the app comes to foreground
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          setIsAuthenticated(false);
          router.replace("/login");
          return;
        }

        const decodedToken: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          await AsyncStorage.removeItem("authToken");
          setIsAuthenticated(false);
          router.replace("/login");
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        router.replace("/login");
      } finally {
        if (loaded) {
          SplashScreen.hideAsync();
        }
      }
    };

    checkAuth();

    // Add event listener for app state changes
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkAuth();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [loaded, router]);

  // Handle navigation after the navigator is mounted
  useEffect(() => {
    if (isAppReady && isAuthenticated !== null) {
      if (isAuthenticated) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    }
  }, [isAppReady, isAuthenticated, router]);

  // Mark the app as ready after the first render
  useEffect(() => {
    if (loaded && isAuthenticated !== null) {
      setIsAppReady(true);
    }
  }, [loaded, isAuthenticated]);

  if (!loaded || isAuthenticated === null) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login/index" />
        <Stack.Screen name="register/index" />
        <Stack.Screen name="home/index" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
