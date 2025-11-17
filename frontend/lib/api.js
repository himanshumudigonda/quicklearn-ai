import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('session_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (idToken) => api.post('/auth/login', { idToken }),
  regenerateNickname: (userId) => api.post('/auth/regenerate-nickname', { userId }),
  regenerateAvatar: (userId) => api.post('/auth/regenerate-avatar', { userId }),
};

export const explainAPI = {
  explain: (topic, userId = null, forceVerify = false) =>
    api.post('/explain', { topic, user_id: userId, force_verify: forceVerify }),
};

export const verifyAPI = {
  verify: (topic, userId, priority = 'normal') =>
    api.post('/verify', { topic, user_id: userId, priority }),
  checkStatus: (jobId) => api.get(`/verify/${jobId}`),
};

export const topicsAPI = {
  popular: (limit = 50) => api.get(`/topics/popular?limit=${limit}`),
  recent: (limit = 20) => api.get(`/topics/recent?limit=${limit}`),
  search: (query) => api.get(`/topics/search?q=${encodeURIComponent(query)}`),
};

export const feedbackAPI = {
  submit: (userId, topic, rating, note) =>
    api.post('/feedback', { user_id: userId, topic, rating, note }),
};

export default api;
