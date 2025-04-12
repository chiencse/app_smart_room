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

  getStrategies: async () => {
    try {
      const response = await api.get("/api/devices/strategy", {
        headers: {
          Authorization: "Bearer " + (await getToken()),
        },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getDevices: async () => {
    try {
      const response = await api.get("/api/devices", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch devices"
      );
    }
  },

  createStrategy: async (strategyData: {
    name: string;
    description: string;
    status: string;
    startTime: string;
    listDeviceValues: Array<{
      deviceId: number;
      value: string;
    }>;
  }) => {
    try {
      const response = await api.post("/api/devices/strategy", strategyData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create strategy"
      );
    }
  },

  updateStrategy: async (
    strategyId: number,
    strategyData: {
      name: string;
      description: string;
      status: string;
      startTime: string;
      listDeviceValues: Array<{
        deviceId: number;
        value: string;
      }>;
    }
  ) => {
    try {
      const response = await api.put(
        `/api/devices/strategy/${strategyId}`,
        strategyData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update strategy"
      );
    }
  },

  deleteStrategy: async (strategyId: number) => {
    try {
      const response = await api.delete(`/api/devices/strategy/${strategyId}`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete strategy"
      );
    }
  },
};

export default fetchData;
