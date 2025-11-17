import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const explainAPI = {
  explain: async (topic, userId = null) => {
    const response = await api.post('/explain', {
      topic,
      user_id: userId,
    });
    return response.data;
  },
};

export const topicsAPI = {
  popular: async (limit = 20) => {
    const response = await api.get(`/topics/popular?limit=${limit}`);
    return response.data;
  },
};

export default api;
