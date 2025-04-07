import axios from "axios";
import config from "@/constants/ConfigEnv";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: config.BACKEND_URL,
  timeout: 2000,
});

const getToken = async () => {
  const token = await AsyncStorage.getItem("authToken");
  return token;
};

const fetchData = {
  getInfo: async () => {
    try {
      const response = await api.get("/api/adafruit/feeds", {
        headers: {
          Authorization: "Bearer " + (await getToken()),
        },
      });
      const data = {
        temperature:
          response.data.find((item: any) => item.name === "Temp").last_value ??
          0,
        humidity:
          response.data.find((item: any) => item.name === "Humidity")
            .last_value ?? 0,
        brightness:
          response.data.find((item: any) => item.name === "Light").last_value ??
          0,
        airQuality:
          response.data.find((item: any) => item.name === "Air").last_value ??
          0,
        light:
          response.data.find((item: any) => item.name === "Lamp").last_value ??
          "OFF",
        door:
          response.data.find((item: any) => item.name === "Door").last_value ??
          "ON",
        fan:
          response.data.find((item: any) => item.name === "Fan").last_value ??
          0,
      };
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getDeviceInfo: async (deviceKey: String) => {
    try {
      const response = await api.get(`/api/adafruit/feeds/${deviceKey}`, {
        headers: {
          Authorization: "Bearer " + (await getToken()),
        },
      });
      return response.data.value;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getUserInfo: async () => {
    try {
      const response = await api.get("/api/user/info", {
        headers: {
          Authorization: "Bearer " + (await getToken()),
        },
      });
      return {
        username: response.data.data.username,
        email: response.data.data.email,
        phoneNumber: response.data.data.phoneNumber,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default fetchData;
