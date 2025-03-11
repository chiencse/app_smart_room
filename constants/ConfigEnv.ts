import { Platform } from "react-native";

const config = {
  BACKEND_URL:
    Platform.OS === "android"
      ? `${process.env.API_URL_ANDROID}`
      : Platform.OS === "web"
      ? `${process.env.API_URL_WEB}`
      : `${process.env.API_URL_DEVICE}`,
};

export default config;
