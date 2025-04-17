import { Platform } from "react-native";

const getBackendUrl = () => {
  if (process.env.EXPO_PUBLIC_ENVIRONMENT_APP === "staging") {
    return process.env.EXPO_PUBLIC_API_URL_STAGING;
  }

  switch (Platform.OS) {
    case "android":
      return process.env.EXPO_PUBLIC_API_URL_ANDROID;
    case "web":
      return process.env.EXPO_PUBLIC_API_URL_WEB;
    default:
      return process.env.EXPO_PUBLIC_API_URL_DEVICE;
  }
};

const config = {
  BACKEND_URL: getBackendUrl(),
};

export default config;
