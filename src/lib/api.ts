// lib/api.ts
import api from "./axios";

interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
  timestamp: string;
}

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const loginUser = async (email: string, password: string) : Promise<ApiResponse<string>> => {
  const res = await api.post<ApiResponse<string>>("/login", {
    email,
    password,
  });

  return res.data;
};

export const registerUser = async (email: string, userName: string, password: string) => {
  const res = await api.post("/register", {
    email,
    userName,
    password
  })
  return res.data;
}

export const fetchGoogleOAuthUrl = async () => {
  try {
        const response = await api.get<{ authUrl: string }>('/connect/google');
        return response.data.authUrl;
  } catch (error) {
     console.error('Failed to get Google OAuth URL:', error);
    throw new Error('Could not initiate Google OAuth. Please try again later.');
  }
}
