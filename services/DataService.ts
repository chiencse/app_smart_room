import axios from 'axios';


const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 2000,
})

const DataService = {
  getEnvInfo: async () => {
    try {
      const response = await api.get('/api/adafruit/feeds')
      const data = {
        temperature: response.data.find((item: any) => item.name === "Temp").last_value ?? 0,
        humidity: response.data.find((item: any) => item.name === "Humidity").last_value ?? 0,
        brightness: response.data.find((item: any) => item.name === "Light").last_value ?? 0,
        airQuality: response.data.find((item: any) => item.name === "Air").last_value ?? 0,
      }
      return data;
    } catch(error) {
      console.error('Faild to get environment information');
    }
  },

};

export default DataService;