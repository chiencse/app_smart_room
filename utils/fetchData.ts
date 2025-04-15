import axios from "axios";
import config from "@/constants/ConfigEnv";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const api = axios.create({
  baseURL: config.BACKEND_URL,
  timeout: 2000,
});

const getToken = async () => {
  const token = await AsyncStorage.getItem("authToken");
  return token;
};

// Add request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there's no originalRequest._retry flag,
    // it means the token has expired or is invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Remove the invalid token
      await AsyncStorage.removeItem("authToken");

      // Redirect to login screen
      router.replace("/login");

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

const fetchData = {
  getInfo: async () => {
    try {
      const response = await api.get("/api/adafruit/feeds");
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
      const response = await api.get(`/api/adafruit/feeds/${deviceKey}`);
      return response.data.value;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getUserInfo: async () => {
    try {
      const response = await api.get("/api/user/info");
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
      const response = await api.get("/api/devices/strategy");
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getDevices: async () => {
    try {
      const response = await api.get("/api/devices");
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
      const response = await api.post("/api/devices/strategy", strategyData);
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
        strategyData
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
      const response = await api.delete(`/api/devices/strategy/${strategyId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete strategy"
      );
    }
  },

  runStrategy: async (strategyId: number) => {
    try {
      const response = await api.post(
        `/api/devices/strategy/${strategyId}/run`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to run strategy"
      );
    }
  },

  getAnalytic: async () => {
    try {
      const response = await api.get(`/api/activity/logs`);
      const now = new Date().toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      let data = response.data;
      data = data.filter(
        (ele: any) =>
          new Date(ele.time).toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }) === now
      );

      const totalUsage = data.reduce((acc: any, ele: any) => {
        acc[ele.deviceKey] = (acc[ele.deviceKey] || 0) + 1;
        return acc;
      }, {});

      const userInfo = await fetchData.getUserInfo();
      let userUsage = data.filter(
        (ele: any) => (ele.username === userInfo.username)
      );
      userUsage = userUsage.reduce((acc: any, ele: any) => {
        acc[ele.deviceKey] = (acc[ele.deviceKey] || 0) + 1;
        return acc;
      }, {});

      return {
        totalUsage: totalUsage,
        userUsage: userUsage,
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to get logs");
    }
  },

  getLogs: async (date: Date) => {
    try {
      const response = await api.get(`/api/activity/logs`);
      let data = response.data;
      data = data.filter((ele: any) => (new Date(ele.time)).getDate() === date.getDate())
      data.sort((a: any, b: any) => Date.parse(b.time) - Date.parse(a.time));
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to get logs");
    }
  },
};

export default fetchData;
