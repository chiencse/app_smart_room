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

const controlDevice = {
  control: async (deviceKey: String, value: String) => {
    try {
      const body = {
        deviceKey: deviceKey,
        value: value,
      };
      await api.post("/api/adafruit/command", body, {
        headers: {
          Authorization: "Bearer " + (await getToken()),
        },
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default controlDevice;
