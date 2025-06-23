// Extension axios configuration
import axios from 'axios';

// Configuration
// const API_BASE_URL = 'https://mail-tracker-xy4c.onrender.com';
const API_BASE_URL = 'http://localhost:8080'; // Use local server for development

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    // In Chrome extension, we use Chrome storage instead of localStorage
    return new Promise((resolve) => {
      chrome.storage.local.get(['authState', 'tempToken'], (result) => {
        const token = result.tempToken || result.authState?.token;
        console.log('Token from Chrome storage:', token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Request headers:', config.headers);
        }
        resolve(config);
      });
    });
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401/403 globally
    if (error.response?.status === 401) {
      console.error('Unauthorized. Clearing auth state...');
      // Clear auth state on unauthorized
      chrome.storage.local.remove(['authState', 'isAuthenticated']);
    }
    return Promise.reject(error);
  }
);

export default api;
