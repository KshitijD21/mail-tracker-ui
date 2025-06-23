// lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Make sure this is set
  // withCredentials: true, // Optional: for cookies (JWT, sessions)
  timeout: 10000, // Optional: timeout in ms
});

// Example: Request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    console.log("🚀 API Request:", {
      url: `${config.baseURL}${config.url}`,
      method: config.method?.toUpperCase(),
      token: token ? "Present" : "Missing"
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Example: Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", {
      url: response.config.url,
      status: response.status,
      dataLength: Array.isArray(response.data) ? response.data.length : typeof response.data
    });
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    // Optional: handle 401/403 globally
    if (error.response?.status === 401) {
      console.error("Unauthorized. Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default api;
